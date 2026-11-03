import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

/**
 * Compute the relative brightness of a **Lommel–Seeliger** surface: a dark, dusty one, like the Moon or an asteroid.
 *
 * $$
 * r \propto \frac{\cos i}{\cos i + \cos e}
 * $$
 *
 * Where:
 * - $ i $ is the incidence angle and $ e $ the emission angle (rad), from {@link illuminationAngles}
 *
 * **Units**
 * - Inputs: `incidence` and `emission` in **radians**.
 * - Output: relative reflectance, in [0, 1].
 *
 * ::: info Notes
 *
 * - Light that enters a dark, porous surface is mostly absorbed before it can scatter twice, so what comes back depends on the path in and the path out. That's why the full Moon looks evenly lit to its edge, instead of fading like a Lambertian ball.
 * - Equals 1/2 whenever $ i = e $, and grows towards 1 as the observer looks closer to the horizon.
 * - Returns 0 when the point is in shadow ($ i \ge \pi/2 $) or out of sight ($ e \ge \pi/2 $).
 * - Doesn't model the opposition surge near zero phase; see {@link illuminationAngles}.
 *
 * :::
 *
 * @param incidence - Incidence angle $ i $ in **radians** (finite, >= 0).
 * @param emission - Emission angle $ e $ in **radians** (finite, >= 0).
 * @returns The relative reflectance, in [0, 1].
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If any input is negative.
 * @group Imaging
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // Lit and seen from the same angle
 * lommelSeeligerReflectance((Math.PI / 4) as Radians, (Math.PI / 4) as Radians); // 0.5
 * ```
 *
 * @see {@link lambertReflectance}
 * @see {@link illuminationAngles}
 */
export const lommelSeeligerReflectance = (
  incidence: Radians,
  emission: Radians
): number => {
  assertFinite([
    ['incidence', incidence],
    ['emission', emission]
  ]);

  for (const [name, x] of [
    ['incidence', incidence],
    ['emission', emission]
  ] as const)
    if (x < 0) throw new RangeError(`${name} must be >= 0. Received: ${x}`);

  // Compare the angles, not their cosines: cos(π/2) isn't exactly 0
  if (incidence >= Math.PI / 2 || emission >= Math.PI / 2) return 0;

  const mu0 = Math.cos(incidence);

  return mu0 / (mu0 + Math.cos(emission));
};
