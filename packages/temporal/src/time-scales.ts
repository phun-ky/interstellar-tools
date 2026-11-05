import {
  JULIAN_DATE_UNIX_EPOCH,
  LEAP_SECONDS,
  MILLISECONDS_PER_DAY,
  MODIFIED_JULIAN_DATE_OFFSET,
  TT_MINUS_TAI_SECONDS
} from '@interstellar-tools/constants';
import type { TimeScaleType } from '@interstellar-tools/types';

// The leap second table as Unix milliseconds, for lookups
const STEPS = LEAP_SECONDS.map(({ date, taiMinusUtc }) => ({
  ms: Date.parse(`${date}T00:00:00Z`),
  taiMinusUtc
}));
const SCALES: readonly TimeScaleType[] = [
  'UTC',
  'TAI',
  'TT',
  'UT1',
  'TDB',
  'GPS'
];
// GPS time was set to UTC on 1980-01-06, when TAI − UTC was 19 s, and has
// taken no leap seconds since
const TAI_MINUS_GPS_SECONDS = 19;
// Julian date of J2000.0
const JD_J2000 = 2_451_545;
const assertDate = (date: Date): number => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new TypeError(`date must be a valid Date. Received: ${String(date)}`);

  return date.getTime();
};
const assertScale = (scale: TimeScaleType) => {
  if (!SCALES.includes(scale))
    throw new RangeError(
      `scale must be one of ${SCALES.join(', ')}. Received: ${String(scale)}`
    );
};
// TAI − UTC in s at a UTC instant in Unix ms
const leapSecondsAt = (ms: number): number => {
  if (ms < STEPS[0]!.ms)
    throw new RangeError(
      `TAI, TT, TDB and GPS time are only defined here from 1972-01-01, when UTC began to step by whole leap seconds. Received: ${new Date(ms).toISOString()}`
    );

  let taiMinusUtc = STEPS[0]!.taiMinusUtc;

  for (const step of STEPS) {
    if (ms < step.ms) break;

    taiMinusUtc = step.taiMinusUtc;
  }

  return taiMinusUtc;
};
// TDB − TT in ms at a TT instant in Unix ms: USNO Circular 179, eq. 2.6,
// good to 10 µs
const tdbMinusTt = (ms: number): number => {
  const t =
    (ms / MILLISECONDS_PER_DAY + JULIAN_DATE_UNIX_EPOCH - JD_J2000) / 36_525;

  return (
    1.657 * Math.sin(628.3076 * t + 6.2401) +
    0.022 * Math.sin(575.3385 * t + 4.297) +
    0.014 * Math.sin(1256.6152 * t + 6.1969) +
    0.005 * Math.sin(606.9777 * t + 4.0212) +
    0.005 * Math.sin(52.9691 * t + 0.4444) +
    0.002 * Math.sin(21.3299 * t + 5.5431) +
    0.01 * t * Math.sin(628.3076 * t + 4.249)
  );
};
// The scale's lead over UTC, in ms, at a UTC instant in Unix ms
const leadOverUtc = (ms: number, scale: TimeScaleType): number => {
  if (scale === 'UTC' || scale === 'UT1') return 0;

  const tai = 1000 * leapSecondsAt(ms);

  if (scale === 'TAI') return tai;

  if (scale === 'GPS') return tai - 1000 * TAI_MINUS_GPS_SECONDS;

  const tt = tai + 1000 * TT_MINUS_TAI_SECONDS;

  return scale === 'TT' ? tt : tt + tdbMinusTt(ms + tt);
};

/**
 * **TAI − UTC**, in **s**, at a moment: the number of leap seconds so far, plus
 * the 10 s UTC started with in 1972.
 *
 * $$
 * \mathrm{TAI} = \mathrm{UTC} + \Delta_{\mathrm{AT}},
 * \qquad
 * \mathrm{TT} = \mathrm{TAI} + 32.184\ \mathrm{s}
 * $$
 *
 * Where:
 * - $ \Delta_{\mathrm{AT}} $ is TAI − UTC, from the leap second table `LEAP_SECONDS` (s)
 *
 * ::: info Notes
 *
 * - The table in `@interstellar-tools/constants` holds the leap seconds the
 *   IERS has announced. A moment after a leap second that isn't in it yet gets
 *   an offset 1 s short: keep the package up to date.
 * - A JavaScript `Date` can't hold 23:59:60, the leap second itself: it goes
 *   from 23:59:59.999 to 00:00:00 of the next day, where the new offset starts.
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01).
 * @returns TAI − UTC in **s**: a whole number, 37 since 2017.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `date` is before 1972-01-01.
 * @group Time scales
 *
 * @example
 * ```ts
 * taiMinusUtc(new Date('2016-12-31T23:59:59Z')); // 36
 * taiMinusUtc(new Date('2017-01-01T00:00:00Z')); // 37
 * ```
 */
export const taiMinusUtc = (date: Date): number =>
  leapSecondsAt(assertDate(date));

/**
 * The **Julian date** of a moment, in a time scale: the number of days since
 * noon on 1 January 4713 BC, counted on that scale's clock.
 *
 * $$
 * \mathrm{JD} = \frac{t_{\mathrm{Unix}} + \Delta}{86\,400\,000} + 2\,440\,587.5
 * $$
 *
 * Where:
 * - $ t_{\mathrm{Unix}} $ is the `Date`'s milliseconds since 1970-01-01T00:00:00Z (ms)
 * - $ \Delta $ is the scale's lead over UTC: 0 for UTC and UT1, TAI − UTC for TAI, TAI − UTC − 19 s for GPS, TAI − UTC + 32.184 s for TT, and that plus TDB − TT for TDB (ms)
 *
 * ::: info Notes
 *
 * - **UT1 is taken as UTC.** They differ by up to 0.9 s; the exact difference
 *   is measured and published by the IERS, and the library fetches nothing.
 * - **TDB − TT** comes from the series in USNO Circular 179 (eq. 2.6), good
 *   to 10 µs: within 1.7 ms, largest in early April and early October.
 * - A Julian date as a double is precise to about 40 µs today.
 * - UTC Julian dates step over leap seconds, like the `Date` itself: the
 *   difference between two of them in days can be 1 s short. Take differences
 *   in TAI or TT.
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01 for TAI, TT, TDB and GPS).
 * @param scale - The time scale to count in. Defaults to `UTC`.
 * @returns The Julian date in **days**.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `scale` is not a {@link TimeScaleType}, or `date` is before 1972-01-01 for TAI, TT, TDB and GPS.
 * @group Time scales
 *
 * @example
 * ```ts
 * import { J2000_UTC } from '@interstellar-tools/constants';
 *
 * julianDate(J2000_UTC, 'TT'); // 2451545: J2000 is JD 2451545.0 TT
 * julianDate(J2000_UTC); // 2451544.999257: 64.184 s earlier on the UTC clock
 * julianDate(J2000_UTC, 'GPS'); // 2451544.999408: 13 s ahead of UTC in 2000
 * ```
 *
 * @see https://aa.usno.navy.mil/publications/Circular_179 USNO Circular 179, for TDB
 */
export const julianDate = (
  date: Date,
  scale: TimeScaleType = 'UTC'
): number => {
  const ms = assertDate(date);

  assertScale(scale);

  return (
    (ms + leadOverUtc(ms, scale)) / MILLISECONDS_PER_DAY +
    JULIAN_DATE_UNIX_EPOCH
  );
};

/**
 * The **modified Julian date** of a moment, in a time scale: the Julian date
 * minus 2 400 000.5, so days start at midnight and MJD 0 is 1858-11-17.
 *
 * $$
 * \mathrm{MJD} = \mathrm{JD} - 2\,400\,000.5
 * $$
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01 for TAI, TT, TDB and GPS).
 * @param scale - The time scale to count in. Defaults to `UTC`.
 * @returns The modified Julian date in **days**.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `scale` is not a {@link TimeScaleType}, or `date` is before 1972-01-01 for TAI, TT, TDB and GPS.
 * @group Time scales
 * @see {@link julianDate}
 *
 * @example
 * ```ts
 * modifiedJulianDate(new Date('2000-01-01T00:00:00Z')); // 51544
 * ```
 */
export const modifiedJulianDate = (
  date: Date,
  scale: TimeScaleType = 'UTC'
): number => {
  const ms = assertDate(date);

  assertScale(scale);

  // Subtract the offsets first, so the result keeps its precision
  return (
    (ms + leadOverUtc(ms, scale)) / MILLISECONDS_PER_DAY +
    (JULIAN_DATE_UNIX_EPOCH - MODIFIED_JULIAN_DATE_OFFSET)
  );
};

/**
 * The **UTC `Date`** of a Julian date in a time scale: the inverse of
 * {@link julianDate}.
 *
 * ::: info Notes
 *
 * - The result is rounded to the millisecond, the precision of a `Date`.
 * - A TAI or TT Julian date that falls inside a leap second, 23:59:60 UTC,
 *   has no `Date`: it becomes 00:00:00 of the next day.
 *
 * :::
 *
 * @param jd - The Julian date in **days** (finite).
 * @param scale - The time scale the Julian date counts in. Defaults to `UTC`.
 * @returns The moment as a `Date`.
 * @throws {TypeError} If `jd` is not a finite number.
 * @throws {RangeError} If `scale` is not a {@link TimeScaleType}, the moment is before 1972-01-01 for TAI, TT, TDB and GPS, or it's outside the range of a `Date`.
 * @group Time scales
 *
 * @example
 * ```ts
 * dateFromJulianDate(2451545, 'TT').toISOString(); // '2000-01-01T11:58:55.816Z'
 * ```
 */
export const dateFromJulianDate = (
  jd: number,
  scale: TimeScaleType = 'UTC'
): Date => {
  if (!Number.isFinite(jd))
    throw new TypeError(`jd must be a finite number. Received: ${jd}`);

  assertScale(scale);

  // Milliseconds since 1970-01-01T00:00:00 on the scale's clock, TT for TDB
  const exact = (jd - JULIAN_DATE_UNIX_EPOCH) * MILLISECONDS_PER_DAY;
  const onScale = Math.round(
    scale === 'TDB' ? exact - tdbMinusTt(exact) : exact
  );

  let ms = onScale;

  if (scale !== 'UTC' && scale !== 'UT1') {
    // Back to TAI, then to UTC. The leap seconds depend on the UTC moment:
    // guess with TAI, then settle on the offset at the guess
    const tai =
      scale === 'TAI'
        ? onScale
        : scale === 'GPS'
          ? onScale + 1000 * TAI_MINUS_GPS_SECONDS
          : onScale - 1000 * TT_MINUS_TAI_SECONDS;
    const guess = tai - 1000 * leapSecondsAt(tai);
    const offset = leapSecondsAt(guess);

    ms = tai - 1000 * offset;

    // Inside a leap second, no UTC moment has this offset: take the start of
    // the next day, where the new offset begins
    if (leapSecondsAt(ms) !== offset)
      ms = STEPS.find((step) => step.ms > guess)!.ms;
  }

  const date = new Date(ms);

  if (!Number.isFinite(date.getTime()))
    throw new RangeError(`jd is outside the range of a Date. Received: ${jd}`);

  return date;
};
