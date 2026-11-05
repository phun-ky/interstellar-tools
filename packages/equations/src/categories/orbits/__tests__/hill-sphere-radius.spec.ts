import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { lagrangePoints } from '../../three-body/lagrange-points.js';
import { hillSphereRadius } from '../hill-sphere-radius.js';
import { sphereOfInfluenceRadius } from '../sphere-of-influence-radius.js';

const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const GM_SUN = 1.32712440041e20;
const GM_EARTH = 3.986004418e14;
const AU = 1.495978707e11;

describe('hillSphereRadius', () => {
  test("puts Earth's at 1.47 million km, beyond its sphere of influence", () => {
    const hill = hillSphereRadius(AU, 0.0167, GM_EARTH, GM_SUN);

    close(hill, 1.4716e9, 1e6);
    assert.ok(hill > sphereOfInfluenceRadius(AU, GM_EARTH, GM_SUN));
  });

  test('reaches about as far as L1, for a circular orbit', () => {
    const hill = hillSphereRadius(AU, 0, GM_EARTH, GM_SUN);
    const mu = GM_EARTH / (GM_SUN + GM_EARTH);
    const { L1 } = lagrangePoints(GM_SUN, GM_EARTH, AU);

    // The Hill approximation is the first term of L1's distance
    close(hill / ((1 - mu) * AU - L1[0]), 1, 0.01);
  });

  test('shrinks with the eccentricity, at the closest approach', () => {
    const circular = hillSphereRadius(384_400_000, 0, 4.9028e12, GM_EARTH);
    const moon = hillSphereRadius(384_400_000, 0.0549, 4.9028e12, GM_EARTH);

    close(moon, 58_146_000, 1000);
    close(moon / circular, 1 - 0.0549, 1e-12);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => hillSphereRadius(Number.NaN, 0, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be a finite number. Received: NaN'
    );

    for (const [args, message] of [
      [[0, 0, 1, 1], 'a must be > 0. Received: 0'],
      [[1, 0, -1, 1], 'm must be > 0. Received: -1'],
      [[1, 0, 1, 0], 'M must be > 0. Received: 0'],
      [[1, 1, 1, 1], 'e must be in [0, 1). Received: 1'],
      [[1, -0.1, 1, 1], 'e must be in [0, 1). Received: -0.1']
    ] as const)
      assert.throws(
        () => hillSphereRadius(...(args as [number, number, number, number])),
        (err) => err instanceof RangeError && err.message === message
      );
  });
});
