import { TWO_PI } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

import { solveKeplerBisection } from './solve-kepler-bisection.js';
import { solveKeplerHighEccentricity } from './solve-kepler-high-eccentricity.js';
import { solveKeplerNewtonRaphson } from './solve-kepler-newton-raphson.js';

/**
 * Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach:
 *
 * - **Newton-Raphson method** for fast convergence.
 * - **High-eccentricity solver** for extreme orbits ($e > 0.9$).
 * - **Bisection fallback** if the selected solver doesn't return a root.
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
 *    - **The result is verified** against Kepler's equation ($|E - e\sin E - M| \leq$ `tolerance`,
 *      modulo $2\pi$). If the solver didn't converge (`NaN`), stopped at `maxIter`, or settled
 *      away from the root, it falls back to `solveKeplerBisection()`, which always brackets the root.
 *
 * 3. **Normalization:**
 *    - Kepler's equation is $2\pi$-periodic ($M + 2\pi k \mapsto E + 2\pi k$), so $M$ is first
 *      reduced to $[0, 2\pi)$ with `norm2pi()`. This keeps the solvers in their stable range
 *      for any finite $M$, including negative values and many revolutions.
 *    - The solution is normalized to $[0, 2\pi)$ with `norm2pi()`.
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
 * @returns {Radians} The **eccentric anomaly** ($E$) in **radians** (normalized to $[0, 2\pi)$).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the **eccentricity ($e$) is invalid** ($e < 0$ or $e \geq 1$).
 *
 * ---
 *
 * @example
 * ```ts
 * import { solveKepler } from '@interstellar-tools/equations';
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
 * @group Kepler Solvers
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

  // Kepler's equation is 2π-periodic, so solve for M in [0, 2π)
  const Mn = norm2pi(M) as Radians;

  // **Use different solvers for high-eccentricity cases**
  let E =
    e > 0.9
      ? solveKeplerHighEccentricity(Mn, e, maxIter, tolerance)
      : solveKeplerNewtonRaphson(Mn, e, maxIter, tolerance);

  // The iterative solvers can stop at maxIter or on a vanishing step away from
  // the root, so verify the result and fall back to bisection if needed
  const residual = norm2pi(E - e * Math.sin(E) - Mn);

  if (!(Math.min(residual, TWO_PI - residual) <= tolerance)) {
    E = solveKeplerBisection(Mn, e, maxIter, tolerance);
  }

  return norm2pi(E) as Radians;
};
