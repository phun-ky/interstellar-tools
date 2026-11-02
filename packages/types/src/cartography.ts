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
