import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';

import { cross, dot, norm } from '../helpers/misc.js';

/**
 * Compute the **central angle** between two position vectors, without trigonometry on latitude and longitude.
 *
 * $$
 * \Delta\sigma = \operatorname{atan2}\big(\lVert\mathbf r_1 \times \mathbf r_2\rVert,\ \mathbf r_1 \cdot \mathbf r_2\big)
 * $$
 *
 * Where:
 * - $ \mathbf r_1 $, $ \mathbf r_2 $ are the two positions, from the body's centre
 *
 * **Units**
 * - Inputs: `r1`, `r2` in any length unit, the same for both.
 * - Output: $ \Delta\sigma $ in **radians**, in [0, π].
 *
 * ::: info Notes
 *
 * - The `atan2` form is accurate at every angle, unlike $ \arccos $ of the normalised dot product, which loses precision near 0 and π.
 * - The vectors' lengths don't matter, only their directions: the angle between a ground station and a satellite above another point is the angle between the points below them.
 * - Works with body-fixed positions from {@link geodeticToBodyFixed}, giving the angle at the centre, not along the ellipsoid.
 *
 * :::
 *
 * @param r1 - First position vector (finite components, not zero).
 * @param r2 - Second position vector (finite components, not zero).
 * @returns The central angle $ \Delta\sigma $ in **radians**.
 * @throws {TypeError} If a component is not a finite number.
 * @throws {RangeError} If either vector is zero.
 * @group Cartography
 *
 * @example
 * ```ts
 * // The x and y axes are a quarter turn apart
 * centralAngleFromVectors([1, 0, 0], [0, 5, 0]); // π/2
 * ```
 *
 * @see {@link centralAngle}
 * @see {@link greatCircleDistance}
 */
export const centralAngleFromVectors = (
  r1: Vector3DTupleType,
  r2: Vector3DTupleType
): Radians => {
  for (const [name, v] of [
    ['r1', r1],
    ['r2', r2]
  ] as const) {
    for (const x of v)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );

    if (norm(v) === 0)
      throw new RangeError(`${name} must not be the zero vector.`);
  }

  return Math.atan2(norm(cross(r1, r2)), dot(r1, r2)) as Radians;
};
