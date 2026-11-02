import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { hyperbolicTimeOfFlight } from '../hyperbolic-time-of-flight.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const MU = 3.986004418e14;
const rad = (d: number) => ((d * Math.PI) / 180) as Radians;

// dt/dν = r² / h on any conic: integrate it with Simpson's rule as an
// independent check of Kepler's equation for hyperbolas
const integrateTime = (nu1: number, nu2: number, e: number, a: number) => {
  const p = a * (1 - e * e);
  const h = Math.sqrt(MU * p);
  const f = (nu: number) => (p / (1 + e * Math.cos(nu))) ** 2 / h;
  const n = 20_000;
  const step = (nu2 - nu1) / n;
  let sum = f(nu1) + f(nu2);

  for (let k = 1; k < n; k++) sum += (k % 2 ? 4 : 2) * f(nu1 + k * step);

  return (sum * step) / 3;
};

describe('hyperbolicTimeOfFlight', () => {
  test('matches integrating r²/h over the true anomaly', () => {
    for (const [nu1, nu2, e] of [
      [0, 90, 2],
      [-100, 60, 1.44],
      [10, 120, 1.2]
    ]) {
      relClose(
        hyperbolicTimeOfFlight(rad(nu1), rad(nu2), e, -10_000e3, MU),
        integrateTime(rad(nu1), rad(nu2), e, -10_000e3),
        1e-9
      );
    }
  });

  test('matches the documented example (≈ 3 401 s)', () => {
    assert.equal(
      Math.round(hyperbolicTimeOfFlight(rad(0), rad(90), 2, -10_000e3, MU)),
      3401
    );
  });

  test('is zero for the same point, antisymmetric, and additive', () => {
    const [a, b, c] = [rad(-60), rad(20), rad(110)];
    const t = (x: Radians, y: Radians) =>
      hyperbolicTimeOfFlight(x, y, 1.5, -20_000e3, MU);

    assert.equal(t(a, a), 0);
    relClose(t(b, a), -t(a, b), 1e-12);
    relClose(t(a, b) + t(b, c), t(a, c), 1e-12);
  });

  test('is symmetric about periapsis', () => {
    relClose(
      hyperbolicTimeOfFlight(rad(-70), rad(0), 1.5, -20_000e3, MU),
      hyperbolicTimeOfFlight(rad(0), rad(70), 1.5, -20_000e3, MU),
      1e-12
    );
  });

  test('throws for invalid inputs', () => {
    const cases: [() => number, ErrorConstructor, string][] = [
      [
        () =>
          hyperbolicTimeOfFlight(Number.NaN as Radians, rad(0), 2, -1e7, MU),
        TypeError,
        'nu1 must be a finite number. Received: NaN'
      ],
      [
        () => hyperbolicTimeOfFlight(rad(0), rad(10), 0.5, -1e7, MU),
        RangeError,
        'e must be > 1. Received: 0.5'
      ],
      [
        () => hyperbolicTimeOfFlight(rad(0), rad(10), 2, 1e7, MU),
        RangeError,
        'a must be < 0 for a hyperbola. Received: 10000000'
      ],
      [
        () => hyperbolicTimeOfFlight(rad(0), rad(10), 2, -1e7, 0),
        RangeError,
        'mu must be > 0. Received: 0'
      ]
    ];

    for (const [run, type, message] of cases) {
      assert.throws(
        run,
        (err) => err instanceof type && err.message === message
      );
    }

    assert.throws(
      () => hyperbolicTimeOfFlight(rad(0), rad(125), 2, -1e7, MU),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('nu is at or beyond the asymptotes')
    );
  });
});
