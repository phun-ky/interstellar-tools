import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import type {
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from './coordinates.js';
import {
  assertLatitude,
  assertSphere,
  latitudeOnMap,
  mapLongitude,
  wrapLongitude
} from './shared.js';

/**
 * Options for {@link equirectangular} and {@link inverseEquirectangular}.
 *
 * @group Projections
 */
export interface EquirectangularOptionsInterface {
  /** The central meridian $ \lambda_0 $, the longitude at the map's centre line, in **radians** (finite). Defaults to 0. */
  lambda0?: Radians;
  /** Latitude of the map's origin $ \varphi_0 $, in **radians** (in [−π/2, π/2]). Defaults to 0. */
  phi0?: Radians;
  /** Standard parallel $ \varphi_1 $, where the scale is true east–west, in **radians** (in (−π/2, π/2)). Defaults to 0, the equator. */
  phi1?: Radians;
}

const assertOptions = (phi0: number, phi1: number) => {
  assertLatitude('phi0', phi0);
  assertLatitude('phi1', phi1);

  if (Math.abs(phi1) === Math.PI / 2)
    throw new RangeError(
      `phi1 must be in (-π/2, π/2): at a pole the map has no width. Received: ${phi1}`
    );
};

/**
 * Project a point on a sphere with the **equirectangular projection**: the simple cylindrical map, with latitude and longitude spaced evenly.
 *
 * $$
 * x = R\,(\lambda - \lambda_0)\cos\varphi_1,
 * \qquad
 * y = R\,(\varphi - \varphi_0)
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \lambda_0 $ is the central meridian and $ \varphi_0 $ the latitude of the origin (rad)
 * - $ \varphi_1 $ is the standard parallel, where the scale is true (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - The usual format for global mosaics and elevation models, where it's called **simple cylindrical**: a grid in degrees is a grid on the map. With $ \varphi_1 = 0 $ it's the plate carrée, twice as wide as tall.
 * - Distances are true along every meridian, and along the standard parallels $ \pm\varphi_1 $ east–west. Elsewhere east–west distances are stretched by $ \cos\varphi_1/\cos\varphi $, so it keeps neither angles nor areas.
 * - Choose $ \varphi_1 $ near the latitude of interest for a regional map: Mars mosaics of mid-latitude sites, for example.
 * - $ \lambda - \lambda_0 $ is wrapped to (−π, π].
 *   −π itself stays on the left edge, so a line that ends there, like a
 *   ground track split at the antimeridian, isn't drawn across the map.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian, `phi0`, the latitude of the origin, and `phi1`, the standard parallel (radians, all default to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` or `phi0` is outside [−π/2, π/2], `phi1` outside (−π/2, π/2), or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * // 10° N, 20° E on a 3 389.5 km Mars, true to scale at 45°
 * equirectangular(toRad(10), toRad(20), 3_389_500, { phi1: toRad(45) });
 * // ≈ { x: 837 km, y: 592 km }
 * ```
 *
 * @see {@link inverseEquirectangular}
 * @see {@link mercator}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 12
 */
export const equirectangular = (
  phi: Radians,
  lambda: Radians,
  R: number,
  {
    lambda0 = 0 as Radians,
    phi0 = 0 as Radians,
    phi1 = 0 as Radians
  }: EquirectangularOptionsInterface = {}
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);
  assertOptions(phi0, phi1);

  return {
    x: R * mapLongitude(lambda - lambda0) * Math.cos(phi1),
    y: R * (phi - phi0)
  };
};

/**
 * Find the point on a sphere for a point on an **equirectangular** map: the inverse of {@link equirectangular}.
 *
 * $$
 * \varphi = \varphi_0 + \frac{y}{R},
 * \qquad
 * \lambda = \lambda_0 + \frac{x}{R\cos\varphi_1}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, the options in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - The map ends at the poles: a `y` beyond them throws a `RangeError`.
 * - $ \lambda $ is wrapped to (−π, π]: the map repeats east–west.
 *
 * :::
 *
 * @param x - Distance east of the origin in **m** (finite).
 * @param y - Distance north of the origin in **m** (finite, on the map).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, `phi0` and `phi1`, as for {@link equirectangular}.
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `y` is beyond a pole, `phi0` is outside [−π/2, π/2], `phi1` outside (−π/2, π/2), or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseEquirectangular(836_620, 591_579, 3_389_500, { phi1: toRad(45) });
 * // ≈ { phi: 10° N, lambda: 20° E }, in radians
 * ```
 *
 * @see {@link equirectangular}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 12
 */
export const inverseEquirectangular = (
  x: number,
  y: number,
  R: number,
  {
    lambda0 = 0 as Radians,
    phi0 = 0 as Radians,
    phi1 = 0 as Radians
  }: EquirectangularOptionsInterface = {}
): GeographicCoordinatesInterface => {
  assertFinite([
    ['x', x],
    ['y', y]
  ]);
  assertSphere(R, lambda0);
  assertOptions(phi0, phi1);

  const phi = latitudeOnMap(phi0 + y / R, y);

  return {
    phi,
    lambda: wrapLongitude(lambda0 + x / (R * Math.cos(phi1)))
  };
};
