import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { gravityLoss } from '../gravity-loss.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const constant = (deg: number, n: number) =>
  Array.from({ length: n }, () => rad(deg));

describe('gravityLoss', () => {
  test('loses g * t in a vertical climb at constant gravity', () => {
    relClose(gravityLoss(9.80665, constant(90, 11), 1), 98.0665);
  });

  test('loses nothing in horizontal flight', () => {
    assert.ok(Math.abs(gravityLoss(9.80665, constant(0, 50), 0.5)) < 1e-12);
  });

  test('integrates a linear pitch-over exactly for g * sin γ linear in time', () => {
    // sin γ from 1 to 0 linearly: the trapezoidal rule is exact
    const n = 101;
    const gamma = Array.from(
      { length: n },
      (_, i) => Math.asin(1 - i / (n - 1)) as Radians
    );

    relClose(gravityLoss(9.80665, gamma, 1), 9.80665 * 50);
  });

  test('accepts sampled gravity matching gamma', () => {
    const g = [9.8, 9.7, 9.6];

    relClose(gravityLoss(g, constant(90, 3), 2), (9.75 + 9.65) * 2);
  });

  test('is negative while descending', () => {
    assert.ok(gravityLoss(1.62, constant(-30, 10), 1) < 0);
  });

  test('throws for bad sample counts and lengths', () => {
    assert.throws(
      () => gravityLoss(9.8, [rad(90)], 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'gamma must have at least 2 samples. Received: 1'
    );
    assert.throws(
      () => gravityLoss([9.8, 9.7], constant(90, 3), 1),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'g must be a number or have one sample per gamma. Received: 2 for 3'
    );
  });

  test('throws for invalid dt, g and gamma', () => {
    assert.throws(
      () => gravityLoss(9.8, constant(90, 3), Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'dt must be a finite number. Received: NaN'
    );
    assert.throws(
      () => gravityLoss(9.8, constant(90, 3), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'dt must be > 0. Received: 0'
    );
    assert.throws(
      () => gravityLoss([9.8, Number.NaN], constant(90, 2), 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g must be finite. Received: NaN at 1'
    );
    assert.throws(
      () => gravityLoss(-1, constant(90, 2), 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'g must be >= 0. Received: -1 at 0'
    );
    assert.throws(
      () => gravityLoss(9.8, [rad(90), Number.NaN as Radians], 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'gamma must be finite. Received: NaN at 1'
    );
  });
});
