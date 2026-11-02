import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { bodyFixedToGeodetic } from '../body-fixed-to-geodetic.js';
import { geodeticToBodyFixed } from '../geodetic-to-body-fixed.js';
import { planetographicLatitudeOblate } from '../planetographic-latitude-oblate.js';
import {
  absClose,
  angleClose,
  relClose
} from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const A = 6_378_137; // m, WGS84
const E2 = 0.00669437999014;
const B = A * Math.sqrt(1 - E2);

describe('bodyFixedToGeodetic', () => {
  test('reads the equator at the prime meridian', () => {
    const { phi, lambda, h } = bodyFixedToGeodetic(A + 100, 0, 0, A, E2);

    absClose(phi, 0);
    absClose(lambda, 0);
    absClose(h, 100, 1e-6);
  });

  test('reads the poles, with longitude 0 on the axis', () => {
    const north = bodyFixedToGeodetic(0, 0, B + 1000, A, E2);
    const south = bodyFixedToGeodetic(0, 0, -B, A, E2);

    assert.equal(north.phi, Math.PI / 2);
    assert.equal(north.lambda, 0);
    absClose(north.h, 1000, 1e-6);
    assert.equal(south.phi, -Math.PI / 2);
    absClose(south.h, 0, 1e-6);
  });

  test('round-trips points above, on and below the surface to sub-millimetre', () => {
    for (const [lat, lon, height] of [
      [28.608422, -80.604133, 0],
      [32.672, -50, 191_000],
      [-45, 170, -5000],
      [89.999, 12, 1e6],
      [0.0001, -179.9, 35_786_000]
    ]) {
      const [x, y, z] = geodeticToBodyFixed(rad(lat), rad(lon), height, A, E2);
      const { phi, lambda, h } = bodyFixedToGeodetic(x, y, z, A, E2);

      angleClose(phi, rad(lat), 1e-12);
      angleClose(lambda, rad(lon), 1e-12);
      absClose(h, height, 1e-4);
    }
  });

  test('matches planetographicLatitudeOblate on the surface', () => {
    const [x, y, z] = geodeticToBodyFixed(rad(51.5), rad(-0.1), 0, A, E2);

    relClose(
      bodyFixedToGeodetic(x, y, z, A, E2).phi,
      planetographicLatitudeOblate(x, y, z, A, B),
      1e-12
    );
  });

  test('is the geocentric latitude on a sphere', () => {
    const { phi, h } = bodyFixedToGeodetic(3e6, 4e6, 5e6, A, 0);

    relClose(phi, Math.atan2(5e6, 5e6));
    relClose(h, Math.hypot(3e6, 4e6, 5e6) - A);
  });

  test('throws TypeError when any input is not finite', () => {
    for (const [i, name] of [
      [0, 'x'],
      [1, 'y'],
      [2, 'z'],
      [3, 'a'],
      [4, 'eSquared']
    ] as const) {
      const args = [A, 0, 0, A, E2];

      args[i] = Number.POSITIVE_INFINITY;
      assert.throws(
        () => bodyFixedToGeodetic(args[0], args[1], args[2], args[3], args[4]),
        (err) =>
          err instanceof TypeError &&
          err.message === `${name} must be a finite number. Received: Infinity`
      );
    }
  });

  test('throws RangeError for a <= 0, e² outside [0, 1) or the centre', () => {
    assert.throws(
      () => bodyFixedToGeodetic(1, 0, 0, -1, E2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: -1'
    );
    assert.throws(
      () => bodyFixedToGeodetic(1, 0, 0, A, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'eSquared must be in [0, 1). Received: 1'
    );
    assert.throws(
      () => bodyFixedToGeodetic(0, 0, 0, A, E2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'The point must not be at the centre of the body.'
    );
  });
});
