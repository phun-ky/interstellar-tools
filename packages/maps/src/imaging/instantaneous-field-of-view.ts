import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertPositive } from '../validate.js';

/**
 * Compute the **instantaneous field of view** of one detector pixel: the angle it sees.
 *
 * $$
 * \text{IFOV} = 2\arctan\frac{p}{2f} \approx \frac{p}{f}
 * $$
 *
 * Where:
 * - $ p $ is the pixel pitch, the spacing of the detector's pixels (m)
 * - $ f $ is the camera's effective focal length (m)
 *
 * **Units**
 * - Inputs: `pixelPitch` and `focalLength` in **m**.
 * - Output: IFOV in **radians**.
 *
 * ::: info Notes
 *
 * - For any real camera $ p \ll f $, and the exact form equals $ p/f $ to many digits; it's used so the result stays right for wide angles too.
 * - A camera's field of view across its detector is about the IFOV times the number of pixels.
 * - Multiply by the distance for what one pixel covers on the ground: {@link groundSampleDistance}.
 *
 * :::
 *
 * @param pixelPitch - Pixel pitch $ p $ in **m** (finite, > 0).
 * @param focalLength - Effective focal length $ f $ in **m** (finite, > 0).
 * @returns The instantaneous field of view in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If any input is `<= 0`.
 * @group Imaging
 *
 * @example
 * ```ts
 * // 7 µm pixels behind a 700 mm lens
 * instantaneousFieldOfView(7e-6, 0.7); // ≈ 1e-5 rad, 10 µrad
 * ```
 *
 * @see {@link groundSampleDistance}
 * @see {@link swathWidth}
 */
export const instantaneousFieldOfView = (
  pixelPitch: number,
  focalLength: number
): Radians => {
  const values = [
    ['pixelPitch', pixelPitch],
    ['focalLength', focalLength]
  ] as const;

  assertFinite(values);
  assertPositive(values);

  return (2 * Math.atan(pixelPitch / (2 * focalLength))) as Radians;
};
