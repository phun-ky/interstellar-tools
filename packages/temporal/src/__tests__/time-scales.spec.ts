import {
  J2000_TT,
  J2000_UTC,
  LEAP_SECONDS
} from '@interstellar-tools/constants';
import type { TimeScaleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  dateFromJulianDate,
  julianDate,
  modifiedJulianDate,
  taiMinusUtc
} from '../time-scales.js';

const SECOND_IN_DAYS = 1 / 86_400;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

describe('julianDate', () => {
  test('puts J2000 at JD 2451545.0 TT', () => {
    assert.equal(julianDate(J2000_UTC, 'TT'), J2000_TT);
    close(julianDate(J2000_UTC), J2000_TT - 64.184 * SECOND_IN_DAYS, 1e-9);
    close(
      julianDate(J2000_UTC, 'TAI'),
      J2000_TT - 32.184 * SECOND_IN_DAYS,
      1e-9
    );
  });

  test('keeps GPS time 19 s behind TAI', () => {
    // 13 s ahead of UTC in 2000, 18 s since the leap second of 2017
    close(
      julianDate(J2000_UTC, 'GPS'),
      J2000_TT - 51.184 * SECOND_IN_DAYS,
      1e-9
    );

    const date = new Date('2026-11-04T12:00:00Z');

    close(
      (modifiedJulianDate(date, 'GPS') - modifiedJulianDate(date)) * 86_400,
      18,
      1e-6
    );
    close(
      (modifiedJulianDate(date, 'TAI') - modifiedJulianDate(date, 'GPS')) *
        86_400,
      19,
      1e-6
    );
  });

  test('runs TDB within 1.7 ms of TT, as JPL Horizons does', () => {
    // TDB − TT in µs, from Earth's position in Horizons at the same TT and
    // TDB readings: the series is good to 10 µs, the comparison to 25 µs
    const horizons = [
      ['2026-01-01', -80],
      ['2026-04-01', 1655],
      ['2026-06-30', 151],
      ['2026-10-28', -1536]
    ] as const;
    const tdbMinusTt = (date: Date) =>
      (modifiedJulianDate(date, 'TDB') - modifiedJulianDate(date, 'TT')) *
      86_400e6;

    for (const [day, microseconds] of horizons)
      close(tdbMinusTt(new Date(`${day}T00:00:00Z`)), microseconds, 25);

    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1972-01-01T00:00:00Z'),
          max: new Date('2100-01-01T00:00:00Z'),
          noInvalidDate: true
        }),
        (date) => assert.ok(Math.abs(tdbMinusTt(date)) < 1700)
      )
    );
  });

  test('puts the Unix epoch at JD 2440587.5 UTC', () => {
    assert.equal(julianDate(new Date(0)), 2440587.5);
  });

  test('takes UT1 as UTC', () => {
    const date = new Date('2026-11-04T12:00:00Z');

    assert.equal(julianDate(date, 'UT1'), julianDate(date, 'UTC'));
  });

  test('counts the leap second at the end of 2016 on the TT clock', () => {
    const before = new Date('2016-12-31T23:59:59Z');
    const after = new Date('2017-01-01T00:00:00Z');

    // 23:59:59 to 00:00:00 is 1 s on a Date, but 23:59:60 lies between
    close(julianDate(after) - julianDate(before), SECOND_IN_DAYS, 1e-9);
    close(
      julianDate(after, 'TT') - julianDate(before, 'TT'),
      2 * SECOND_IN_DAYS,
      1e-9
    );
  });

  test('rejects an invalid date or scale, and TT before 1972', () => {
    assert.throws(() => julianDate(new Date('nope')), TypeError);
    assert.throws(
      () => julianDate(new Date(0), 'TCB' as TimeScaleType),
      RangeError
    );
    assert.throws(
      () => julianDate(new Date('1971-12-31T23:59:59Z'), 'TT'),
      /1972/
    );
    assert.equal(julianDate(new Date('1950-01-01T00:00:00Z')), 2433282.5);
  });
});

describe('modifiedJulianDate', () => {
  test('is the Julian date minus 2400000.5', () => {
    const date = new Date('2026-11-04T06:30:00Z');

    assert.equal(modifiedJulianDate(new Date('1858-11-17T00:00:00Z')), 0);
    assert.equal(modifiedJulianDate(new Date('2000-01-01T00:00:00Z')), 51544);

    for (const scale of ['UTC', 'TAI', 'TT', 'UT1', 'TDB', 'GPS'] as const)
      close(
        modifiedJulianDate(date, scale),
        julianDate(date, scale) - 2400000.5,
        1e-9
      );
  });
});

describe('taiMinusUtc', () => {
  test('steps by one second at each leap second', () => {
    assert.equal(taiMinusUtc(new Date('1972-01-01T00:00:00Z')), 10);
    assert.equal(taiMinusUtc(new Date('2016-12-31T23:59:59.999Z')), 36);
    assert.equal(taiMinusUtc(new Date('2017-01-01T00:00:00Z')), 37);
    assert.equal(taiMinusUtc(J2000_UTC), 32);
    assert.equal(taiMinusUtc(new Date('2026-11-04T00:00:00Z')), 37);
  });

  test('follows the table', () => {
    for (const { date, taiMinusUtc: offset } of LEAP_SECONDS)
      assert.equal(taiMinusUtc(new Date(`${date}T00:00:00Z`)), offset);
  });

  test('rejects dates before 1972', () => {
    assert.throws(
      () => taiMinusUtc(new Date('1971-12-31T23:59:59Z')),
      RangeError
    );
  });
});

describe('dateFromJulianDate', () => {
  test('turns J2000 TT back into its UTC moment', () => {
    assert.equal(
      dateFromJulianDate(J2000_TT, 'TT').toISOString(),
      '2000-01-01T11:58:55.816Z'
    );
  });

  test("turns Horizons' TDB epochs and GPS time into UTC", () => {
    // 2026-01-01 00:00 TDB, a Horizons sample time: 69.184 s, less TDB − TT
    assert.equal(
      dateFromJulianDate(2461041.5, 'TDB').toISOString(),
      '2025-12-31T23:58:50.816Z'
    );
    assert.equal(
      dateFromJulianDate(2461041.5, 'GPS').toISOString(),
      '2025-12-31T23:59:42.000Z'
    );
  });

  test('turns a moment inside a leap second into the next day', () => {
    // 2016-12-31T23:59:60.5 UTC, on the TAI clock
    const tai =
      julianDate(new Date('2017-01-01T00:00:00Z'), 'TAI') -
      0.5 * SECOND_IN_DAYS;

    assert.equal(
      dateFromJulianDate(tai, 'TAI').toISOString(),
      '2017-01-01T00:00:00.000Z'
    );
  });

  test('rejects a non-finite Julian date or one out of range', () => {
    assert.throws(() => dateFromJulianDate(Number.NaN), TypeError);
    assert.throws(() => dateFromJulianDate(1e12), RangeError);
    assert.throws(() => dateFromJulianDate(2441317.4, 'TT'), RangeError);
  });

  test('undoes julianDate to the millisecond, on every scale', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1972-01-01T00:00:00Z'),
          max: new Date('2100-01-01T00:00:00Z'),
          noInvalidDate: true
        }),
        fc.constantFrom<TimeScaleType>('UTC', 'TAI', 'TT', 'UT1', 'TDB', 'GPS'),
        (date, scale) => {
          assert.equal(
            dateFromJulianDate(julianDate(date, scale), scale).getTime(),
            date.getTime()
          );
        }
      )
    );
  });
});
