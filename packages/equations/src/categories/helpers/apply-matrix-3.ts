import { Matrix3x3Type, Vector3DTupleType } from '@interstellar-tools/types';

/**
 * Apply a **3×3 matrix** to a **3D vector** (matrix–vector multiplication).
 *
 * Computes:
 * $$
 * \mathbf{y} = \mathbf{M}\,\mathbf{v}
 * $$
 *
 * With row-major indexing:
 * - `M[row][col]`
 * - `v = [x, y, z]`
 *
 * This is commonly used for:
 * - Applying a **direction cosine matrix (DCM)** / rotation matrix to transform vectors
 *   between frames (e.g., inertial → body-fixed).
 * - Small 3D linear transforms in geometry and mapping pipelines.
 *
 * @param M - 3×3 matrix (row-major) (all finite).
 * @param v - 3D vector `[x, y, z]` (all finite).
 * @returns The transformed vector `M * v` as a 3D tuple.
 * @group Helpers
 *
 * @example
 * ```ts
 * const M: Matrix3x3Type = [
 *   [1, 0, 0],
 *   [0, 0, -1],
 *   [0, 1, 0]
 * ];
 *
 * const v: Vector3DTupleType = [1, 2, 3];
 * const out = applyMatrix3(M, v);
 * // out === [1, -3, 2]
 * ```
 */
export const applyMatrix3 = (
  M: Matrix3x3Type,
  v: Vector3DTupleType
): Vector3DTupleType => {
  const [x, y, z] = v;

  return [
    M[0][0] * x + M[0][1] * y + M[0][2] * z,
    M[1][0] * x + M[1][1] * y + M[1][2] * z,
    M[2][0] * x + M[2][1] * y + M[2][2] * z
  ] as const;
};
