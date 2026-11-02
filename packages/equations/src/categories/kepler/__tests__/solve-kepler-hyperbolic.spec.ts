import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { solveKeplerHyperbolic } from '../solve-kepler-hyperbolic.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const residual = (F: number, e: number, M: number) => e * Math.sinh(F) - F - M;

describe('solveKeplerHyperbolic', () => {
  test('satisfies Mh = e sinh F - F over a wide range', () => {
    for (const e of [1.0001, 1.05, 1.44, 2, 10, 1000]) {
      for (const M of [1e-9, 0.01, 0.5, 1, 5, 12.66, 100, 1e4, 1e8]) {
        const F = solveKeplerHyperbolic(M, e);

        relClose(e * Math.sinh(F) - F, M, 1e-12, `e=${e}, M=${M}`);
      }
    }
  });

  test('converges close to e = 1 without losing precision', () => {
    // e sinh F - F - M cancels badly here unless sinh F - F is taken from its
    // series: check with (e - 1) F + e (F³/6 + F⁵/120 + ...)
    const series = (F: number) => {
      let term = F ** 3 / 6;
      let sum = term;

      for (let k = 5; k < 40; k += 2) {
        term *= (F * F) / ((k - 1) * k);
        sum += term;
      }

      return sum;
    };

    for (const e of [1 + 1e-12, 1 + 1e-9, 1.0001]) {
      for (const M of [1e-15, 1e-12, 1e-6, 0.01]) {
        const F = solveKeplerHyperbolic(M, e);

        relClose((e - 1) * F + e * series(F), M, 1e-13, `e=${e}, M=${M}`);
      }
    }
  });

  test('is odd: negative mean anomalies give negative F', () => {
    const F = solveKeplerHyperbolic(-12.66, 1.44);

    assert.ok(F < 0);
    relClose(F, -solveKeplerHyperbolic(12.66, 1.44), 1e-15);
  });

  test('returns 0 at periapsis', () => {
    assert.equal(solveKeplerHyperbolic(0, 1.44), 0);
  });

  test('matches the documented example (F ≈ 3.087)', () => {
    const F = solveKeplerHyperbolic(12.66, 1.44);

    assert.equal(F.toFixed(3), '3.087');
    assert.ok(Math.abs(residual(F, 1.44, 12.66)) < 1e-12);
  });

  test('throws when it does not converge within maxIter', () => {
    assert.throws(
      () => solveKeplerHyperbolic(1e6, 1.44, 1e-14, 1),
      (err) =>
        err instanceof Error &&
        err.message.startsWith(
          'solveKeplerHyperbolic did not converge in 1 steps.'
        )
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => solveKeplerHyperbolic(Number.NaN, 1.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Mh must be a finite number. Received: NaN'
    );
    assert.throws(
      () => solveKeplerHyperbolic(1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be > 1. Received: 1'
    );
    assert.throws(
      () => solveKeplerHyperbolic(1, 1.5, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'tolerance must be > 0. Received: 0'
    );
    assert.throws(
      () => solveKeplerHyperbolic(1, 1.5, 1e-12, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'maxIter must be >= 1. Received: 0'
    );
  });
});
