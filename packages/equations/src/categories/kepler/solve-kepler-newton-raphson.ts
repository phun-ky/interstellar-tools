import type { Radians } from '@interstellar-tools/types';

/**
 * Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method**
 * with Householder acceleration for fast convergence.
 *
 * ---
 *
 * **Mathematical Explanation:**
 *
 * Kepler's equation relates the **mean anomaly** ($M$), the **eccentric anomaly** ($E$),
 * and the **orbital eccentricity** ($e$) as:
 * $$
 * M = E - e \sin(E)
 * $$
 * Since this equation **cannot be solved algebraically**, iterative numerical methods are required.
 *
 * ---
 *
 * **Solving Strategy:**
 * 1. **Handle Special Cases:**
 *    - If the orbit is **circular** ($e = 0$), then $E = M$ directly.
 *    - If the orbit is **nearly parabolic** ($e \geq 0.97$), a special approximation is used.
 *    - If **eccentricity is out of range** ($e < 0$ or $e \geq 1$), a `RangeError` is thrown.
 *
 * 2. **Initial Approximation:**
 *    - **For small eccentricities ($e < 0.8$):** $E_0 = M$.
 *    - **For moderate eccentricities ($0.8 \leq e < 0.97$):** $E_0 = M + e \sin(M) (1 + e \cos(M))$.
 *    - **For nearly parabolic orbits ($e \geq 0.97$):** $E_0 = \frac{6M}{e}$.
 *
 * 3. **Newton-Raphson Iteration with Householder Acceleration:**
 *    - The **Newton-Raphson method** iterates using:
 *      $$
 *      E_{n+1} = E_n - \frac{f(E_n)}{f'(E_n)}
 *      $$
 *      where:
 *      - $f(E) = E - e \sin(E) - M$
 *      - $f'(E) = 1 - e \cos(E)$
 *
 *    - **Householder acceleration** refines the correction:
 *      $$
 *      \Delta E = \frac{f(E)}{f'(E)} \left( 1 - \frac{1}{2} \frac{f''(E)}{f'(E)} \Delta E \right)^{-1}
 *      $$
 *
 * 4. **Convergence Check:**
 *    - The iteration stops when:
 *      $$
 *      |E_{n+1} - E_n| < \text{tolerance}
 *      $$
 *      (default tolerance is **1e-9**).
 *
 * 5. **Failure Handling:**
 *    - If the method **does not converge**, `NaN` is returned, signaling that a fallback method should be used.
 *
 * ---
 *
 * **Performance Considerations:**
 * - **Typically converges in 4-5 iterations for most eccentricities.**
 * - **Time complexity:** $O(1)$ for Newton-Raphson.
 *
 * ---
 *
 * @param {Radians} M - Mean anomaly ($M$) in **radians**.
 * @param {number} e - Orbital eccentricity ($0 \leq e < 1$).
 * @param {number} maxIter - Maximum number of **iterations** before failure.
 * @param {number} tolerance - Convergence criterion for stopping the iteration.
 * @returns {Radians} The **eccentric anomaly** ($E$) in **radians** (or `NaN` if the method fails).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).
 *
 * ---
 *
 * @example
 * ```ts
 * const M = Math.PI / 4; // 45 degrees in radians
 * const e = 0.1; // Orbital eccentricity
 * console.log(solveKeplerNewtonRaphson(M, e, 50, 1e-9)); // Output: Eccentric anomaly in radians
 * ```
 *
 * ---
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [Newton-Raphson Method (Wikipedia)](https://en.wikipedia.org/wiki/Newton%27s_method)
 * @see [Eccentric Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly#Eccentric_anomaly)
 * @group Kepler Solvers
 */
export const solveKeplerNewtonRaphson = (
  M: Radians,
  e: number,
  maxIter: number,
  tolerance: number
): Radians | number => {
  if (e < 0 || e >= 1) {
    throw new RangeError(`Invalid eccentricity: ${e}. Must be in range [0,1).`);
  }

  let E: number;

  // Smart initial guess
  if (e < 0.8) {
    E = M;
  } else if (e < 0.97) {
    E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  } else {
    E = (6 * M) / e; // Nearly parabolic case
  }

  let iter = 0;

  while (iter < maxIter) {
    const F = E - e * Math.sin(E) - M;
    const dF = 1 - e * Math.cos(E);
    const d2F = e * Math.sin(E);
    const d3F = e * Math.cos(E);
    const deltaE = -F / dF; // Newton’s step

    // Apply Householder's method for faster convergence
    let correction = deltaE / (1 - (0.5 * deltaE * d2F) / dF);

    correction /= 1 - ((1 / 6) * correction * correction * d3F) / dF;

    E += correction;

    if (Math.abs(correction) < tolerance) {
      return E as Radians; // Converged
    }

    iter++;
  }

  return NaN; // Indicate failure
};
