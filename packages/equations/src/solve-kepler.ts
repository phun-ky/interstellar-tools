import { Radians } from '@interstellar-tools/types';

import { solveKeplerBisection } from './solve-kepler-bisection';
import { solveKeplerHighEccentricity } from './solve-kepler-high-eccentricity';
import { solveKeplerNewtonRaphson } from './solve-kepler-newton-raphson';
import { wrapAngle } from './wrap-angle';

/**
 * Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach:
 * - **Newton-Raphson method** for fast convergence.
 * - **Bisection fallback** if Newton’s method fails.
 * - **High-eccentricity solver** for extreme orbits ($e > 0.9$).
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
 * Since this equation **cannot be solved algebraically**, numerical methods are required.
 *
 * ---
 *
 * **Solving Strategy:**
 * 1. **Handle Special Cases:**
 *    - If the orbit is **circular** ($e = 0$), then $E = M$ directly.
 *    - If the orbit is **parabolic** ($e = 1$), an exception is thrown.
 *    - If **eccentricity is out of range** ($e < 0$ or $e \geq 1$), a `RangeError` is thrown.
 *
 * 2. **Select the Best Solver:**
 *    - **For high eccentricities ($e > 0.9$)** → Uses `solveKeplerHighEccentricity()`.
 *    - **For moderate eccentricities ($e \leq 0.9$)** → Uses `solveKeplerNewtonRaphson()`.
 *    - **If Newton-Raphson fails**, falls back to `solveKeplerBisection()`.
 *
 * 3. **Final Wrapping:**
 *    - Ensures the solution is correctly wrapped using `wrapAngle()`.
 *
 * ---
 *
 * **Performance Considerations:**
 * - **Newton-Raphson typically converges in 4-5 iterations.**
 * - **Bisection fallback ensures robustness for extreme cases.**
 * - **High-eccentricity solver prevents instability for $e \approx 1$.**
 *
 * ---
 *
 * @param {Radians} M - Mean anomaly ($M$) in **radians**.
 * @param {number} e - Orbital eccentricity ($0 \leq e < 1$).
 * @param {number} [maxIter=50] - Maximum number of **iterations** before fallback.
 * @param {number} [tolerance=1e-9] - Convergence criterion for stopping the iteration.
 * @returns {Radians} The **eccentric anomaly** ($E$) in **radians** (wrapped to $[0, 2\pi]$).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).
 *
 * ---
 *
 * @example
 * ```ts
 * import { solveKepler } from './solve-kepler';
 *
 * // Example 1: Moderate eccentricity
 * const M = Math.PI / 4; // 45 degrees in radians
 * const e = 0.1; // Orbital eccentricity
 * const result = solveKepler(M, e);
 * console.log(result); // Output: Eccentric anomaly in radians
 * ```
 *
 * @example
 * ```ts
 * // Example 2: High-eccentricity orbit (e > 0.9)
 * const M_high = 1.5; // Mean anomaly in radians
 * const e_high = 0.95; // High eccentricity
 * console.log(solveKepler(M_high, e_high)); // Uses high-eccentricity solver
 * ```
 *
 * ---
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [Newton-Raphson Method (Wikipedia)](https://en.wikipedia.org/wiki/Newton%27s_method)
 * @see [Eccentric Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly#Eccentric_anomaly)
 * @see [RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
 * @category Solve for Kepler
 */
export const solveKepler = (
  M: Radians,
  e: number,
  maxIter = 50,
  tolerance = 1e-9
): Radians => {
  if (e < 0 || e >= 1) {
    throw new RangeError(`Invalid eccentricity: ${e}. Must be in range [0,1).`);
  }

  // **Use different solvers for high-eccentricity cases**
  if (e > 0.9) {
    return solveKeplerHighEccentricity(M, e, maxIter, tolerance);
  }

  // Use Newton-Raphson first; if it fails, fallback to bisection
  let E = solveKeplerNewtonRaphson(M, e, maxIter, tolerance);

  if (isNaN(E)) {
    E = solveKeplerBisection(M, e, maxIter, tolerance);
  }

  return wrapAngle(E);
};
