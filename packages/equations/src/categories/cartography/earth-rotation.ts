import { modifiedJulianDate } from '@interstellar-tools/temporal';
import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from './validate.js';

const TWO_PI = 2 * Math.PI;
// MJD of J2000.0, 2000-01-01T12:00:00
const MJD_J2000 = 51544.5;
// GMST in seconds of time, IAU 1982, less the 12 h a Julian date starts late
const GMST_A = 24110.54841 - 43_200;
const GMST_B = 8640184.812866;
const GMST_C = 0.093104;
const GMST_D = -6.2e-6;
// [0, 2π), leaving an angle already in range as it is. A tiny negative angle
// rounds up to 2π, which is 0
const wrap = (angle: number): Radians => {
  const wrapped = angle - TWO_PI * Math.floor(angle / TWO_PI);

  return (wrapped < TWO_PI ? wrapped : 0) as Radians;
};
// Days of UT1 since J2000.0, taking UT1 as UTC
const ut1DaysSinceJ2000 = (date: Date): number =>
  modifiedJulianDate(date, 'UT1') - MJD_J2000;

/**
 * Compute the **Earth rotation angle** (ERA): how far Earth has turned about its
 * axis at a moment, measured from the Celestial Intermediate Origin. It's the
 * IAU 2000 measure of Earth's rotation, linear in UT1.
 *
 * $$
 * \theta_{\mathrm{ERA}} = 2\pi\,(0.7790572732640 + 1.00273781191135448\,D_U)
 * $$
 *
 * Where:
 * - $ D_U $ is the number of days of UT1 since J2000.0, 2000-01-01T12:00:00 UT1 (d)
 *
 * **Units**
 * - Input: a `Date`.
 * - Output: $ \theta_{\mathrm{ERA}} $ in **radians**, in [0, 2π).
 *
 * ::: info Notes
 *
 * - **UT1 is taken as UTC.** They differ by up to 0.9 s, which turns Earth by
 *   up to 13″: 400 m at the equator. The exact difference is published by the
 *   IERS, and the library fetches nothing.
 * - Earth turns once every 0.99727 days, a sidereal day, which is why the
 *   coefficient of $ D_U $ is a little over 1.
 * - SGP4's TEME frame uses the older Greenwich mean sidereal time instead:
 *   {@link greenwichMeanSiderealTime}.
 *
 * :::
 *
 * @param date - The moment, as a `Date`.
 * @returns The Earth rotation angle $ \theta_{\mathrm{ERA}} $ in **radians**, in [0, 2π).
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // At J2000.0, ERA is 280.46° (2π × 0.7790572732640)
 * earthRotationAngle(new Date('2000-01-01T12:00:00Z')); // ≈ 4.894961 rad
 * ```
 *
 * @see {@link greenwichMeanSiderealTime}
 * @see https://iers-conventions.obspm.fr/content/tn36.pdf IERS Conventions (2010), section 5.5.3
 */
export const earthRotationAngle = (date: Date): Radians => {
  const du = ut1DaysSinceJ2000(date);

  // The whole days turn Earth by a whole number of turns: keep only the
  // fraction, so the sum stays precise
  return wrap(TWO_PI * ((du % 1) + 0.779057273264 + 0.00273781191135448 * du));
};

/**
 * Compute **Greenwich mean sidereal time** (GMST) with the IAU 1982 model: the
 * angle from the mean equinox of date to the Greenwich meridian, as the
 * 1982 standard defines it.
 *
 * $$
 * \theta_{\mathrm{GMST}} = 24\,110.54841 + 8\,640\,184.812866\,T + 0.093104\,T^2 - 6.2\times10^{-6}\,T^3\ \text{s} + \mathrm{UT1}
 * $$
 *
 * Where:
 * - $ T $ is the number of Julian centuries of UT1 since J2000.0
 * - $ \mathrm{UT1} $ is the time of day in UT1 (s); a day of time is 2π
 *
 * **Units**
 * - Input: a `Date`.
 * - Output: $ \theta_{\mathrm{GMST}} $ in **radians**, in [0, 2π).
 *
 * ::: info Notes
 *
 * - **This is the angle SGP4's TEME frame uses.** To rotate an SGP4 position
 *   into Earth-fixed coordinates, turn it by GMST about the z axis (Vallado et
 *   al. 2006). Newer IAU 2000 work uses {@link earthRotationAngle} instead.
 * - **UT1 is taken as UTC**, as in {@link earthRotationAngle}.
 *
 * :::
 *
 * @param date - The moment, as a `Date`.
 * @returns Greenwich mean sidereal time $ \theta_{\mathrm{GMST}} $ in **radians**, in [0, 2π).
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Vallado, Example 3-5: 1992-08-20 12:14 UT1
 * greenwichMeanSiderealTime(new Date('1992-08-20T12:14:00Z')); // ≈ 2.663 rad, 152.58°
 * ```
 *
 * @see {@link earthRotationAngle}
 * @see {@link localSiderealTime}
 * @see https://celestrak.org/publications/AIAA/2006-6753/ Vallado et al. (2006), Revisiting Spacetrack Report #3
 */
export const greenwichMeanSiderealTime = (date: Date): Radians => {
  const du = ut1DaysSinceJ2000(date);
  const t = du / 36525;
  // The time of day in UT1, from noon, where a Julian date's day starts
  const dayFraction = 86_400 * (du % 1);

  return wrap(
    (TWO_PI / 86_400) *
      (GMST_A + (GMST_B + (GMST_C + GMST_D * t) * t) * t + dayFraction)
  );
};

/**
 * Compute **local mean sidereal time**: Greenwich mean sidereal time turned by
 * a longitude, the angle from the mean equinox to the local meridian.
 *
 * $$
 * \theta_{\mathrm{LST}} = \theta_{\mathrm{GMST}} + \lambda
 * $$
 *
 * Where:
 * - $ \theta_{\mathrm{GMST}} $ is {@link greenwichMeanSiderealTime} (rad)
 * - $ \lambda $ is the longitude, east positive (rad)
 *
 * **Units**
 * - Inputs: a `Date`, and the longitude in **radians**.
 * - Output: $ \theta_{\mathrm{LST}} $ in **radians**, in [0, 2π).
 *
 * ::: info Notes
 *
 * - A star is on the local meridian when its right ascension equals the local
 *   sidereal time.
 *
 * :::
 *
 * @param date - The moment, as a `Date`.
 * @param longitude - Longitude $ \lambda $ in **radians**, east positive (finite).
 * @returns Local mean sidereal time $ \theta_{\mathrm{LST}} $ in **radians**, in [0, 2π).
 * @throws {TypeError} If `date` is not a valid `Date`, or `longitude` is not a finite number.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Vallado, Example 3-5: 104° W, 1992-08-20 12:14 UT1
 * localSiderealTime(new Date('1992-08-20T12:14:00Z'), toRad(-104)); // ≈ 0.848 rad, 48.58°
 * ```
 *
 * @see {@link greenwichMeanSiderealTime}
 */
export const localSiderealTime = (date: Date, longitude: Radians): Radians => {
  assertFinite([['longitude', longitude]]);

  return wrap(greenwichMeanSiderealTime(date) + longitude);
};
