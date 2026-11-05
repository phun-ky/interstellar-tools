import type { DistanceInterface } from './distance.js';
import type { Vector3DTupleType } from './math.js';
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

/**
 * The **Sun's position** seen from Earth's centre at a moment: its direction
 * on the sky and its distance.
 *
 * Returned by `sunPosition` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - Geocentric and equatorial, referred to the mean equator and equinox of
 *   the date. That is close enough to TEME, the frame SGP4 works in, to test
 *   a satellite for Earth's shadow.
 * - `declination` is about +23.44° at the June solstice, -23.44° at the
 *   December solstice and 0 at the equinoxes.
 *
 * :::
 *
 * @example
 * ```ts
 * // The June solstice: the Sun is at its farthest north
 * const sun: SunPositionInterface = {
 *   rightAscension: 1.5708 as Radians,
 *   declination: 0.4091 as Radians,
 *   distance: 1.5203e11,
 *   r: [0, 1.3947e11, 6.047e10]
 * };
 * ```
 * @group Cartography
 */
export interface SunPositionInterface {
  /** Right ascension $\alpha$ in radians, eastward from the vernal equinox, in [0, 2π). */
  rightAscension: Radians;
  /** Declination $\delta$ in radians, north of the celestial equator, in [-π/2, π/2]. */
  declination: Radians;
  /** Distance from Earth's centre in m. */
  distance: number;
  /** Position in m, from Earth's centre: x toward the vernal equinox, z toward the north celestial pole. */
  r: Vector3DTupleType;
}

/**
 * The **Moon's position** seen from Earth's centre at a moment: its direction
 * on the sky and its distance.
 *
 * Returned by `moonPosition` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - Geocentric and equatorial, referred to the mean equator and equinox of
 *   the date, like {@link SunPositionInterface}: close enough to TEME, the
 *   frame SGP4 works in, for the Moon's pull on a satellite.
 * - `declination` swings between about ±18° and ±29° over an 18.6-year cycle,
 *   as the Moon's orbit, tilted 5.1° to the ecliptic, turns.
 * - `distance` ranges from about 356 000 km at perigee to 407 000 km at
 *   apogee.
 *
 * :::
 *
 * @example
 * ```ts
 * // The Moon at its mean distance, 45° east of the equinox and 25° north
 * const moon: MoonPositionInterface = {
 *   rightAscension: 0.7854 as Radians,
 *   declination: 0.4363 as Radians,
 *   distance: 3.844e8,
 *   r: [2.4635e8, 2.4635e8, 1.6244e8]
 * };
 * ```
 * @group Cartography
 */
export interface MoonPositionInterface {
  /** Right ascension $\alpha$ in radians, eastward from the vernal equinox, in [0, 2π). */
  rightAscension: Radians;
  /** Declination $\delta$ in radians, north of the celestial equator, in [-π/2, π/2]. */
  declination: Radians;
  /** Distance from Earth's centre in m. */
  distance: number;
  /** Position in m, from Earth's centre: x toward the vernal equinox, z toward the north celestial pole. */
  r: Vector3DTupleType;
}
