import { julianDate } from '@interstellar-tools/temporal';
import type { MoonPositionInterface, Radians } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

const DEG = Math.PI / 180;
const ARCSEC = DEG / 3600;
// Julian date of J2000.0, 2000-01-01T12:00:00
const JD_J2000 = 2_451_545;

/**
 * Compute the **Moon's position** seen from Earth's centre at a moment:
 * right ascension, declination and distance, from the short series of
 * Montenbruck and Gill, the largest terms of the lunar theory.
 *
 * $$
 * \begin{aligned}
 * \lambda &= L_0 + 22\,640'' \sin l + 769'' \sin 2l - 4\,586'' \sin(l - 2D) + 2\,370'' \sin 2D - 668'' \sin l' - \ldots \\
 * \beta &= 18\,520'' \sin\big(F + \lambda - L_0 + 412'' \sin 2F + 541'' \sin l'\big) - 526'' \sin(F - 2D) + \ldots \\
 * r &= 385\,000 - 20\,905 \cos l - 3\,699 \cos(2D - l) - 2\,956 \cos 2D - \ldots\ \text{km}
 * \end{aligned}
 * $$
 *
 * with 14 terms in longitude, 8 in latitude and 9 in distance, then turned
 * from the ecliptic to the equator by the obliquity $ \varepsilon $.
 *
 * Where:
 * - $ L_0 $ is the Moon's mean longitude, $ l $ its mean anomaly, $ F $ its mean argument of latitude and $ D $ its mean elongation from the Sun
 * - $ l' $ is the Sun's mean anomaly
 * - $ \lambda, \beta $ are the Moon's ecliptic longitude and latitude, and $ r $ its distance
 *
 * **Units**
 * - Input: a `Date`.
 * - Output: `rightAscension` and `declination` in **radians**, `distance` in **m**, and `r` in **m**: see {@link MoonPositionInterface}.
 *
 * ::: info Notes
 *
 * - **Good to several arcminutes, and a few hundred kilometres in distance**,
 *   in the decades around 2000: for the Moon's pull on a satellite, where
 *   that's an error of a fraction of a percent, or to find the Moon in the
 *   sky. Not for eclipses or occultations.
 * - The position is geocentric. From Earth's surface the Moon appears up to
 *   a degree lower, its parallax, which matters for observing it.
 * - The axes are the mean equator and equinox of the date, like
 *   {@link sunPosition}: close enough to SGP4's TEME frame.
 *
 * :::
 *
 * @param date - The moment, as a `Date`.
 * @returns The right ascension, declination, distance and position: see {@link MoonPositionInterface}.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @group Cartography
 *
 * @example
 * ```ts
 * const moon = moonPosition(new Date('2026-11-24T12:00:00Z'));
 *
 * moon.distance / 1000; // ≈ 361 300 km; JPL Horizons gives 361 050 km
 * ```
 *
 * @see {@link sunPosition}
 * @see {@link thirdBodyAcceleration}
 * @see Montenbruck & Gill, _Satellite Orbits_ (2000), section 3.3.2
 */
export const moonPosition = (date: Date): MoonPositionInterface => {
  const n = julianDate(date) - JD_J2000;
  const T = n / 36_525;
  // The mean equinox of the date: without the precession term that refers
  // the series to J2000
  const L0 = (218.31617 + 481_267.88088 * T) * DEG;
  const l = (134.96292 + 477_198.86753 * T) * DEG;
  const ls = (357.52543 + 35_999.04944 * T) * DEG;
  const F = (93.27283 + 483_202.01873 * T) * DEG;
  const D = (297.85027 + 445_267.11135 * T) * DEG;
  const lambda =
    L0 +
    (22_640 * Math.sin(l) +
      769 * Math.sin(2 * l) -
      4586 * Math.sin(l - 2 * D) +
      2370 * Math.sin(2 * D) -
      668 * Math.sin(ls) -
      412 * Math.sin(2 * F) -
      212 * Math.sin(2 * l - 2 * D) -
      206 * Math.sin(l + ls - 2 * D) +
      192 * Math.sin(l + 2 * D) -
      165 * Math.sin(ls - 2 * D) +
      148 * Math.sin(l - ls) -
      125 * Math.sin(D) -
      110 * Math.sin(l + ls) -
      55 * Math.sin(2 * F - 2 * D)) *
      ARCSEC;
  const beta =
    (18_520 *
      Math.sin(
        F + lambda - L0 + (412 * Math.sin(2 * F) + 541 * Math.sin(ls)) * ARCSEC
      ) -
      526 * Math.sin(F - 2 * D) +
      44 * Math.sin(l + F - 2 * D) -
      31 * Math.sin(-l + F - 2 * D) -
      25 * Math.sin(-2 * l + F) -
      23 * Math.sin(ls + F - 2 * D) +
      21 * Math.sin(-l + F) +
      11 * Math.sin(-ls + F - 2 * D)) *
    ARCSEC;
  const distance =
    (385_000 -
      20_905 * Math.cos(l) -
      3699 * Math.cos(2 * D - l) -
      2956 * Math.cos(2 * D) -
      570 * Math.cos(2 * l) +
      246 * Math.cos(2 * l - 2 * D) -
      205 * Math.cos(ls - 2 * D) -
      171 * Math.cos(l + 2 * D) -
      152 * Math.cos(l + ls - 2 * D)) *
    1000;
  // The obliquity of the date, as in sunPosition
  const epsilon = (23.439 - 0.0000004 * n) * DEG;
  // Ecliptic to equatorial
  const xe = Math.cos(beta) * Math.cos(lambda);
  const ye = Math.cos(beta) * Math.sin(lambda);
  const ze = Math.sin(beta);
  const x = xe;
  const y = Math.cos(epsilon) * ye - Math.sin(epsilon) * ze;
  const z = Math.sin(epsilon) * ye + Math.cos(epsilon) * ze;

  return {
    rightAscension: norm2pi(Math.atan2(y, x)) as Radians,
    declination: Math.asin(z) as Radians,
    distance,
    r: [distance * x, distance * y, distance * z]
  };
};
