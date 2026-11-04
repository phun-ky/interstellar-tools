import { geodeticToBodyFixed } from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { temeToEarthFixed } from '../earth-fixed.js';
import {
  dopplerShift,
  lookAngles,
  lookAnglesFromEarthFixed
} from '../look-angles.js';
import { propagate } from '../propagate.js';
import { parseTle } from '../tle.js';
import { A, E_SQUARED } from '../wgs84.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const oslo: GeodeticCoordinatesInterface = {
  phi: rad(59.91),
  lambda: rad(10.75),
  h: 20
};
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);
// The observer's east, north and up directions in the Earth-fixed frame
const enu = ({ phi, lambda }: GeodeticCoordinatesInterface) => ({
  east: [-Math.sin(lambda), Math.cos(lambda), 0],
  north: [
    -Math.sin(phi) * Math.cos(lambda),
    -Math.sin(phi) * Math.sin(lambda),
    Math.cos(phi)
  ],
  up: [
    Math.cos(phi) * Math.cos(lambda),
    Math.cos(phi) * Math.sin(lambda),
    Math.sin(phi)
  ]
});
const site = (observer: GeodeticCoordinatesInterface) =>
  geodeticToBodyFixed(observer.phi, observer.lambda, observer.h, A, E_SQUARED);
// A point `distance` m from the observer along a unit direction
const along = (
  observer: GeodeticCoordinatesInterface,
  direction: readonly number[],
  distance: number
): Vector3DTupleType => {
  const s = site(observer);

  return [
    s[0] + distance * direction[0]!,
    s[1] + distance * direction[1]!,
    s[2] + distance * direction[2]!
  ];
};
const still: Vector3DTupleType = [0, 0, 0];
const scale = (direction: readonly number[], k: number): Vector3DTupleType => [
  k * direction[0]!,
  k * direction[1]!,
  k * direction[2]!
];

describe('lookAnglesFromEarthFixed', () => {
  test('puts a satellite straight overhead at 90° of elevation', () => {
    const r = geodeticToBodyFixed(oslo.phi, oslo.lambda, 400_000, A, E_SQUARED);
    const { elevation, range } = lookAnglesFromEarthFixed(
      { r, v: still },
      oslo
    );

    close(elevation, Math.PI / 2, 1e-9);
    close(range, 400_000 - oslo.h, 1e-6);
  });

  test('puts a satellite on the horizon at 0° of elevation', () => {
    const { east } = enu(oslo);
    const { elevation, azimuth } = lookAnglesFromEarthFixed(
      { r: along(oslo, east, 2_000_000), v: still },
      oslo
    );

    close(elevation, 0, 1e-12);
    close(azimuth, Math.PI / 2, 1e-12);
  });

  test('runs the azimuth clockwise from north', () => {
    const { east, north, up } = enu(oslo);
    const toward = (e: number, n: number) =>
      [0, 1, 2].map((k) => e * east[k]! + n * north[k]! + 0.5 * up[k]!);
    const azimuth = (e: number, n: number) =>
      lookAnglesFromEarthFixed(
        { r: along(oslo, toward(e, n), 1_000_000), v: still },
        oslo
      ).azimuth;

    close(azimuth(0, 1), 0, 1e-12);
    close(azimuth(1, 1), Math.PI / 4, 1e-12);
    close(azimuth(1, 0), Math.PI / 2, 1e-12);
    close(azimuth(0, -1), Math.PI, 1e-12);
    close(azimuth(-1, 0), (3 * Math.PI) / 2, 1e-12);
    // Just west of north: in [0, 2π), not negative
    close(azimuth(-1e-3, 1), 2 * Math.PI - 1e-3, 1e-9);
  });

  test('takes the range rate along the line of sight', () => {
    const { east, up } = enu(oslo);
    const r = along(oslo, up, 500_000);

    // Climbing straight away, then moving across the line of sight
    close(
      lookAnglesFromEarthFixed({ r, v: scale(up, 7000) }, oslo).rangeRate,
      7000,
      1e-9
    );
    close(
      lookAnglesFromEarthFixed({ r, v: scale(east, 7000) }, oslo).rangeRate,
      0,
      1e-9
    );
  });

  test('keeps the range the distance to the satellite, for any direction', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -89, max: 89, noNaN: true }),
        fc.double({ min: -180, max: 180, noNaN: true }),
        fc.double({ min: -0.5, max: 0.5, noNaN: true }),
        fc.double({ min: 1e5, max: 4e7, noNaN: true }),
        (lat, lon, tilt, distance) => {
          const observer = { phi: rad(lat), lambda: rad(lon), h: 0 };
          const { east, up } = enu(observer);
          const direction = [0, 1, 2].map(
            (k) => Math.cos(tilt) * east[k]! + Math.sin(tilt) * up[k]!
          );
          const { range, elevation, azimuth } = lookAnglesFromEarthFixed(
            { r: along(observer, direction, distance), v: still },
            observer
          );

          close(range, distance, 1e-6 * distance);
          close(elevation, tilt, 1e-9);
          close(azimuth, Math.PI / 2, 1e-9);
        }
      )
    );
  });

  test('rejects an invalid state, observer or a satellite at the observer', () => {
    assert.throws(
      () => lookAnglesFromEarthFixed({ r: [1, 2, Number.NaN], v: still }, oslo),
      (err) =>
        err instanceof TypeError &&
        err.message === 'r must be three finite numbers. Received: 1,2,NaN'
    );
    assert.throws(
      () =>
        lookAnglesFromEarthFixed(
          { r: [7e6, 0, 0], v: still },
          { ...oslo, phi: 2 as Radians }
        ),
      RangeError
    );
    assert.throws(
      () => lookAnglesFromEarthFixed({ r: site(oslo), v: still }, oslo),
      (err) =>
        err instanceof RangeError &&
        err.message === 'The satellite must not be at the observer.'
    );
  });
});

describe('lookAngles', () => {
  test('equals the angles from the Earth-fixed state', () => {
    const date = new Date('2026-11-04T12:00:00Z');

    assert.deepEqual(
      lookAngles(iss, oslo, date),
      lookAnglesFromEarthFixed(
        temeToEarthFixed(propagate(iss, date), date),
        oslo
      )
    );
  });

  test('gives a range rate that matches the rate of change of the range', () => {
    const at = (ms: number) =>
      lookAngles(iss, oslo, new Date(Date.UTC(2026, 10, 4, 12, 0, 0, ms)));

    close(at(0).rangeRate, at(500).range - at(-500).range, 0.05);
  });

  test('sees the ISS above Oslo several times a day, and never higher than overhead', () => {
    let visible = 0;
    let highest = -Infinity;

    // Every minute for a day
    for (let minutes = 0; minutes < 1440; minutes++) {
      const { elevation, range } = lookAngles(
        iss,
        oslo,
        new Date(iss.epoch.getTime() + minutes * 60_000)
      );

      if (elevation > 0) visible++;

      highest = Math.max(highest, elevation);
      // From a 420 km orbit, the horizon is at most about 2 300 km away
      if (elevation > 0) assert.ok(range < 2_400_000, `range ${range}`);
    }

    // 59.9° N is near the edge of the ISS's 51.6° orbit: passes, but low
    assert.ok(visible > 20, `visible for ${visible} min`);
    assert.ok(highest > rad(10) && highest < rad(60));
  });
});

describe('dopplerShift', () => {
  test('raises the frequency of an approaching satellite', () => {
    close(dopplerShift(145_800_000, -7000), 3404.4, 0.1);
    close(dopplerShift(437_000_000, 5000), -7288.3, 0.1);
    assert.equal(dopplerShift(145_800_000, 0), -0);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => dopplerShift(Number.NaN, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'frequency must be a finite number. Received: NaN'
    );
    assert.throws(
      () => dopplerShift(1, Infinity),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rangeRate must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => dopplerShift(0, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'frequency must be > 0. Received: 0'
    );
    assert.throws(
      () => dopplerShift(1, -299_792_458),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'rangeRate must be slower than light. Received: -299792458'
    );
  });
});
