import { MARS_SOL_DAYS } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';

import { julianDate } from './time-scales.js';

// Mars24's reference: MSD 44 796.0 − 0.0009626 at JD 2451549.5 TT, the start
// of 6 January 2000 on Earth
const MSD_REFERENCE_JD_TT = 2_451_549.5;
const MSD_AT_REFERENCE = 44_796 - 0.000_962_6;
const TWO_PI = 2 * Math.PI;
const fraction = (x: number) => x - Math.floor(x);
const assertLongitude = (longitude: number) => {
  if (!Number.isFinite(longitude))
    throw new TypeError(
      `longitude must be a finite number. Received: ${longitude}`
    );
};

/**
 * The **Mars Sol Date** of a moment: a continuous count of sols, Mars's mean
 * solar days, like the Julian date for Earth.
 *
 * $$
 * \mathrm{MSD} = \frac{\mathrm{JD_{TT}} - 2\,451\,549.5}{1.0274912517} + 44\,796.0 - 0.0009626
 * $$
 *
 * Where:
 * - $ \mathrm{JD_{TT}} $ is the Julian date in Terrestrial Time (days)
 * - $ 1.0274912517 $ is the sol in Earth days, {@link "@interstellar-tools/constants"!MARS_SOL_DAYS | MARS_SOL_DAYS}
 *
 * ::: info Notes
 *
 * - The count starts on 29 December 1873, at about noon in Greenwich.
 * - Each new sol begins at mean midnight at Airy-0, when
 *   {@link coordinatedMarsTime} wraps to 0.
 * - From NASA GISS's Mars24 algorithm, refined from Allison & McEwen (2000).
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01).
 * @returns The Mars Sol Date in **sols**.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `date` is before 1972-01-01, where TT isn't defined from the leap seconds.
 * @group Mars time
 *
 * @example
 * ```ts
 * marsSolDate(new Date('2000-01-06T00:00:00Z')); // ≈ 44 795.99976
 * ```
 *
 * @see {@link coordinatedMarsTime}
 * @see https://www.giss.nasa.gov/tools/mars24/help/algorithm.html Mars24 algorithm
 */
export const marsSolDate = (date: Date): number =>
  (julianDate(date, 'TT') - MSD_REFERENCE_JD_TT) / MARS_SOL_DAYS +
  MSD_AT_REFERENCE;

/**
 * **Coordinated Mars Time** (MTC): the mean solar time at Mars's prime
 * meridian, Airy-0, in hours, like UTC is at Greenwich.
 *
 * $$
 * \mathrm{MTC} = 24 \times (\mathrm{MSD} \bmod 1)
 * $$
 *
 * ::: info Notes
 *
 * - A Mars hour is a 24th of a sol: 1 h 1 m 39 s of Earth time.
 * - It's mean time: the real Sun can be up to about 50 minutes ahead of or behind it,
 *   because of Mars's eccentric orbit and tilt, the equation of time.
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01).
 * @returns The time at Airy-0 in **Mars hours**, from 0 up to 24.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If `date` is before 1972-01-01.
 * @group Mars time
 *
 * @example
 * ```ts
 * // Mars24's first worked example: 23:59:39 at Airy-0
 * coordinatedMarsTime(new Date('2000-01-06T00:00:00Z')); // ≈ 23.99425 h
 * ```
 *
 * @see {@link marsSolDate}
 * @see {@link marsLocalMeanSolarTime}
 */
export const coordinatedMarsTime = (date: Date): number =>
  24 * fraction(marsSolDate(date));

/**
 * The **local mean solar time on Mars** at a longitude, in hours: Coordinated
 * Mars Time plus the east longitude in hours, 15° to the hour.
 *
 * $$
 * \mathrm{LMST} = \left( \mathrm{MTC} + \lambda \, \frac{24\ \mathrm{h}}{2\pi} \right) \bmod 24\ \mathrm{h}
 * $$
 *
 * Where:
 * - $ \lambda $ is the planetocentric east longitude (rad)
 *
 * ::: info Notes
 *
 * - **East longitude**, as the IAU gives it for Mars. Mars24 counts west
 *   longitude, so 184.702° W there is 175.298° E here.
 * - It's mean time, by a Sun that moves evenly. The real Sun can be up to about
 *   50 minutes ahead of or behind it.
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01).
 * @param longitude - The east longitude in **radians** (finite; any turn).
 * @returns The local mean solar time in **Mars hours**, from 0 up to 24.
 * @throws {TypeError} If `date` is not a valid `Date`, or `longitude` is not a finite number.
 * @throws {RangeError} If `date` is before 1972-01-01.
 * @group Mars time
 *
 * @example
 * ```ts
 * const DEG = Math.PI / 180;
 *
 * // Spirit's site, at local midnight on Earth's clock: 00:51 mean time
 * marsLocalMeanSolarTime(
 *   new Date('2004-01-03T13:46:31Z'),
 *   (175.298 * DEG) as Radians
 * ); // ≈ 0.8519 h
 * ```
 *
 * @see {@link coordinatedMarsTime}
 * @see {@link missionSol}
 */
export const marsLocalMeanSolarTime = (
  date: Date,
  longitude: Radians
): number => {
  assertLongitude(longitude);

  return 24 * fraction(marsSolDate(date) + longitude / TWO_PI);
};

/**
 * The **mission sol** at a landing site: the number of the sol a rover is on,
 * counted from its landing.
 *
 * $$
 * \text{sol} = s_0 + \lfloor \mathrm{MSD} + \lambda / 2\pi \rfloor - \lfloor \mathrm{MSD_{landing}} + \lambda / 2\pi \rfloor
 * $$
 *
 * Where:
 * - $ s_0 $ is the number of the landing sol
 * - $ \lambda $ is the east longitude of the mission's clock (rad)
 *
 * ::: info Notes
 *
 * - A new sol begins at local mean midnight at the site.
 * - **Sol 0 or sol 1?** Curiosity and Perseverance call their landing sol 0.
 *   Spirit and Opportunity called it sol 1.
 * - Before landing, the count goes below the landing sol.
 * - Spirit and Opportunity ran on a hybrid of true solar time, a few minutes
 *   off mean time: close to their midnights, their count can differ by one.
 *
 * :::
 *
 * @param date - The moment, as a UTC `Date` (on or after 1972-01-01).
 * @param landingDate - The moment of landing, as a UTC `Date` (on or after 1972-01-01).
 * @param longitude - The east longitude of the mission's clock in **radians** (finite).
 * @param firstSol - The number of the landing sol: 0 or 1 (an integer). Defaults to 0.
 * @returns The sol number, an integer.
 * @throws {TypeError} If a date is not a valid `Date`, `longitude` is not a finite number, or `firstSol` is not an integer.
 * @throws {RangeError} If a date is before 1972-01-01.
 * @group Mars time
 *
 * @example
 * ```ts
 * const DEG = Math.PI / 180;
 *
 * // Curiosity landed in Gale crater, its clock at 137.42° E
 * missionSol(
 *   new Date('2015-05-30T12:00:00Z'),
 *   new Date('2012-08-06T05:17:57Z'),
 *   (137.42 * DEG) as Radians
 * ); // 1000
 * ```
 *
 * @see {@link marsLocalMeanSolarTime}
 * @see https://www.giss.nasa.gov/tools/mars24/help/notes.html Mars24 technical notes, on mission sols
 */
export const missionSol = (
  date: Date,
  landingDate: Date,
  longitude: Radians,
  firstSol = 0
): number => {
  assertLongitude(longitude);

  if (!Number.isInteger(firstSol))
    throw new TypeError(`firstSol must be an integer. Received: ${firstSol}`);

  const local = (moment: Date) =>
    Math.floor(marsSolDate(moment) + longitude / TWO_PI);

  return firstSol + local(date) - local(landingDate);
};
