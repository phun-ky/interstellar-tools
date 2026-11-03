import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertPositive } from '../validate.js';

/**
 * Compute the **ground sample distance**: how much ground one pixel covers, looking straight down.
 *
 * $$
 * \text{GSD} = 2H\tan\frac{\text{IFOV}}{2} \approx H\,\text{IFOV} = \frac{H\,p}{f}
 * $$
 *
 * Where:
 * - $ H $ is the distance to the ground along the line of sight (m)
 * - IFOV is the pixel's instantaneous field of view (rad), from {@link instantaneousFieldOfView}
 *
 * **Units**
 * - Inputs: `distance` in **m**, `ifov` in **radians**.
 * - Output: GSD in **m** per pixel.
 *
 * ::: info Notes
 *
 * - Grows in step with the distance: twice as high, pixels twice as large.
 * - Flat ground seen straight down. Looking off to the side, the slant distance is longer and pixels stretch further along the look direction, by about $ 1/\cos e $ for an emission angle $ e $.
 * - The smallest object a camera can recognise is a few pixels across, not one.
 *
 * :::
 *
 * ::: practice HiRISE, over Mars
 *
 * **30 cm**
 *
 * _One pixel of the Mars Reconnaissance Orbiter's HiRISE camera, 1 µrad, from 300 km_
 *
 * HiRISE's 12 m focal length gives each pixel a field of view of one microradian: small enough to make out a rover and its tracks from orbit.
 *
 * ```ts
 * groundSampleDistance(300_000, 1e-6); // ≈ 0.30 m
 * ```
 *
 * :::
 *
 * @param distance - Distance $ H $ to the ground in **m** (finite, > 0).
 * @param ifov - Instantaneous field of view in **radians** (finite, > 0, < π).
 * @returns The ground sample distance in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `distance <= 0`, or `ifov` is outside (0, π).
 * @group Imaging
 *
 * @example
 * ```ts
 * import { instantaneousFieldOfView } from '@interstellar-tools/maps';
 *
 * // 7 µm pixels, a 700 mm lens, 50 km up
 * groundSampleDistance(50_000, instantaneousFieldOfView(7e-6, 0.7)); // ≈ 0.5 m
 * ```
 *
 * @see {@link instantaneousFieldOfView}
 * @see {@link swathWidth}
 */
export const groundSampleDistance = (
  distance: number,
  ifov: Radians
): number => {
  const values = [
    ['distance', distance],
    ['ifov', ifov]
  ] as const;

  assertFinite(values);
  assertPositive(values);

  if (ifov >= Math.PI)
    throw new RangeError(`ifov must be < π. Received: ${ifov}`);

  return 2 * distance * Math.tan(ifov / 2);
};
