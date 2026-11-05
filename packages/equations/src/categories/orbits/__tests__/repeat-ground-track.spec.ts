import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { j2ArgumentOfPerigeeRate } from '../j2-argument-of-perigee-rate.js';
import { j2NodalPrecessionRate } from '../j2-nodal-precession-rate.js';
import { repeatGroundTrack } from '../repeat-ground-track.js';

const J2 = 1.08262668e-3;
const MU = 3.986004418e14;
const R = 6_378_137;
const EARTH_RATE = 7.292115e-5;
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

describe('repeatGroundTrack', () => {
  test("finds Landsat's 16-day and Sentinel-2's 10-day orbits", () => {
    const landsat = repeatGroundTrack(
      233,
      16,
      J2,
      MU,
      R,
      rad(98.2),
      0.0001,
      EARTH_RATE
    );
    const sentinel2 = repeatGroundTrack(
      143,
      10,
      J2,
      MU,
      R,
      rad(98.62),
      0.0001,
      EARTH_RATE
    );

    // Landsat 8's semi-major axis is 7 077.7 km; Sentinel-2 flies at 786 km
    assert.equal((landsat / 1000).toFixed(1), '7077.7');
    assert.equal(Math.round((sentinel2 - R) / 1000), 786);
  });

  test('repeats: the ground turns N times while the satellite goes round k', () => {
    fc.assert(
      fc.property(
        // At most 16 revolutions a day: 17 would be below the surface
        fc.integer({ min: 12, max: 15 }),
        fc.integer({ min: 1, max: 30 }),
        fc.double({ min: 0, max: 180, noNaN: true }),
        fc.double({ min: 0, max: 0.01, noNaN: true }),
        (perDay, days, inclination, e) => {
          const revolutions = perDay * days + 1;
          const i = rad(inclination);
          const a = repeatGroundTrack(
            revolutions,
            days,
            J2,
            MU,
            R,
            i,
            e,
            EARTH_RATE
          );
          const n = Math.sqrt(MU / a ** 3);
          const node = j2NodalPrecessionRate(J2, n, R, a, i, e);
          const perigee = j2ArgumentOfPerigeeRate(J2, n, R, a, i, e);
          const anomaly =
            0.75 *
            J2 *
            n *
            (R / (a * (1 - e * e))) ** 2 *
            Math.sqrt(1 - e * e) *
            (3 * Math.cos(i) ** 2 - 1);
          const ground = revolutions * (EARTH_RATE - node);
          const orbit = days * (n + perigee + anomaly);

          close(ground / orbit, 1, 1e-12);
        }
      )
    );
  });

  test('is the Kepler orbit with the period, without J2', () => {
    const a = repeatGroundTrack(15, 1, 0, MU, R, rad(51.6), 0, EARTH_RATE);
    const period = 2 * Math.PI * Math.sqrt(a ** 3 / MU);

    close(period * 15, (2 * Math.PI) / EARTH_RATE, 1e-6);
  });

  test('rejects invalid input, and a cycle below the surface', () => {
    const args = [J2, MU, R, rad(98), 0, EARTH_RATE] as const;

    assert.throws(
      () => repeatGroundTrack(14.5, 1, ...args),
      (err) =>
        err instanceof TypeError &&
        err.message === 'revolutions must be an integer. Received: 14.5'
    );
    assert.throws(
      () => repeatGroundTrack(14, 0, ...args),
      (err) =>
        err instanceof RangeError &&
        err.message === 'days must be > 0. Received: 0'
    );
    assert.throws(
      () => repeatGroundTrack(14, 1, Number.NaN, MU, R, rad(98), 0, EARTH_RATE),
      TypeError
    );
    assert.throws(
      () => repeatGroundTrack(14, 1, J2, MU, R, rad(98), 1, EARTH_RATE),
      RangeError
    );
    assert.throws(
      () => repeatGroundTrack(20, 1, ...args),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith(
          '20 revolutions in 1 days has no orbit above the surface'
        )
    );
  });
});
