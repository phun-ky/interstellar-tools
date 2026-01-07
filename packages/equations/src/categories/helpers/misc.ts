import { TWO_PI } from '@interstellar-tools/constants';
import type { Vector3DTupleType } from '@interstellar-tools/types';

/**
 * Compute the **Euclidean norm** (length / magnitude) of a 3D vector.
 *
 * $$
 * \lVert \mathbf{v} \rVert = \sqrt{x^2 + y^2 + z^2}
 * $$
 *
 * Uses `Math.hypot` for numerical stability.
 *
 * @param v - 3D vector `[x, y, z]`.
 * @returns Vector magnitude (same units as the components of `v`).
 * @group Helpers
 *
 * @example
 * ```ts
 * norm([3, 4, 12]); // 13
 * ```
 */
export const norm = (v: Vector3DTupleType) => {
  return Math.hypot(v[0], v[1], v[2]);
};

/**
 * Scale a 3D vector by a scalar.
 *
 * Computes:
 * $$
 * s\mathbf{v} = [sx, sy, sz]
 * $$
 *
 * @param v - 3D vector `[x, y, z]`.
 * @param s - Scalar multiplier.
 * @returns Scaled vector `s * v`.
 * @group Helpers
 *
 * @example
 * ```ts
 * scale([1, -2, 3], 10); // [10, -20, 30]
 * ```
 */
export const scale = (v: Vector3DTupleType, s: number): Vector3DTupleType => {
  return [v[0] * s, v[1] * s, v[2] * s];
};

/**
 * Subtract two 3D vectors (`a - b`).
 *
 * @param a - Minuend vector.
 * @param b - Subtrahend vector.
 * @returns Difference vector `a - b`.
 * @group Helpers
 *
 * @example
 * ```ts
 * sub([3, 2, 1], [1, 1, 1]); // [2, 1, 0]
 * ```
 */
export const sub = (
  a: Vector3DTupleType,
  b: Vector3DTupleType
): Vector3DTupleType => {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
};

/**
 * Compute the **dot product** of two 3D vectors.
 *
 * $$
 * \mathbf{a}\cdot\mathbf{b} = a_x b_x + a_y b_y + a_z b_z
 * $$
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @returns Dot product (units: product of the input component units).
 * @group Helpers
 *
 * @example
 * ```ts
 * dot([1, 2, 3], [4, 5, 6]); // 32
 * ```
 */
export const dot = (a: Vector3DTupleType, b: Vector3DTupleType) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Normalize an angle to the range **[0, 2π)**.
 *
 * This is commonly used to keep anomalies / angles within a canonical interval.
 *
 * @param x - Angle in radians (or any unit, as long as `TWO_PI` matches that unit).
 * @returns Equivalent angle in the range `[0, 2π)`.
 * @group Helpers
 *
 * @example
 * ```ts
 * norm2pi(7);            // ~0.7168 (if radians)
 * norm2pi(-Math.PI / 2); // 3π/2
 * ```
 */
export const norm2pi = (x: number): number => {
  return ((x % TWO_PI) + TWO_PI) % TWO_PI;
};

/**
 * Compute the **Kepler equation residual** for an elliptical orbit:
 *
 * $$
 * E - e\sin(E) = M
 * $$
 *
 * This function returns:
 * $$
 * r(E) = E - e\sin(E) - \mathrm{wrap}_{2\pi}(M)
 * $$
 *
 * where `wrap_{2π}` normalizes `M` into `[0, 2π)` to keep the residual well-behaved.
 *
 * Common usage: root-finding / iteration (Newton–Raphson, Halley, etc.) to solve for
 * eccentric anomaly `E` given eccentricity `e` and mean anomaly `M`.
 *
 * @param E - Eccentric anomaly `E` (radians).
 * @param e - Eccentricity `e` (dimensionless).
 * @param M - Mean anomaly `M` (radians).
 * @returns Residual value `E - e*sin(E) - M_wrapped`.
 * @group Kepler
 *
 * @example
 * ```ts
 * // If E solves Kepler's equation, residual(E,e,M) ≈ 0
 * const r = residual(1.0, 0.1, 0.9);
 * ```
 */
export const residual = (E: number, e: number, M: number) => {
  const Mm = norm2pi(M);

  return E - e * Math.sin(E) - Mm;
};
