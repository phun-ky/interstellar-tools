import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import { tipOverAngle } from './tip-over-angle.js';

/**
 * Check whether a lander **stays upright** on a slope: whether its total tilt stays below its tip-over angle.
 *
 * $$
 * \theta_\text{terrain} + \theta_\text{dynamic} < \arctan\frac{r_\text{footprint}}{h_\text{CoM}}
 * $$
 *
 * Where:
 * - $ \theta_\text{terrain} $ is the slope of the ground under the lander (rad)
 * - $ \theta_\text{dynamic} $ is the extra tilt from the touchdown itself, the rock-up as the legs take the load (rad)
 * - the right-hand side is {@link tipOverAngle}
 *
 * **Units**
 * - Inputs: `slope` and `dynamicTilt` in **radians**, `rFootprint` and `hCoM` in **m**.
 * - Output: `true` if it stays up, `false` if it tips at or past the limit.
 *
 * ::: info Notes
 *
 * - A static check, the first screen for a landing site: real landers also depend on touchdown speed, leg compression, friction and footpads digging in or sliding.
 * - Pass the slope in the direction the lander is most likely to tip, and the footprint distance in that direction too.
 * - For a whole elevation grid, {@link safeLandingGrid} combines it with each cell's slope and roughness.
 *
 * :::
 *
 * @param slope - Ground slope $ \theta_\text{terrain} $ in **radians** (finite, >= 0).
 * @param dynamicTilt - Extra tilt from touchdown $ \theta_\text{dynamic} $ in **radians** (finite, >= 0).
 * @param rFootprint - Distance from the centre of mass to the tipping edge, horizontally, in **m** (finite, > 0).
 * @param hCoM - Height of the centre of mass above the ground in **m** (finite, > 0).
 * @returns `true` if the total tilt stays below the tip-over angle.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `slope` or `dynamicTilt` is negative, or `rFootprint` or `hCoM` is `<= 0`.
 * @group Landing sites
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // Tips at 45°: fine on a 30° slope with 10° of rock-up, not on 40° with 10°
 * isStableLanding(toRad(30), toRad(10), 2, 2); // true
 * isStableLanding(toRad(40), toRad(10), 2, 2); // false
 * ```
 *
 * @see {@link tipOverAngle}
 * @see {@link safeLandingGrid}
 */
export const isStableLanding = (
  slope: Radians,
  dynamicTilt: Radians,
  rFootprint: number,
  hCoM: number
): boolean => {
  assertFinite([
    ['slope', slope],
    ['dynamicTilt', dynamicTilt]
  ]);

  for (const [name, x] of [
    ['slope', slope],
    ['dynamicTilt', dynamicTilt]
  ] as const)
    if (x < 0) throw new RangeError(`${name} must be >= 0. Received: ${x}`);

  return slope + dynamicTilt < tipOverAngle(rFootprint, hCoM);
};
