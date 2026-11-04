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

/** Solve 2θ + sin 2θ = π sin φ for θ, for φ in [0, π/2]. */
const auxiliaryAngle = (phi: number): number => {
  if (phi === Math.PI / 2) return phi;

  const target = Math.PI * Math.sin(phi);

  // 2θ + sin 2θ rises from 0 to π, flattening out at the pole, where Newton's
  // method slows down: there start from π/2 − θ ≈ (3π(1 − sin φ)/4)^(1/3),
  // with 1 − sin φ = 2 sin²((π/2 − φ)/2) to keep its digits
  let lo = 0;
  let hi = Math.PI / 2;
  let theta =
    phi < 1.4
      ? phi
      : Math.PI / 2 -
        Math.cbrt(1.5 * Math.PI * Math.sin((Math.PI / 2 - phi) / 2) ** 2);

  for (let i = 0; i < 100; i++) {
    const f = 2 * theta + Math.sin(2 * theta) - target;

    if (f === 0) return theta;

    if (f > 0) hi = theta;
    else lo = theta;

    // Newton's step, or bisection if it leaves the bracket
    let next = theta - f / (4 * Math.cos(theta) ** 2);

    if (!(next > lo && next < hi)) next = (lo + hi) / 2;

    if (Math.abs(next - theta) <= Number.EPSILON) return next;

    theta = next;
  }

  return theta;
};

/**
 * Project a point on a sphere with the **Mollweide projection**: an equal-area map of the whole sphere inside an ellipse twice as wide as tall.
 *
 * $$
 * 2\theta + \sin 2\theta = \pi\sin\varphi,
 * \qquad
 * x = \frac{2\sqrt2}{\pi}R\,(\lambda - \lambda_0)\cos\theta,
 * \qquad
 * y = \sqrt2\,R\sin\theta
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \theta $ is an auxiliary angle, found with Newton's method (rad)
 * - $ \lambda_0 $ is the central meridian (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - **Equal-area**: a region's area on the map is its area on the sphere. The whole sphere fills an ellipse $ 4\sqrt2 R $ wide and $ 2\sqrt2 R $ tall, with straight parallels and elliptical meridians, which distorts shapes less near the edges than {@link sinusoidal}. Sky surveys, such as maps of the cosmic microwave background, use it.
 * - Newton's method slows down near the poles, where $ 2\theta + \sin 2\theta $ flattens out; the solver starts closer there and falls back to bisection, so it always converges. The poles themselves are solved directly.
 * - $ \lambda - \lambda_0 $ is wrapped to (−π, π].
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
 * // The edge of the map: 180° E on the equator, and the north pole
 * mollweide(0 as Radians, Math.PI as Radians, 1); // { x: 2√2, y: 0 }
 * mollweide((Math.PI / 2) as Radians, 0 as Radians, 1); // { x: 0, y: √2 }
 * ```
 *
 * @see {@link inverseMollweide}
 * @see {@link sinusoidal}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 31
 */
export const mollweide = (
  phi: Radians,
  lambda: Radians,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);

  const theta = Math.sign(phi) * auxiliaryAngle(Math.abs(phi));

  return {
    x:
      ((2 * Math.SQRT2) / Math.PI) *
      R *
      wrapLongitude(lambda - lambda0) *
      Math.cos(theta),
    y: Math.SQRT2 * R * Math.sin(theta)
  };
};

/**
 * Find the point on a sphere for a point on a **Mollweide** map: the inverse of {@link mollweide}.
 *
 * $$
 * \theta = \arcsin\frac{y}{\sqrt2 R},
 * \qquad
 * \varphi = \arcsin\frac{2\theta + \sin 2\theta}{\pi},
 * \qquad
 * \lambda = \lambda_0 + \frac{\pi x}{2\sqrt2 R\cos\theta}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - No iteration is needed this way round. Within about $ 10^{-7} $ rad of a pole, $ \arcsin $ of a number so close to 1 limits $ \varphi $ to about $ 10^{-9} $ rad.
 * - Only points inside the ellipse have an inverse: a point outside it throws a `RangeError`.
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
 * @throws {RangeError} If the point is outside the map's ellipse, or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseMollweide(2 * Math.SQRT2, 0, 1); // { phi: 0, lambda: π }
 * ```
 *
 * @see {@link mollweide}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 31
 */
export const inverseMollweide = (
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

  const sinTheta = y / (Math.SQRT2 * R);

  // Allowing for rounding at the poles
  if (Math.abs(sinTheta) > 1 + 1e-12)
    throw new RangeError(
      `y must be on the map: it is beyond a pole. Received: ${y}`
    );

  const theta = Math.asin(Math.min(1, Math.max(-1, sinTheta)));
  const perRadian = ((2 * Math.SQRT2) / Math.PI) * R * Math.cos(theta);

  assertOnMap(x, perRadian);

  return {
    phi: Math.asin(
      Math.min(1, Math.max(-1, (2 * theta + Math.sin(2 * theta)) / Math.PI))
    ) as Radians,
    lambda: wrapLongitude(lambda0 + (x === 0 ? 0 : x / perRadian))
  };
};
