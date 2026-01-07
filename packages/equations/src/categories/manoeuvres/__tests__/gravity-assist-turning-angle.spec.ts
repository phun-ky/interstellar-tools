import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { relClose } from 'packages/equations/src/__tests__/helpers';
import { gravityAssistTurningAngle } from '../gravity-assist-turning-angle';
import type { Radians } from '@interstellar-tools/types';

describe('gravityAssistTurningAngle', () => {
  /**
   * Local helper for the expected value using the same math definition.
   * Keeps the test readable and mirrors the equation.
   */
  const expectedTurningAngle = (
    rp: number,
    vInf: number,
    mu: number
  ): Radians => {
    const denom = 1 + (rp * vInf * vInf) / mu;
    const x = 1 / denom;
    const clamped = Math.min(1, Math.max(0, x));
    return (2 * Math.asin(clamped)) as Radians;
  };

  test('returns expected turning angle for typical inputs (Earth, km-based)', () => {
    const rp = 7000; // km
    const vInf = 8; // km/s
    const mu = 398600.4418; // km³/s²

    const delta = gravityAssistTurningAngle(rp, vInf, mu);
    const expected = expectedTurningAngle(rp, vInf, mu);

    relClose(delta, expected);
    assert.ok(delta >= 0 && delta <= Math.PI, `delta out of range: ${delta}`);
  });

  test('when vInfinity is 0, turning angle approaches π (degenerate limit)', () => {
    // With vInf = 0 => x = 1/(1+0) = 1 => delta = 2*asin(1) = π
    const rp = 7000;
    const vInf = 0;
    const mu = 398600.4418;

    const delta = gravityAssistTurningAngle(rp, vInf, mu);

    relClose(delta, Math.PI, 1e-12);
  });

  test('turning angle decreases as periapsis radius increases (all else equal)', () => {
    const vInf = 8;
    const mu = 398600.4418;

    const deltaLowRp = gravityAssistTurningAngle(7000, vInf, mu);
    const deltaHighRp = gravityAssistTurningAngle(70000, vInf, mu);

    assert.ok(
      deltaHighRp < deltaLowRp,
      `expected delta to decrease with rp, got ${deltaLowRp} -> ${deltaHighRp}`
    );
  });

  test('turning angle decreases as vInfinity increases (all else equal)', () => {
    const rp = 7000;
    const mu = 398600.4418;

    const deltaLowV = gravityAssistTurningAngle(rp, 4, mu);
    const deltaHighV = gravityAssistTurningAngle(rp, 8, mu);

    assert.ok(
      deltaHighV < deltaLowV,
      `expected delta to decrease with vInfinity, got ${deltaLowV} -> ${deltaHighV}`
    );
  });

  test('throws TypeError when rp is not finite (NaN)', () => {
    assert.throws(
      () => gravityAssistTurningAngle(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rp must be a finite number. Received: NaN'
    );
  });

  test('throws TypeError when vInfinity is not finite (Infinity)', () => {
    assert.throws(
      () => gravityAssistTurningAngle(1, Number.POSITIVE_INFINITY, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: Infinity'
    );
  });

  test('throws TypeError when mu is not finite (-Infinity)', () => {
    assert.throws(
      () => gravityAssistTurningAngle(1, 1, Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mu must be a finite number. Received: -Infinity'
    );
  });

  test('throws RangeError when rp <= 0', () => {
    assert.throws(
      () => gravityAssistTurningAngle(0, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rp must be > 0. Received: 0'
    );
  });

  test('throws RangeError when vInfinity < 0', () => {
    assert.throws(
      () => gravityAssistTurningAngle(1, -1e-9, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'vInfinity must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when mu <= 0', () => {
    assert.throws(
      () => gravityAssistTurningAngle(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: 0'
    );
  });

  test('returns ~0 for extremely large rp (very weak deflection)', () => {
    const rp = 1e17;
    const vInf = 8;
    const mu = 398600.4418;

    const delta = gravityAssistTurningAngle(rp, vInf, mu);

    // For huge rp, delta is extremely small
    relClose(delta, 0, 1e-12);
  });

  test('for large rp, turning angle matches small-angle approximation', () => {
    const rp = 1e8; // or 1e12, etc.
    const vInf = 8;
    const mu = 398600.4418;

    const delta = gravityAssistTurningAngle(rp, vInf, mu);

    const approx = (2 * mu) / (rp * vInf * vInf);

    // This is an approximation, so use a looser tolerance
    relClose(delta, approx, 1e-6);
  });
});
