import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerNewtonRaphson } from '../solve-kepler-newton-raphson.js';
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
    // One iteration is too few (this case needs 3), so the solver must signal failure
    const result = solveKeplerNewtonRaphson(M as Radians, e, 1, 1e-9);

    assert.ok(Number.isNaN(result));
  });
});

describe('solveKeplerNewtonRaphson: robustness', () => {
  // E is not normalized, so E - e·sin(E) must equal M itself, not just modulo 2π
  const assertSolves = (M: number, e: number) => {
    const E = solveKeplerNewtonRaphson(M as Radians, e, 50, 1e-9);

    assert.ok(!Number.isNaN(E), `M=${M}, e=${e}: did not converge`);
    assert.ok(
      Math.abs(E - e * Math.sin(E) - M) < 1e-8,
      `M=${M}, e=${e}: E=${E} does not solve Kepler's equation`
    );
  };

  test('converges for nearly parabolic orbits (e ≥ 0.97)', () => {
    // The previous starting value 6M/e made these return NaN for almost every M
    for (const e of [0.97, 0.99, 0.999, 0.9999]) {
      for (let M = 0.05; M < 2 * Math.PI; M += 0.25) assertSolves(M, e);
    }
  });

  test('does not stall away from the root', () => {
    // Previously "converged" to E ≈ 0.266 (residual 0.147) on a vanishing step
    assertSolves(0.175928, 0.9);
  });

  test('solves for negative M and many revolutions', () => {
    for (const e of [0, 0.5, 0.9, 0.99]) {
      for (const M of [-1000.5, -7, -1, 1, 7, 1000.5]) assertSolves(M, e);
    }
  });

  test('keeps results for M in [0, 2π) unchanged by the turn reduction', () => {
    assertApproxEqual(
      solveKeplerNewtonRaphson((Math.PI / 4) as Radians, 0.1, 50, 1e-9),
      0.8612648849
    );
  });
});
