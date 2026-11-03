import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import type {
  GeographicCoordinatesInterface,
  ProjectedPointInterface,
  ProjectionOptionsInterface
} from './coordinates.js';
import {
  assertLatitude,
  assertOnMap,
  assertSphere,
  wrapLongitude
} from './shared.js';

/**
 * Project a point on a sphere with the **sinusoidal projection**: an equal-area map, with every parallel at its true length.
 *
 * $$
 * x = R\,(\lambda - \lambda_0)\cos\varphi,
 * \qquad
 * y = R\,\varphi
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \lambda_0 $ is the central meridian (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - **Equal-area**: a region's area on the map is its area on the sphere, so it suits geology, coverage and density maps. Shapes shear away from the central meridian and the equator.
 * - Every parallel is drawn at its true length, and so is the central meridian. The other meridians are sine curves, which meet at the poles: the map is $ 2\pi R $ wide and $ \pi R $ tall.
 * - Global planetary mosaics often use it, for example of Mars and the Moon.
 * - $ \lambda - \lambda_0 $ is wrapped to (−π, π], so the map is centred on the central meridian.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` is outside [−π/2, π/2], or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * // 60° N, 90° E on a 1 737.4 km Moon: the parallel is half as long as the equator
 * sinusoidal(toRad(60), toRad(90), 1_737_400);
 * // ≈ { x: 1 364 551, y: 1 819 401 } m
 * ```
 *
 * @see {@link inverseSinusoidal}
 * @see {@link mollweide}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 30
 */
export const sinusoidal = (
  phi: Radians,
  lambda: Radians,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);

  return {
    x: R * wrapLongitude(lambda - lambda0) * Math.cos(phi),
    y: R * phi
  };
};

/**
 * Find the point on a sphere for a point on a **sinusoidal** map: the inverse of {@link sinusoidal}.
 *
 * $$
 * \varphi = \frac{y}{R},
 * \qquad
 * \lambda = \lambda_0 + \frac{x}{R\cos\varphi}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - Only points on the map have an inverse: a `y` beyond a pole, or an `x` beyond the edge meridians, $ |x| > \pi R\cos\varphi $, throws a `RangeError`.
 * - Every longitude meets at a pole, so there $ \lambda $ is $ \lambda_0 $.
 *
 * :::
 *
 * @param x - Distance east of the origin in **m** (finite, on the map).
 * @param y - Distance north of the origin in **m** (finite, on the map).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If the point is off the map, or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseSinusoidal(1_364_551, 1_819_401, 1_737_400);
 * // ≈ { phi: 60° N, lambda: 90° E }, in radians
 * ```
 *
 * @see {@link sinusoidal}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 30
 */
export const inverseSinusoidal = (
  x: number,
  y: number,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): GeographicCoordinatesInterface => {
  assertFinite([
    ['x', x],
    ['y', y]
  ]);
  assertSphere(R, lambda0);

  const phi = y / R;

  if (Math.abs(phi) > Math.PI / 2)
    throw new RangeError(
      `y must be on the map: it gives a latitude beyond a pole. Received: ${y}`
    );

  const width = R * Math.cos(phi);

  assertOnMap(x, width);

  return {
    phi: phi as Radians,
    lambda: wrapLongitude(lambda0 + (x === 0 ? 0 : x / width))
  };
};
