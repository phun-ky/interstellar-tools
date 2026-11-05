import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { j2NodalPrecessionRate } from '../j2-nodal-precession-rate.js';
import { sunSynchronousInclination } from '../sun-synchronous-inclination.js';

const J2 = 1.08262668e-3;
const MU = 3.986004418e14;
const R = 6_378_137;
// Earth's mean motion around the Sun: once a tropical year
const RATE = (2 * Math.PI) / (365.2421897 * 86_400);
const deg = (rad: number) => (rad * 180) / Math.PI;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

describe('sunSynchronousInclination', () => {
  test('is 97.4° at 500 km', () => {
    const i = sunSynchronousInclination(J2, MU, R, R + 500_000, 0, RATE);

    assert.equal(deg(i).toFixed(1), '97.4');
    assert.equal(i.toFixed(4), '1.7000');
  });

  test('turns the orbit plane once a year', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200_000, max: 5_000_000, noNaN: true }),
        fc.double({ min: 0, max: 0.1, noNaN: true }),
        (height, e) => {
          const a = R + height;
          const i = sunSynchronousInclination(J2, MU, R, a, e, RATE);
          const n = Math.sqrt(MU / a ** 3);

          close(j2NodalPrecessionRate(J2, n, R, a, i, e), RATE, 1e-12 * RATE);
          // Retrograde, and more so higher up
          assert.ok(i > Math.PI / 2);
          assert.ok(
            sunSynchronousInclination(J2, MU, R, a + 10_000, e, RATE) > i
          );
        }
      )
    );
  });

  test('has no solution above about 5 980 km', () => {
    assert.ok(sunSynchronousInclination(J2, MU, R, R + 5_970_000, 0, RATE));
    assert.throws(
      () => sunSynchronousInclination(J2, MU, R, R + 6_000_000, 0, RATE),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('No sun-synchronous orbit at a = 12378137 m')
    );
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => sunSynchronousInclination(Number.NaN, MU, R, R, 0, RATE),
      (err) =>
        err instanceof TypeError &&
        err.message === 'J2 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => sunSynchronousInclination(J2, MU, R, R, 0, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rate must be > 0. Received: 0'
    );
    assert.throws(
      () => sunSynchronousInclination(J2, MU, R, R, 1, RATE),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be in [0, 1). Received: 1'
    );
  });
});
