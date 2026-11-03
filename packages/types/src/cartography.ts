import type { Radians } from './numeric.js';

/**
 * A point's **geodetic coordinates** on an oblate body: latitude, longitude
 * and height above the reference ellipsoid, in SI units and radians.
 *
 * Returned by `bodyFixedToGeodetic` and taken (as separate arguments) by
 * `geodeticToBodyFixed` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - `phi` is the **geodetic** latitude: the angle between the equator and the
 *   normal to the ellipsoid, the latitude on maps and GPS receivers. It isn't
 *   the geocentric latitude, the angle seen from the body's centre.
 * - `h` is measured along that normal, and is negative below the ellipsoid.
 *
 * :::
 *
 * @example
 * ```ts
 * // Launch Complex 39A, Kennedy Space Center
 * const pad: GeodeticCoordinatesInterface = {
 *   phi: 0.49931 as Radians,
 *   lambda: -1.40681 as Radians,
 *   h: 0
 * };
 * ```
 * @group Cartography
 */
export interface GeodeticCoordinatesInterface {
  /** Geodetic latitude in radians, in [-π/2, π/2]. */
  phi: Radians;
  /** Longitude in radians, east positive, in (-π, π]. */
  lambda: Radians;
  /** Height above the ellipsoid in metres, along its normal. */
  h: number;
}

/**
 * The **illumination angles** at a point on a surface: where the light comes
 * from and where it's seen from, relative to the surface and each other.
 *
 * Returned by `illuminationAngles` in `@interstellar-tools/maps`.
 *
 * ::: info
 *
 * - `incidence` is 0 with the Sun straight overhead and π/2 at sunrise or
 *   sunset; past π/2 the point is in its own shadow.
 * - `emission` is 0 looking straight down, π/2 at the observer's horizon.
 * - `phase` is 0 with the Sun directly behind the observer, where the
 *   surface looks brightest and shadows vanish.
 *
 * :::
 *
 * @example
 * ```ts
 * // Sun 30° from overhead, seen from straight above
 * const angles: IlluminationAnglesInterface = {
 *   incidence: (Math.PI / 6) as Radians,
 *   emission: 0 as Radians,
 *   phase: (Math.PI / 6) as Radians
 * };
 * ```
 * @group Cartography
 */
export interface IlluminationAnglesInterface {
  /** Incidence angle $i$, between the surface normal and the direction to the Sun, in radians. */
  incidence: Radians;
  /** Emission angle $e$, between the surface normal and the direction to the observer, in radians. */
  emission: Radians;
  /** Phase angle $g$, between the directions to the Sun and to the observer, in radians. */
  phase: Radians;
}
