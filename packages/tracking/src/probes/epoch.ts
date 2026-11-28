import {
  JULIAN_DATE_UNIX_EPOCH,
  MILLISECONDS_PER_DAY
} from '@interstellar-tools/constants';
import { dateFromJulianDate, taiMinusUtc } from '@interstellar-tools/temporal';
import type { TimeScaleType } from '@interstellar-tools/types';

export const SCALES: readonly TimeScaleType[] = [
  'UTC',
  'TAI',
  'TT',
  'UT1',
  'TDB',
  'GPS'
];

/** The UTC `Date` of a reading of a time scale's clock, as Unix ms on that clock. */
export const fromScale = (ms: number, scale: TimeScaleType): Date =>
  dateFromJulianDate(ms / MILLISECONDS_PER_DAY + JULIAN_DATE_UNIX_EPOCH, scale);

const UTC_START = Date.UTC(1972, 0, 1);
// TAI − UTC in ms; before 1972, when UTC didn't step by leap seconds, the 10 s it started with
const leap = (ms: number): number =>
  ms < UTC_START ? 10_000 : taiMinusUtc(new Date(ms)) * 1000;

/** Unix ms on the TAI clock, which counts leap seconds: differences are the time elapsed. */
export const toTai = (date: Date): number =>
  date.getTime() + leap(date.getTime());

/** The UTC `Date` of a reading of the TAI clock, from {@link toTai}; inside a leap second, which a `Date` can't hold, the end of it. */
export const fromTai = (tai: number): Date => {
  const ms = tai - leap(tai - leap(tai));

  // Inside a leap second, ms lands in the second after it, which starts at midnight
  return new Date(ms + leap(ms) === tai ? ms : Math.floor(ms / 1000) * 1000);
};
