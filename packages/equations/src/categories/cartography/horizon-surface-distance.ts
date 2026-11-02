import { horizonDistance } from './horizon-distance.js';

/**
 * Compute the **distance along the surface to the horizon** for an observer at a height above a sphere.
 *
 * $$
 * s = R \arccos\frac{R}{R + h} = R \operatorname{atan2}\!\left(\sqrt{2Rh + h^2},\ R\right)
 * $$
 *
 * Where:
 * - $ R $ is the sphere's radius (m)
 * - $ h $ is the observer's height above the surface (m)
 *
 * **Units**
 * - Inputs: `h` and `R` in **m**.
 * - Output: $ s $ in **m**, along the surface from the point below the observer to the horizon.
 *
 * ::: info Notes
 *
 * - Computed with `atan2`, which stays accurate for small heights where $ \arccos $ of a number close to 1 loses most of its digits.
 * - Slightly shorter than the line of sight {@link horizonDistance}; the two agree for $ h \ll R $ and part ways from orbit.
 * - $ s/R $ is the central angle from the observer to the horizon: the radius of what a satellite can see, as an angle.
 *
 * :::
 *
 * @param h - Height $ h $ above the surface in **m** (finite, >= 0).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @returns The distance along the surface to the horizon $ s $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `h < 0` or `R <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // The ISS, 420 km above a 6 371 km Earth
 * horizonSurfaceDistance(420_000, 6_371_000); // ≈ 2 252 km, against 2 351 km in a straight line
 * ```
 *
 * @see {@link horizonDistance}
 * @see {@link greatCircleDistance}
 */
export const horizonSurfaceDistance = (h: number, R: number): number =>
  R * Math.atan2(horizonDistance(h, R), R);
