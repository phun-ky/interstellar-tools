import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { isStableLanding } from '../is-stable-landing.js';
import { tipOverAngle } from '../tip-over-angle.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);

describe('tipOverAngle', () => {
  test('is 45° when the footprint is as wide as the centre of mass is high', () => {
    close(tipOverAngle(2, 2), Math.PI / 4);
  });

  test('matches arctan(r / h) for a known geometry', () => {
    close(tipOverAngle(3, 4), Math.atan(3 / 4));
    assert.equal(
      ((tipOverAngle(1, Math.sqrt(3)) * 180) / Math.PI).toFixed(6),
      '30.000000'
    );
  });

  test('grows with a wider stance and shrinks with a higher centre of mass', () => {
    assert.ok(tipOverAngle(3, 2) > tipOverAngle(2, 2));
    assert.ok(tipOverAngle(2, 3) < tipOverAngle(2, 2));
  });

  test('stays inside (0, π/2)', () => {
    for (const [r, h] of [
      [1e-6, 1e6],
      [1e6, 1e-6],
      [1, 1]
    ]) {
      const theta = tipOverAngle(r, h);

      assert.ok(theta > 0 && theta < Math.PI / 2);
    }
  });

  test('throws for non-finite or non-positive inputs', () => {
    assert.throws(
      () => tipOverAngle(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rFootprint must be a finite number. Received: NaN'
    );
    assert.throws(
      () => tipOverAngle(1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'hCoM must be > 0. Received: 0'
    );
  });
});

describe('isStableLanding', () => {
  test('is safe on flat ground with no rock-up', () => {
    assert.equal(isStableLanding(rad(0), rad(0), 2, 2), true);
  });

  test('tips at the limit, and is safe just below it', () => {
    const limit = tipOverAngle(2, 2);

    assert.equal(isStableLanding(limit, rad(0), 2, 2), false);
    assert.equal(
      isStableLanding((limit - 1e-9) as Radians, rad(0), 2, 2),
      true
    );
  });

  test('adds the slope and the rock-up', () => {
    assert.equal(isStableLanding(rad(30), rad(10), 2, 2), true);
    assert.equal(isStableLanding(rad(40), rad(10), 2, 2), false);
    assert.equal(isStableLanding(rad(10), rad(40), 2, 2), false);
  });

  test('fails sooner with a higher centre of mass or a steeper slope', () => {
    assert.equal(isStableLanding(rad(30), rad(5), 2, 2), true);
    assert.equal(isStableLanding(rad(30), rad(5), 2, 4), false);
    assert.equal(isStableLanding(rad(50), rad(5), 2, 2), false);
  });

  test('throws for non-finite or negative angles, and passes geometry checks on', () => {
    assert.throws(
      () => isStableLanding(Number.NaN as Radians, rad(0), 2, 2),
      (err) =>
        err instanceof TypeError &&
        err.message === 'slope must be a finite number. Received: NaN'
    );
    assert.throws(
      () => isStableLanding(rad(0), -0.1 as Radians, 2, 2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'dynamicTilt must be >= 0. Received: -0.1'
    );
    assert.throws(() => isStableLanding(rad(0), rad(0), 0, 2), RangeError);
  });
});

// The Apollo Lunar Module: footpad centres 167.57 in from the X axis (TN
// D-6850 p. 6), ground line at X 72.84 in (CSM/LM Spacecraft Operational Data
// Book Vol. III, Fig. 2-10), centre of gravity at X 213.5 in at lunar landing,
// tilt 4.5° at rest and about 2° of rock-up (Apollo 11 Mission Report, Table
// A-I and sections 5.4 and 5.5)
describe('In practice values: Apollo 11, Eagle on the Moon', () => {
  const IN = 0.0254;
  const R = 167.57 * IN;
  const h = (213.5 - 72.84) * IN;
  const between = R * Math.cos(Math.PI / 4);
  const deg = (r: number) => (r * 180) / Math.PI;

  test('tipOverAngle: 40.1° between two legs, 50.0° over one', () => {
    assert.equal(R.toFixed(3), '4.256');
    assert.equal(between.toFixed(3), '3.010');
    assert.equal((213.5 - 72.84).toFixed(1), '140.7');
    assert.equal(h.toFixed(2), '3.57');
    assert.equal(deg(tipOverAngle(between, h)).toFixed(1), '40.1');
    assert.equal(deg(tipOverAngle(R, h)).toFixed(1), '50.0');
  });

  test('isStableLanding: 4.5° of tilt and 2° of rock-up keep Eagle up, and so would a 12° slope', () => {
    assert.equal(4.5 + 2, 6.5);
    assert.equal(isStableLanding(rad(4.5), rad(2), between, h), true);
    assert.equal(isStableLanding(rad(12), rad(2), between, h), true);
    assert.equal(isStableLanding(rad(40), rad(2), between, h), false);
  });
});
