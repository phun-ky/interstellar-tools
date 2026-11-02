import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { surfaceRotationSpeed } from '../surface-rotation-speed.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const OMEGA = 7.292115e-5; // rad/s
const R = 6_378_137; // m

describe('surfaceRotationSpeed', () => {
  test('gives the full ωR at the equator (≈ 465.1 m/s for Earth)', () => {
    relClose(surfaceRotationSpeed(rad(0), R, OMEGA), OMEGA * R);
    assert.equal(surfaceRotationSpeed(rad(0), R, OMEGA).toFixed(1), '465.1');
  });

  test('gives (almost) nothing at the poles', () => {
    assert.ok(Math.abs(surfaceRotationSpeed(rad(90), R, OMEGA)) < 1e-10);
    assert.ok(Math.abs(surfaceRotationSpeed(rad(-90), R, OMEGA)) < 1e-10);
  });

  test('is the same north and south of the equator', () => {
    relClose(
      surfaceRotationSpeed(rad(28.6), R, OMEGA),
      surfaceRotationSpeed(rad(-28.6), R, OMEGA)
    );
  });

  test('is negative (westward) for a body rotating backwards', () => {
    assert.ok(surfaceRotationSpeed(rad(0), 6_051_800, -2.99e-7) < 0);
  });

  test('throws TypeError when any input is not finite', () => {
    for (const [args, name] of [
      [[Number.NaN, R, OMEGA], 'lat'],
      [[0, Number.NaN, OMEGA], 'R'],
      [[0, R, Number.NaN], 'omega']
    ] as const) {
      assert.throws(
        () => surfaceRotationSpeed(args[0] as Radians, args[1], args[2]),
        (err) =>
          err instanceof TypeError &&
          err.message === `${name} must be a finite number. Received: NaN`
      );
    }
  });

  test('throws RangeError for a latitude past a pole or R <= 0', () => {
    assert.throws(
      () => surfaceRotationSpeed(2 as Radians, R, OMEGA),
      (err) =>
        err instanceof RangeError &&
        err.message === 'lat must be in [-π/2, π/2]. Received: 2'
    );
    assert.throws(
      () => surfaceRotationSpeed(rad(0), 0, OMEGA),
      (err) =>
        err instanceof RangeError &&
        err.message === 'R must be > 0. Received: 0'
    );
  });
});
