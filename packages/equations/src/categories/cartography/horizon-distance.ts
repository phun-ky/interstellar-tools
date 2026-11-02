import { assertFinite } from './validate.js';

/**
 * Compute the straight-line **distance to the horizon** for an observer at a height above a sphere.
 *
 * $$
 * d = \sqrt{2Rh + h^2}
 * $$
 *
 * Where:
 * - $ R $ is the sphere's radius (m)
 * - $ h $ is the observer's height above the surface (m)
 *
 * **Units**
 * - Inputs: `h` and `R` in **m**.
 * - Output: $ d $ in **m**, along the line of sight to the tangent point.
 *
 * ::: info Notes
 *
 * - For $ h \ll R $, $ d \approx \sqrt{2Rh} $: four times the height, twice the distance.
 * - A smooth sphere with no atmosphere. On Earth, refraction bends light over the horizon and adds about 8% at sea level; terrain and buildings take it away again.
 * - The distance over the ground to the same point is {@link horizonSurfaceDistance}, a little shorter.
 * - The same tangent point limits what a satellite can see: its footprint is the circle of points within this distance.
 *
 * :::
 *
 * ::: practice Apollo 11, starting the powered descent
 *
 * **224.5 km**
 *
 * _From 14.4 km above a 1 737.4 km Moon, the low point of Eagle's descent orbit_
 *
 * When Armstrong and Aldrin lit the descent engine, the horizon was 224.5 km ahead. Standing on the surface, with their eyes about 1.8 m up, they could see only 2.5 km; on Earth it would be 4.8 km.
 *
 * ```ts
 * horizonDistance(7.8 * 1852, 1_737_400); // ≈ 224 509 m
 * ```
 *
 * :::
 *
 * @param h - Height $ h $ above the surface in **m** (finite, >= 0).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @returns The straight-line distance to the horizon $ d $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `h < 0` or `R <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // A rover's mast camera, 2 m above Mars
 * horizonDistance(2, 3_389_500); // ≈ 3 682 m
 * ```
 *
 * @see {@link horizonSurfaceDistance}
 * @see https://en.wikipedia.org/wiki/Horizon#Distance_to_the_horizon Distance to the horizon
 */
export const horizonDistance = (h: number, R: number): number => {
  assertFinite([
    ['h', h],
    ['R', R]
  ]);

  if (h < 0) throw new RangeError(`h must be >= 0. Received: ${h}`);

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  return Math.sqrt(2 * R * h + h * h);
};
