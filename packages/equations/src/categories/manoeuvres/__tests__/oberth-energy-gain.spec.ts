import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { oberthEnergyGain } from '../oberth-energy-gain';
import { absClose } from 'packages/equations/src/__tests__/helpers';

const relClose = (
  a: number,
  b: number,
  rel = 1e-12,
  abs = 1e-12,
  msg?: string
) => {
  const denom = Math.max(1, Math.abs(a), Math.abs(b));
  assert.ok(Math.abs(a - b) <= Math.max(abs, rel * denom), msg);
};

describe('oberthEnergyGain', () => {
  test('basic: Δε ≈ v·Δv', () => {
    const v = 7800; // m/s (LEO-ish)
    const dv = 100; // m/s
    const dE = oberthEnergyGain(v, dv);
    absClose(dE, v * dv);
  });

  test('zeros: dv=0 → 0; v=0 → 0', () => {
    absClose(oberthEnergyGain(7500, 0), 0);
    absClose(oberthEnergyGain(0, 25), 0);
  });

  test('scaling: scale v and dv by k ⇒ Δε scales by k²', () => {
    const v = 5000,
      dv = 20;
    const k = 3.5;
    const base = oberthEnergyGain(v, dv);
    const scaled = oberthEnergyGain(k * v, k * dv);
    relClose(scaled, k * k * base, 1e-12, 1e-12);
  });

  test('monotonicity: Δε increases with v for fixed dv', () => {
    const dv = 15;
    const values = [2000, 4000, 8000, 12000].map((v) =>
      oberthEnergyGain(v, dv)
    );
    for (let i = 1; i < values.length; i++) {
      assert.ok(values[i] > values[i - 1]);
    }
  });

  test('monotonicity: Δε increases with dv for fixed v', () => {
    const v = 9000;
    const values = [1, 5, 25, 50, 100].map((dv) => oberthEnergyGain(v, dv));
    for (let i = 1; i < values.length; i++) {
      assert.ok(values[i] > values[i - 1]);
    }
  });

  // ---------------- approximation sanity vs. exact small-impulse energy change ----------------

  test('approximation check vs. exact Δε = v·Δv + 0.5·Δv² (prograde)', () => {
    const v = 9000; // m/s
    const dv = 10; // small impulse
    const approx = oberthEnergyGain(v, dv);
    const exact = v * dv + 0.5 * dv * dv; // neglecting gravity/curvature during the burn
    // The approximation should be lower than exact by ~0.5*dv²
    absClose(exact - approx, 0.5 * dv * dv);
  });

  // ---------------- validation ----------------

  test('TypeError on non-number inputs', () => {
    assert.throws(() => oberthEnergyGain('7800' as any, 50), TypeError);

    assert.throws(() => oberthEnergyGain(7800, '50' as any), TypeError);
  });

  test('RangeError on non-finite/negative v or dv', () => {
    assert.throws(() => oberthEnergyGain(NaN, 10), RangeError);
    assert.throws(() => oberthEnergyGain(7500, NaN), RangeError);
    assert.throws(() => oberthEnergyGain(Infinity, 10), RangeError);
    assert.throws(() => oberthEnergyGain(7500, Infinity), RangeError);
    assert.throws(() => oberthEnergyGain(-1, 10), RangeError);
    assert.throws(() => oberthEnergyGain(7500, -0.1), RangeError);
  });

  // ---------------- large but finite values ----------------

  test('handles large finite numbers without overflow', () => {
    const v = 1e6; // m/s (synthetic test)
    const dv = 1e3; // m/s
    const dE = oberthEnergyGain(v, dv);
    absClose(dE, v * dv);
  });
});
