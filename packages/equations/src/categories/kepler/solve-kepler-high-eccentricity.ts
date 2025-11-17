import { Radians } from '@interstellar-tools/types';

import { wrapAngle } from '../angle/wrap-angle';

/* node:coverage disable */
/**
 * Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly eccentric orbits
 * ($e > 0.9$) using an iterative numerical approach.
 *
 * **Mathematical Explanation:**
 *
 * Kepler's equation for eccentric anomaly ($E$) is:
 *
 * ![solve-kelper-high-eccentricity-elliptical-orbit](https://raw.githubusercontent.com/phun-ky/interstellar/b607daf8e014128a6dceb3cf8d522676f06bc233/public/solve-kelper-high-eccentricity-elliptical-orbit.svg)
 *
 * $$
 * M = E - e \sin(E) \quad \text{(for elliptical orbits, } 0 < e < 1\text{)}
 * $$
 *
 * ![solve-kepler-high-eccentricity-hyperbolic-orbit](https://raw.githubusercontent.com/phun-ky/interstellar/b607daf8e014128a6dceb3cf8d522676f06bc233/public/solve-kepler-high-eccentricity-hyperbolic-orbit.svg)
 *
 * $$
 * M = e \sinh(E) - E \quad \text{(for hyperbolic orbits, } e > 1\text{)}
 * $$
 *
 * For orbits with **high eccentricity** ($e \approx 1$), standard Newton-Raphson solvers struggle
 * due to extreme changes in orbital velocity near perihelion. Instead, we apply a **fixed-point iteration**
 * method that is more stable for these cases.
 *
 * ---
 *
 * **Solving Strategy:**
 * 1. **Initial Guess:**
 *    - The solver starts with $E_0 = M$ and refines using:
 * $$
 * E_0 = M \pm \frac{e \sin(M)}{1 - e \cos(M)}
 * $$
 *
 * 2. **Iterative Refinement:**
 *    - The method updates $E$ using:
 * $$
 * \Delta E = \frac{E - e \sin(E) - M}{1 - e \cos(E)}
 * $$
 * for elliptical orbits.
 *
 * $$
 * \Delta E = \frac{e \sinh(E) - E - M}{e \cosh(E) - 1}
 * $$
 * for hyperbolic orbits.
 *
 *    - Iteration stops when:
 * $$
 * |E_{n+1} - E_n| < \text{tolerance}
 * $$
 * (default tolerance is **1e-9**).
 *
 * 3. **Angle Wrapping (Elliptical Only):**
 *    - The result is wrapped using `wrapAngle()` for consistency.
 *
 *
 * **Performance Considerations:**
 * - **Typically converges in fewer than 10 iterations for $e > 0.9$.**
 * - **Time complexity:** $O(1)$ for standard convergence.
 *
 *
 * @param {Radians} M - Mean anomaly ($M$) in **radians**.
 * @param {number} e - Orbital eccentricity ($e > 0.9$ for high-eccentricity orbits).
 * @param {number} [maxIter=Math.max(300, Math.floor(5 + 3 * Math.log(1 + Math.abs(M))))] - Maximum number of **iterations** before failure.
 * @param {number} [tolerance=1e-9] - Convergence criterion for stopping the iteration.
 * @returns {Radians} The **eccentric anomaly** ($E$) in **radians** (wrapped to $[-\pi, \pi]$ for elliptical orbits).
 *
 *
 * @example
 * ```ts
 * import { solveKeplerHighEccentricity } from './solve-kepler';
 *
 * const M = Math.PI / 4; // 45 degrees in radians
 * const e = 0.95; // High orbital eccentricity
 * const result = solveKeplerHighEccentricity(M, e);
 * console.log(result); // Output: Eccentric anomaly in radians
 * ```
 *
 * @example
 * ```ts
 * // Hyperbolic orbit example (e > 1)
 * const M_hyperbolic = 2.0; // Mean anomaly for hyperbolic orbit
 * const e_hyperbolic = 1.2; // Hyperbolic eccentricity
 * console.log(solveKeplerHighEccentricity(M_hyperbolic, e_hyperbolic));
 * ```
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [Hyperbolic Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly)
 * @group Kepler Solvers
 *
 */
/* node:coverage enable */
export const solveKeplerHighEccentricity = (
  M: Radians,
  e: number,
  maxIter = Math.max(300, Math.floor(5 + 3 * Math.log(1 + Math.abs(M)))),
  tolerance = 1e-9
): Radians => {
  if (e < 0) {
    throw new RangeError(`Invalid eccentricity: ${e}. Must be e ≥ 0.`);
  }

  let E: number;

  // Use a more accurate initial guess for highly eccentric orbits
  if (M < 0) {
    E = M - (e * Math.sin(M)) / (1 - e * Math.cos(M));
  } else {
    E = M + (e * Math.sin(M)) / (1 - e * Math.cos(M));
  }

  let delta = 1;
  let iter = 0;
  let lastValidE = E;

  while (Math.abs(delta) > tolerance && iter < maxIter) {
    let fE: number;
    let dfE: number;

    // **Elliptical Orbit (0.9 < e < 1)**
    if (e < 1) {
      fE = E - e * Math.sin(E) - M;
      dfE = 1 - e * Math.cos(E);
    }
    // **Hyperbolic Orbit (e > 1)**
    else {
      const sinhE = Math.sinh(E);
      const coshE = Math.cosh(E);

      fE = e * sinhE - E - M;
      dfE = e * coshE - 1;
    }

    // **Prevent divide-by-zero issues**
    dfE = Math.max(Math.abs(dfE), 1e-6) * Math.sign(dfE);

    delta = fE / dfE;

    // **Clamp delta to prevent large jumps**
    delta = Math.sign(delta) * Math.min(Math.abs(delta), 0.5);

    E -= delta;
    iter++;

    if (!isNaN(E) && isFinite(E)) {
      lastValidE = E;
    }

    // **Clamp extreme values to prevent divergence**
    if (Math.abs(E) > 100) {
      E = 100 * Math.sign(E);
      break;
    }
  }

  // **Wrap angles to the range [-π, π] for elliptical orbits**
  if (e < 1) {
    lastValidE = wrapAngle(lastValidE);
  }

  return lastValidE as Radians;
};
