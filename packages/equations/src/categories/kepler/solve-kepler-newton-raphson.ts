import { TWO_PI } from '@interstellar-tools/constants';
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
 *    - If **eccentricity is out of range** ($e < 0$ or $e \geq 1$), a `RangeError` is thrown.
 *    - Kepler's equation is $2\pi$-periodic ($M + 2\pi k \mapsto E + 2\pi k$), so the equation is
 *      solved for $M \bmod 2\pi$ and the whole turns are added back. Any finite $M$ works,
 *      including negative values and many revolutions.
 *
 * 2. **Initial Approximation** (Danby 1987, good for all $0 \leq e < 1$):
 *    $$
 *    E_0 = M + 0.85\, e \,\operatorname{sign}(\sin M)
 *    $$
 *
 * 3. **Newton-Raphson Iteration with Householder Acceleration:**
 *    - With $f(E) = E - e \sin(E) - M$, $f'(E) = 1 - e \cos(E)$, $f''(E) = e \sin(E)$ and
 *      $f'''(E) = e \cos(E)$, each step refines the Newton correction to third order:
 *      $$
 *      \delta_1 = -\frac{f}{f'}, \quad
 *      \delta_2 = -\frac{f}{f' + \tfrac{1}{2} \delta_1 f''}, \quad
 *      \Delta E = -\frac{f}{f' + \tfrac{1}{2} \delta_2 f'' + \tfrac{1}{6} \delta_2^2 f'''}
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
 * - **Typically converges in 3-4 iterations, including $e \to 1$.**
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
 * @see Danby, J. M. A. (1987). The solution of Kepler's equation, III. *Celestial Mechanics*, 40, 303–312.
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

  // Kepler's equation is 2π-periodic: solve within one turn, add the turns back
  const Mr = M % TWO_PI;
  const turns = M - Mr;

  // Danby's starting value, good for all 0 ≤ e < 1
  let E = Mr + 0.85 * e * Math.sign(Math.sin(Mr));
  let iter = 0;

  while (iter < maxIter) {
    const F = E - e * Math.sin(E) - Mr;
    const dF = 1 - e * Math.cos(E);
    const d2F = e * Math.sin(E);
    const d3F = e * Math.cos(E);
    // Newton's step, refined to third order (Householder / Danby)
    const delta1 = -F / dF;
    const delta2 = -F / (dF + 0.5 * delta1 * d2F);
    const correction =
      -F / (dF + 0.5 * delta2 * d2F + (1 / 6) * delta2 * delta2 * d3F);

    E += correction;

    if (Math.abs(correction) < tolerance) {
      return (E + turns) as Radians; // Converged
    }

    iter++;
  }

  return NaN; // Indicate failure
};
