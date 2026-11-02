import type { Radians } from '@interstellar-tools/types';

/**
 * Convert a **hyperbolic anomaly** $ F $ to the **true anomaly** on a hyperbola.
 *
 * $$
 * \tan\frac{\nu}{2} = \sqrt{\frac{e + 1}{e - 1}}\,\tanh\frac{F}{2}
 * $$
 *
 * **Units**
 * - Inputs: `F` in **radians**, `e` dimensionless.
 * - Output: $ \nu $ in **radians**, in $ (-\nu_\infty, \nu_\infty) $.
 *
 * ::: info Notes
 *
 * - The inverse of {@link trueToHyperbolicAnomaly}.
 * - As $ F \to \pm\infty $, $ \nu $ approaches the asymptotes $ \pm\nu_\infty $ but never reaches them.
 * - Returns a signed angle, negative before periapsis. Use `norm2pi` for [0, 2π).
 *
 * :::
 *
 * @param F - Hyperbolic anomaly $ F $ in **radians** (finite).
 * @param e - Eccentricity $ e $ (finite, > 1).
 * @returns True anomaly $ \nu $ in **radians**, in (-π, π).
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `e <= 1`.
 * @group Anomalies
 *
 * @example
 * ```ts
 * const nu = hyperbolicToTrueAnomaly(Math.acosh(2), 2);
 * // nu ≈ π/2
 * ```
 *
 * @see {@link trueToHyperbolicAnomaly}
 * @see {@link solveKeplerHyperbolic}
 */
export const hyperbolicToTrueAnomaly = (F: number, e: number): Radians => {
  for (const [name, x] of [
    ['F', F],
    ['e', e]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (e <= 1) throw new RangeError(`e must be > 1. Received: ${e}`);

  return (2 *
    Math.atan(Math.sqrt((e + 1) / (e - 1)) * Math.tanh(F / 2))) as Radians;
};
