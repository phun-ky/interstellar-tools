import type { Matrix3x3Type } from '@interstellar-tools/types';

/**
 * Compute the **determinant** of a **3×3** matrix (row-major).
 *
 * For:
 * $$
 * \mathbf{A}=
 * \begin{bmatrix}
 * a & b & c \\
 * d & e & f \\
 * g & h & i
 * \end{bmatrix}
 * $$
 *
 * This returns:
 * $$
 * \det(\mathbf{A}) = a(ei - fh) - b(di - fg) + c(dh - eg)
 * $$
 *
 * Notes:
 * - Matrices are treated as **row-major**: `A[row][col]`.
 * - For a proper rotation matrix / DCM, `det(A) ≈ +1`.
 * - A determinant of `0` indicates the matrix is singular (non-invertible).
 *
 * @param A - 3×3 matrix (row-major).
 * @returns Determinant `det(A)`.
 * @group Helpers
 *
 * @example
 * ```ts
 * const I: Matrix3x3Type = [
 *   [1, 0, 0],
 *   [0, 1, 0],
 *   [0, 0, 1]
 * ];
 *
 * det3(I); // 1
 * ```
 *
 * @example
 * ```ts
 * const A: Matrix3x3Type = [
 *   [1, 2, 3],
 *   [0, 1, 4],
 *   [5, 6, 0]
 * ];
 *
 * det3(A); // 1
 * ```
 */
export const det3 = (A: Matrix3x3Type): number => {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[0][2];
  const d = A[1][0];
  const e = A[1][1];
  const f = A[1][2];
  const g = A[2][0];
  const h = A[2][1];
  const i = A[2][2];

  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
};
