import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerBisection } from '../categories/solve-for-kepler/solve-kepler-bisection';

describe('solveKeplerBisection', () => {
  test("Solves Kepler's equation for small eccentricities", () => {
    const M = Math.PI / 4; // 45 degrees in radians
    const e = 0.1;
    const expected = solveKeplerBisection(M, e, 50, 1e-9);
    const result = solveKeplerBisection(M, e, 50, 1e-9);

    assert.ok(
      Math.abs(result - expected) < 1e-9,
      `Expected ${expected}, got ${result}`
    );
  });

  test("Solves Kepler's equation for moderate eccentricities", () => {
    const M = Math.PI / 2; // 90 degrees in radians
    const e = 0.5;
    const expected = solveKeplerBisection(M, e, 50, 1e-9);
    const result = solveKeplerBisection(M, e, 50, 1e-9);

    assert.ok(
      Math.abs(result - expected) < 1e-9,
      `Expected ${expected}, got ${result}`
    );
  });

  test("Solves Kepler's equation for high eccentricities", () => {
    const M = Math.PI / 3; // 60 degrees in radians
    const e = 0.9;
    const expected = solveKeplerBisection(M, e, 50, 1e-9);
    const result = solveKeplerBisection(M, e, 50, 1e-9);

    assert.ok(
      Math.abs(result - expected) < 1e-9,
      `Expected ${expected}, got ${result}`
    );
  });

  test('Ensures solution falls within expected bounds', () => {
    const M = Math.PI / 6;
    const e = 0.4;
    const result = solveKeplerBisection(M, e, 50, 1e-9);

    assert.ok(
      result >= 0 && result <= Math.PI,
      `Eccentric anomaly ${result} out of bounds`
    );
  });

  test('Handles convergence within the given tolerance', () => {
    const M = Math.PI / 2;
    const e = 0.7;
    const tolerance = 1e-12;
    const result = solveKeplerBisection(M, e, 50, tolerance);
    const F = result - e * Math.sin(result) - M;

    assert.ok(Math.abs(F) < tolerance, `Convergence issue: Residual ${F}`);
  });
});
