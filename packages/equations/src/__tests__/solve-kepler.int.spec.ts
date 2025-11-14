import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKepler } from '../categories/kepler/solve-kepler';

const EPSILON = 1e-8; // Floating-point tolerance
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};

describe('solveKepler', () => {
  test('Circular Orbit (e = 0)', () => {
    const M = Math.PI / 4; // 45 degrees
    const e = 0.0; // Circular orbit
    const result = solveKepler(M, e);

    assertApproxEqual(result, M); // E = M for circular orbits
  });

  test('Small Eccentricity (e = 0.1)', () => {
    const M = Math.PI / 4;
    const e = 0.1;
    const expectedE = 0.8612648848681754;
    const result = solveKepler(M, e);

    assertApproxEqual(result, expectedE);
  });

  test('Moderate Eccentricity (e = 0.5)', () => {
    const M = Math.PI / 2;
    const e = 0.5;
    const expectedE = 2.02097993808977;
    const result = solveKepler(M, e);

    assertApproxEqual(result, expectedE);
  });

  test('High Eccentricity (e = 0.8)', () => {
    const M = Math.PI / 6;
    const e = 0.8;
    const expectedE = 1.2929083458551878;
    const result = solveKepler(M, e);

    assertApproxEqual(result, expectedE);
  });

  test('Nearly Parabolic Orbit (e = 0.99)', () => {
    const M = Math.PI / 4;
    const e = 0.99;
    const expectedE = 1.758085607716896;
    const result = solveKepler(M, e);

    assertApproxEqual(result, expectedE);
  });

  test('Mean Anomaly at 0', () => {
    const M = 0;
    const e = 0.5;
    const result = solveKepler(M, e);

    assertApproxEqual(result, 0); // E = 0 when M = 0
  });

  test('Mean Anomaly at π', () => {
    const M = Math.PI;
    const e = 0.5;
    const expectedE = Math.PI; // At M = π, E should also be π
    const result = solveKepler(M, e);

    assert.equal(result, expectedE);
  });

  test('Mean Anomaly at 2π', () => {
    const M = 2 * Math.PI;
    const e = 0.5;
    const result = solveKepler(M, e);

    assertApproxEqual(result, 0); // Should wrap to 0
  });

  test('Convergence with max iterations', () => {
    const M = Math.PI / 3;
    const e = 0.7;
    const result = solveKepler(M, e, 100); // Force more iterations

    assert.ok(
      result >= 0 && result < 2 * Math.PI,
      `Expected result in range [0, 2π], got ${result}`
    );
  });

  test('Invalid Eccentricity (e < 0) Throws Error', () => {
    assert.throws(() => solveKepler(Math.PI / 4, -0.1), RangeError);
  });

  test('Invalid Eccentricity (e >= 1) Throws Error', () => {
    assert.throws(() => solveKepler(Math.PI / 4, 1), RangeError);
    assert.throws(() => solveKepler(Math.PI / 4, 1.1), RangeError);
  });
});
