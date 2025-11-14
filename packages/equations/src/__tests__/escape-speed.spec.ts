import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { escapeSpeed } from '../categories/orbits/escape-speed';
import { absClose, relClose } from './helpers';

describe('escapeSpeed', () => {
  test('definition check: v_esc = sqrt(2μ/r)', () => {
    const mu = 3.986004418e14; // m^3/s^2 (Earth GM)
    const r = 7000e3; // m
    const v = escapeSpeed(r, mu);
    const expected = Math.sqrt((2 * mu) / r);
    relClose(v, expected, 1e-15);
  });

  test('relationship to circular speed: v_esc = √2 * √(μ/r)', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const vEsc = escapeSpeed(r, mu);
    const vCirc = Math.sqrt(mu / r);
    relClose(vEsc / vCirc, Math.SQRT2, 1e-15);
  });

  test('Earth surface ~6378 km: v_esc ≈ 11.186 km/s', () => {
    const mu = 3.986004418e14;
    const rSurface = 6378e3;
    const v = escapeSpeed(rSurface, mu);
    const ref = 11186; // m/s
    relClose(v, ref, 0.01); // within 1%
  });

  test('LEO (~400 km): v_esc ≈ 10.86 km/s', () => {
    const mu = 3.986004418e14;
    const rLeo = 6378e3 + 400e3;
    const v = escapeSpeed(rLeo, mu);
    const ref = 10860; // m/s
    relClose(v, ref, 0.02); // within 2%
  });

  test('scaling with μ: doubling μ → v scales by √2 (same r)', () => {
    const r = 7000e3;
    const mu = 3.986004418e14;
    const v1 = escapeSpeed(r, mu);
    const v2 = escapeSpeed(r, 2 * mu);
    relClose(v2 / v1, Math.SQRT2, 1e-15);
  });

  test('scaling with r: quadrupling r → v halves (same μ)', () => {
    const mu = 3.986004418e14;
    const r1 = 7000e3;
    const r2 = 4 * r1;
    const v1 = escapeSpeed(r1, mu);
    const v2 = escapeSpeed(r2, mu);
    relClose(v2 / v1, 0.5, 1e-15);
  });

  test('dimensionless identity: (v^2 * r) / (2μ) ≈ 1', () => {
    const mu = 1.2345e12;
    const r = 3.21e7;
    const v = escapeSpeed(r, mu);
    const ratio = (v * v * r) / (2 * mu);
    relClose(ratio, 1, 1e-12);
  });

  test('degenerate case μ = 0 → v_esc = 0', () => {
    const r = 7000e3;
    const v = escapeSpeed(r, 0);
    absClose(v, 0, 1e-15);
  });

  test('input validation: r<=0, non-finite r; μ<0, non-finite μ throw', () => {
    const r = 7000e3;
    const mu = 3.986004418e14;

    // r invalid
    assert.throws(() => escapeSpeed(0, mu), /positive/);
    assert.throws(() => escapeSpeed(-1, mu), /positive/);
    assert.throws(() => escapeSpeed(Number.NaN, mu), /finite/);

    // μ invalid
    assert.throws(() => escapeSpeed(r, -1), /non-negative/);
    assert.throws(() => escapeSpeed(r, Number.NaN), /finite/);
  });

  test('numerical sanity: extreme but valid values remain finite and positive', () => {
    const v1 = escapeSpeed(1e3, 1e9); // small r, large μ
    const v2 = escapeSpeed(1e12, 1e6); // large r, small μ
    assert.ok(Number.isFinite(v1) && v1 > 0);
    assert.ok(Number.isFinite(v2) && v2 > 0);
  });
});
