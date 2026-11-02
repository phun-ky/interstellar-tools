import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { rotatingLaunchAzimuth } from '../rotating-launch-azimuth.js';
import { angleClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (r: number) => (r * 180) / Math.PI;

describe('rotatingLaunchAzimuth', () => {
  test('is the inertial azimuth on a body that does not rotate', () => {
    angleClose(rotatingLaunchAzimuth(rad(45), 7800, 0), rad(45), 1e-12);
  });

  test('stays due east when launching due east', () => {
    angleClose(rotatingLaunchAzimuth(rad(90), 7800, 408), rad(90), 1e-12);
  });

  test('turns further from east than the inertial azimuth', () => {
    assert.ok(rotatingLaunchAzimuth(rad(45), 7800, 408) < rad(45));
    assert.ok(rotatingLaunchAzimuth(rad(135), 7800, 408) > rad(135));
  });

  test('aims slightly west of north to go due north (≈ 357.0°)', () => {
    assert.equal(
      deg(rotatingLaunchAzimuth(rad(0), 7800, 408)).toFixed(1),
      '357.0'
    );
  });

  test('throws when the speed over the ground is zero', () => {
    assert.throws(
      () => rotatingLaunchAzimuth(rad(90), 408, 408),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'The speed over the ground is zero, so the azimuth is undefined.'
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => rotatingLaunchAzimuth(Number.NaN as Radians, 1, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'azimuth must be a finite number. Received: NaN'
    );
    assert.throws(
      () => rotatingLaunchAzimuth(rad(0), Number.NaN, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'v must be a finite number. Received: NaN'
    );
    assert.throws(
      () => rotatingLaunchAzimuth(rad(0), 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vRot must be a finite number. Received: NaN'
    );
    assert.throws(
      () => rotatingLaunchAzimuth(rad(0), 0, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'v must be > 0. Received: 0'
    );
  });
});
