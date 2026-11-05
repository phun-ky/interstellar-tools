import { MARS_SOL_SECONDS } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  coordinatedMarsTime,
  marsLocalMeanSolarTime,
  marsSolDate,
  missionSol
} from '../mars-time.js';

const DEG = Math.PI / 180;
const east = (degrees: number) => (degrees * DEG) as Radians;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });
const moment = fc.date({
  min: new Date('1972-01-02T00:00:00Z'),
  max: new Date('2100-01-01T00:00:00Z'),
  noInvalidDate: true
});
// Landings, and the east longitudes of the mission clocks (Mars24's landers
// page; NAIF's mission catalogues for Spirit and Opportunity)
const CURIOSITY = {
  landing: new Date('2012-08-06T05:17:57Z'),
  longitude: east(137.42),
  firstSol: 0
};
const PERSEVERANCE = {
  landing: new Date('2021-02-18T20:43:48.818Z'),
  longitude: east(77.43),
  firstSol: 0
};
const SPIRIT = {
  landing: new Date('2004-01-04T04:26:00Z'),
  longitude: east(175.47848),
  firstSol: 1
};
const OPPORTUNITY = {
  landing: new Date('2004-01-25T04:55:00Z'),
  longitude: east(354.47417),
  firstSol: 1
};
const solOf = (
  date: string,
  { landing, longitude, firstSol }: typeof CURIOSITY
) => missionSol(new Date(date), landing, longitude, firstSol);

describe('Mars24 worked examples', () => {
  test('6 January 2000: MSD 44 795.99976, 23:59:39 at Airy-0', () => {
    const date = new Date('2000-01-06T00:00:00Z');

    close(marsSolDate(date), 44_795.99976, 5e-6);
    close(coordinatedMarsTime(date), 23.99425, 5e-6);
    close(marsLocalMeanSolarTime(date, east(0)), 23.99425, 5e-6);
  });

  test("Spirit's landing site, 3 January 2004: 13:09:55 at Airy-0, 00:51:07 at 184.702° W", () => {
    const date = new Date('2004-01-03T13:46:31Z');

    close(coordinatedMarsTime(date), 13.16537, 5e-6);
    close(marsLocalMeanSolarTime(date, east(360 - 184.702)), 0.8519, 5e-5);
  });
});

describe('marsSolDate', () => {
  test('counts one sol in 88 775.244 s', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const later = new Date(date.getTime() + MARS_SOL_SECONDS * 1000);

        close(marsSolDate(later) - marsSolDate(date), 1, 1e-8);
      })
    );
  });

  test('rejects an invalid date, and one before 1972', () => {
    throwsWith(
      () => marsSolDate(new Date('nope')),
      TypeError,
      'date must be a valid Date. Received: Invalid Date'
    );
    assert.throws(
      () => marsSolDate(new Date('1971-12-31T00:00:00Z')),
      RangeError
    );
  });
});

describe('coordinatedMarsTime', () => {
  test('runs from 0 up to 24 h, and wraps at each new sol', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const mtc = coordinatedMarsTime(date);
        const msd = marsSolDate(date);

        assert.ok(mtc >= 0 && mtc < 24);
        close(mtc, 24 * (msd - Math.floor(msd)), 1e-6);
      })
    );
  });

  test('advances an hour in a 24th of a sol', () => {
    const date = new Date('2026-11-05T00:00:00Z');
    const hour = new Date(date.getTime() + (MARS_SOL_SECONDS / 24) * 1000);
    const step = coordinatedMarsTime(hour) - coordinatedMarsTime(date);

    close((step + 24) % 24, 1, 1e-6);
  });
});

describe('marsLocalMeanSolarTime', () => {
  test('is 12 hours from Airy-0 at 180°, and an hour ahead every 15° east', () => {
    fc.assert(
      fc.property(
        moment,
        fc.double({ min: -360, max: 360, noNaN: true }),
        (date, degrees) => {
          const mtc = coordinatedMarsTime(date);
          const ahead =
            (marsLocalMeanSolarTime(date, east(degrees)) - mtc + 48) % 24;
          const expected = (((degrees / 15) % 24) + 24) % 24;

          assert.ok(
            Math.abs(ahead - expected) < 1e-6 ||
              Math.abs(Math.abs(ahead - expected) - 24) < 1e-6,
            `${degrees}°: ${ahead} h ahead`
          );

          const opposite = marsLocalMeanSolarTime(date, east(180));

          close((opposite - mtc + 24) % 24, 12, 1e-6);
        }
      )
    );
  });

  test('rejects a longitude that is not finite', () => {
    throwsWith(
      () =>
        marsLocalMeanSolarTime(
          new Date('2026-01-01T00:00:00Z'),
          Number.NaN as Radians
        ),
      TypeError,
      'longitude must be a finite number. Received: NaN'
    );
  });
});

describe('missionSol', () => {
  test('gives Curiosity and Perseverance sol 0 at landing, Spirit and Opportunity sol 1', () => {
    for (const mission of [CURIOSITY, PERSEVERANCE])
      assert.equal(
        missionSol(mission.landing, mission.landing, mission.longitude),
        0
      );

    for (const mission of [SPIRIT, OPPORTUNITY])
      assert.equal(
        missionSol(
          mission.landing,
          mission.landing,
          mission.longitude,
          mission.firstSol
        ),
        1
      );
  });

  test("lands in the afternoon: Curiosity at 15:03 mean time, by NAIF's catalogue", () => {
    const time = marsLocalMeanSolarTime(CURIOSITY.landing, CURIOSITY.longitude);

    assert.equal(
      `${Math.floor(time)}:${String(Math.floor((time % 1) * 60)).padStart(2, '0')}`,
      '15:03'
    );
  });

  test('gives the sols NASA dated', () => {
    // JPL's PIA19679: sol 1 000 was 30 May 2015
    assert.equal(solOf('2015-05-30T12:00:00Z', CURIOSITY), 1000);
    // Mars24's landers page: 9 December 2023
    assert.equal(solOf('2023-12-09T18:00:00Z', CURIOSITY), 4032);
    assert.equal(solOf('2023-12-09T20:00:00Z', PERSEVERANCE), 997);
    // Spirit's last contact, 22 March 2010, and Opportunity's, 10 June 2018
    assert.equal(solOf('2010-03-22T12:00:00Z', SPIRIT), 2210);
    assert.equal(solOf('2018-06-10T12:00:00Z', OPPORTUNITY), 5111);
    // The 90-sol prime missions, to 4 and 25 April 2004
    assert.equal(solOf('2004-04-04T12:00:00Z', SPIRIT), 90);
    assert.equal(solOf('2004-04-25T12:00:00Z', OPPORTUNITY), 90);
  });

  test('starts a new sol at local midnight, and counts back before landing', () => {
    const { landing, longitude } = CURIOSITY;
    const time = marsLocalMeanSolarTime(landing, longitude);
    const toMidnight = ((24 - time) / 24) * MARS_SOL_SECONDS * 1000;
    const at = (offset: number) =>
      missionSol(new Date(landing.getTime() + offset), landing, longitude);

    assert.equal(at(toMidnight - 1000), 0);
    assert.equal(at(toMidnight + 1000), 1);
    assert.equal(at(-2 * MARS_SOL_SECONDS * 1000), -2);
  });

  test('counts one sol in every 88 775.244 s', () => {
    const { landing, longitude } = CURIOSITY;

    fc.assert(
      fc.property(moment, fc.integer({ min: 1, max: 5000 }), (date, sols) => {
        const time = marsLocalMeanSolarTime(date, longitude);

        // Not within a second of local midnight, where rounding decides
        fc.pre(time > 1e-3 && time < 24 - 1e-3);

        const later = new Date(date.getTime() + sols * MARS_SOL_SECONDS * 1000);

        assert.equal(
          missionSol(later, landing, longitude) -
            missionSol(date, landing, longitude),
          sols
        );
      })
    );
  });

  test('rejects invalid input', () => {
    const { landing, longitude } = CURIOSITY;

    throwsWith(
      () => missionSol(landing, landing, Infinity as Radians),
      TypeError,
      'longitude must be a finite number. Received: Infinity'
    );
    throwsWith(
      () => missionSol(landing, landing, longitude, 0.5),
      TypeError,
      'firstSol must be an integer. Received: 0.5'
    );
    throwsWith(
      () => missionSol(landing, new Date('nope'), longitude),
      TypeError,
      'date must be a valid Date. Received: Invalid Date'
    );
  });
});
