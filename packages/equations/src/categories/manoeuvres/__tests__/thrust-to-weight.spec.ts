import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { thrustToWeight } from '../thrust-to-weight.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('thrustToWeight', () => {
  test('computes F / (m * g)', () => {
    relClose(thrustToWeight(45_000, 2000, 3.71), 45_000 / (2000 * 3.71));
  });

  test('is 1 when thrust exactly balances weight', () => {
    relClose(thrustToWeight(9.80665 * 1000, 1000, 9.80665), 1);
  });

  test('is 0 with no thrust', () => {
    assert.equal(thrustToWeight(0, 1000, 9.80665), 0);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => thrustToWeight(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'F must be a finite number. Received: NaN'
    );
    assert.throws(
      () => thrustToWeight(1, Number.POSITIVE_INFINITY, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => thrustToWeight(1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError for out-of-domain inputs', () => {
    assert.throws(
      () => thrustToWeight(-1, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'F must be >= 0. Received: -1'
    );
    assert.throws(
      () => thrustToWeight(1, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm must be > 0. Received: 0'
    );
    assert.throws(
      () => thrustToWeight(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g must be > 0. Received: 0'
    );
  });
});
