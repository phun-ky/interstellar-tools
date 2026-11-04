import type { Radians } from '@interstellar-tools/types';

import { atAntipode, azimuthal, inverseAzimuthal } from './azimuthal.js';
import type {
  AzimuthalOptionsInterface,
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from './coordinates.js';

/**
 * Project a point on a sphere with the **stereographic projection**: a conformal map centred on any point, the usual choice for polar maps.
 *
 * $$
 * \cos c = \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0),
 * \qquad
 * k = \frac{2}{1 + \cos c}
 * $$
 *
 * $$
 * x = R\,k\cos\varphi\sin(\lambda - \lambda_0),
 * \qquad
 * y = R\,k\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \varphi_0 $ and $ \lambda_0 $ are the map's centre (rad)
 * - $ c $ is the point's angular distance from the centre (rad)
 * - $ k $ is the map's scale at the point, the same in every direction
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - **Conformal**: angles and small shapes are kept, and every circle on the sphere is a circle (or a line) on the map. The scale is true at the centre and grows to $ k $ away from it: a point at angular distance $ c $ is $ 2R\tan(c/2) $ from the centre, in its true direction.
 * - With $ \varphi_0 = \pm\pi/2 $ it's the **polar stereographic** projection, used for polar caps, such as those of Mars, and for sea ice on Earth.
 * - The whole sphere maps to the infinite plane except the centre's antipode, which is infinitely far away: it throws a `RangeError`, as does a point within rounding of it, about $ 10^{-15} $ rad.
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
 * // Mars's south polar cap: 80° S, 45° E, on a map centred on the south pole
 * stereographic(toRad(-80), toRad(45), 3_389_500, { phi0: toRad(-90) });
 * // ≈ { x: 419 375, y: 419 375 } m, 593 086 m from the pole
 * ```
 *
 * @see {@link inverseStereographic}
 * @see {@link lambertAzimuthalEqualArea}
 * @see {@link orthographic}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 21
 */
export const stereographic = (
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
    (onePlusCosC) => (atAntipode(onePlusCosC) ? NaN : 2 / onePlusCosC),
    'the antipode of the centre is infinitely far away'
  );

/**
 * Find the point on a sphere for a point on a **stereographic** map: the inverse of {@link stereographic}.
 *
 * $$
 * \rho = \sqrt{x^2 + y^2},
 * \qquad
 * c = 2\arctan\frac{\rho}{2R}
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
 * - Every point on the plane has an inverse; the farther from the centre, the closer it is to the centre's antipode.
 * - $ \varphi $ and $ \lambda $ are found with `atan2`, which keeps full precision near the poles, and the arctangent takes the quadrant into account. At a pole, any $ \lambda $ is the same point.
 *
 * :::
 *
 * @param x - Distance east of the centre in **m** (finite).
 * @param y - Distance north of the centre in **m** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `phi0` and `lambda0`, the map's centre (radians, both default to 0).
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi0` is outside [−π/2, π/2], or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseStereographic(419_375, 419_375, 3_389_500, { phi0: toRad(-90) });
 * // ≈ { phi: 80° S, lambda: 45° E }, in radians
 * ```
 *
 * @see {@link stereographic}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 21
 */
export const inverseStereographic = (
  x: number,
  y: number,
  R: number,
  options: AzimuthalOptionsInterface = {}
): GeographicCoordinatesInterface =>
  inverseAzimuthal(x, y, R, options, (rho) => {
    // tan(c/2); written so that a far point tends to the antipode
    const t2 = (rho / 2) ** 2;

    return { cosC: 2 / (1 + t2) - 1, sinCPerRho: 1 / (1 + t2) };
  });
