import type { Cr3bpState } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cr3bpDerivatives } from '../cr3bp-derivatives.js';
import { jacobiConstant } from '../jacobi-constant.js';
import { rk4Integrate } from '../../helpers/rk4.js';
import {
  absClose,
  angleClose,
  relClose
} from '../../../__tests__/helpers/index.js';

const MU = 0.012150584205210296; // Earth–Moon
const f = (_t: number, y: readonly number[]) =>
  cr3bpDerivatives(y as unknown as Cr3bpState, MU);

describe('cr3bpDerivatives', () => {
  test('returns the velocities first', () => {
    const d = cr3bpDerivatives([0.5, 0.2, 0.1, 0.3, -0.4, 0.05], MU);

    assert.deepEqual(d.slice(0, 3), [0.3, -0.4, 0.05]);
  });

  test('has no acceleration at rest at L4 and L5', () => {
    for (const sign of [1, -1]) {
      const d = cr3bpDerivatives(
        [0.5 - MU, (sign * Math.sqrt(3)) / 2, 0, 0, 0, 0],
        MU
      );

      for (const v of d) absClose(v, 0, 1e-15);
    }
  });

  test('keeps a body at L4 in place for ten revolutions', () => {
    const l4 = [0.5 - MU, Math.sqrt(3) / 2, 0, 0, 0, 0];
    const { y } = rk4Integrate(f, l4, 0, 20 * Math.PI, 20_000);
    const end = y[y.length - 1];

    assert.ok(Math.hypot(end[0] - l4[0], end[1] - l4[1]) < 1e-9);
  });

  test('pulls towards both bodies, with Coriolis turning a moving body to the right', () => {
    // Midway on the line between them, gravity of the Earth wins
    const [, , , ax] = cr3bpDerivatives([0.5, 0, 0, 0, 0, 0], MU);

    assert.ok(ax < 0);

    // Moving along +x, the Coriolis term −2ẋ pushes towards −y
    const still = cr3bpDerivatives([0.5, 0.3, 0, 0, 0, 0], MU);
    const moving = cr3bpDerivatives([0.5, 0.3, 0, 0.1, 0, 0], MU);

    relClose(moving[4] - still[4], -0.2, 1e-12);
  });

  test('pulls back towards the plane, symmetric in z', () => {
    const up = cr3bpDerivatives([0.5, 0.3, 0.1, 0, 0, 0], MU);
    const down = cr3bpDerivatives([0.5, 0.3, -0.1, 0, 0, 0], MU);

    assert.ok(up[5] < 0);
    relClose(up[5], -down[5]);
  });

  test('with a negligible second mass, shows a circular orbit turning in the rotating frame', () => {
    const tiny = 1e-12;
    const r = 0.5;
    const w = r ** -1.5; // inertial angular rate of a circular orbit
    const g = (_t: number, y: readonly number[]) =>
      cr3bpDerivatives(y as unknown as Cr3bpState, tiny);
    // Inertial speed rω, minus the frame's ω × r = r
    const { y } = rk4Integrate(g, [r, 0, 0, 0, r * w - r, 0], 0, 2, 4000);
    const [x, yy] = y[y.length - 1];

    relClose(Math.hypot(x, yy), r, 1e-9);
    angleClose(Math.atan2(yy, x), (w - 1) * 2, 1e-9);
  });

  test('keeps the Jacobi constant to 1e-9 over a few revolutions', () => {
    const start = [0.8, 0, 0, 0, 0.3, 0.05];
    const c0 = jacobiConstant(start as unknown as Cr3bpState, MU);
    const { y } = rk4Integrate(f, start, 0, 6 * Math.PI, 60_000, {
      every: 1000
    });

    for (const s of y)
      absClose(jacobiConstant(s as unknown as Cr3bpState, MU), c0, 1e-9);
  });

  test('throws for a bad mu, a non-finite state, or a state at a body', () => {
    assert.throws(
      () => cr3bpDerivatives([0.5, 0, 0, 0, 0, 0], Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mu must be a finite number. Received: NaN'
    );

    for (const mu of [0, 0.6]) {
      assert.throws(
        () => cr3bpDerivatives([0.5, 0, 0, 0, 0, 0], mu),
        (err) =>
          err instanceof RangeError &&
          err.message === `mu must be in (0, 0.5]. Received: ${mu}`
      );
    }

    assert.throws(
      () => cr3bpDerivatives([0.5, 0, 0, Number.NaN, 0, 0], MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'xDot must be a finite number. Received: NaN'
    );
    assert.throws(
      () => cr3bpDerivatives([-MU, 0, 0, 0, 0, 0], MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'The state must not be at the centre of either body.'
    );
  });
});
