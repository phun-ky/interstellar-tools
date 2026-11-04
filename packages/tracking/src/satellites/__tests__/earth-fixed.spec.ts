import { greenwichMeanSiderealTime } from '@interstellar-tools/equations';
import type { StateVectorInterface } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { subSatellitePoint, temeToEarthFixed } from '../earth-fixed.js';
import { propagate } from '../propagate.js';
import { parseTle } from '../tle.js';

const deg = (rad: number) => (rad * 180) / Math.PI;
const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(...a.map((x, k) => x - b[k]!));
// Turn an Earth-fixed position back into TEME
const earthFixedToTeme = (
  r: readonly number[],
  date: Date
): [number, number, number] => {
  const theta = greenwichMeanSiderealTime(date);

  return [
    Math.cos(theta) * r[0]! - Math.sin(theta) * r[1]!,
    Math.sin(theta) * r[0]! + Math.cos(theta) * r[1]!,
    r[2]!
  ];
};
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);
// XM-3, from Vallado's verification set: geostationary at 85.15° W
const xm3 = parseTle(
  '1 28626U 05008A   06176.46683397 -.00000205  00000-0  10000-3 0  2190',
  '2 28626   0.0019 286.9433 0000335  13.7918  55.6504  1.00270176  4891'
);

describe('temeToEarthFixed', () => {
  test("matches Vallado et al.'s TEME example", () => {
    // 2004-04-06 07:51:28.386009 UTC; UT1 is 0.4399619 s behind, and the
    // example turns by GMST at UT1
    const date = new Date(Date.UTC(2004, 3, 6, 7, 51, 27, 946));
    const teme: StateVectorInterface = {
      r: [5_094_180.1621, 6_127_644.6595, 6_380_344.5327],
      v: [-4746.131487, 785.818041, 5531.931288]
    };
    const { r, v } = temeToEarthFixed(teme, date);

    // To the 47 µs a Date can't hold: about 3 cm here
    assert.ok(
      distance(r, [-1_033_475.0313, 7_901_305.5856, 6_380_344.5327]) < 0.05
    );
    assert.ok(distance(v.slice(0, 2), [-3225.63652, -2872.45145]) < 0.02);
    assert.equal(v[2], teme.v[2]);
  });

  test('gives the velocity a ground station sees: the rate of the Earth-fixed position', () => {
    const at = (ms: number) => {
      const date = new Date(Date.UTC(2026, 10, 4, 12, 0, 0, ms));

      return temeToEarthFixed(propagate(iss, date), date);
    };
    const { v } = at(0);
    const rate = at(500).r.map((x, k) => (x - at(-500).r[k]!) / 1);

    assert.ok(distance(v, rate) < 0.05, `${v} ≉ ${rate}`);
  });

  test('round-trips with the inverse rotation', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.double({ min: -5e7, max: 5e7, noNaN: true }),
          fc.double({ min: -5e7, max: 5e7, noNaN: true }),
          fc.double({ min: -5e7, max: 5e7, noNaN: true })
        ),
        fc.integer({ min: Date.UTC(1990, 0, 1), max: Date.UTC(2050, 0, 1) }),
        (r, ms) => {
          const date = new Date(ms);
          const { r: fixed } = temeToEarthFixed({ r, v: [0, 0, 0] }, date);

          assert.ok(
            distance(earthFixedToTeme(fixed, date), r) <=
              1e-8 * Math.max(1, Math.hypot(...r))
          );
          // Lengths and heights don't change
          assert.ok(
            Math.abs(Math.hypot(...fixed) - Math.hypot(...r)) <=
              1e-8 * Math.max(1, Math.hypot(...r))
          );
          assert.equal(fixed[2], r[2]);
        }
      )
    );
  });

  test('puts a point on the equator at the longitude it was placed at', () => {
    const date = new Date('2026-11-04T12:00:00Z');
    const lambda = (-85 * Math.PI) / 180;
    const R = 42_164_000;
    const r = earthFixedToTeme(
      [R * Math.cos(lambda), R * Math.sin(lambda), 0],
      date
    );
    const { r: fixed } = temeToEarthFixed({ r, v: [0, 0, 0] }, date);

    assert.ok(Math.abs(Math.atan2(fixed[1], fixed[0]) - lambda) < 1e-12);
  });

  test('rejects an invalid state or date', () => {
    const date = new Date('2026-11-04T12:00:00Z');

    assert.throws(
      () => temeToEarthFixed({ r: [1, 2, Number.NaN], v: [0, 0, 0] }, date),
      (err) =>
        err instanceof TypeError &&
        err.message === 'r must be three finite numbers. Received: 1,2,NaN'
    );
    assert.throws(
      () =>
        temeToEarthFixed(
          { r: [1, 2, 3], v: [0, 0] } as unknown as StateVectorInterface,
          date
        ),
      (err) =>
        err instanceof TypeError &&
        err.message === 'v must be three finite numbers. Received: 0,0'
    );
    assert.throws(
      () => temeToEarthFixed({ r: [1, 2, 3], v: [0, 0, 0] }, new Date('nope')),
      TypeError
    );
  });
});

describe('subSatellitePoint', () => {
  test('keeps a geostationary satellite over its slot on the equator', () => {
    // XM-3 was stationed at 85.15° W
    for (let hours = 0; hours < 24; hours += 3) {
      const { phi, lambda, h } = subSatellitePoint(
        xm3,
        new Date(xm3.epoch.getTime() + hours * 3_600_000)
      );

      assert.ok(Math.abs(deg(phi)) < 0.02);
      assert.ok(Math.abs(deg(lambda) + 85.15) < 0.1);
      assert.ok(Math.abs(h / 1000 - 35_786) < 5);
    }
  });

  test('keeps the ISS between ±51.6° and about 420 km up', () => {
    let north = -Infinity;
    let south = Infinity;

    // One day, every minute
    for (let minutes = 0; minutes < 1440; minutes++) {
      const { phi, lambda, h } = subSatellitePoint(
        iss,
        new Date(iss.epoch.getTime() + minutes * 60_000)
      );

      north = Math.max(north, deg(phi));
      south = Math.min(south, deg(phi));
      assert.ok(h > 400_000 && h < 440_000, `h = ${h}`);
      assert.ok(lambda > -Math.PI && lambda <= Math.PI);
    }

    // The geodetic latitude peaks a little above the inclination
    assert.ok(north > 51.6 && north < 51.9, `north = ${north}`);
    assert.ok(south < -51.6 && south > -51.9, `south = ${south}`);
  });

  test('moves the ground track about 22.6° west each orbit', () => {
    // Earth turns 360° × 92.95 min / 1436.07 min under one orbit
    const period = (2 * Math.PI) / iss.meanMotion / 60;
    const at = (minutes: number) =>
      subSatellitePoint(iss, new Date(iss.epoch.getTime() + minutes * 60_000));
    const shift = deg(at(period).lambda - at(0).lambda);

    assert.ok(Math.abs(shift + 23.3) < 0.5, `shift = ${shift}`);
  });
});
