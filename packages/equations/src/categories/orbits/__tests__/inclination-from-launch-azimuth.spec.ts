import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { inclinationFromLaunchAzimuth } from '../inclination-from-launch-azimuth.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (r: number) => (r * 180) / Math.PI;

describe('inclinationFromLaunchAzimuth', () => {
  test('due east gives the launch latitude', () => {
    relClose(inclinationFromLaunchAzimuth(rad(28.6), rad(90)), rad(28.6));
    relClose(inclinationFromLaunchAzimuth(rad(-45), rad(90)), rad(45));
  });

  test('due north or south gives a polar orbit', () => {
    relClose(inclinationFromLaunchAzimuth(rad(28.6), rad(0)), rad(90));
    relClose(inclinationFromLaunchAzimuth(rad(28.6), rad(180)), rad(90));
  });

  test('due west gives the retrograde mirror, 180° minus the latitude', () => {
    relClose(inclinationFromLaunchAzimuth(rad(28.6), rad(270)), rad(151.4));
  });

  test('the equator reaches 90° minus the azimuth from east', () => {
    relClose(inclinationFromLaunchAzimuth(rad(0), rad(60)), rad(30));
  });

  test('matches the documented Baikonur example (≈ 51.7°)', () => {
    assert.equal(
      deg(inclinationFromLaunchAzimuth(rad(45.97), rad(63))).toFixed(1),
      '51.7'
    );
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => inclinationFromLaunchAzimuth(Number.NaN as Radians, rad(90)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'lat must be a finite number. Received: NaN'
    );
    assert.throws(
      () =>
        inclinationFromLaunchAzimuth(
          rad(0),
          Number.POSITIVE_INFINITY as Radians
        ),
      (err) =>
        err instanceof TypeError &&
        err.message === 'azimuth must be a finite number. Received: Infinity'
    );
  });

  test('throws RangeError for a latitude past a pole', () => {
    assert.throws(
      () => inclinationFromLaunchAzimuth(-2 as Radians, rad(90)),
      (err) =>
        err instanceof RangeError &&
        err.message === 'lat must be in [-π/2, π/2]. Received: -2'
    );
  });
});
