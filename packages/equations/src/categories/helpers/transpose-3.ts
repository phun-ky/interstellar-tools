import type { Matrix3x3Type } from '@interstellar-tools/types';

/**
 * Transpose a **3×3 matrix** (row-major).
 *
 * For a matrix:
 * $$
 * \mathbf{A} =
 * \begin{bmatrix}
 * a_{00} & a_{01} & a_{02} \\
 * a_{10} & a_{11} & a_{12} \\
 * a_{20} & a_{21} & a_{22}
 * \end{bmatrix}
 * $$
 *
 * the transpose is:
 * $$
 * \mathbf{A}^\mathsf{T} =
 * \begin{bmatrix}
 * a_{00} & a_{10} & a_{20} \\
 * a_{01} & a_{11} & a_{21} \\
 * a_{02} & a_{12} & a_{22}
 * \end{bmatrix}
 * $$
 *
 * Notes:
 * - Matrices are treated as **row-major**: `A[row][col]`.
 * - For rotation matrices / DCMs, the transpose is also the inverse:
 *   $ \mathbf{R}^{-1} = \mathbf{R}^\mathsf{T} $.
 *
 * @param A - 3×3 matrix (row-major).
 * @returns Transposed matrix `Aᵀ` (row-major).
 * @group Helpers
 *
 * @example
 * ```ts
 * const A: Matrix3x3Type = [
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9]
 * ];
 *
 * const AT = transpose3(A);
 * // [
 * //   [1, 4, 7],
 * //   [2, 5, 8],
 * //   [3, 6, 9]
 * // ]
 * ```
 */
export const transpose3 = (A: Matrix3x3Type): Matrix3x3Type =>
  [
    [A[0][0], A[1][0], A[2][0]],
    [A[0][1], A[1][1], A[2][1]],
    [A[0][2], A[1][2], A[2][2]]
  ] as const;
