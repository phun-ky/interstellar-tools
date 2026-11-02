import type { Radians } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

/**
 * Compute the **azimuth over the ground** for an inertial launch azimuth, on a rotating body.
 *
 * $$
 * \tan\beta_\text{rot} = \frac{v \sin\beta - v_\text{rot}}{v \cos\beta}
 * $$
 *
 * Where:
 * - $ \beta $ is the inertial azimuth, clockwise from north (rad)
 * - $ v $ is the inertial speed to reach, e.g. the orbital speed at insertion (m/s)
 * - $ v_\text{rot} $ is the pad's eastward speed from the body's rotation (m/s)
 *
 * **Units**
 * - Inputs: `azimuth` in **radians**, `v` and `vRot` in **m/s**.
 * - Output: $ \beta_\text{rot} $ in **radians**, in [0, 2π).
 *
 * ::: info Notes
 *
 * - The pad is already moving east, so the rocket only has to add the difference: it steers a little further from east than the inertial azimuth.
 * - Get $ v_\text{rot} $ from {@link surfaceRotationSpeed} and $ \beta $ from {@link launchAzimuthForInclination}.
 * - Uses a flat, local approximation: good for the azimuth at launch, not for the whole ascent.
 *
 * :::
 *
 * @param azimuth - Inertial azimuth $ \beta $ in **radians**, clockwise from north (finite).
 * @param v - Inertial speed $ v $ in **m/s** (finite, > 0).
 * @param vRot - Eastward surface speed $ v_\text{rot} $ in **m/s** (finite).
 * @returns Azimuth over the ground $ \beta_\text{rot} $ in **radians**, in [0, 2π).
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `v <= 0`, or the speed over the ground is zero (the target velocity equals the pad's).
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // Due north inertially at 7.8 km/s, from a pad moving east at 409 m/s
 * const beta = rotatingLaunchAzimuth(toRad(0), 7800, 409);
 * // beta ≈ 357.0°: aim slightly west of north to cancel the pad's eastward speed
 * ```
 *
 * @see {@link launchAzimuthForInclination}
 * @see {@link surfaceRotationSpeed}
 */
export const rotatingLaunchAzimuth = (
  azimuth: Radians,
  v: number,
  vRot: number
): Radians => {
  for (const [name, x] of [
    ['azimuth', azimuth],
    ['v', v],
    ['vRot', vRot]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (v <= 0) throw new RangeError(`v must be > 0. Received: ${v}`);

  const east = v * Math.sin(azimuth) - vRot;
  const north = v * Math.cos(azimuth);

  if (Math.hypot(east, north) <= 1e-12 * v)
    throw new RangeError(
      'The speed over the ground is zero, so the azimuth is undefined.'
    );

  return norm2pi(Math.atan2(east, north)) as Radians;
};
