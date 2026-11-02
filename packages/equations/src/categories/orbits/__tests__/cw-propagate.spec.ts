import type { CwState } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cwHillDerivatives } from '../cw-hill-derivatives.js';
import { cwPropagate } from '../cw-propagate.js';
import { cwStateTransition } from '../cw-state-transition.js';
import { matMul3 } from '../../helpers/mat-mul3.js';
import { absClose, relClose } from '../../../__tests__/helpers/index.js';

const n = 0.00113; // rad/s, about a 93-minute orbit

// Classic RK4 on cwHillDerivatives, as an independent check
const rk4 = (state: CwState, t: number, steps: number): CwState => {
  const h = t / steps;
  let y = [...state];
  const add = (a: number[], b: readonly number[], k: number) =>
    a.map((x, i) => x + k * b[i]);

  for (let i = 0; i < steps; i++) {
    const k1 = cwHillDerivatives(y as unknown as CwState, n);
    const k2 = cwHillDerivatives(add(y, k1, h / 2) as unknown as CwState, n);
    const k3 = cwHillDerivatives(add(y, k2, h / 2) as unknown as CwState, n);
    const k4 = cwHillDerivatives(add(y, k3, h) as unknown as CwState, n);

    y = y.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }

  return y as unknown as CwState;
};

describe('cwStateTransition', () => {
  test('is the identity at t = 0', () => {
    const { rr, rv, vr, vv } = cwStateTransition(n, 0);
    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Compared with a tolerance: some entries are -0
        absClose(rr[i][j], identity[i][j]);
        absClose(vv[i][j], identity[i][j]);
        absClose(rv[i][j], 0);
        absClose(vr[i][j], 0);
      }
    }
  });

  test('composes: Φ(t1 + t2) = Φ(t2) Φ(t1), checked on the position blocks', () => {
    const [t1, t2] = [700, 1900];
    const a = cwStateTransition(n, t1);
    const b = cwStateTransition(n, t2);
    const ab = cwStateTransition(n, t1 + t2);
    // rr(t1+t2) = rr2 rr1 + rv2 vr1
    const left = matMul3(b.rr, a.rr);
    const right = matMul3(b.rv, a.vr);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        absClose(left[i][j] + right[i][j], ab.rr[i][j], 1e-9);
      }
    }
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => cwStateTransition(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'n must be a finite number. Received: NaN'
    );
    assert.throws(
      () => cwStateTransition(n, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 't must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => cwStateTransition(0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'n must be > 0. Received: 0'
    );
  });
});

describe('cwPropagate', () => {
  test('agrees with integrating cwHillDerivatives with RK4', () => {
    const start: CwState = [120, -800, 40, 0.3, -0.25, 0.05];

    for (const t of [300, 2500, 9000]) {
      const exact = cwPropagate(start, n, t);
      const numeric = rk4(start, t, 4000);

      for (let i = 0; i < 6; i++) absClose(exact[i], numeric[i], 1e-6);
    }
  });

  test('returns a drift-free state to its start after one orbit', () => {
    const start: CwState = [-100, 0, 30, 0, 2 * n * 100, 0];
    const later = cwPropagate(start, n, (2 * Math.PI) / n);

    for (let i = 0; i < 6; i++) absClose(later[i], start[i], 1e-9);
  });

  test('drifts 12π·|x0| ahead per orbit when starting at rest below the chief', () => {
    // y(T) = 6(sin nT - nT) x0 = -12π x0 after one orbit
    const later = cwPropagate([-100, 0, 0, 0, 0, 0], n, (2 * Math.PI) / n);

    relClose(later[1], 12 * Math.PI * 100, 1e-12);
    relClose(later[0], -100, 1e-12);
  });

  test('runs backwards with negative t', () => {
    const start: CwState = [50, 60, 70, 0.1, 0.2, 0.3];
    const back = cwPropagate(cwPropagate(start, n, 1234), n, -1234);

    for (let i = 0; i < 6; i++) absClose(back[i], start[i], 1e-9);
  });

  test('throws for a non-finite state', () => {
    assert.throws(
      () => cwPropagate([0, 0, 0, 0, Number.NaN, 0], n, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'state must have finite components. Received: NaN'
    );
  });
});
