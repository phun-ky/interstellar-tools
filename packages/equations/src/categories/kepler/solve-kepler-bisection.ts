import { Radians } from '@interstellar-tools/types';

/**
 * Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **bisection method**
 * when Newton-Raphson or other iterative solvers fail to converge.
 *
 * ---
 *
 * **Mathematical Explanation:**
 *
 * Kepler's equation for eccentric anomaly ($E$) is:
 * $$
 * M = E - e \sin(E)
 * $$
 * This equation cannot be solved analytically, and numerical methods must be used.
 * When standard iterative solvers like **Newton-Raphson** fail due to poor convergence,
 * the **bisection method** provides a robust alternative by performing a bracketed search.
 *
 * ---
 *
 * **Solving Strategy:**
 * 1. **Initialize Bounds:**
 *    - The valid range for $E$ is **$[0, \pi]$** (as $E$ is symmetric around 0).
 *    - The midpoint $E_0$ is chosen as:
 *      $$
 *      E = \frac{E_{low} + E_{high}}{2}
 *      $$
 *
 * 2. **Bisection Iteration:**
 *    - Compute the function residual:
 *      $$
 *      F(E) = E - e \sin(E) - M
 *      $$
 *    - If $F(E)$ is sufficiently small (within tolerance), $E$ is returned as the solution.
 *    - Otherwise, the interval is **halved** by updating either:
 *      - The lower bound ($E_{low}$) if $F(E) < 0$
 *      - The upper bound ($E_{high}$) if $F(E) > 0$
 *
 * 3. **Convergence Check:**
 *    - The iteration stops when:
 *      $$
 *      |E_{n+1} - E_n| < \text{tolerance}
 *      $$
 *      (default tolerance is **1e-9**).
 *
 * ---
 *
 * **Performance Considerations:**
 * - **Always converges**, unlike Newton-Raphson, which can fail for some initial guesses.
 * - **Time complexity:** $O(\log N)$ due to the **logarithmic convergence** of bisection.
 *
 * ---
 *
 * @param {Radians} M - Mean anomaly ($M$) in **radians**.
 * @param {number} e - Orbital eccentricity ($0 \leq e < 1$).
 * @param {number} maxIter - Maximum number of **iterations** before failure.
 * @param {number} tolerance - Convergence criterion for stopping the iteration.
 * @returns {Radians} The **eccentric anomaly** ($E$) in **radians** (best approximation).
 *
 * ---
 *
 * @example
 * ```ts
 * const M = Math.PI / 3; // 60 degrees in radians
 * const e = 0.5; // Orbital eccentricity
 * console.log(solveKeplerBisection(M, e, 50, 1e-9)); // Output: Eccentric anomaly in radians
 * ```
 *
 * ---
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [Bisection Method (Wikipedia)](https://en.wikipedia.org/wiki/Bisection_method)
 * @category Kepler Solvers
 */
export const solveKeplerBisection = (
  M: Radians,
  e: number,
  maxIter: number,
  tolerance: number
): Radians => {
  let E_low = 0;
  let E_high = Math.PI;
  let E = (E_low + E_high) / 2;
  let iter = 0;

  while (iter < maxIter) {
    const F = E - e * Math.sin(E) - M;

    if (Math.abs(F) < tolerance) {
      return E; // Converged
    }

    if (F > 0) {
      E_high = E;
    } else {
      E_low = E;
    }

    E = (E_low + E_high) / 2;
    iter++;
  }

  return E; // Best approximation
};
