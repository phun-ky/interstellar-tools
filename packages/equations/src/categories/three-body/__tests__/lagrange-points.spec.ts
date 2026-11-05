import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { cr3bpDerivatives } from '../cr3bp-derivatives.js';
import { areTrojanPointsStable, lagrangePoints } from '../lagrange-points.js';

const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const GM_SUN = 1.32712440041e20;
const GM_EARTH = 3.986004418e14;
const GM_EARTH_MOON = 4.0350323e14;
const GM_MOON = 4.9028e12;
const GM_JUPITER = 1.26686534e17;
const AU = 1.495978707e11;
const MOON = 384_400_000;
const NAMES = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;

describe('lagrangePoints', () => {
  test('puts Earth-Moon L1 326 000 km from Earth', () => {
    const points = lagrangePoints(GM_EARTH, GM_MOON, MOON);
    const mu = GM_MOON / (GM_EARTH + GM_MOON);
    const earth = -mu * MOON;

    close(points.L1[0] - earth, 326_381_000, 1000);
    close(points.L2[0] - earth, 448_915_000, 1000);
  });

  test('puts Sun-Earth L1 and L2 about 1.5 million km from Earth', () => {
    const points = lagrangePoints(GM_SUN, GM_EARTH_MOON, AU);
    const mu = GM_EARTH_MOON / (GM_SUN + GM_EARTH_MOON);
    const earth = (1 - mu) * AU;

    close(earth - points.L1[0], 1.4976e9, 1e6);
    close(points.L2[0] - earth, 1.5077e9, 1e6);
    // L3 opposite Earth, a(1 + 5μ/12) from the barycentre to first order:
    // 190 km beyond Earth's orbit
    close(-points.L3[0], AU * (1 + (5 * mu) / 12), 1000);
  });

  test('makes L4 and L5 equilateral triangles with the two bodies', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1e-7, max: 0.5, noNaN: true }),
        fc.double({ min: 1e6, max: 1e13, noNaN: true }),
        (mu, a) => {
          const points = lagrangePoints(1 - mu, mu, a);
          const larger = [-mu * a, 0];
          const smaller = [(1 - mu) * a, 0];

          for (const corner of [points.L4, points.L5]) {
            close(Math.hypot(corner[0] - larger[0]!, corner[1]), a, 1e-9 * a);
            close(Math.hypot(corner[0] - smaller[0]!, corner[1]), a, 1e-9 * a);
            assert.equal(corner[2], 0);
          }

          assert.equal(points.L5[1], -points.L4[1]);
        }
      )
    );
  });

  test('puts every point where the forces balance in the rotating frame', () => {
    fc.assert(
      fc.property(fc.double({ min: 1e-7, max: 0.5, noNaN: true }), (mu) => {
        const points = lagrangePoints(1 - mu, mu, 1);

        for (const name of NAMES) {
          const [x, y, z] = points[name];
          const [, , , ax, ay, az] = cr3bpDerivatives([x, y, z, 0, 0, 0], mu);

          // At rest in the rotating frame, it stays: no acceleration
          close(ax, 0, 1e-10);
          close(ay, 0, 1e-10);
          close(az, 0, 1e-10);
        }

        // In order along the x axis
        assert.ok(points.L3[0] < -mu);
        assert.ok(-mu < points.L1[0] && points.L1[0] < 1 - mu);
        assert.ok(points.L2[0] > 1 - mu);
      })
    );
  });

  test('is symmetric for two equal bodies', () => {
    const points = lagrangePoints(1, 1, 1);

    close(points.L1[0], 0, 1e-15);
    close(points.L2[0], 1.198406, 1e-6);
    close(points.L3[0], -points.L2[0], 1e-15);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => lagrangePoints(1, 2, 1),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'm2 must be the smaller body: m2 <= m1. Received: m1 = 1, m2 = 2'
    );
    assert.throws(
      () => lagrangePoints(2, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'separation must be a finite number. Received: NaN'
    );
    assert.throws(
      () => lagrangePoints(2, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'separation must be > 0. Received: 0'
    );
  });
});

describe('areTrojanPointsStable', () => {
  test('holds for Sun-Jupiter and Earth-Moon, not for Pluto-Charon', () => {
    assert.equal(areTrojanPointsStable(GM_SUN, GM_JUPITER), true);
    assert.equal(areTrojanPointsStable(GM_EARTH, GM_MOON), true);
    assert.equal(areTrojanPointsStable(8.69e11, 1.06e11), false);
  });

  test("switches at Routh's mass ratio, 0.03852", () => {
    const routh = (1 - Math.sqrt(23 / 27)) / 2;

    close(routh, 0.038521, 1e-6);
    assert.equal(areTrojanPointsStable(1 - routh * 0.999, routh * 0.999), true);
    assert.equal(
      areTrojanPointsStable(1 - routh * 1.001, routh * 1.001),
      false
    );
  });

  test('rejects invalid input', () => {
    assert.throws(() => areTrojanPointsStable(0, 0), RangeError);
    assert.throws(() => areTrojanPointsStable(Number.NaN, 1), TypeError);
  });
});
