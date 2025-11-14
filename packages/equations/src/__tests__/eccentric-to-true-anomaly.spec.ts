import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly';

describe('eccentricToTrueAnomaly', () => {
  // Test cases for eccentricToTrueAnomaly
  const testCases = [
    { E: 0, e: 0.5, expected: 0.0 }, // E = 0 should give V = 0
    { E: Math.PI / 4, e: 0.1, expected: 0.858858 }, // Approximate expected value
    { E: Math.PI / 2, e: 0.3, expected: 1.875489 }, // Approximate expected value
    { E: Math.PI, e: 0.2, expected: Math.PI }, // E = π should give V = π
    { E: (3 * Math.PI) / 2, e: 0.4, expected: 4.300872 } // Approximate expected value
  ];

  test('computes correct true anomaly', () => {
    testCases.forEach(({ E, e, expected }) => {
      const result = eccentricToTrueAnomaly(E, e);

      assert.ok(
        Math.abs(result - expected) < 1e-4,
        `Expected V ≈ ${expected} for E=${E}, e=${e}, but got ${result}`
      );
    });
  });

  test('handles special cases', () => {
    assert.strictEqual(eccentricToTrueAnomaly(0, 0), 0); // Circular orbit (e = 0) should return E
    assert.strictEqual(eccentricToTrueAnomaly(Math.PI, 0), Math.PI); // Circular case with E = π
    assert.strictEqual(eccentricToTrueAnomaly(0, 1), 0); // Parabolic orbit case
  });

  test('throws on invalid eccentricity', () => {
    assert.throws(() => eccentricToTrueAnomaly(Math.PI / 3, -0.1), RangeError);
    assert.throws(() => eccentricToTrueAnomaly(Math.PI / 3, 1.2), RangeError);
  });

  test('ensures numerical stability near E = π', () => {
    assert.strictEqual(eccentricToTrueAnomaly(Math.PI + 1e-11, 0.5), Math.PI);
    assert.strictEqual(eccentricToTrueAnomaly(Math.PI - 1e-11, 0.5), Math.PI);
  });
});
