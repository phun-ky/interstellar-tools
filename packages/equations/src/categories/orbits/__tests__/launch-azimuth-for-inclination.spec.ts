import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { inclinationFromLaunchAzimuth } from '../inclination-from-launch-azimuth.js';
import { launchAzimuthForInclination } from '../launch-azimuth-for-inclination.js';
import { angleClose, relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (r: number) => (r * 180) / Math.PI;

describe('launchAzimuthForInclination', () => {
  test('both solutions reach the target inclination', () => {
    const lat = rad(28.6);
    const i = rad(51.64);
    const { northbound, southbound } = launchAzimuthForInclination(lat, i);

    relClose(inclinationFromLaunchAzimuth(lat, northbound), i, 1e-12);
    relClose(inclinationFromLaunchAzimuth(lat, southbound), i, 1e-12);
    angleClose(northbound + southbound, Math.PI, 1e-12);
  });

  test('meets due east when the inclination equals the latitude', () => {
    const { northbound, southbound } = launchAzimuthForInclination(
      rad(28.6),
      rad(28.6)
    );

    angleClose(northbound, rad(90), 1e-6);
    angleClose(southbound, rad(90), 1e-6);
  });

  test('heads west of north for retrograde orbits', () => {
    const { northbound, southbound } = launchAzimuthForInclination(
      rad(34.7),
      rad(97.8)
    );

    assert.equal(deg(northbound).toFixed(1), '350.5');
    assert.equal(deg(southbound).toFixed(1), '189.5');
  });

  test('throws when the inclination is lower than the latitude, or its mirror', () => {
    const message =
      /^i can't be reached from lat: it must be in \[\|lat\|, π - \|lat\|\]/;

    assert.throws(
      () => launchAzimuthForInclination(rad(28.6), rad(20)),
      (err) => err instanceof RangeError && message.test(err.message)
    );
    assert.throws(
      () => launchAzimuthForInclination(rad(28.6), rad(160)),
      (err) => err instanceof RangeError && message.test(err.message)
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => launchAzimuthForInclination(Number.NaN as Radians, rad(30)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'lat must be a finite number. Received: NaN'
    );
    assert.throws(
      () => launchAzimuthForInclination(rad(0), Number.NaN as Radians),
      (err) =>
        err instanceof TypeError &&
        err.message === 'i must be a finite number. Received: NaN'
    );
    assert.throws(
      () => launchAzimuthForInclination((Math.PI / 2) as Radians, rad(90)),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('lat must be in (-π/2, π/2).')
    );
    assert.throws(
      () => launchAzimuthForInclination(rad(0), -1 as Radians),
      (err) =>
        err instanceof RangeError &&
        err.message === 'i must be in [0, π]. Received: -1'
    );
  });
});
