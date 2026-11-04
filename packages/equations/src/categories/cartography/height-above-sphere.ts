import type { Vector3DTupleType } from '@interstellar-tools/types';

import { norm } from '../helpers/misc.js';

import { assertFinite } from './validate.js';

/**
 * Compute a point's **height above a spherical body**: its distance from the centre less the radius.
 *
 * $$
 * h = \lVert\mathbf r\rVert - R
 * $$
 *
 * Where:
 * - $ \mathbf r $ is the point's position from the body's centre (m)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: `r` and `R` in **m**.
 * - Output: $ h $ in **m**, negative below the surface.
 *
 * ::: info Notes
 *
 * - The quick altitude readout for a position vector, in any frame centred on the body: the frame's orientation doesn't matter.
 * - On an oblate body the sphere is only an approximation. On Earth, a sphere of the equatorial radius puts the poles **21.4 km** too low, since the polar radius is that much shorter; the mean radius, 6 371 km, is 7.1 km off at the equator and 14.2 km at the poles. Use {@link heightAboveEllipsoid} for the height a map or GPS receiver gives.
 *
 * :::
 *
 * ::: practice Apollo 11, in Earth orbit
 *
 * **184.9 km up, on a sphere**
 *
 * _At orbit insertion: 6 563.0 km from Earth's centre, at 32.502° N_
 *
 * Above a sphere of Earth's equatorial radius, 6 378.137 km. The WGS84 ellipsoid is lower at that latitude, so {@link heightAboveEllipsoid} gives 191.1 km.
 *
 * ```ts
 * const lat = toRad(32.502);
 * const r = 6_563_041;
 * heightAboveSphere([r * Math.cos(lat), 0, r * Math.sin(lat)], 6_378_137);
 * // ≈ 184 904 m
 * ```
 *
 * :::
 *
 * @param r - Position $ \mathbf r $ from the body's centre in **m** (finite components).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @returns The height $ h $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `R <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * // 400 km above the Moon's north pole, on a 1 737.4 km sphere
 * heightAboveSphere([0, 0, 2_137_400], 1_737_400); // 400 000 m
 * ```
 *
 * @see {@link heightAboveEllipsoid}
 * @see {@link horizonDistance}
 */
export const heightAboveSphere = (r: Vector3DTupleType, R: number): number => {
  for (const x of r)
    if (!Number.isFinite(x))
      throw new TypeError(`r must have finite components. Received: ${x}`);

  assertFinite([['R', R]]);

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  return norm(r) - R;
};
