import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

/**
 * Compute the relative brightness of a **Lambertian** surface: one that scatters light equally in all directions.
 *
 * $$
 * r \propto \cos i
 * $$
 *
 * Where:
 * - $ i $ is the incidence angle (rad), from {@link illuminationAngles}
 *
 * **Units**
 * - Input: `incidence` in **radians**.
 * - Output: relative reflectance, from 1 with the Sun overhead to 0 at the horizon and beyond.
 *
 * ::: info Notes
 *
 * - Doesn't depend on where it's seen from: a Lambertian surface looks equally bright from every direction. Snow and matte paint come close.
 * - Dark, dusty surfaces like the Moon's don't: their brightness depends on the viewing angle too, which {@link lommelSeeligerReflectance} models.
 * - Returns 0 for an incidence past π/2, when the point is in shadow.
 *
 * :::
 *
 * @param incidence - Incidence angle $ i $ in **radians** (finite, >= 0).
 * @returns The relative reflectance, in [0, 1].
 * @throws {TypeError} If `incidence` is not a finite number.
 * @throws {RangeError} If `incidence < 0`.
 * @group Imaging
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // The Sun 60° from overhead: half as bright as with the Sun overhead
 * lambertReflectance((Math.PI / 3) as Radians); // 0.5
 * ```
 *
 * @see {@link lommelSeeligerReflectance}
 * @see {@link illuminationAngles}
 */
export const lambertReflectance = (incidence: Radians): number => {
  assertFinite([['incidence', incidence]]);

  if (incidence < 0)
    throw new RangeError(`incidence must be >= 0. Received: ${incidence}`);

  return incidence >= Math.PI / 2 ? 0 : Math.cos(incidence);
};
