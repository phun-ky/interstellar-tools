import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { massFlowRate } from '../mass-flow-rate.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('massFlowRate', () => {
  test('computes F / (Isp * g0) with the default g0', () => {
    relClose(massFlowRate(1000, 300), 1000 / (300 * 9.80665));
  });

  test('uses provided g0 when passed', () => {
    relClose(massFlowRate(1000, 300, 10), 1000 / 3000);
  });

  test('scales linearly with thrust and inversely with Isp', () => {
    relClose(massFlowRate(2000, 300) / massFlowRate(1000, 300), 2);
    relClose(massFlowRate(1000, 600) / massFlowRate(1000, 300), 0.5);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => massFlowRate(Number.NaN, 300),
      (err) =>
        err instanceof TypeError &&
        err.message === 'F must be a finite number. Received: NaN'
    );
    assert.throws(
      () => massFlowRate(1000, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Isp must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => massFlowRate(1000, 300, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g0 must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError for non-positive inputs', () => {
    assert.throws(
      () => massFlowRate(0, 300),
      (err) =>
        err instanceof RangeError &&
        err.message === 'F must be > 0. Received: 0'
    );
    assert.throws(
      () => massFlowRate(1000, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Isp must be > 0. Received: -1'
    );
    assert.throws(
      () => massFlowRate(1000, 300, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g0 must be > 0. Received: 0'
    );
  });
});
