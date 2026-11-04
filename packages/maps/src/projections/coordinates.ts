import type { Radians } from '@interstellar-tools/types';

/**
 * A point on a map, in metres from the projection's origin: `x` east, `y` north.
 *
 * @group Projections
 */
export interface ProjectedPointInterface {
  /** Distance east of the origin on the map (m). */
  x: number;
  /** Distance north of the origin on the map (m). */
  y: number;
}

/**
 * A point on a sphere: latitude and longitude.
 *
 * @group Projections
 */
export interface GeographicCoordinatesInterface {
  /** Latitude in radians, in [-π/2, π/2]. */
  phi: Radians;
  /** Longitude in radians, east positive, in (-π, π]. */
  lambda: Radians;
}

/**
 * Where a map is centred east–west, for the projections.
 *
 * @group Projections
 */
export interface ProjectionOptionsInterface {
  /** The central meridian $ \lambda_0 $, the longitude at the map's centre line, in **radians** (finite). Defaults to 0. */
  lambda0?: Radians;
}

/**
 * Where an azimuthal map is centred, for {@link lambertAzimuthalEqualArea}, {@link stereographic} and {@link orthographic}.
 *
 * @group Projections
 */
export interface AzimuthalOptionsInterface {
  /** Longitude of the map's centre $ \lambda_0 $, in **radians** (finite). Defaults to 0. */
  lambda0?: Radians;
  /** Latitude of the map's centre $ \varphi_0 $, in **radians** (in [−π/2, π/2]). Defaults to 0, the equator; ±π/2 gives a polar map. */
  phi0?: Radians;
}
