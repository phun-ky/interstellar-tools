import { Matrix3x3Type, Radians } from '@interstellar-tools/types';

/**
 * Construct a **right-handed rotation matrix about the z-axis** (often written **R₃**).
 *
 * This returns the 3×3 direction cosine matrix (DCM) for an active rotation by angle `theta`
 * around the **+Z** axis:
 *
 * $$
 * \mathbf{R}_3(\theta)=
 * \begin{bmatrix}
 * \cos\theta & -\sin\theta & 0 \\
 * \sin\theta & \cos\theta  & 0 \\
 * 0          & 0           & 1
 * \end{bmatrix}
 * $$
 *
 * ::: info Notes:
 *
 * - `theta` is in **radians**.
 * - Matrix layout is **row-major**: `M[row][col]`.
 * - Common in 3-1-3 / 3-2-1 rotation sequences (e.g., IAU pole + prime meridian rotations)
 *   and general 3D coordinate transforms.
 *
 * :::
 *
 * @param theta - Rotation angle ($ \theta $) in **radians** (finite).
 * @returns 3×3 rotation matrix ($ \mathbf{R}_3(\theta) $) (row-major).
 * @throws {TypeError} If `theta` is not a finite number.
 * @group Helpers
 *
 * @example
 * ```ts
 * // Rotate about +Z by 90°:
 * const R = rot3(Math.PI / 2);
 * ```
 */
export const rot3 = (theta: Radians): Matrix3x3Type => {
  if (!Number.isFinite(theta))
    throw new TypeError(`theta must be finite. Received: ${theta}`);

  const c = Math.cos(theta);
  const s = Math.sin(theta);

  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1]
  ] as const;
};
