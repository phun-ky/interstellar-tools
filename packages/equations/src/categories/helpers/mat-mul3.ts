import { Matrix3x3Type } from '@interstellar-tools/types';

/**
 * Multiply two **3×3 matrices** (row-major).
 *
 * Computes:
 * $$
 * \mathbf{C} = \mathbf{A}\mathbf{B}
 * $$
 *
 * Using standard matrix multiplication:
 * $$
 * C_{r,c} = \sum_{k=0}^{2} A_{r,k}\,B_{k,c}
 * $$
 *
 * Layout:
 * - Matrices are treated as **row-major**: `M[row][col]`.
 *
 * Common usage:
 * - Compose rotations / direction cosine matrices (DCMs), e.g. `R = R3 * R1 * R3`.
 * - Compose linear transforms in 3D geometry and mapping pipelines.
 *
 * @param A - Left matrix (3×3, row-major).
 * @param B - Right matrix (3×3, row-major).
 * @returns The product matrix `A * B` (3×3, row-major).
 * @group Helpers
 *
 * @example
 * ```ts
 * const A: Matrix3x3Type = [
 *   [1, 2, 3],
 *   [0, 1, 4],
 *   [5, 6, 0]
 * ];
 *
 * const B: Matrix3x3Type = [
 *   [-2, 1, 0],
 *   [3, 0, 0],
 *   [4, 5, 1]
 * ];
 *
 * const C = matMul3(A, B);
 * // C is A*B
 * ```
 */
export const matMul3 = (A: Matrix3x3Type, B: Matrix3x3Type): Matrix3x3Type => {
  const m = (r: number, c: number) =>
    A[r][0] * B[0][c] + A[r][1] * B[1][c] + A[r][2] * B[2][c];

  return [
    [m(0, 0), m(0, 1), m(0, 2)],
    [m(1, 0), m(1, 1), m(1, 2)],
    [m(2, 0), m(2, 1), m(2, 2)]
  ] as const;
};
