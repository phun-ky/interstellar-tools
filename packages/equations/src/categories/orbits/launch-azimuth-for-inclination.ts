import type { Radians } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

export interface LaunchAzimuthsInterface {
  /** Azimuth for the ascending pass: heading north, in [0, π/2] or [3π/2, 2π) */
  northbound: Radians;
  /** Azimuth for the descending pass: heading south, in [π/2, 3π/2] */
  southbound: Radians;
}

/**
 * Compute the **inertial launch azimuths** that reach an inclination from a latitude.
 *
 * $$
 * \sin\beta = \frac{\cos i}{\cos\varphi}
 * $$
 *
 * Where:
 * - $ \beta $ is the inertial azimuth, clockwise from north (rad)
 * - $ i $ is the target inclination (rad)
 * - $ \varphi $ is the geocentric launch latitude (rad)
 *
 * Two azimuths reach every reachable inclination: one heading north ($ \beta $) and one heading south ($ \pi - \beta $).
 *
 * **Units**
 * - Inputs: `lat` and `i` in **radians**.
 * - Output: both azimuths in **radians**, in [0, 2π).
 *
 * ::: info Notes
 *
 * - `lat` is the **geocentric** latitude. Published latitudes are usually geodetic, which on Earth differ by up to 0.19°, and the inclination by about as much. Convert first (see [#186](https://github.com/phun-ky/interstellar-tools/issues/186)).
 * - A site can only reach inclinations between $ |\varphi| $ and $ \pi - |\varphi| $ directly. Anything else needs a plane change, or a dogleg during ascent.
 * - The azimuths are inertial. Over the ground, the rocket flies a slightly different heading; see {@link rotatingLaunchAzimuth}.
 * - At $ i = |\varphi| $ the two solutions meet, due east (or due west for retrograde orbits).
 *
 * :::
 *
 * ::: practice To the ISS from Cape Canaveral
 *
 * **44.9°**
 *
 * _Inertial azimuth from Pad 39A, 28.447° N geocentric, to an orbit inclined 51.64°_
 *
 * Over the ground the rocket flies 42.7°, because the pad is already moving east at 409 m/s.
 *
 * ```ts
 * launchAzimuthForInclination(toRad(28.447), toRad(51.64)).northbound; // ≈ 44.9°
 * ```
 *
 * :::
 *
 * @param lat - Geocentric launch latitude $ \varphi $ in **radians** (finite, in (-π/2, π/2)).
 * @param i - Target inclination $ i $ in **radians** (finite, in [0, π]).
 * @returns The northbound and southbound inertial azimuths, in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `lat` is not in (-π/2, π/2), `i` is not in [0, π], or `i` can't be reached from `lat` (`i < |lat|` or `i > π - |lat|`).
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // A sun-synchronous orbit (97.8°) from Vandenberg (34.7° N)
 * const { southbound } = launchAzimuthForInclination(toRad(34.7), toRad(97.8));
 * // southbound ≈ 189.5°: south, slightly west
 * ```
 *
 * @see {@link inclinationFromLaunchAzimuth}
 * @see https://en.wikipedia.org/wiki/Launch_azimuth Launch azimuth
 */
export const launchAzimuthForInclination = (
  lat: Radians,
  i: Radians
): LaunchAzimuthsInterface => {
  for (const [name, v] of [
    ['lat', lat],
    ['i', i]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (Math.abs(lat) >= Math.PI / 2)
    throw new RangeError(`lat must be in (-π/2, π/2). Received: ${lat}`);

  if (i < 0 || i > Math.PI)
    throw new RangeError(`i must be in [0, π]. Received: ${i}`);

  const sinBeta = Math.cos(i) / Math.cos(lat);
  // Allow rounding at the edge, where i = |lat| exactly
  const tolerance = 1e-12;

  if (Math.abs(sinBeta) > 1 + tolerance)
    throw new RangeError(
      `i can't be reached from lat: it must be in [|lat|, π - |lat|]. Received: i=${i}, lat=${lat}`
    );

  const beta = Math.asin(Math.min(1, Math.max(-1, sinBeta)));

  return {
    northbound: norm2pi(beta) as Radians,
    southbound: norm2pi(Math.PI - beta) as Radians
  };
};
