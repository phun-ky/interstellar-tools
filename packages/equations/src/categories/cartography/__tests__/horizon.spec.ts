import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { horizonDistance } from '../horizon-distance.js';
import { horizonSurfaceDistance } from '../horizon-surface-distance.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const R_EARTH = 6_371_000;

describe('horizonDistance and horizonSurfaceDistance', () => {
  test('are 0 on the surface', () => {
    assert.equal(horizonDistance(0, R_EARTH), 0);
    assert.equal(horizonSurfaceDistance(0, R_EARTH), 0);
  });

  test('approach √(2Rh) for small heights, where both agree', () => {
    const h = 1.8;

    relClose(horizonDistance(h, R_EARTH), Math.sqrt(2 * R_EARTH * h), 1e-6);
    relClose(
      horizonSurfaceDistance(h, R_EARTH),
      horizonDistance(h, R_EARTH),
      1e-6
    );
    assert.equal(Math.round(horizonDistance(h, R_EARTH)), 4789);
  });

  test('give the ISS about 2 350 km in a straight line and 2 252 km over the ground', () => {
    assert.equal(Math.round(horizonDistance(420_000, R_EARTH) / 1000), 2351);
    assert.equal(
      Math.round(horizonSurfaceDistance(420_000, R_EARTH) / 1000),
      2252
    );
  });

  test('match R arccos(R / (R + h)) where arccos is well conditioned', () => {
    const h = 35_786_000; // geostationary

    relClose(
      horizonSurfaceDistance(h, R_EARTH),
      R_EARTH * Math.acos(R_EARTH / (R_EARTH + h)),
      1e-12
    );
  });

  test('stay accurate for a millimetre, where arccos loses its digits', () => {
    relClose(
      horizonSurfaceDistance(1e-3, R_EARTH),
      Math.sqrt(2 * R_EARTH * 1e-3),
      1e-9
    );
  });

  test('keep the surface distance below the line of sight, and below a quarter circumference', () => {
    for (const h of [1, 1e3, 1e6, 1e9]) {
      assert.ok(
        horizonSurfaceDistance(h, R_EARTH) < horizonDistance(h, R_EARTH)
      );
      assert.ok(horizonSurfaceDistance(h, R_EARTH) < (Math.PI / 2) * R_EARTH);
    }
  });

  test('throw for non-finite inputs, h < 0 or R <= 0', () => {
    for (const f of [horizonDistance, horizonSurfaceDistance]) {
      assert.throws(
        () => f(Number.NaN, R_EARTH),
        (err) =>
          err instanceof TypeError &&
          err.message === 'h must be a finite number. Received: NaN'
      );
      assert.throws(
        () => f(-1, R_EARTH),
        (err) =>
          err instanceof RangeError &&
          err.message === 'h must be >= 0. Received: -1'
      );
      assert.throws(
        () => f(1, 0),
        (err) =>
          err instanceof RangeError &&
          err.message === 'R must be > 0. Received: 0'
      );
    }
  });
});
