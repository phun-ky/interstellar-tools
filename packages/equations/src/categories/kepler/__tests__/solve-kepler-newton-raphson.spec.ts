import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerNewtonRaphson } from '../solve-kepler-newton-raphson';
import type { Radians } from '@interstellar-tools/types';

const EPSILON = 1e-9;
const assertApproxEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `Expected ~${expected}, got ${actual}`
  );
};

describe('solveKeplerNewtonRaphson', () => {
  test('converges for typical values', () => {
    const M = Math.PI / 4; // 45 degrees in radians
    const e = 0.1; // Low eccentricity
    const result = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assertApproxEqual(result, 0.8612648849); // Expected numerical result
  });

  test('works for small M values', () => {
    const M = 0.01;
    const e = 0.2;
    const result = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assertApproxEqual(result, 0.0124999186);
  });

  test('handles M = 0 case correctly', () => {
    const M = 0;
    const e = 0.5;
    const result = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assertApproxEqual(result, 0); // Eccentric anomaly should also be zero
  });

  test('handles high eccentricity values correctly', () => {
    const M = Math.PI / 3;
    const e = 0.95;
    const result = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assertApproxEqual(result, 1.9349139832);
  });

  test('ensures correct output for nearly parabolic orbits', () => {
    const M = Math.PI / 6;
    const e = 0.97; // Nearly parabolic
    const result = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assertApproxEqual(result, 1.4904711747);
  });

  test('throws RangeError for invalid eccentricities', () => {
    assert.throws(
      () => solveKeplerNewtonRaphson((Math.PI / 4) as Radians, -0.1, 50, 1e-9),
      RangeError
    );
    assert.throws(
      () => solveKeplerNewtonRaphson((Math.PI / 4) as Radians, 1.2, 50, 1e-9),
      RangeError
    );
  });

  test('returns NaN if the method does not converge', () => {
    const M = 3;
    const e = 0.9999; // Extremely high eccentricity
    const result = solveKeplerNewtonRaphson(M as Radians, e, 5, 1e-9); // Very low maxIter

    assert.ok(Number.isNaN(result));
  });
});
