import { CwState, CwStateDerivative } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cwHillDerivatives } from '../cw-hill-derivatives';
import {
  relClose,
  relCloseTuple
} from 'packages/equations/src/__tests__/helpers';

describe('cwHillDerivatives', () => {
  test('returns [xDot,yDot,zDot,xDDot,yDDot,zDDot] matching CW/Hill accelerations', () => {
    const n = 0.001; // rad/s
    const state: CwState = [100, -50, 25, 0.2, -0.1, 0.05];

    const ds = cwHillDerivatives(state, n);

    const [x, y, z, xDot, yDot, zDot] = state;
    const n2 = n * n;

    const expected: CwStateDerivative = [
      xDot,
      yDot,
      zDot,
      2 * n * yDot + 3 * n2 * x,
      -2 * n * xDot,
      -n2 * z
    ];

    relCloseTuple(ds, expected);
  });

  test('when n = 0, accelerations are zero and derivative is pure velocity', () => {
    const n = 0;
    const state: CwState = [1, 2, 3, 0.1, 0.2, 0.3];

    const ds = cwHillDerivatives(state, n);

    const expected: CwStateDerivative = [0.1, 0.2, 0.3, 0, 0, 0];
    relCloseTuple(ds, expected);
  });

  test('z dynamics are simple harmonic: zDDot = -n² z', () => {
    const n = 0.01;
    const state: CwState = [0, 0, 123.456, 0, 0, 0];

    const ds = cwHillDerivatives(state, n);

    const expectedZDDot = -(n * n) * state[2];
    relClose(ds[5], expectedZDDot);
  });

  test('throws TypeError when n is not finite (NaN)', () => {
    const state: CwState = [0, 0, 0, 0, 0, 0];
    assert.throws(
      () => cwHillDerivatives(state, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'n must be finite. Received: NaN'
    );
  });

  test('throws RangeError when n < 0', () => {
    const state: CwState = [0, 0, 0, 0, 0, 0];
    assert.throws(
      () => cwHillDerivatives(state, -1e-9),
      (err) =>
        err instanceof RangeError &&
        err.message === 'n must be >= 0. Received: -1e-9'
    );
  });

  test('throws TypeError when a state component is not finite', () => {
    const n = 0.001;

    const badX: CwState = [Number.NaN, 0, 0, 0, 0, 0];
    assert.throws(
      () => cwHillDerivatives(badX, n),
      (err) =>
        err instanceof TypeError &&
        err.message === 'x must be finite. Received: NaN'
    );

    const badYDot: CwState = [0, 0, 0, 0, Number.POSITIVE_INFINITY, 0];
    assert.throws(
      () => cwHillDerivatives(badYDot, n),
      (err) =>
        err instanceof TypeError &&
        err.message === 'yDot must be finite. Received: Infinity'
    );
  });

  test('output is always finite for finite inputs', () => {
    const n = 0.002;
    const state: CwState = [1e6, -1e6, 1e5, 10, -10, 1];

    const ds = cwHillDerivatives(state, n);

    for (const v of ds) {
      assert.ok(Number.isFinite(v), `expected finite output, got ${v}`);
    }
  });
});
