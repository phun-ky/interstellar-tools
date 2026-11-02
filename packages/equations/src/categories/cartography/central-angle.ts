import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertLatitude } from './validate.js';

/**
 * Compute the **central angle** between two points on a sphere from their latitudes and longitudes, with the haversine formula.
 *
 * $$
 * h = \sin^2\frac{\Delta\varphi}{2} + \cos\varphi_1\cos\varphi_2\sin^2\frac{\Delta\lambda}{2},
 * \qquad
 * \Delta\sigma = 2\arcsin\sqrt{h}
 * $$
 *
 * Where:
 * - $ \varphi_1 $, $ \varphi_2 $ are the latitudes and $ \Delta\varphi $, $ \Delta\lambda $ the differences in latitude and longitude (rad)
 * - $ \Delta\sigma $ is the angle between the two points, seen from the centre (rad)
 *
 * **Units**
 * - Inputs: latitudes and longitudes in **radians**.
 * - Output: $ \Delta\sigma $ in **radians**, in [0, π].
 *
 * ::: info Notes
 *
 * - The haversine form stays accurate for points close together, where the spherical law of cosines loses precision. $ h $ is clamped to 1 so rounding can't break antipodal points.
 * - On an oblate body, use geocentric latitudes for the angle between the position vectors, or accept an error of up to about 0.5% on Earth with geodetic ones. For exact distances on an ellipsoid, Vincenty's or Karney's methods are needed.
 * - Multiply by a radius for the distance: {@link greatCircleDistance}. From position vectors, use {@link centralAngleFromVectors}.
 *
 * :::
 *
 * @param lat1 - Latitude of the first point in **radians** (finite, in [-π/2, π/2]).
 * @param lon1 - Longitude of the first point in **radians** (finite).
 * @param lat2 - Latitude of the second point in **radians** (finite, in [-π/2, π/2]).
 * @param lon2 - Longitude of the second point in **radians** (finite).
 * @returns The central angle $ \Delta\sigma $ in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If a latitude is outside [-π/2, π/2].
 * @group Cartography
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A quarter of the equator
 * centralAngle(0 as Radians, 0 as Radians, 0 as Radians, (Math.PI / 2) as Radians); // π/2
 * ```
 *
 * @see {@link greatCircleDistance}
 * @see {@link centralAngleFromVectors}
 * @see https://en.wikipedia.org/wiki/Haversine_formula Haversine formula
 */
export const centralAngle = (
  lat1: Radians,
  lon1: Radians,
  lat2: Radians,
  lon2: Radians
): Radians => {
  assertFinite([
    ['lat1', lat1],
    ['lon1', lon1],
    ['lat2', lat2],
    ['lon2', lon2]
  ]);
  assertLatitude('lat1', lat1);
  assertLatitude('lat2', lat2);

  const dLat = Math.sin((lat2 - lat1) / 2);
  const dLon = Math.sin((lon2 - lon1) / 2);
  const h = dLat * dLat + Math.cos(lat1) * Math.cos(lat2) * dLon * dLon;

  return (2 * Math.asin(Math.sqrt(Math.min(1, h)))) as Radians;
};
