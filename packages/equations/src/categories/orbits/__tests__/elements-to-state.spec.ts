import type {
  ClassicalElementsInterface,
  Radians
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { elementsToState } from '../elements-to-state.js';
import { visVivaSpeed } from '../vis-viva-speed.js';
import { relClose } from '../../../__tests__/helpers/index.js';

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
        { e: 1 },
        MU,
        'Parabolic orbits (e = 1) are not supported: they have no finite semi-major axis.'
      ],
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
      () => elementsToState({ ...base, raan: Number.NaN as Radians }, MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'raan must be a finite number. Received: NaN'
    );
  });
});
