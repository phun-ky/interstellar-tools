import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { relClose } from './helpers';
import { keplerPeriod } from '../categories/orbits/kepler-period';

describe('keplerPeriod', () => {
  test('GEO sanity: a ≈ 42,164 km around Earth → T ≈ 86,164 s', () => {
    const a = 42164e3; // m
    const muEarth = 3.986004418e14; // m³/s²
    const T = keplerPeriod(a, muEarth);

    const ref = 86164.0905; // sidereal day (s)
    // Keep tolerance modest: orbit isn't exactly Keplerian in reality; our formula is ideal
    relClose(T, ref, 1e-3); // 0.1% relative tolerance
  });

  test('LEO circular (~400 km): a = Re + 400 km → T ~ 5550 s', () => {
    const a = 6378e3 + 400e3; // m
    const muEarth = 3.986004418e14; // m³/s²
    const T = keplerPeriod(a, muEarth);

    const ref = 5550; // ~92.5 min
    relClose(T, ref, 5e-2); // 5% slack; depends on precise constants
  });

  test('Scaling with semi-major axis: T ∝ a^(3/2) (same μ)', () => {
    const mu = 3.986004418e14;
    const a1 = 7000e3;
    const a2 = 2 * a1;

    const T1 = keplerPeriod(a1, mu);
    const T2 = keplerPeriod(a2, mu);

    const expectedRatio = Math.pow(2, 1.5); // 2^(3/2)
    relClose(T2 / T1, expectedRatio, 1e-12);
  });

  test('Scaling with μ: doubling μ reduces T by 1/√2 (same a)', () => {
    const a = 10000e3;
    const mu = 3.986004418e14;

    const T1 = keplerPeriod(a, mu);
    const T2 = keplerPeriod(a, 2 * mu);

    const expectedRatio = 1 / Math.SQRT2;
    relClose(T2 / T1, expectedRatio, 1e-12);
  });

  test('Heliocentric: a = 1 AU around Sun → T ≈ 365.256 days', () => {
    const AU = 149_597_870_700; // m (IAU 2012)
    const muSun = 1.32712440018e20; // m³/s²
    const T = keplerPeriod(AU, muSun);

    const siderealYear = 365.256363004 * 86400; // s
    relClose(T, siderealYear, 1e-3); // 0.1% tolerance
  });

  test('Input validation: a <= 0, μ <= 0, or non-finite throws', () => {
    const a = 7000e3;
    const mu = 3.986004418e14;

    // a invalid
    assert.throws(() => keplerPeriod(0, mu), /positive/);
    assert.throws(() => keplerPeriod(-1, mu), /positive/);
    assert.throws(() => keplerPeriod(Number.NaN, mu), /finite/);

    // μ invalid
    assert.throws(() => keplerPeriod(a, 0), /positive/);
    assert.throws(() => keplerPeriod(a, -1), /positive/);
    assert.throws(() => keplerPeriod(a, Number.NaN), /finite/);
  });

  test('Numerical stability: very large a still yields finite result', () => {
    const a = 1e9; // 1,000,000 km
    const muEarth = 3.986004418e14; // m³/s²
    const T = keplerPeriod(a, muEarth);

    assert.ok(Number.isFinite(T) && T > 0);
  });

  // Optional tight identity test against the formula directly
  test('Definition check: T = 2π * sqrt(a^3/μ)', () => {
    const a = 12_345_678; // m
    const mu = 7.654321e13; // m³/s²

    const T = keplerPeriod(a, mu);
    const expected = 2 * Math.PI * Math.sqrt((a * a * a) / mu);

    relClose(T, expected, 1e-15);
  });
});
