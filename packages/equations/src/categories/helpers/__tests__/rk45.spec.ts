import type { OdeRightHandSideType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { rk4Integrate } from '../rk4.js';
import { rk45Integrate } from '../rk45.js';

const oscillator: OdeRightHandSideType = (_t, [x, v]) => [v!, -x!];
// A Kepler orbit with μ = 1, in the plane
const kepler: OdeRightHandSideType = (_t, [x, y, vx, vy]) => {
  const r3 = Math.hypot(x!, y!) ** 3;

  return [vx!, vy!, -x! / r3, -y! / r3];
};
// Periapsis of an orbit with a = 1 and e = 0.7, which has a period of 2π
const E = 0.7;
const PERIAPSIS = [1 - E, 0, 0, Math.sqrt((1 + E) / (1 - E))];
const energy = ([x, y, vx, vy]: readonly number[]) =>
  (vx! ** 2 + vy! ** 2) / 2 - 1 / Math.hypot(x!, y!);
const last = <T>(list: readonly T[]) => list[list.length - 1]!;
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });

describe('rk45Integrate', () => {
  test('brings a harmonic oscillator back after one period', () => {
    const { t, y } = rk45Integrate(oscillator, [1, 0], 0, 2 * Math.PI);

    assert.equal(t.length, 94);
    assert.equal(t[0], 0);
    assert.equal(last(t), 2 * Math.PI);
    assert.ok(Math.abs(last(y)[0]! - 1) < 3e-9);
    assert.ok(Math.abs(last(y)[1]!) < 3e-9);
  });

  test('follows y′ = y to e', () => {
    const { y } = rk45Integrate((_t, [v]) => [v!], [1], 0, 1);

    assert.ok(Math.abs(last(y)[0]! - Math.E) < 1e-8);
  });

  test('gets more accurate as the tolerance tightens, on an eccentric orbit', () => {
    const error = (tolerance: number) => {
      const { y } = rk45Integrate(kepler, PERIAPSIS, 0, 20 * Math.PI, {
        tolerance,
        absoluteTolerance: tolerance
      });
      const [x, yy] = last(y);

      return Math.hypot(x! - PERIAPSIS[0]!, yy!);
    };

    assert.ok(error(1e-6) < 1e-1);
    assert.ok(error(1e-9) < 1e-4);
    assert.ok(error(1e-12) < 1e-7);
    assert.ok(error(1e-12) < error(1e-9) / 100);
  });

  test('takes short steps at periapsis and long ones at apoapsis', () => {
    const { t, y } = rk45Integrate(kepler, PERIAPSIS, 0, 2 * Math.PI);
    const steps = t.slice(1).map((time, k) => ({
      h: time - t[k]!,
      r: Math.hypot(y[k]![0]!, y[k]![1]!)
    }));
    const near = steps.filter(({ r }) => r < 0.5).map(({ h }) => h);
    const far = steps.filter(({ r }) => r > 1.5).map(({ h }) => h);

    assert.ok(Math.max(...near) * 5 < Math.min(...far));
  });

  test('beats fixed steps on an eccentric orbit, for the same work', () => {
    const adaptive = rk45Integrate(kepler, PERIAPSIS, 0, 2 * Math.PI, {
      tolerance: 1e-10,
      absoluteTolerance: 1e-10
    });
    // Six evaluations of f per step, against RK4's four
    const fixed = rk4Integrate(
      kepler,
      PERIAPSIS,
      0,
      2 * Math.PI,
      Math.round((adaptive.t.length * 6) / 4)
    );
    const miss = (y: number[][]) =>
      Math.abs(energy(last(y)) - energy(PERIAPSIS));

    assert.ok(miss(adaptive.y) * 100 < miss(fixed.y));
  });

  test('integrates backwards', () => {
    const { t, y } = rk45Integrate(oscillator, [1, 0], 0, -Math.PI / 2);

    assert.equal(last(t), -Math.PI / 2);
    // x = cos t, v = -sin t: at -π/2, v = 1
    assert.ok(Math.abs(last(y)[0]!) < 1e-8);
    assert.ok(Math.abs(last(y)[1]! - 1) < 1e-8);
  });

  test('keeps to maxStep and initialStep', () => {
    const { t } = rk45Integrate((_t, [v]) => [0 * v!], [1], 0, 10, {
      initialStep: 0.5,
      maxStep: 1
    });

    assert.equal(t[1], 0.5);
    assert.ok(t.slice(1).every((time, k) => time - t[k]! <= 1 + 1e-12));
    assert.equal(last(t), 10);
  });

  test('stops when asked', () => {
    // Fall from rest at 1 under gravity of 1: stop at the ground
    const { t, y } = rk45Integrate((_t, [, v]) => [v!, -1], [1, 0], 0, 10, {
      maxStep: 0.01,
      stop: (_t, [h]) => h! <= 0
    });

    assert.ok(last(y)[0]! <= 0);
    assert.ok(Math.abs(last(t) - Math.SQRT2) < 0.011);
  });

  describe('rejects', () => {
    test('invalid input', () => {
      throwsWith(
        () => rk45Integrate(oscillator, [1, Number.NaN], 0, 1),
        TypeError,
        'y0[1] must be a finite number. Received: NaN'
      );
      throwsWith(
        () => rk45Integrate(oscillator, [1, 0], 0, Number.POSITIVE_INFINITY),
        TypeError,
        't1 must be a finite number. Received: Infinity'
      );
      throwsWith(
        () => rk45Integrate(oscillator, [1, 0], 0, 1, { maxSteps: 1.5 }),
        TypeError,
        'maxSteps must be an integer. Received: 1.5'
      );
      throwsWith(
        () => rk45Integrate(oscillator, [1, 0], 1, 1),
        RangeError,
        't1 must differ from t0.'
      );

      for (const name of [
        'tolerance',
        'absoluteTolerance',
        'initialStep',
        'maxStep',
        'maxSteps'
      ])
        throwsWith(
          () => rk45Integrate(oscillator, [1, 0], 0, 1, { [name]: 0 }),
          RangeError,
          `${name} must be > 0. Received: 0`
        );

      throwsWith(
        () => rk45Integrate(() => [0], [1, 0], 0, 1),
        TypeError,
        'f must return 2 components, one per state component. Received: 1'
      );
    });

    test('an integration that needs too many steps', () => {
      throwsWith(
        () => rk45Integrate(oscillator, [1, 0], 0, 100, { maxSteps: 10 }),
        RangeError,
        'The integration needs more than 10 steps: loosen the tolerance, or raise maxSteps.'
      );
    });

    test('a step too small to tell from rounding', () => {
      // y′ = y² from 1 blows up at t = 1
      assert.throws(
        () => rk45Integrate((_t, [v]) => [v! ** 2], [1], 0, 2),
        (err) =>
          err instanceof RangeError &&
          /^The step fell to .* the solution changes too fast to follow at this tolerance\.$/.test(
            err.message
          )
      );
    });
  });
});
