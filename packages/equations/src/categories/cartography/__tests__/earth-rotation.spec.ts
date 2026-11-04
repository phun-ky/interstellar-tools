import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  earthRotationAngle,
  greenwichMeanSiderealTime,
  localSiderealTime
} from '../earth-rotation.js';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const moment = fc.date({
  min: new Date('1972-01-01T00:00:00Z'),
  max: new Date('2100-01-01T00:00:00Z'),
  noInvalidDate: true
});
const inRange = (angle: number) =>
  assert.ok(angle >= 0 && angle < 2 * Math.PI, `${angle} in [0, 2π)`);

describe('earthRotationAngle', () => {
  test('is 2π × 0.7790572732640 at J2000.0', () => {
    close(
      earthRotationAngle(new Date('2000-01-01T12:00:00Z')),
      2 * Math.PI * 0.779057273264,
      1e-12
    );
  });

  test('matches SOFA (eraEra00 at MJD 54388.0 UT1)', () => {
    close(
      earthRotationAngle(new Date('2007-10-15T00:00:00Z')),
      0.4022837240028158102,
      1e-12
    );
  });

  test('turns 1.00273781191135448 turns a day, wrapped to [0, 2π)', () => {
    fc.assert(
      fc.property(moment, (date) => {
        const today = earthRotationAngle(date);
        const tomorrow = earthRotationAngle(
          new Date(date.getTime() + 86_400_000)
        );
        const turned =
          (((tomorrow - today) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        inRange(today);
        close(turned, 2 * Math.PI * 0.00273781191135448, 1e-9);
      })
    );
  });

  test('rejects an invalid date', () => {
    assert.throws(() => earthRotationAngle(new Date('nope')), TypeError);
  });
});

describe('greenwichMeanSiderealTime', () => {
  test('matches SOFA (eraGmst82 at MJD 53736.0 UT1)', () => {
    close(
      greenwichMeanSiderealTime(new Date('2006-01-01T00:00:00Z')),
      1.754174981860675096,
      1e-12
    );
  });

  test('matches Vallado, Example 3-5: 152.5787879° at 1992-08-20 12:14 UT1', () => {
    close(
      toDeg(greenwichMeanSiderealTime(new Date('1992-08-20T12:14:00Z'))),
      152.5787879,
      1e-6
    );
  });

  test('agrees with the Earth rotation angle to within 1″ at J2000.0', () => {
    // They differ by the equation of the origins, which grows with
    // precession, about 46″ a year, from close to 0 at J2000.0
    const date = new Date('2000-01-01T12:00:00Z');

    close(
      toDeg(greenwichMeanSiderealTime(date) - earthRotationAngle(date)) * 3600,
      0,
      1
    );
  });

  test('is wrapped to [0, 2π)', () => {
    fc.assert(
      fc.property(moment, (date) => inRange(greenwichMeanSiderealTime(date)))
    );
  });
});

describe('localSiderealTime', () => {
  test('matches Vallado, Example 3-5: 48.5787879° at 104° W', () => {
    close(
      toDeg(localSiderealTime(new Date('1992-08-20T12:14:00Z'), toRad(-104))),
      48.5787879,
      1e-6
    );
  });

  test('is GMST at Greenwich, and wrapped to [0, 2π) anywhere', () => {
    fc.assert(
      fc.property(
        moment,
        fc.double({ min: -10, max: 10, noNaN: true }),
        (date, lon) => {
          const lst = localSiderealTime(date, lon as Radians);

          inRange(lst);
          assert.equal(
            localSiderealTime(date, 0 as Radians),
            greenwichMeanSiderealTime(date)
          );
        }
      )
    );
  });

  test('wraps an angle just below 0 to 0, not to 2π', () => {
    // GMST is 1.754 rad here; a longitude one step past it leaves a sum of
    // -2.2e-16 rad, and 2π − 2.2e-16 rounds to 2π
    const date = new Date('2006-01-01T00:00:00Z');
    const gmst = greenwichMeanSiderealTime(date);

    assert.equal(
      localSiderealTime(date, -(gmst + Number.EPSILON) as Radians),
      0
    );
  });

  test('rejects a non-finite longitude', () => {
    assert.throws(
      () => localSiderealTime(new Date(), Number.NaN as Radians),
      TypeError
    );
  });
});
