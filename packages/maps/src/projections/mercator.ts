import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import type {
  GeographicCoordinatesInterface,
  ProjectedPointInterface,
  ProjectionOptionsInterface
} from './coordinates.js';
import { assertLatitude, assertSphere, wrapLongitude } from './shared.js';

/**
 * Project a point on a sphere with the **Mercator projection**: the conformal cylindrical map, which keeps angles and shapes locally true.
 *
 * $$
 * x = R\,(\lambda - \lambda_0),
 * \qquad
 * y = R\ln\tan\!\left(\frac{\pi}{4} + \frac{\varphi}{2}\right)
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \lambda_0 $ is the central meridian (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**, with $ x $ in (−πR, πR].
 *
 * ::: info Notes
 *
 * - The scale is $ \sec\varphi $ in every direction: true on the equator, twice as large at 60°, and without bound towards the poles. That's why Greenland looks as large as Africa. Angles stay true, so a line of constant compass bearing (a rhumb line) is straight.
 * - $ y $ grows without bound towards the poles, so the poles themselves throw a `RangeError`. Maps clip the latitude: web maps (see {@link inverseMercator}) stop at $ \arctan\sinh\pi \approx 85.0511° $, where the map is as tall as it is wide.
 * - $ \lambda - \lambda_0 $ is wrapped to (−π, π], so the map is centred on the central meridian.
 * - A sphere only: on an oblate body this is the spherical Mercator web maps use, not the ellipsoidal one.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in (−π/2, π/2)).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` is not in (−π/2, π/2), or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * // The edge of a web map: 180° E, 85.0511° N on a 6 378 137 m sphere
 * mercator(toRad(85.05112878), toRad(180), 6_378_137);
 * // ≈ { x: 20 037 508, y: 20 037 508 } m
 * ```
 *
 * @see {@link inverseMercator}
 * @see {@link equirectangular}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 7
 */
export const mercator = (
  phi: Radians,
  lambda: Radians,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);

  if (Math.abs(phi) === Math.PI / 2)
    throw new RangeError(
      `phi must be in (-π/2, π/2): the poles are infinitely far away on a Mercator map. Received: ${phi}`
    );

  // ln tan(π/4 + φ/2) = asinh(tan φ), which keeps its digits near the equator
  return {
    x: R * wrapLongitude(lambda - lambda0),
    y: R * Math.asinh(Math.tan(phi))
  };
};

/**
 * Find the point on a sphere for a point on a **Mercator** map: the inverse of {@link mercator}.
 *
 * $$
 * \varphi = \arctan\sinh\frac{y}{R},
 * \qquad
 * \lambda = \lambda_0 + \frac{x}{R}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - Every $ y $ has a latitude, so the whole map inverts; the poles are never reached.
 * - $ \lambda $ is wrapped to (−π, π]: the map repeats every $ 2\pi R $ east–west.
 * - A square map, $ 2\pi R $ on each side, reaches $ \arctan\sinh\pi \approx 85.0511° $ north and south: the limit of web map tiles.
 *
 * :::
 *
 * @param x - Distance east of the origin in **m** (finite).
 * @param y - Distance north of the origin in **m** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * // The top of a square web map
 * inverseMercator(0, Math.PI * 6_378_137, 6_378_137).phi; // ≈ 1.4844 rad, 85.0511°
 * ```
 *
 * @see {@link mercator}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 7
 */
export const inverseMercator = (
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

  return {
    phi: Math.atan(Math.sinh(y / R)) as Radians,
    lambda: wrapLongitude(lambda0 + x / R)
  };
};
