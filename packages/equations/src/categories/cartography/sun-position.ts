import { AU_METERS } from '@interstellar-tools/constants';
import { julianDate } from '@interstellar-tools/temporal';
import type { Radians, SunPositionInterface } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

const DEG = Math.PI / 180;
// Julian date of J2000.0, 2000-01-01T12:00:00
const JD_J2000 = 2_451_545;

/**
 * Compute the **Sun's position** seen from Earth's centre at a moment: right
 * ascension, declination and distance, with the low-precision formulas of the
 * Astronomical Almanac.
 *
 * $$
 * \begin{aligned}
 * L &= 280.460^\circ + 0.9856474^\circ\,n \\
 * g &= 357.528^\circ + 0.9856003^\circ\,n \\
 * \lambda &= L + 1.915^\circ \sin g + 0.020^\circ \sin 2g \\
 * \varepsilon &= 23.439^\circ - 0.0000004^\circ\,n \\
 * R &= 1.00014 - 0.01671 \cos g - 0.00014 \cos 2g\ \text{au}
 * \end{aligned}
 * $$
 *
 * and then
 *
 * $$
 * \alpha = \operatorname{atan2}(\cos\varepsilon \sin\lambda, \cos\lambda), \qquad
 * \delta = \arcsin(\sin\varepsilon \sin\lambda)
 * $$
 *
 * Where:
 * - $ n $ is the number of days since J2000.0, 2000-01-01T12:00:00 (d)
 * - $ L $ is the Sun's mean longitude, corrected for aberration
 * - $ g $ is the Sun's mean anomaly
 * - $ \lambda $ is the Sun's ecliptic longitude; its ecliptic latitude is 0
 * - $ \varepsilon $ is the obliquity of the ecliptic
 * - $ R $ is the distance from Earth to the Sun
 *
 * **Units**
 * - Input: a `Date`.
 * - Output: `rightAscension` and `declination` in **radians**, `distance` in **m**, and `r` in **m**: see {@link SunPositionInterface}.
 *
 * ::: info Notes
 *
 * - **Good to about 0.01° between 1950 and 2050**, and slowly worse outside
 *   it: enough to light a hillside or to tell whether a satellite is in
 *   Earth's shadow, not enough to point a solar telescope.
 * - The position is geocentric. From Earth's surface the Sun appears up to
 *   8.8″ lower, its parallax, which is well below the formula's accuracy.
 * - The axes are the mean equator and equinox of the date, close enough to
 *   SGP4's TEME frame to compare with a satellite's position.
 *
 * :::
 *
 * @param date - The moment, as a `Date`.
 * @returns The right ascension, declination, distance and position: see {@link SunPositionInterface}.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // The June solstice of 2026: the Sun at its farthest north
 * const { declination, distance } = sunPosition(new Date('2026-06-21T08:24:00Z'));
 *
 * declination; // ≈ 0.4091 rad, 23.44°
 * distance; // ≈ 1.5203e11 m, 1.0163 au
 * ```
 *
 * @see {@link greenwichMeanSiderealTime}
 * @see https://aa.usno.navy.mil/faq/sun_approx The Astronomical Almanac's approximate solar coordinates
 */
export const sunPosition = (date: Date): SunPositionInterface => {
  const n = julianDate(date) - JD_J2000;
  const meanLongitude = (280.46 + 0.9856474 * n) * DEG;
  const g = (357.528 + 0.9856003 * n) * DEG;
  const lambda =
    meanLongitude + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG;
  const epsilon = (23.439 - 0.0000004 * n) * DEG;
  const distance =
    (1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g)) * AU_METERS;
  const x = Math.cos(lambda);
  const y = Math.cos(epsilon) * Math.sin(lambda);
  const z = Math.sin(epsilon) * Math.sin(lambda);

  return {
    rightAscension: norm2pi(Math.atan2(y, x)) as Radians,
    declination: Math.asin(z) as Radians,
    distance,
    r: [distance * x, distance * y, distance * z]
  };
};
