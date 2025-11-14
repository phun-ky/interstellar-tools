import { TWO_PI } from '@interstellar-tools/constants';

const EPSILON = 1e-10; // Small threshold for floating-point drift
const LARGE_EPSILON = 1e-8; // Higher tolerance for large angles

/**
 * Wrap an angle (in **radians**) to a **single-turn range** and snap values
 * extremely close to **±τ** (±`2π`) back to **0** to curb floating-point drift.
 *
 * - Uses the JavaScript remainder operator to reduce the angle:
 *
 * $$
 * r \;=\; \theta \bmod \tau,\quad \tau = 2\pi
 * $$
 *
 * - Because JS remainders keep the **sign of the dividend**, after the reduction:
 *
 * $$
 * r \in (-\tau,\;\tau)
 * $$
 *
 * - If the reduced result is numerically indistinguishable from **±τ** within small
 * tolerances, it returns **0**:
 *
 * $$
 * \text{wrap}(\theta) =
 * \begin{cases}
 * 0, & |r - \tau| < \varepsilon \;\lor\; |r + \tau| < \varepsilon \\
 * r, & \text{otherwise}
 * \end{cases}
 * $$
 *
 * where \( r = \theta \bmod \tau \) and \( \varepsilon \in \{\texttt{EPSILON}, \texttt{LARGE\_EPSILON}\} \).
 *
 * @param angle Input angle in **radians** (any real number).
 * @returns Wrapped angle in **radians**, guaranteed to lie in **(-τ, τ)**,
 *          with values near **±τ** snapped to **0**.
 *
 * ::: info
 *
 *
 * - This function **does not** force the common principal ranges **[0, τ)** or **(-π, π]**.
 *   It merely ensures the magnitude is **< τ** while preserving sign.
 *   If you need a principal value in **[0, τ)**, post-process via:
 *
 *   ```ts
 *   const wrapToZeroTau = (θ: number) => {
 *     const r = wrapAngle(θ);
 *     return r < 0 ? r + TWO_PI : r;
 *   };
 *   ```
 *
 *   For **(-π, π]**:
 *
 *   ```ts
 *   const wrapToMinusPiPi = (θ: number) => {
 *     const r = wrapAngle(θ);
 *     return r > Math.PI ? r - TWO_PI : r;
 *   };
 *   ```
 *
 * - Very small values near **0** are **not** snapped to zero by this helper;
 *   only values near **±τ** are. If you also want to zero-out tiny magnitudes,
 *   apply your own deadband, e.g. `Math.abs(r) < 1e-12 ? 0 : r`.
 *
 * :::
 *
 * @example
 * ```ts
 * // Basic reductions
 * wrapAngle(3 * Math.PI);      // →  Math.PI
 * wrapAngle(-3 * Math.PI);     // → -Math.PI
 *
 * // Exact multiples of 2π snap to 0 (within tolerance)
 * wrapAngle(2 * Math.PI);      // → 0
 * wrapAngle(-2 * Math.PI);     // → 0
 *
 * // Preserve positive values under 2π
 * wrapAngle(1.5 * Math.PI);    // → 1.5π
 *
 * // Preserve negative values under 2π
 * wrapAngle(-0.1);             // → -0.1
 * ```
 * @category Angle
 */
export const wrapAngle = (angle: number) => {
  // Reduce angle while preserving sign
  angle = angle % TWO_PI;

  // Handle floating-point precision at ±2π
  if (Math.abs(angle - TWO_PI) < EPSILON) return 0;

  if (Math.abs(angle + TWO_PI) < EPSILON) return 0;

  if (
    Math.abs(angle - TWO_PI) < LARGE_EPSILON ||
    Math.abs(angle + TWO_PI) < LARGE_EPSILON
  )
    return 0;

  return angle;
};
