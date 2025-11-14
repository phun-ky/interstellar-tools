import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly';
import { wrapAngle } from '../categories/angle/wrap-angle';

describe('trueToMeanAnomaly', () => {
  const EPSILON = 1e-10; // Floating-point tolerance
  const assertApproxEqual = (actual: number, expected: number) => {
    assert.ok(
      Math.abs(actual - expected) < EPSILON,
      `Expected ~${expected}, got ${actual}`
    );
  };

  test('Circular Orbit (e = 0)', () => {
    const result = trueToMeanAnomaly(Math.PI / 3, 0); // e = 0 (should be identity)

    assertApproxEqual(result, wrapAngle(Math.PI / 3));
  });

  test('Zero True Anomaly (V = 0)', () => {
    const result = trueToMeanAnomaly(0, 0.5);

    assertApproxEqual(result, 0);
  });

  test('True Anomaly at π/2 (90°)', () => {
    const result = trueToMeanAnomaly(Math.PI / 2, 0.5);
    const expectedM = 0.6141848493043778; // Corrected expected value

    assertApproxEqual(result, expectedM);
  });
  test('True Anomaly at π (Apoapsis)', () => {
    const result = trueToMeanAnomaly(Math.PI, 0.5);
    const expectedM = wrapAngle(Math.PI); // Mean anomaly should be equal to π

    assertApproxEqual(result, expectedM);
  });

  test('True Anomaly at 3π/2 (270°)', () => {
    const result = trueToMeanAnomaly((3 * Math.PI) / 2, 0.5);
    const expectedM = -0.6141848493043782; // Corrected expected value

    assertApproxEqual(result, expectedM);
  });

  test('True Anomaly at 2π (Periapsis)', () => {
    const result = trueToMeanAnomaly(2 * Math.PI, 0.5);

    assertApproxEqual(result, 0); // Should return to zero
  });

  test('Eccentricity Out of Bounds Throws Error', () => {
    assert.throws(() => trueToMeanAnomaly(Math.PI / 3, -0.1), RangeError);
    assert.throws(() => trueToMeanAnomaly(Math.PI / 3, 1.1), RangeError);
  });

  test('Large Eccentricity (e close to 1)', () => {
    const result = trueToMeanAnomaly(Math.PI / 4, 0.99);

    assert.ok(
      result >= 0 && result < 2 * Math.PI,
      `Expected result in range [0, 2π], got ${result}`
    );
  });
});
