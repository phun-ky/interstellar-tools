import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from './helpers';
import { visVivaSpeed } from '../vis-viva-speed';

describe('visVivaSpeed', () => {
  test('circular orbit: a = r → v = sqrt(μ/r)', () => {
    const mu = 3.986004418e14; // m^3/s^2 (Earth GM)
    const r = 6778e3; // m (LEO-ish)
    const a = r;

    const v = visVivaSpeed(r, a, mu);
    const expected = Math.sqrt(mu / r);

    relClose(v, expected, 1e-12);
  });

  test('parabolic trajectory: a = Infinity → v = sqrt(2μ/r)', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;

    const v = visVivaSpeed(r, Infinity, mu);
    const expected = Math.sqrt((2 * mu) / r);

    relClose(v, expected, 1e-12);
  });

  test('hyperbolic case: a < 0 uses same formula and yields valid speed', () => {
    const mu = 3.986004418e14;
    const r = 10000e3;
    const a = -15000e3; // negative semi-major axis

    const v = visVivaSpeed(r, a, mu);
    const expected = Math.sqrt(mu * (2 / r - 1 / a));

    relClose(v, expected, 1e-12);
  });

  test('radicand zero boundary: choose a such that 2/r - 1/a = 0 → v = 0', () => {
    const mu = 3.986004418e14;
    const r = 8000e3;
    const a = r / 2; // 1/a = 2/r

    const v = visVivaSpeed(r, a, mu);
    absClose(v, 0, 1e-12);
  });

  test('tiny negative radicand (within tolerance) is clamped to v ≈ 0', () => {
    const mu = 3.986004418e14;
    const r = 8000e3;

    // Function's tolerance: tol = |1e-14 * mu / r|
    const tol = Math.abs((1e-14 * mu) / r);
    const delta = tol / (2 * mu); // makes radicand = μ*(2/r - 1/a) = -tol/2

    // Choose 1/a = 2/r + delta  → a = 1 / (2/r + delta)
    const a = 1 / (2 / r + delta);

    const v = visVivaSpeed(r, a, mu);
    absClose(v, 0, 1e-12);
  });

  test('significantly negative radicand throws (physically impossible state)', () => {
    const mu = 3.986004418e14;
    const r = 8000e3;
    const a = r / 4; // 1/a = 4/r -> 2/r - 1/a = -2/r (negative)

    assert.throws(
      () => visVivaSpeed(r, a, mu),
      /Invalid state: μ\*\(2\/r - 1\/a\) < 0/
    );
  });

  test('monotonic with radius for fixed a, μ: larger r → smaller v (ellipse domain)', () => {
    const mu = 3.986004418e14;
    const a = 10000e3; // ellipse: r must be < 2a
    const r1 = 8000e3;
    const r2 = 15000e3; // < 2a = 20000 km

    const v1 = visVivaSpeed(r1, a, mu);
    const v2 = visVivaSpeed(r2, a, mu);

    assert.ok(
      v1 > v2,
      'speed should decrease as radius increases (for fixed a)'
    );
  });

  test('input validation: r<=0, mu<0/NaN, a non-finite (except +Infinity), a=0', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const a = r;

    // r invalid
    assert.throws(() => visVivaSpeed(0, a, mu), /positive/);
    assert.throws(() => visVivaSpeed(-1, a, mu), /positive/);
    assert.throws(() => visVivaSpeed(Number.NaN, a, mu), /finite/);

    // mu invalid
    assert.throws(() => visVivaSpeed(r, a, -1), /non-negative/);
    assert.throws(() => visVivaSpeed(r, a, Number.NaN), /finite/);

    // a invalid (non-finite other than +Infinity)
    assert.throws(() => visVivaSpeed(r, Number.NaN, mu), /finite/);
    assert.throws(
      () => visVivaSpeed(r, Number.NEGATIVE_INFINITY, mu),
      /finite/
    );

    // a = 0 invalid
    assert.throws(() => visVivaSpeed(r, 0, mu), /non-zero/);
  });
});
