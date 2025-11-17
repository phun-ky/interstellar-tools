import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerBisection } from '../categories/kepler/solve-kepler-bisection';
import { Radians } from '@interstellar-tools/types';
import { angleClose, norm2pi, residual } from './helpers';
import { TWO_PI } from '@interstellar-tools/constants';

describe('solveKeplerBisection', () => {
  test('basic correctness: residual close to 0 (e=0.5, M=1.234)', () => {
    const e = 0.5;
    const M = 1.234 as Radians;
    const tol = 1e-12;
    const E = solveKeplerBisection(M, e, 200, tol);
    assert.ok(E >= 0 && E < TWO_PI, 'E not in [0, 2π)');
    assert.ok(
      Math.abs(residual(E, e, M)) < tol,
      'residual not within tolerance'
    );
  });

  test('circular case e=0 → E = M (mod 2π)', () => {
    const e = 0;
    const M = (7 * Math.PI) as Radians; // maps to π
    const E = solveKeplerBisection(M, e, 50, 1e-12);
    angleClose(E, norm2pi(M), 1e-12);
  });

  test('near-parabolic (e≈1): convergence and residual check', () => {
    const e = 0.999;
    const M = (0.9 * Math.PI) as Radians;
    const E = solveKeplerBisection(M, e, 500, 1e-12);
    assert.ok(E >= 0 && E < TWO_PI);
    assert.ok(Math.abs(residual(E, e, M)) < 1e-12);
  });

  test('normalizes M to [0, 2π): negative M and large M match normalized result', () => {
    const e = 0.3;
    const M1 = (-3 * Math.PI) as Radians; // ≡ π (mod 2π)
    const M2 = (13 * Math.PI) as Radians; // ≡ π (mod 2π)
    const E1 = solveKeplerBisection(M1, e, 200, 1e-12);
    const E2 = solveKeplerBisection(M2, e, 200, 1e-12);
    const Enorm = solveKeplerBisection(Math.PI as Radians, e, 200, 1e-12);
    angleClose(E1, Enorm, 1e-12);
    angleClose(E2, Enorm, 1e-12);
  });

  test('early exit at endpoints: M≈0 and M≈2π both return ~0', () => {
    const e = 0.42;
    const tol = 1e-12;

    const M0 = 1e-13 as Radians; // |F(0)| < tol
    const E0 = solveKeplerBisection(M0, e, 5, tol);
    angleClose(E0, 0, 1e-12);

    const M2pi = (2 * Math.PI - 1e-13) as Radians; // |F(2π)| < tol ⇒ returns 0
    const E2 = solveKeplerBisection(M2pi, e, 5, tol);
    angleClose(E2, 0, 1e-12);
  });

  test('monotonic mapping: if M1 < M2 then E1 < E2 (same e)', () => {
    const e = 0.7;
    const M1 = 0.1 as Radians;
    const M2 = 3.0 as Radians;
    const E1 = solveKeplerBisection(M1, e, 300, 1e-12);
    const E2 = solveKeplerBisection(M2, e, 300, 1e-12);
    assert.ok(E1 < E2, `Expected E1 < E2 but got E1=${E1}, E2=${E2}`);
  });

  test('input validation: TypeError for non-number M', () => {
    assert.throws(
      () => solveKeplerBisection('1.0' as unknown as Radians, 0.2, 100, 1e-9),
      TypeError
    );
  });

  test('input validation: RangeError for non-finite M', () => {
    assert.throws(
      () => solveKeplerBisection(NaN as Radians, 0.2, 100, 1e-9),
      RangeError
    );
    assert.throws(
      () => solveKeplerBisection(Infinity as Radians, 0.2, 100, 1e-9),
      RangeError
    );
  });

  test('input validation: e out of domain throws RangeError', () => {
    assert.throws(
      () => solveKeplerBisection(1 as Radians, -0.1, 100, 1e-9),
      RangeError
    );
    assert.throws(
      () => solveKeplerBisection(1 as Radians, 1, 100, 1e-9),
      RangeError
    );
    assert.throws(
      () => solveKeplerBisection(1 as Radians, 1.2, 100, 1e-9),
      RangeError
    );
  });

  test('input validation: maxIter and tolerance must be positive finite', () => {
    assert.throws(
      () => solveKeplerBisection(1 as Radians, 0.1, 0, 1e-9),
      RangeError
    );
    assert.throws(
      () => solveKeplerBisection(1 as Radians, 0.1, -5, 1e-9),
      RangeError
    );

    assert.throws(
      () => solveKeplerBisection(1 as Radians, 0.1, '100' as any, 1e-9),
      RangeError
    );

    assert.throws(
      () => solveKeplerBisection(1 as Radians, 0.1, 100, 0),
      RangeError
    );

    assert.throws(
      () => solveKeplerBisection(1 as Radians, 0.1, 100, '1e-9' as any),
      RangeError
    );
  });

  test('consistency across tolerances: tighter tol refines E (residual non-increasing)', () => {
    const e = 0.45;
    const M = 2.2 as Radians;
    const E1 = solveKeplerBisection(M, e, 100, 1e-6);
    const E2 = solveKeplerBisection(M, e, 200, 1e-12);
    const r1 = Math.abs(residual(E1, e, M));
    const r2 = Math.abs(residual(E2, e, M));
    assert.ok(
      r2 <= r1 + 1e-15,
      `expected residual to not increase: r1=${r1}, r2=${r2}`
    );
  });
});
