import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { phasingWaitTime } from '../phasing-wait-time.js';
import { synodicPeriod } from '../../orbits/synodic-period.js';
import { angleClose, relClose } from '../../../__tests__/helpers/index.js';

const rad = (d: number) => ((d * Math.PI) / 180) as Radians;
const nTarget = 0.00113;
const nChaser = nTarget * (1 + 1 / 360);

describe('phasingWaitTime', () => {
  test('waits 6 target orbits to close from 10° to 4° at 1° per orbit', () => {
    const t = phasingWaitTime(rad(10), rad(4), nChaser, nTarget);

    relClose(t, 6 * ((2 * Math.PI) / nTarget), 1e-9);
  });

  test('reaches the required phase angle after the wait', () => {
    for (const [now, required] of [
      [10, 4],
      [4, 10],
      [-30, 170],
      [350, 5]
    ]) {
      const t = phasingWaitTime(rad(now), rad(required), nChaser, nTarget);
      const phase = rad(now) + (nTarget - nChaser) * t;

      angleClose(phase, rad(required), 1e-9);
      assert.ok(t >= 0 && t < synodicPeriod(nChaser, nTarget));
    }
  });

  test('works for a slower chaser too', () => {
    const t = phasingWaitTime(rad(4), rad(10), nTarget, nChaser);

    angleClose(rad(4) + (nChaser - nTarget) * t, rad(10), 1e-9);
  });

  test('is 0 when the phase angle is already right', () => {
    assert.equal(phasingWaitTime(rad(7), rad(7), nChaser, nTarget), 0);
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => phasingWaitTime(Number.NaN as Radians, rad(0), nChaser, nTarget),
      (err) =>
        err instanceof TypeError &&
        err.message === 'thetaNow must be a finite number. Received: NaN'
    );
    assert.throws(
      () => phasingWaitTime(rad(0), rad(0), 0, nTarget),
      (err) =>
        err instanceof RangeError &&
        err.message === 'nChaser must be > 0. Received: 0'
    );
    assert.throws(
      () => phasingWaitTime(rad(0), rad(1), nTarget, nTarget),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('nChaser and nTarget must differ')
    );
  });
});
