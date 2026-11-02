import type { CwState } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cwTwoImpulseTransfer } from '../cw-two-impulse-transfer.js';
import { cwPropagate } from '../../orbits/cw-propagate.js';
import { absClose } from '../../../__tests__/helpers/index.js';

const n = 0.00113;
const ZERO: CwState = [0, 0, 0, 0, 0, 0];

const applyBurn = (state: CwState, dv: readonly number[]): CwState =>
  [
    state[0],
    state[1],
    state[2],
    state[3] + dv[0],
    state[4] + dv[1],
    state[5] + dv[2]
  ] as const;

describe('cwTwoImpulseTransfer', () => {
  test('arrives at the target state', () => {
    const start: CwState = [-2000, -15_000, 300, 0.5, 3.4, -0.1];
    const target: CwState = [0, -50, 0, 0, 0, 0];

    for (const t of [900, 2500, 4000]) {
      const { dv1, dv2 } = cwTwoImpulseTransfer(start, target, n, t);
      const arrived = applyBurn(cwPropagate(applyBurn(start, dv1), n, t), dv2);

      for (let i = 0; i < 6; i++) absClose(arrived[i], target[i], 1e-6);
    }
  });

  test('needs no burns when already on the way', () => {
    const start: CwState = [-100, 0, 0, 0, 2 * n * 100, 0];
    const t = 1500;
    const { dv1, dv2 } = cwTwoImpulseTransfer(
      start,
      cwPropagate(start, n, t),
      n,
      t
    );

    for (const x of [...dv1, ...dv2]) absClose(x, 0, 1e-9);
  });

  test('works in the plane at a half orbit, without a cross-track burn', () => {
    const start: CwState = [0, -1000, 0, 0, 0, 0];
    const { dv1, dv2 } = cwTwoImpulseTransfer(start, ZERO, n, Math.PI / n);

    assert.equal(dv1[2], 0);
    absClose(dv2[2], 0, 1e-12);
  });

  test('throws when the transfer time cannot be targeted', () => {
    assert.throws(
      () =>
        cwTwoImpulseTransfer(
          [0, -1000, 0, 0, 0, 0],
          ZERO,
          n,
          (2 * Math.PI) / n
        ),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('The transfer time is a whole number of orbits')
    );
    assert.throws(
      () => cwTwoImpulseTransfer([0, -1000, 50, 0, 0, 0], ZERO, n, Math.PI / n),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith(
          "At a half orbit (nt = πk) the cross-track position can't be changed."
        )
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => cwTwoImpulseTransfer([0, 0, 0, 0, 0, Number.NaN], ZERO, n, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'state0 must have finite components. Received: NaN'
    );
    assert.throws(
      () => cwTwoImpulseTransfer(ZERO, [Number.NaN, 0, 0, 0, 0, 0], n, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'target must have finite components. Received: NaN'
    );
    assert.throws(
      () => cwTwoImpulseTransfer(ZERO, ZERO, n, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 't must be a finite number. Received: NaN'
    );
    assert.throws(
      () => cwTwoImpulseTransfer(ZERO, ZERO, n, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 't must be > 0. Received: 0'
    );
  });
});
