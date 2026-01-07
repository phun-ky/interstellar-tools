import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';
import { circularSpeed } from '../circular-speed';

describe('circularSpeed', () => {
  test('LEO (~400 km) around Earth: v ≈ 7.67 km/s', () => {
    const mu = 3.986004418e14; // m³/s²
    const r = 6378e3 + 400e3; // m
    const v = circularSpeed(r, mu);
    const expected = Math.sqrt(mu / r);
    relClose(v, expected, 1e-12);
    assert.ok(v > 7400 && v < 7900, `unexpected LEO speed: ${v} m/s`);
  });

  test('GEO (~42,164 km): v ≈ 3074 m/s', () => {
    const mu = 3.986004418e14;
    const r = 42164e3;
    const v = circularSpeed(r, mu);
    const expected = Math.sqrt(mu / r);
    relClose(v, expected, 1e-12);
    // loose real-world check
    const ref = 3074; // m/s
    relClose(v, ref, 0.02); // within 2%
  });

  test('Heliocentric at 1 AU: v ≈ 29.78 km/s', () => {
    const muSun = 1.32712440018e20; // m³/s²
    const AU = 149_597_870_700; // m
    const v = circularSpeed(AU, muSun);
    const ref = 29_780; // m/s
    relClose(v, ref, 0.01); // within 1%
  });

  test('Scaling with μ: doubling μ increases v by √2 (same r)', () => {
    const r = 7000e3;
    const mu = 3.986004418e14;
    const v1 = circularSpeed(r, mu);
    const v2 = circularSpeed(r, 2 * mu);
    relClose(v2 / v1, Math.SQRT2, 1e-12);
  });

  test('Scaling with r: quadrupling r halves v (same μ)', () => {
    const mu = 3.986004418e14;
    const r1 = 7000e3;
    const r2 = 4 * r1;
    const v1 = circularSpeed(r1, mu);
    const v2 = circularSpeed(r2, mu);
    relClose(v2 / v1, 0.5, 1e-12);
  });

  test('Degenerate case: μ = 0 → v = 0', () => {
    const r = 7000e3;
    const v = circularSpeed(r, 0);
    absClose(v, 0, 1e-15);
  });

  test('Input validation: r<=0, non-finite r; μ<0, non-finite μ', () => {
    const r = 7000e3;
    const mu = 3.986004418e14;

    // r invalid
    assert.throws(() => circularSpeed(0, mu), /positive/);
    assert.throws(() => circularSpeed(-1, mu), /positive/);
    assert.throws(() => circularSpeed(Number.NaN, mu), /finite/);

    // μ invalid
    assert.throws(() => circularSpeed(r, -1), /non-negative/);
    assert.throws(() => circularSpeed(r, Number.NaN), /finite/);
  });

  test('Numerical sanity: extremely large/small-but-valid values remain finite', () => {
    const v1 = circularSpeed(1e3, 1e9); // small r, large μ
    const v2 = circularSpeed(1e12, 1e6); // huge r, small μ
    assert.ok(Number.isFinite(v1) && v1 > 0);
    assert.ok(Number.isFinite(v2) && v2 > 0);
  });
});
