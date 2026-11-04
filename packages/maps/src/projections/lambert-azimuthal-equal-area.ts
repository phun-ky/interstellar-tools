import type { Radians } from '@interstellar-tools/types';

import { atAntipode, azimuthal, inverseAzimuthal } from './azimuthal.js';
import type {
  AzimuthalOptionsInterface,
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from './coordinates.js';

/**
 * Project a point on a sphere with the **Lambert azimuthal equal-area projection**: an equal-area map centred on any point, with true directions from the centre.
 *
 * $$
 * \cos c = \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0),
 * \qquad
 * k' = \sqrt{\frac{2}{1 + \cos c}}
 * $$
 *
 * $$
 * x = R\,k'\cos\varphi\sin(\lambda - \lambda_0),
 * \qquad
 * y = R\,k'\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \varphi_0 $ and $ \lambda_0 $ are the map's centre (rad)
 * - $ c $ is the point's angular distance from the centre (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - **Equal-area**: a region's area on the map is its area on the sphere. A point at angular distance $ c $ from the centre is $ 2R\sin(c/2) $ from it on the map, in its true direction, so shapes are kept near the centre and squashed towards the edge.
 * - The whole sphere fits in a circle of radius $ 2R $, and one hemisphere in a circle of radius $ \sqrt2 R $. Polar caps and the hemispheres of planets and moons are often mapped with it.
 * - The centre's antipode is the whole edge circle, so it has no single place on the map: it throws a `RangeError`, as does a point within rounding of it, about $ 10^{-15} $ rad. $ 1 + \cos c $ is computed in haversine form, so points close to the antipode keep their precision.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `phi0` and `lambda0`, the map's centre (radians, both default to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` or `phi0` is outside [−π/2, π/2], `R <= 0`, or the point is the centre's antipode.
 * @group Projections
 *
 * @example
 * ```ts
 * // The Moon's far side, centred on 0° N, 180° E: the limb, 90° from the centre, is √2 R away
 * lambertAzimuthalEqualArea(0 as Radians, toRad(90), 1_737_400, { lambda0: toRad(180) });
 * // ≈ { x: −2 457 055, y: 0 } m
 * ```
 *
 * @see {@link inverseLambertAzimuthalEqualArea}
 * @see {@link stereographic}
 * @see {@link orthographic}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 24
 */
export const lambertAzimuthalEqualArea = (
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
    (onePlusCosC) =>
      atAntipode(onePlusCosC) ? NaN : Math.sqrt(2 / onePlusCosC),
    'the antipode of the centre is the whole edge of the map'
  );

/**
 * Find the point on a sphere for a point on a **Lambert azimuthal equal-area** map: the inverse of {@link lambertAzimuthalEqualArea}.
 *
 * $$
 * \rho = \sqrt{x^2 + y^2},
 * \qquad
 * c = 2\arcsin\frac{\rho}{2R}
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
 * - Only points within $ 2R $ of the centre have an inverse: a point beyond that circle throws a `RangeError`. The circle itself is the centre's antipode.
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
 * @throws {RangeError} If the point is more than $ 2R $ from the centre, `phi0` is outside [−π/2, π/2], or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseLambertAzimuthalEqualArea(-2_457_055, 0, 1_737_400, { lambda0: toRad(180) });
 * // ≈ { phi: 0, lambda: 90° E }, in radians
 * ```
 *
 * @see {@link lambertAzimuthalEqualArea}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 24
 */
export const inverseLambertAzimuthalEqualArea = (
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
      // sin(c/2), clamped to the edge against rounding
      const s = Math.min(1, rho / 2);

      return rho / 2 > 1 + 1e-12
        ? undefined
        : { cosC: 1 - 2 * s * s, sinCPerRho: Math.sqrt(1 - s * s) };
    },
    'the whole sphere lies within 2R of the centre'
  );
