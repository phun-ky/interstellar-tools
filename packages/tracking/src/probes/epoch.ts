import {
  JULIAN_DATE_UNIX_EPOCH,
  MILLISECONDS_PER_DAY
} from '@interstellar-tools/constants';
import { dateFromJulianDate } from '@interstellar-tools/temporal';
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
