import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertPositive } from '../validate.js';

/**
 * Compute the **swath width**: the strip of ground a camera covers across its track, looking straight down.
 *
 * $$
 * w = 2H\tan\frac{\theta}{2} \approx H\,\text{IFOV}\,N
 * $$
 *
 * Where:
 * - $ H $ is the distance to the ground (m)
 * - $ \theta $ is the camera's field of view across track (rad), about the IFOV times the number of pixels $ N $ across
 *
 * **Units**
 * - Inputs: `distance` in **m**, `fieldOfView` in **radians**.
 * - Output: $ w $ in **m**.
 *
 * ::: info Notes
 *
 * - Flat ground seen straight down. Over a curved body the edges are a little further away, and a wide field of view on a low orbit can reach past the horizon (see `horizonDistance` in `@interstellar-tools/equations`).
 * - With the orbit's ground speed it sets how fast a camera maps: the area per second is the swath times the speed.
 *
 * :::
 *
 * ::: practice HiRISE, over Mars
 *
 * **5.97 km**
 *
 * _HiRISE's 1.14° field of view across track, from 300 km_
 *
 * NASA quotes the swath as 6 km. At 30 cm a pixel, that's about 20 000 pixels across.
 *
 * ```ts
 * swathWidth(300_000, toRad(1.14)); // ≈ 5 969 m
 * ```
 *
 * :::
 *
 * @param distance - Distance $ H $ to the ground in **m** (finite, > 0).
 * @param fieldOfView - Field of view $ \theta $ across track in **radians** (finite, > 0, < π).
 * @returns The swath width $ w $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `distance <= 0`, or `fieldOfView` is outside (0, π).
 * @group Imaging
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A 90° field of view sees twice its height across
 * swathWidth(1000, (Math.PI / 2) as Radians); // 2 000 m
 * ```
 *
 * @see {@link groundSampleDistance}
 * @see {@link instantaneousFieldOfView}
 */
export const swathWidth = (distance: number, fieldOfView: Radians): number => {
  const values = [
    ['distance', distance],
    ['fieldOfView', fieldOfView]
  ] as const;

  assertFinite(values);
  assertPositive(values);

  if (fieldOfView >= Math.PI)
    throw new RangeError(`fieldOfView must be < π. Received: ${fieldOfView}`);

  return 2 * distance * Math.tan(fieldOfView / 2);
};
