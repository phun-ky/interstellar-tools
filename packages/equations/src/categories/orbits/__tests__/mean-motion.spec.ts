import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { meanMotion } from '../mean-motion';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('meanMotion', () => {
  test('computes n = sqrt(mu / a^3) for a typical Earth orbit (km-based)', () => {
    const mu = 398600.4418; // km³/s²
    const a = 7000; // km

    const n = meanMotion(mu, a);

    const expected = Math.sqrt(mu / (a * a * a));
    relClose(n, expected);
    assert.ok(n > 0);
  });

  test('scales as a^(-3/2): doubling a reduces n by 2^(3/2)', () => {
    const mu = 398600.4418;
    const a1 = 7000;
    const a2 = 2 * a1;

    const n1 = meanMotion(mu, a1);
    const n2 = meanMotion(mu, a2);

    const expectedRatio = 1 / Math.pow(2, 3 / 2); // n2/n1
    relClose(n2 / n1, expectedRatio);
  });

  test('scales as sqrt(mu): quadrupling mu doubles n', () => {
    const mu1 = 100;
    const mu2 = 4 * mu1;
    const a = 10;

    const n1 = meanMotion(mu1, a);
    const n2 = meanMotion(mu2, a);

    relClose(n2 / n1, 2);
  });

  test('throws TypeError when mu is not finite (NaN)', () => {
    assert.throws(
      () => meanMotion(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mu must be finite. Received: NaN'
    );
  });

  test('throws TypeError when a is not finite (Infinity)', () => {
    assert.throws(
      () => meanMotion(1, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be finite. Received: Infinity'
    );
  });

  test('throws RangeError when mu <= 0 (mu === 0)', () => {
    assert.throws(
      () => meanMotion(0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: 0'
    );
  });

  test('throws RangeError when a <= 0 (a === 0)', () => {
    assert.throws(
      () => meanMotion(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });
});
