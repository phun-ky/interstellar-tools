import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { hyperbolicPeriapsisSpeed } from '../categories/orbits/hyperbolic-periapsis-speed';
import { relClose } from './helpers';

describe('hyperbolicPeriapsisSpeed', () => {
  test('returns sqrt(vInf² + 2mu/rp) for typical inputs (Earth, km-based example)', () => {
    const vInf = 3.2; // km/s
    const mu = 398600.4418; // km³/s²
    const rp = 6678; // km

    const vp = hyperbolicPeriapsisSpeed(vInf, mu, rp);

    const expected = Math.sqrt(vInf * vInf + (2 * mu) / rp);
    relClose(vp, expected);
  });

  test('when vInfinity is 0, reduces to escape speed at rp: sqrt(2mu/rp)', () => {
    const vInf = 0;
    const mu = 398600.4418;
    const rp = 6678;

    const vp = hyperbolicPeriapsisSpeed(vInf, mu, rp);

    const expected = Math.sqrt((2 * mu) / rp);
    relClose(vp, expected);
  });

  test('is always >= vInfinity for valid inputs', () => {
    const vInf = 5;
    const mu = 1e5;
    const rp = 1e3;

    const vp = hyperbolicPeriapsisSpeed(vInf, mu, rp);

    assert.ok(vp >= vInf, `expected vp (${vp}) >= vInfinity (${vInf})`);
  });

  test('throws TypeError when vInfinity is NaN', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: NaN'
    );
  });

  test('throws TypeError when mu is Infinity', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(1, Number.POSITIVE_INFINITY, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mu must be a finite number. Received: Infinity'
    );
  });

  test('throws TypeError when rp is undefined/NaN-ish (NaN)', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rp must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError when vInfinity < 0', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(-0.0001, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'vInfinity must be >= 0. Received: -0.0001'
    );
  });

  test('throws RangeError when mu <= 0 (mu === 0)', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(0, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: 0'
    );
  });

  test('throws RangeError when rp <= 0 (rp === 0)', () => {
    assert.throws(
      () => hyperbolicPeriapsisSpeed(0, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rp must be > 0. Received: 0'
    );
  });

  test('for large rp, vp - vInfinity ≈ mu / (rp * vInfinity)', () => {
    const vInf = 12.345;
    const mu = 3.986004418e5;
    const rp = 1e12;

    const vp = hyperbolicPeriapsisSpeed(vInf, mu, rp);

    const delta = vp - vInf;
    const approx = mu / (rp * vInf);

    // approximation, so use a looser tolerance than exact comparisons
    relClose(delta, approx, 1e-6);
  });
});
