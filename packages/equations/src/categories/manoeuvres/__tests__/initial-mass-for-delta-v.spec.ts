import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { initialMassForDeltaV } from '../initial-mass-for-delta-v.js';
import { rocketDeltaVFromIsp } from '../rocket-delta-v-from-isp.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('initialMassForDeltaV', () => {
  test('inverts rocketDeltaVFromIsp', () => {
    const m0 = initialMassForDeltaV(800, 1270, 320);

    relClose(rocketDeltaVFromIsp(320, m0, 800), 1270);
    assert.equal(Math.round(m0), 1199);
  });

  test('returns mf for dv = 0', () => {
    assert.equal(initialMassForDeltaV(800, 0, 320), 800);
  });

  test('chains burns by working backwards', () => {
    const afterBoth = 1000;
    const beforeSecond = initialMassForDeltaV(afterBoth, 1500, 310);
    const beforeFirst = initialMassForDeltaV(beforeSecond, 2000, 305);

    // Each burn multiplies the mass after it by its own price
    relClose(
      beforeFirst,
      afterBoth *
        Math.exp(1500 / (310 * 9.80665)) *
        Math.exp(2000 / (305 * 9.80665))
    );
  });

  test('uses provided g0 when passed', () => {
    relClose(initialMassForDeltaV(100, 3000, 300, 10), 100 * Math.E);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => initialMassForDeltaV(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mf must be a finite number. Received: NaN'
    );
    assert.throws(
      () => initialMassForDeltaV(1, Number.POSITIVE_INFINITY, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'dv must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => initialMassForDeltaV(1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Isp must be a finite number. Received: NaN'
    );
    assert.throws(
      () => initialMassForDeltaV(1, 1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g0 must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError for out-of-domain inputs', () => {
    assert.throws(
      () => initialMassForDeltaV(0, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mf must be > 0. Received: 0'
    );
    assert.throws(
      () => initialMassForDeltaV(1, -5, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'dv must be >= 0. Received: -5'
    );
    assert.throws(
      () => initialMassForDeltaV(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Isp must be > 0. Received: 0'
    );
    assert.throws(
      () => initialMassForDeltaV(1, 1, 1, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g0 must be > 0. Received: -1'
    );
  });
});
