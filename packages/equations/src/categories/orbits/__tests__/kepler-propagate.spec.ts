import type {
  Radians,
  StateVectorInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { relClose } from '../../../__tests__/helpers/index.js';
import { rk45Integrate } from '../../helpers/rk45.js';
import { elementsToState } from '../elements-to-state.js';
import { keplerPropagate } from '../kepler-propagate.js';

const MU = 3.986004418e14;
const rad = (d: number) => ((d * Math.PI) / 180) as Radians;
const orient = { i: rad(30), raan: rad(40), argp: rad(60), nu: rad(20) };
const ellipse = elementsToState({ a: 1e7, e: 0.3, ...orient }, MU);
const parabola = elementsToState({ a: Infinity, e: 1, p: 14e6, ...orient }, MU);
const hyperbola = elementsToState({ a: -2e7, e: 1.5, ...orient }, MU);
const conics: [string, StateVectorInterface][] = [
  ['ellipse', ellipse],
  ['parabola', parabola],
  ['hyperbola', hyperbola]
];
const energy = ({ r, v }: StateVectorInterface) =>
  Math.hypot(...v) ** 2 / 2 - MU / Math.hypot(...r);
const momentum = ({ r, v }: StateVectorInterface): Vector3DTupleType => [
  r[1] * v[2] - r[2] * v[1],
  r[2] * v[0] - r[0] * v[2],
  r[0] * v[1] - r[1] * v[0]
];
// Close to within eps of the vector's length, component by component
const vectorClose = (
  actual: readonly number[],
  expected: readonly number[],
  eps: number
) => {
  const scale = Math.hypot(...expected);

  for (let k = 0; k < 3; k++)
    assert.ok(
      Math.abs(actual[k] - expected[k]) <= eps * scale,
      `[${k}]: ${actual[k]} vs ${expected[k]}`
    );
};

describe('keplerPropagate', () => {
  test('matches Curtis Example 3.7', () => {
    const { r, v } = keplerPropagate(
      [7000e3, -12_124e3, 0],
      [2667.9, 4621.0, 0],
      3600,
      398_600e9
    );

    relClose(r[0] / 1e3, -3297.8, 1e-4);
    relClose(r[1] / 1e3, 7413.4, 1e-4);
    relClose(v[0] / 1e3, -8.2976, 1e-4);
    relClose(v[1] / 1e3, -0.96404, 1e-4);
  });

  for (const [name, start] of conics) {
    test(`agrees with a numerical integration on a ${name}`, () => {
      const dt = 20_000;
      const { y } = rk45Integrate(
        (_t, [x, yy, z, vx, vy, vz]) => {
          const k = -MU / Math.hypot(x, yy, z) ** 3;

          return [vx, vy, vz, k * x, k * yy, k * z];
        },
        [...start.r, ...start.v],
        0,
        dt,
        { tolerance: 1e-12, absoluteTolerance: 1e-6 }
      );
      const end = y[y.length - 1];
      const { r, v } = keplerPropagate(start.r, start.v, dt, MU);

      vectorClose(r, end.slice(0, 3), 1e-8);
      vectorClose(v, end.slice(3), 1e-8);
    });

    test(`keeps energy and angular momentum on a ${name}`, () => {
      for (const dt of [60, 3600, -5000, 2_592_000]) {
        const end = keplerPropagate(start.r, start.v, dt, MU);

        assert.ok(
          Math.abs(energy(end) - energy(start)) <=
            1e-12 * (MU / Math.hypot(...start.r)),
          `energy at dt=${dt}`
        );
        // 30 days out on the hyperbola, cancellation in f and g costs a few digits
        vectorClose(momentum(end), momentum(start), 1e-11);
      }
    });

    test(`runs backwards to where it started on a ${name}`, () => {
      const there = keplerPropagate(start.r, start.v, 86_400, MU);
      const back = keplerPropagate(there.r, there.v, -86_400, MU);

      vectorClose(back.r, start.r, 1e-10);
      vectorClose(back.v, start.v, 1e-10);
    });
  }

  test('takes whole periods off a long dt on an ellipse', () => {
    const T = 2 * Math.PI * Math.sqrt(1e21 / MU);
    const near = keplerPropagate(ellipse.r, ellipse.v, 0.3 * T, MU);
    const far = keplerPropagate(ellipse.r, ellipse.v, 1000.3 * T, MU);

    vectorClose(far.r, near.r, 1e-9);
    vectorClose(far.v, near.v, 1e-9);
  });

  test('returns the start for dt = 0 and for whole periods', () => {
    const T = 2 * Math.PI * Math.sqrt(1e21 / MU);

    assert.deepEqual(keplerPropagate(ellipse.r, ellipse.v, 0, MU), ellipse);

    // T itself may not divide exactly, so allow a sliver of an orbit
    const once = keplerPropagate(ellipse.r, ellipse.v, T, MU);

    vectorClose(once.r, ellipse.r, 1e-9);
  });

  test('solves a fast hyperbola whose bracket reaches into overflow', () => {
    // At periapsis r·v = 0, and 0 × an overflowed term is NaN
    const start = elementsToState(
      {
        a: Infinity,
        p: 7e6,
        e: 2.24,
        i: rad(1),
        raan: rad(0),
        argp: rad(0),
        nu: rad(0)
      },
      MU
    );
    const end = keplerPropagate(start.r, start.v, 1e5, MU);

    assert.ok(
      Math.abs(energy(end) - energy(start)) <= 1e-12 * Math.abs(energy(start))
    );
  });

  test('handles a subnormal dt', () => {
    for (const dt of [Number.MIN_VALUE, -Number.MIN_VALUE]) {
      const { r } = keplerPropagate(ellipse.r, ellipse.v, dt, MU);

      vectorClose(r, ellipse.r, 1e-15);
    }
  });

  test('reaches the parabola point a true anomaly gives', () => {
    // Barker's equation for the time from periapsis to ν = 90°, with q = p / 2:
    // t = √(p³/μ) (D + D³/3) / 2, D = tan(ν/2) = 1
    const p = 14e6;
    const peri = elementsToState(
      {
        a: Infinity,
        e: 1,
        p,
        i: rad(0),
        raan: rad(0),
        argp: rad(0),
        nu: rad(0)
      },
      MU
    );
    const dt = (Math.sqrt(p ** 3 / MU) * (1 + 1 / 3)) / 2;
    const { r } = keplerPropagate(peri.r, peri.v, dt, MU);

    vectorClose(r, [0, p, 0], 1e-12);
  });

  test('throws for invalid inputs', () => {
    const cases: [() => unknown, ErrorConstructor, string][] = [
      [
        () => keplerPropagate([Number.NaN, 0, 0], [0, 1, 0], 1, MU),
        TypeError,
        'r0 must have finite components. Received: NaN'
      ],
      [
        () => keplerPropagate([7e6, 0, 0], [0, Infinity, 0], 1, MU),
        TypeError,
        'v0 must have finite components. Received: Infinity'
      ],
      [
        () => keplerPropagate([7e6, 0, 0], [0, 1, 0], Number.NaN, MU),
        TypeError,
        'dt must be a finite number. Received: NaN'
      ],
      [
        () => keplerPropagate([7e6, 0, 0], [0, 1, 0], 1, 0),
        RangeError,
        'mu must be > 0. Received: 0'
      ],
      [
        () => keplerPropagate([0, 0, 0], [0, 1, 0], 1, MU),
        RangeError,
        'r0 must not be the zero vector.'
      ],
      [
        () => keplerPropagate([7e6, 0, 0], [5000, 0, 0], 1, MU),
        RangeError,
        'The motion is straight up or down (no angular momentum), so the two-body trajectory hits the centre.'
      ],
      [
        // χ resolves, but r overflows
        () => keplerPropagate([1, 0, 0], [0, 2, 0], 1.7e308, 1),
        RangeError,
        'dt=1.7e+308 is too long to solve accurately on this trajectory.'
      ],
      [
        () => keplerPropagate([7e6, 0, 0], [0, 15e3, 0], 1.7e308, MU),
        RangeError,
        'dt=1.7e+308 is too long to solve accurately on this trajectory.'
      ]
    ];

    for (const [run, type, message] of cases)
      assert.throws(
        run,
        (err) => err instanceof type && (err as Error).message === message
      );
  });
});
