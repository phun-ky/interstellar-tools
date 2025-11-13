import { wrapAngle } from './wrap-angle';

/**
 * Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation.
 *
 * ---
 *
 * **Mathematical Explanation:**
 *
 * In orbital mechanics, the **true anomaly** ($\nu$), the **eccentric anomaly** ($E$),
 * and the **mean anomaly** ($M$) are related through Kepler's equation.
 *
 * **Step 1: Convert True Anomaly ($\nu$) to Eccentric Anomaly ($E$)**
 * $$
 * E = 2 \tan^{-1} \left( \sqrt{\frac{1 - e}{1 + e}} \tan\left(\frac{\nu}{2}\right) \right)
 * $$
 *
 * This transformation ensures that $E$ is computed correctly **across all quadrants**,
 * using `atan2(y, x)` instead of `atan(x)` to avoid ambiguity in angle computation.
 *
 * **Step 2: Convert Eccentric Anomaly ($E$) to Mean Anomaly ($M$)**
 *
 * Kepler’s equation states:
 * $$
 * M = E - e \sin(E)
 * $$
 *
 * Since anomalies are periodic over **one full orbit** ($0 \leq M < 2\pi$),
 * we apply `wrapAngle(M)` to ensure that the computed **mean anomaly remains within this range**.
 *
 * ---
 *
 * **Why Use `wrapAngle`?**
 * - Ensures that the mean anomaly **is always wrapped within** $[0, 2\pi]$.
 * - Corrects floating-point precision issues that may cause values slightly greater than $2\pi$.
 * - Prevents negative anomalies by shifting them into the valid range.
 *
 * ---
 *
 * @param {number} V - **True anomaly** ($\nu$) in radians.
 * @param {number} e - **Eccentricity** of the orbit ($0 \leq e < 1$).
 *
 * @returns {number} The **mean anomaly** ($M$) in radians, wrapped to the range $[0, 2\pi]$.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the **eccentricity** ($e$) is outside the valid range $0 \leq e < 1$.
 *
 * ---
 *
 * @example
 * ```ts
 * import { trueAnomalyToMeanAnomaly } from './true-anomaly-to-mean-anomaly';
 *
 * // Example 1: Standard elliptical orbit
 * const V = Math.PI / 3; // 60 degrees in radians
 * const e = 0.1; // Eccentricity
 * console.log(trueAnomalyToMeanAnomaly(V, e)); // Output: Mean anomaly in radians
 * ```
 *
 * @example
 * ```ts
 * // Example 2: Retrograde motion handling
 * const V_retrograde = -Math.PI / 2; // -90 degrees
 * const e_retrograde = 0.2;
 * console.log(trueAnomalyToMeanAnomaly(V_retrograde, e_retrograde));
 * ```
 *
 * ---
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
 * @see [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
 * @see [Orbital Eccentricity (Wikipedia)](https://en.wikipedia.org/wiki/Orbital_eccentricity)
 * @category Anomaly
 */
export const trueAnomalyToMeanAnomaly = (V: number, e: number): number => {
  if (e < 0 || e >= 1) {
    throw new RangeError(
      'Eccentricity (e) must be in the range 0 ≤ e < 1 for elliptical orbits.'
    );
  }

  // Compute Eccentric Anomaly (E) properly using atan2 for quadrant correctness
  const tanHalfV = Math.tan(V / 2);
  const factor = Math.sqrt((1 - e) / (1 + e));

  let E = 2 * Math.atan2(tanHalfV * factor, 1);

  // Ensure correct quadrant handling for retrograde motion
  if (V < -Math.PI || V > Math.PI) {
    E = wrapAngle(E + Math.PI) - Math.PI;
  }

  // Convert eccentric anomaly (E) to mean anomaly (M)
  const M = E - e * Math.sin(E);

  // Ensure M is always in the range [0, 2π]
  return wrapAngle(M);
};
