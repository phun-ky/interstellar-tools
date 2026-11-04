import type { Radians } from '@interstellar-tools/types';

import { azimuthal, inverseAzimuthal } from './azimuthal.js';
import type {
  AzimuthalOptionsInterface,
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from './coordinates.js';

/**
 * Project a point on a sphere with the **orthographic projection**: the globe as it looks from infinitely far away, above the map's centre.
 *
 * $$
 * x = R\cos\varphi\sin(\lambda - \lambda_0),
 * \qquad
 * y = R\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \varphi_0 $ and $ \lambda_0 $ are the map's centre (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - The near hemisphere fills a disc of radius $ R $: a point at angular distance $ c $ from the centre is $ R\sin c $ from it, in its true direction. It keeps neither areas nor angles; shapes are squashed towards the edge, as on a photograph of a planet.
 * - Only the near hemisphere can be shown. A point on the far side, with
 *   $ \cos c = \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0) < 0 $,
 *   throws a `RangeError`; to draw a globe, skip the points where $ \cos c $ is negative. Points on the horizon, $ \cos c = 0 $, are shown, allowing for rounding.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `phi0` and `lambda0`, the map's centre (radians, both default to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` or `phi0` is outside [−π/2, π/2], `R <= 0`, or the point is on the far side.
 * @group Projections
 *
 * @example
 * ```ts
 * // Mars seen from far above 0° N, 0° E: a point at 30° N, 60° E
 * orthographic(toRad(30), toRad(60), 3_389_500);
 * // ≈ { x: 2 542 125, y: 1 694 750 } m
 * ```
 *
 * @see {@link inverseOrthographic}
 * @see {@link lambertAzimuthalEqualArea}
 * @see {@link stereographic}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 20
 */
export const orthographic = (
  phi: Radians,
  lambda: Radians,
  R: number,
  options: AzimuthalOptionsInterface = {}
): ProjectedPointInterface =>
  azimuthal(
    phi,
    lambda,
    R,
    options,
    (onePlusCosC) => (onePlusCosC >= 1 - 1e-12 ? 1 : NaN),
    'the far side of the globe is hidden'
  );

/**
 * Find the point on a sphere for a point on an **orthographic** map: the inverse of {@link orthographic}.
 *
 * $$
 * \rho = \sqrt{x^2 + y^2},
 * \qquad
 * c = \arcsin\frac{\rho}{R}
 * $$
 *
 * $$
 * \varphi = \arcsin\!\Big(\cos c\sin\varphi_0 + \frac{y\sin c\cos\varphi_0}{\rho}\Big),
 * \qquad
 * \lambda = \lambda_0 + \arctan\frac{x\sin c}{\rho\cos\varphi_0\cos c - y\sin\varphi_0\sin c}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, `phi0` and `lambda0` in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - Only points within $ R $ of the centre, on the globe's disc, have an inverse: a point beyond it throws a `RangeError`. The answer is always on the near hemisphere.
 * - Near the edge of the disc, where the globe is seen edge-on, a small step on the map is a long way on the sphere, so the inverse loses precision there.
 * - $ \varphi $ and $ \lambda $ are found with `atan2`, which keeps full precision near the poles, and the arctangent takes the quadrant into account. At a pole, any $ \lambda $ is the same point.
 *
 * :::
 *
 * @param x - Distance east of the centre in **m** (finite, on the map).
 * @param y - Distance north of the centre in **m** (finite, on the map).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `phi0` and `lambda0`, the map's centre (radians, both default to 0).
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If the point is more than $ R $ from the centre, `phi0` is outside [−π/2, π/2], or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseOrthographic(2_542_125, 1_694_750, 3_389_500);
 * // ≈ { phi: 30° N, lambda: 60° E }, in radians
 * ```
 *
 * @see {@link orthographic}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 20
 */
export const inverseOrthographic = (
  x: number,
  y: number,
  R: number,
  options: AzimuthalOptionsInterface = {}
): GeographicCoordinatesInterface =>
  inverseAzimuthal(
    x,
    y,
    R,
    options,
    (rho) => {
      // sin c, clamped to the edge against rounding
      const s = Math.min(1, rho);

      return rho > 1 + 1e-12
        ? undefined
        : { cosC: Math.sqrt((1 - s) * (1 + s)), sinCPerRho: 1 };
    },
    'the disc of the globe lies within R of the centre'
  );
