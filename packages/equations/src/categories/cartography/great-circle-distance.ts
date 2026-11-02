import type { Radians } from '@interstellar-tools/types';

import { centralAngle } from './central-angle.js';
import { assertFinite } from './validate.js';

/**
 * Compute the **great-circle distance** between two points on a sphere: the shortest path along its surface.
 *
 * $$
 * d = R\,\Delta\sigma
 * $$
 *
 * with the central angle $ \Delta\sigma $ from {@link centralAngle} (haversine).
 *
 * **Units**
 * - Inputs: latitudes and longitudes in **radians**, `R` in **m**.
 * - Output: $ d $ in **m**.
 *
 * ::: info Notes
 *
 * - On a sphere of radius $ R $, the distance is at most $ \pi R $, half the circumference.
 * - For an oblate body, the mean radius gives distances good to about 0.5%; exact ellipsoidal distances need Vincenty's or Karney's methods.
 * - Ground tracks, distances between landing sites, and how far a rover has to drive all start here.
 *
 * :::
 *
 * ::: practice Apollo 11, Tranquility Base to Apollo 12
 *
 * **1 426 km**
 *
 * _From 0.674° N, 23.473° E to 3.012° S, 23.422° W, on a 1 737.4 km Moon_
 *
 * Four months after Apollo 11, Apollo 12 landed in the Ocean of Storms, 47° of arc to the west. Apollo 17, the last landing, came down 630 km from Tranquility Base.
 *
 * ```ts
 * greatCircleDistance(toRad(0.67408), toRad(23.47297), toRad(-3.01239), toRad(-23.42157), 1_737_400);
 * // ≈ 1 425 826 m
 * ```
 *
 * :::
 *
 * @param lat1 - Latitude of the first point in **radians** (finite, in [-π/2, π/2]).
 * @param lon1 - Longitude of the first point in **radians** (finite).
 * @param lat2 - Latitude of the second point in **radians** (finite, in [-π/2, π/2]).
 * @param lon2 - Longitude of the second point in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @returns The great-circle distance $ d $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If a latitude is outside [-π/2, π/2], or `R <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // London to New York on a 6 371 km Earth
 * greatCircleDistance(toRad(51.5074), toRad(-0.1278), toRad(40.7128), toRad(-74.006), 6_371_000);
 * // ≈ 5 570 km
 * ```
 *
 * @see {@link centralAngle}
 * @see {@link centralAngleFromVectors}
 * @see https://en.wikipedia.org/wiki/Great-circle_distance Great-circle distance
 */
export const greatCircleDistance = (
  lat1: Radians,
  lon1: Radians,
  lat2: Radians,
  lon2: Radians,
  R: number
): number => {
  assertFinite([['R', R]]);

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  return R * centralAngle(lat1, lon1, lat2, lon2);
};
