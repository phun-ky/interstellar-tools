import { Matrix3x3Type, Radians } from '@interstellar-tools/types';

/**
 * Construct a **right-handed rotation matrix about the x-axis** (often written **R₁**).
 *
 * This returns the 3×3 direction cosine matrix (DCM) for an active rotation by angle `theta`
 * around the **+X** axis, using the common aerospace convention:
 *
 * $$
 * \mathbf{R}_1(\theta)=
 * \begin{bmatrix}
 * 1 & 0 & 0 \\
 * 0 & \cos\theta & -\sin\theta \\
 * 0 & \sin\theta & \cos\theta
 * \end{bmatrix}
 * $$
 *
 * ::: info Notes:
 *
 * - `theta` is in **radians**.
 * - Matrix layout is **row-major**: `M[row][col]`.
 * - Useful for composing 3-1-3 / 3-2-1 sequences (e.g., IAU body orientation) and for
 *   general 3D frame transforms in mapping pipelines.
 *
 * :::
 *
 * @param theta - Rotation angle ($ \theta $) in **radians** (finite).
 * @returns 3×3 rotation matrix ($ \mathbf{R}_1(\theta) $) (row-major).
 * @throws {TypeError} If `theta` is not a finite number.
 * @group Helpers
 *
 * @example
 * ```ts
 * // Rotate a vector about +X by 90°:
 * const R = rot1(Math.PI / 2);
 * ```
 */
export const rot1 = (theta: Radians): Matrix3x3Type => {
  if (!Number.isFinite(theta))
    throw new TypeError(`theta must be finite. Received: ${theta}`);

  const c = Math.cos(theta);
  const s = Math.sin(theta);

  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c]
  ] as const;
};
