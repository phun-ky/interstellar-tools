/**
 * A read-only 3D vector tuple `[x, y, z]`.
 *
 * Immutable container for Cartesian coordinates or any 3-component quantity
 * (e.g., position in meters, velocity in m/s, acceleration in m/s²).
 * The `readonly` modifier prevents in-place mutation.
 *
 * @example
 * ```ts
 * // Declaring a point/vector
 * const p: Vector3DTupleType = [1, 2, 3];
 * // p[0] = 9; // Error: cannot assign to read-only element
 *
 * // Using with functions
 * const dot = (a: Vector3DTupleType, b: Vector3DTupleType) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
 * const v = [4, 5, 6] as const; // const assertion yields a readonly tuple
 * console.log(dot(p, v)); // 32
 * ```
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
 */
export type Vector3DTupleType = readonly [x: number, y: number, z: number];

/**
 * Immutable 3×3 matrix of numbers.
 *
 * This type is typically used for **direction cosine matrices (DCMs)** / rotation matrices
 * and other small linear transforms in 3D Cartesian space.
 *
 * Layout:
 * - Row-major: `M[row][col]`
 * - Each row is a 3-tuple `[x, y, z]` (i.e., column 0..2).
 *
 * @example
 * ```ts
 * const I: Matrix3 = [
 *   [1, 0, 0],
 *   [0, 1, 0],
 *   [0, 0, 1]
 * ];
 * ```
 */
export type Matrix3x3Type = readonly [
  readonly [x: number, y: number, z: number],
  readonly [x: number, y: number, z: number],
  readonly [x: number, y: number, z: number]
];
