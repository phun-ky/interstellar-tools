import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { sphereOfInfluenceRadius } from '../categories/orbits/sphere-of-influence-radius';
import { relClose } from './helpers';

describe('sphereOfInfluenceRadius', () => {
  test('computes rSOI = a * (m/M)^(2/5) for typical inputs (Earth around Sun, km-based)', () => {
    const aKm = 149_597_870.7; // km
    const mEarth = 5.972e24; // kg
    const mSun = 1.9885e30; // kg

    const rSoi = sphereOfInfluenceRadius(aKm, mEarth, mSun);

    const expected = aKm * Math.pow(mEarth / mSun, 2 / 5);
    relClose(rSoi, expected);
    assert.ok(rSoi > 0);
  });

  test('scales linearly with a (doubling a doubles rSOI)', () => {
    const a = 10;
    const m = 2;
    const M = 100;

    const r1 = sphereOfInfluenceRadius(a, m, M);
    const r2 = sphereOfInfluenceRadius(2 * a, m, M);

    relClose(r2, 2 * r1);
  });

  test('increases with secondary mass m (all else equal)', () => {
    const a = 10;
    const M = 100;

    const rSmall = sphereOfInfluenceRadius(a, 1, M);
    const rLarge = sphereOfInfluenceRadius(a, 10, M);

    assert.ok(
      rLarge > rSmall,
      `expected rSOI to increase with m: ${rSmall} -> ${rLarge}`
    );
  });

  test('decreases with primary mass M (all else equal)', () => {
    const a = 10;
    const m = 10;

    const rSmallM = sphereOfInfluenceRadius(a, m, 100);
    const rLargeM = sphereOfInfluenceRadius(a, m, 1000);

    assert.ok(
      rLargeM < rSmallM,
      `expected rSOI to decrease with M: ${rSmallM} -> ${rLargeM}`
    );
  });

  test('throws TypeError when a is not finite (NaN)', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be a finite number. Received: NaN'
    );
  });

  test('throws TypeError when m is not finite (Infinity)', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(1, Number.POSITIVE_INFINITY, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm must be a finite number. Received: Infinity'
    );
  });

  test('throws TypeError when M is not finite (-Infinity)', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(1, 1, Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'M must be a finite number. Received: -Infinity'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(0, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when m <= 0', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(1, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm must be > 0. Received: 0'
    );
  });

  test('throws RangeError when M <= 0', () => {
    assert.throws(
      () => sphereOfInfluenceRadius(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'M must be > 0. Received: 0'
    );
  });
});
