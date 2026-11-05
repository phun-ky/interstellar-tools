import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { moonPosition } from '../moon-position.js';

const DEG = Math.PI / 180;
const AU_KM = 149_597_870.7;
// JPL Horizons, the Moon from Earth's centre: apparent right ascension and
// declination of the date in degrees, and the distance in au. Fetched on
// 5 November 2026
const HORIZONS = [
  ['2000-01-01T12:00:00Z', 222.452200851, -10.90065378, 0.00268998925442],
  ['2010-01-01T00:00:00Z', 104.465941882, 23.4993283, 0.00240220510381],
  ['2020-01-01T00:00:00Z', 349.168521359, -9.974805048, 0.00269988972276],
  ['2026-11-24T12:00:00Z', 57.220676038, 25.123327972, 0.00241346977024],
  ['2026-11-25T00:00:00Z', 65.421973297, 26.449236232, 0.00240668480069],
  ['2030-01-01T00:00:00Z', 235.604309003, -22.153344596, 0.00243651496673],
  ['2040-01-01T00:00:00Z', 118.893258313, 24.439042943, 0.00270509440786],
  ['2050-01-01T00:00:00Z', 15.921362169, 10.450353953, 0.00253151360238]
] as const;
const moment = fc.date({
  min: new Date('1950-01-01T00:00:00Z'),
  max: new Date('2050-01-01T00:00:00Z'),
  noInvalidDate: true
});

describe('moonPosition', () => {
  test('agrees with JPL Horizons to several arcminutes and a few hundred kilometres', () => {
    for (const [date, ra, dec, delta] of HORIZONS) {
      const moon = moonPosition(new Date(date));
      const separation = Math.acos(
        Math.sin(dec * DEG) * Math.sin(moon.declination) +
          Math.cos(dec * DEG) *
            Math.cos(moon.declination) *
            Math.cos(ra * DEG - moon.rightAscension)
      );

      assert.ok(
        separation < (4 / 60) * DEG,
        `${date}: ${(separation / DEG) * 60}′`
      );
      assert.ok(
        Math.abs(moon.distance / 1000 - delta * AU_KM) < 300,
        `${date}: ${moon.distance / 1000 - delta * AU_KM} km`
      );
    }
  });

  test('gives the example: 361 300 km on 24 November 2026', () => {
    assert.equal(
      Math.round(moonPosition(new Date('2026-11-24T12:00:00Z')).distance / 1e5),
      3613
    );
  });

  test('stays within the Moon’s range of distance and declination', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const { distance, declination } = moonPosition(date);

        assert.ok(distance > 355_000_000 && distance < 407_500_000);
        assert.ok(Math.abs(declination) < 29 * DEG);
      })
    );
  });

  test('gives a position along its right ascension and declination', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const {
          rightAscension: a,
          declination: d,
          distance,
          r
        } = moonPosition(date);
        const expected = [
          distance * Math.cos(d) * Math.cos(a),
          distance * Math.cos(d) * Math.sin(a),
          distance * Math.sin(d)
        ];

        for (let k = 0; k < 3; k++)
          assert.ok(Math.abs(r[k]! - expected[k]!) < 1e-6 * distance);

        assert.ok(a >= 0 && a < 2 * Math.PI);
      })
    );
  });

  test('goes around the sky in a sidereal month', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const later = new Date(start.getTime() + 27.321_661 * 86_400_000);
    const a = moonPosition(start);
    const b = moonPosition(later);

    // Back to within a couple of degrees: the orbit's perigee and node move
    assert.ok(
      Math.abs(
        ((b.rightAscension - a.rightAscension + 3 * Math.PI) % (2 * Math.PI)) -
          Math.PI
      ) <
        2 * DEG
    );
  });

  test('rejects an invalid date', () => {
    assert.throws(() => moonPosition(new Date('nope')), TypeError);
  });
});
