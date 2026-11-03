import type { DistanceInterface } from './distance.js';
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
 * A body's **reference ellipsoid**: the smooth surface that latitudes,
 * longitudes and heights are measured on.
 *
 * Most planets and large moons are close to an oblate spheroid, flattened at
 * the poles: `equatorialRadius` and `polarRadius` describe it. A few moons are
 * stretched towards their planet too, a triaxial ellipsoid: `equatorialRadius`
 * is then the radius towards the planet, and `alongOrbitRadius` the equatorial
 * radius along the orbit.
 *
 * ::: info
 *
 * - For the giant planets, the radii are at the 1-bar pressure level.
 * - Get the flattening and eccentricity from the radii with
 *   `flatteningOblateSpheroid` and `eccentricitySquaredOblateSpheroid` in
 *   `@interstellar-tools/equations`.
 *
 * :::
 *
 * @example
 * ```ts
 * const mars: EllipsoidInterface = {
 *   equatorialRadius: { value: 3396.19, unit: 'km' },
 *   polarRadius: { value: 3376.2, unit: 'km' }
 * };
 * ```
 * @group Cartography
 */
export interface EllipsoidInterface {
  /** Equatorial radius $a$; towards the planet, for a triaxial moon. */
  equatorialRadius: DistanceInterface;
  /** Polar radius $c$, along the rotation axis. */
  polarRadius: DistanceInterface;
  /** Equatorial radius $b$ along the orbit, for a triaxial moon. Omitted when equal to `equatorialRadius`. */
  alongOrbitRadius?: DistanceInterface;
}
