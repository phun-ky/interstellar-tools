/** sinh x - x, from its Taylor series for small x to avoid cancellation. */
const sinhMinusX = (x: number): number => {
  if (Math.abs(x) > 0.5) return Math.sinh(x) - x;

  const x2 = x * x;

  let term = (x * x2) / 6;
  let sum = term;

  for (let k = 5; Math.abs(term) > 1e-17 * Math.abs(sum); k += 2) {
    term *= x2 / ((k - 1) * k);
    sum += term;
  }

  return sum;
};

/**
 * Solve **Kepler's equation for a hyperbola**: find the hyperbolic anomaly $ F $ from the hyperbolic mean anomaly $ M_h $.
 *
 * $$
 * M_h = e \sinh F - F
 * $$
 *
 * solved with Newton's method:
 *
 * $$
 * F_{n+1} = F_n - \frac{e \sinh F_n - F_n - M_h}{e \cosh F_n - 1}, \qquad F_0 = \min\left(\operatorname{asinh}\frac{|M_h|}{e - 1},\ \sqrt[3]{\frac{6|M_h|}{e}}\right)
 * $$
 *
 * **Units**
 * - Inputs: `Mh` in **radians**, `e` dimensionless.
 * - Output: $ F $ in **radians** (dimensionless, unbounded).
 *
 * ::: info Notes
 *
 * - The equation is odd in $ F $, so the solver works on $ |M_h| $ and restores the sign. Negative values are before periapsis.
 * - $ F_0 $ is an upper bound on the root, since $ e\sinh F - F $ is at least $ (e-1)\sinh F $ and at least $ (e-1)F + eF^3/6 $. The function is increasing and convex for $ F > 0 $, so Newton's method converges monotonically from there, even close to $ e = 1 $ where the derivative $ e\cosh F - 1 $ is small near periapsis.
 * - Unlike an ellipse, a hyperbola isn't periodic: $ M_h $ isn't reduced to one turn.
 * - {@link solveKeplerHighEccentricity} also accepts $ e > 1 $, but this solver throws when it doesn't converge instead of returning its last estimate.
 *
 * :::
 *
 * @param Mh - Hyperbolic mean anomaly $ M_h $ in **radians** (finite).
 * @param e - Eccentricity $ e $ (finite, > 1).
 * @param tolerance - Stop when a step is smaller than `tolerance * max(1, |F|)`. Defaults to `1e-14`.
 * @param maxIter - Maximum number of Newton steps. Defaults to `50`.
 * @returns The hyperbolic anomaly $ F $ in **radians**, with the sign of `Mh`.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `e <= 1`, `tolerance <= 0` or `maxIter < 1`.
 * @throws {Error} If the iteration doesn't converge within `maxIter` steps.
 * @group Kepler Solvers
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const F = solveKeplerHyperbolic(12.66 as Radians, 1.44);
 * // F ≈ 3.087, and 1.44 * sinh(F) - F ≈ 12.66
 * ```
 *
 * @see {@link hyperbolicTimeOfFlight}
 * @see https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly Hyperbolic anomaly
 */
export const solveKeplerHyperbolic = (
  Mh: number,
  e: number,
  tolerance = 1e-14,
  maxIter = 50
): number => {
  for (const [name, x] of [
    ['Mh', Mh],
    ['e', e],
    ['tolerance', tolerance],
    ['maxIter', maxIter]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (e <= 1) throw new RangeError(`e must be > 1. Received: ${e}`);

  if (tolerance <= 0)
    throw new RangeError(`tolerance must be > 0. Received: ${tolerance}`);

  if (maxIter < 1)
    throw new RangeError(`maxIter must be >= 1. Received: ${maxIter}`);

  const M = Math.abs(Mh);

  // Start above the root, where Newton's method can't overshoot
  let F = Math.min(Math.asinh(M / (e - 1)), Math.cbrt((6 * M) / e));

  for (let iter = 0; iter < maxIter; iter++) {
    // e sinh F - F - M, written so nothing cancels when e ≈ 1 and F is small
    const f = (e - 1) * F + e * sinhMinusX(F) - M;
    const step = f / (e * Math.cosh(F) - 1);

    F -= step;

    if (Math.abs(step) <= tolerance * Math.max(1, Math.abs(F)))
      return Math.sign(Mh) * F;
  }

  throw new Error(
    `solveKeplerHyperbolic did not converge in ${maxIter} steps. Received: Mh=${Mh}, e=${e}`
  );
};
