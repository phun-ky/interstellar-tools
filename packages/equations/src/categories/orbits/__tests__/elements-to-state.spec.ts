import type {
  ClassicalElementsInterface,
  Radians
} from '@interstellar-tools/types';

import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { relClose } from '../../../__tests__/helpers/index.js';
import { elementsToState } from '../elements-to-state.js';
import { stateToElements } from '../state-to-elements.js';
import { visVivaSpeed } from '../vis-viva-speed.js';

const MU = 3.986004418e14;
const rad = (d: number) => ((d * Math.PI) / 180) as Radians;
const base: ClassicalElementsInterface = {
  a: 7000e3,
  e: 0,
  i: rad(0),
  raan: rad(0),
  argp: rad(0),
  nu: rad(0)
};

describe('elementsToState', () => {
  test('puts a circular equatorial orbit on the x and y axes', () => {
    const { r, v } = elementsToState({ ...base, nu: rad(90) }, MU);
    const vc = Math.sqrt(MU / 7000e3);

    assert.ok(Math.abs(r[0]) < 1e-6 && Math.abs(r[2]) < 1e-6);
    relClose(r[1], 7000e3);
    relClose(v[0], -vc);
    assert.ok(Math.abs(v[1]) < 1e-9 && Math.abs(v[2]) < 1e-9);
  });

  test('gives periapsis and apoapsis distances and vis-viva speeds', () => {
    const el = { ...base, a: 10_000e3, e: 0.3 };
    const peri = elementsToState({ ...el, nu: rad(0) }, MU);
    const apo = elementsToState({ ...el, nu: rad(180) }, MU);

    relClose(Math.hypot(...peri.r), 7000e3, 1e-12);
    relClose(Math.hypot(...apo.r), 13_000e3, 1e-12);
    relClose(Math.hypot(...peri.v), visVivaSpeed(7000e3, 10_000e3, MU), 1e-12);
    relClose(Math.hypot(...apo.v), visVivaSpeed(13_000e3, 10_000e3, MU), 1e-12);
  });

  test('tilts the orbit about the node line by i', () => {
    // A quarter orbit past the ascending node (on the x axis), inclined 90°
    const { r } = elementsToState({ ...base, i: rad(90), nu: rad(90) }, MU);

    relClose(r[2], 7000e3, 1e-12);
    assert.ok(Math.abs(r[0]) < 1e-6 && Math.abs(r[1]) < 1e-6);
  });

  test('handles hyperbolic orbits inside the asymptotes', () => {
    const { r } = elementsToState(
      { ...base, a: -20_000e3, e: 1.5, nu: rad(60) },
      MU
    );
    const p = -20_000e3 * (1 - 1.5 ** 2);

    relClose(Math.hypot(...r), p / (1 + 1.5 * Math.cos(rad(60))), 1e-12);
  });

  describe('parabolic orbits (e = 1)', () => {
    const q = 7000e3;
    const parabola = { ...base, a: Infinity, e: 1, p: 2 * q };

    test('sits at q with escape speed at periapsis', () => {
      const { r, v } = elementsToState(parabola, MU);

      relClose(r[0], q, 1e-12);
      relClose(v[1], Math.sqrt((2 * MU) / q), 1e-12);
    });

    test('has zero specific energy at any true anomaly', () => {
      for (const deg of [-170, -90, -30, 45, 120, 179]) {
        const { r, v } = elementsToState({ ...parabola, nu: rad(deg) }, MU);
        const rn = Math.hypot(...r);

        relClose(Math.hypot(...v) ** 2, (2 * MU) / rn, 1e-12);
        relClose(rn, (2 * q) / (1 + Math.cos(rad(deg))), 1e-12);
      }
    });

    test('round-trips through stateToElements', () => {
      const el = {
        ...parabola,
        i: rad(30),
        raan: rad(40),
        argp: rad(60),
        nu: rad(100)
      };
      const { r, v } = elementsToState(el, MU);
      const back = stateToElements(r, v, MU);

      relClose(back.e, 1, 1e-12);
      relClose(back.p!, 2 * q, 1e-12);

      const again = elementsToState(back, MU);

      for (let k = 0; k < 3; k++) {
        relClose(again.r[k], r[k], 1e-9);
        relClose(again.v[k], v[k], 1e-9);
      }
    });

    test('uses p near e = 1, where a(1 - e²) loses digits', () => {
      const e = 1 - 1e-9;
      const { r } = elementsToState(
        { ...base, a: (2 * q) / ((1 - e) * (1 + e)), e, p: 2 * q },
        MU
      );

      relClose(r[0], (2 * q) / (2 - 1e-9), 1e-12);
    });

    test('throws at nu = π', () => {
      assert.throws(
        () => elementsToState({ ...parabola, nu: rad(180) }, MU),
        (err) =>
          err instanceof RangeError &&
          err.message.startsWith('nu is unreachable on a parabola')
      );
    });
  });

  test('uses a and e once they no longer agree with p, as before p existed', () => {
    const start = elementsToState(
      { ...base, a: 7e6, e: 0.1, i: rad(30), nu: rad(57) },
      MU
    );
    const elements = stateToElements(start.r, start.v, MU);
    const { p: _, ...withoutP } = elements;

    // Unchanged, they agree: the round trip works
    relClose(elementsToState(elements, MU).r[0], start.r[0], 1e-12);

    for (const changed of [
      { a: 2 * elements.a },
      { e: 0.2 },
      { a: 2 * elements.a, e: 0.3 }
    ]) {
      const got = elementsToState({ ...elements, ...changed }, MU);
      const want = elementsToState({ ...withoutP, ...changed }, MU);

      for (let k = 0; k < 3; k++) {
        relClose(got.r[k], want.r[k], 1e-12);
        relClose(got.v[k], want.v[k], 1e-12);
      }
    }

    // Twice the a, twice the r
    relClose(
      Math.hypot(...elementsToState({ ...elements, a: 2 * elements.a }, MU).r),
      2 * Math.hypot(...start.r),
      1e-12
    );
  });

  test('still rejects an invalid p when a is given too', () => {
    for (const [p, error] of [
      [NaN, TypeError],
      [-1, RangeError]
    ] as const)
      assert.throws(
        () => elementsToState({ ...base, a: 7e6, e: 0.1, p }, MU),
        error
      );
  });

  test('throws for invalid elements', () => {
    const cases: [Partial<ClassicalElementsInterface>, number, string][] = [
      [{ e: -0.1 }, MU, 'e must be >= 0. Received: -0.1'],
      [{ i: rad(-1) }, MU, `i must be in [0, π]. Received: ${rad(-1)}`],
      [
        { a: -1 },
        MU,
        'a must be > 0 for an elliptic orbit. Received: a=-1, e=0'
      ],
      [
        { a: 1e7, e: 1.5 },
        MU,
        'a must be < 0 for a hyperbolic orbit. Received: a=10000000, e=1.5'
      ],
      [
        { e: 1, a: Infinity },
        MU,
        'A parabolic orbit (e = 1) has no finite semi-major axis: give p, the semi-latus rectum.'
      ],
      [{ e: 1, p: 0 }, MU, 'p must be > 0. Received: 0'],
      [{}, 0, 'mu must be > 0. Received: 0']
    ];

    for (const [patch, mu, message] of cases) {
      assert.throws(
        () => elementsToState({ ...base, ...patch }, mu),
        (err) => err instanceof RangeError && err.message === message
      );
    }

    assert.throws(
      () =>
        elementsToState({ ...base, a: -20_000e3, e: 1.5, nu: rad(150) }, MU),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith("nu is beyond the hyperbola's asymptotes")
    );
    assert.throws(
      () => elementsToState({ ...base, p: Number.NaN }, MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'p must be a finite number. Received: NaN'
    );
    assert.throws(
      () => elementsToState({ ...base, raan: Number.NaN as Radians }, MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'raan must be a finite number. Received: NaN'
    );
  });
});
