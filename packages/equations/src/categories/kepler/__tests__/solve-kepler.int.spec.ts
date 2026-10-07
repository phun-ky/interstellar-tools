import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKepler } from '../solve-kepler.js';
import type { Radians } from '@interstellar-tools/types';

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
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, M); // E = M for circular orbits
  });

  test('Small Eccentricity (e = 0.1)', () => {
    const M = Math.PI / 4;
    const e = 0.1;
    const expectedE = 0.8612648848681754;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, expectedE);
  });

  test('Moderate Eccentricity (e = 0.5)', () => {
    const M = Math.PI / 2;
    const e = 0.5;
    const expectedE = 2.02097993808977;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, expectedE);
  });

  test('High Eccentricity (e = 0.8)', () => {
    const M = Math.PI / 6;
    const e = 0.8;
    const expectedE = 1.2929083458551878;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, expectedE);
  });

  test('Nearly Parabolic Orbit (e = 0.99)', () => {
    const M = Math.PI / 4;
    const e = 0.99;
    const expectedE = 1.758085607716896;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, expectedE);
  });

  test('Mean Anomaly at 0', () => {
    const M = 0;
    const e = 0.5;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, 0); // E = 0 when M = 0
  });

  test('Mean Anomaly at π', () => {
    const M = Math.PI;
    const e = 0.5;
    const expectedE = Math.PI; // At M = π, E should also be π
    const result = solveKepler(M as Radians, e);

    assert.equal(result, expectedE);
  });

  test('Mean Anomaly at 2π', () => {
    const M = 2 * Math.PI;
    const e = 0.5;
    const result = solveKepler(M as Radians, e);

    assertApproxEqual(result, 0); // Should wrap to 0
  });

  test('Convergence with max iterations', () => {
    const M = Math.PI / 3;
    const e = 0.7;
    const result = solveKepler(M as Radians, e, 100); // Force more iterations

    assert.ok(
      result >= 0 && result < 2 * Math.PI,
      `Expected result in range [0, 2π], got ${result}`
    );
  });

  test('Invalid Eccentricity (e < 0) Throws Error', () => {
    assert.throws(
      () => solveKepler((Math.PI / 4) as Radians, -0.1),
      RangeError
    );
  });

  test('Invalid Eccentricity (e >= 1) Throws Error', () => {
    assert.throws(() => solveKepler((Math.PI / 4) as Radians, 1), RangeError);
    assert.throws(() => solveKepler((Math.PI / 4) as Radians, 1.1), RangeError);
  });
});

describe('solveKepler: any finite M', () => {
  const TWO_PI = 2 * Math.PI;
  // Distance of E - e·sin(E) from M, modulo 2π
  const keplerResidual = (E: number, e: number, M: number) => {
    const r = (((E - e * Math.sin(E) - M) % TWO_PI) + TWO_PI) % TWO_PI;

    return Math.min(r, TWO_PI - r);
  };
  const assertSolves = (M: number, e: number) => {
    const E = solveKepler(M as Radians, e);

    assert.ok(E >= 0 && E < TWO_PI, `M=${M}, e=${e}: E=${E} not in [0, 2π)`);
    assert.ok(
      keplerResidual(E, e, M) < EPSILON,
      `M=${M}, e=${e}: E=${E} does not solve Kepler's equation`
    );
  };

  test('negative M returns E in [0, 2π)', () => {
    // Previously returned -1.4987 (E for M = -1, not normalized)
    assertApproxEqual(solveKepler(-1 as Radians, 0.5), TWO_PI - 1.498701133517);

    for (const e of [0, 0.5, 0.9, 0.95, 0.99]) {
      for (const M of [-1e-12, -1, -Math.PI, -10, -1000]) assertSolves(M, e);
    }
  });

  test('is 2π-periodic: E(M + 2πk) = E(M)', () => {
    for (const e of [0.1, 0.7, 0.95]) {
      const base = solveKepler(1.234 as Radians, e);

      for (const k of [-3, -1, 1, 7, 100]) {
        assertApproxEqual(solveKepler((1.234 + TWO_PI * k) as Radians, e), base);
      }
    }
  });

  test('high eccentricity with many revolutions (e > 0.9, large M)', () => {
    // Previously returned E with residuals up to 1.3 rad for M = 150 and 1000
    for (const e of [0.95, 0.99, 0.999]) {
      for (const M of [150, 1000, 123_456.789]) assertSolves(M, e);
    }
  });

  test('falls back to bisection when a solver settles away from the root', () => {
    // e = 0.9 (Newton-Raphson path): the Householder step vanishes at E ≈ 0.266, not a root
    assertSolves(-1997.877, 0.9);
    // e = 0.9999 (high-eccentricity path): needs more than the default maxIter
    assertSolves(-2726.877, 0.9999);
  });

  test('sweep: E in [0, 2π) and solves Kepler for all e and M', () => {
    for (const e of [0, 0.3, 0.7, 0.9, 0.95, 0.99, 0.999, 0.9999]) {
      for (let M = -1000; M <= 1000; M += 7.31) assertSolves(M, e);
    }
  });
});
