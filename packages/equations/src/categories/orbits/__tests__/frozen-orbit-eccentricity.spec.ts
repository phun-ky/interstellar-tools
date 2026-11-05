import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { frozenOrbitEccentricity } from '../frozen-orbit-eccentricity.js';

const J2 = 1.08262668e-3;
const J3 = -2.53265649e-6;
const R = 6_378_137;
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

describe('frozenOrbitEccentricity', () => {
  test('is about 0.001 for a low sun-synchronous orbit', () => {
    assert.equal(
      frozenOrbitEccentricity(J2, J3, R, R + 700_000, rad(98.2)).toFixed(5),
      '0.00104'
    );
  });

  test('grows with sin i and falls with height, and flips with J3', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 180, noNaN: true }),
        fc.double({ min: R + 200_000, max: R + 2_000_000, noNaN: true }),
        (inclination, a) => {
          const e = frozenOrbitEccentricity(J2, J3, R, a, rad(inclination));

          close(
            e,
            frozenOrbitEccentricity(J2, J3, R, a, rad(90)) *
              Math.sin(rad(inclination)),
            1e-15
          );
          assert.ok(e >= -1e-20);
          assert.equal(
            frozenOrbitEccentricity(J2, -J3, R, a, rad(inclination)),
            -e
          );
          assert.ok(
            frozenOrbitEccentricity(J2, J3, R, a + 1000, rad(90)) <
              frozenOrbitEccentricity(J2, J3, R, a, rad(90))
          );
        }
      )
    );
    assert.equal(frozenOrbitEccentricity(J2, J3, R, R, 0 as Radians), 0);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => frozenOrbitEccentricity(0, J3, R, R, rad(98)),
      (err) => err instanceof RangeError && err.message === 'J2 must not be 0.'
    );
    assert.throws(
      () => frozenOrbitEccentricity(J2, Number.NaN, R, R, rad(98)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'J3 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => frozenOrbitEccentricity(J2, J3, R, -1, rad(98)),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: -1'
    );
  });
});
