import type { Radians } from '@interstellar-tools/types';

import { asymptoteTrueAnomaly } from './asymptote-true-anomaly.js';

/**
 * Convert a **true anomaly** on a hyperbola to the **hyperbolic anomaly** $ F $.
 *
 * $$
 * \tanh\frac{F}{2} = \sqrt{\frac{e - 1}{e + 1}}\,\tan\frac{\nu}{2}
 * $$
 *
 * **Units**
 * - Inputs: `nu` in **radians**, `e` dimensionless.
 * - Output: $ F $ in **radians** (dimensionless, unbounded).
 *
 * ::: info Notes
 *
 * - The hyperbolic counterpart of the eccentric anomaly. Feed it to $ M_h = e \sinh F - F $ to get a time from periapsis.
 * - `nu` is wrapped to (-π, π] first, so the incoming branch can be given either as a negative angle or just below 2π, as {@link stateToElements} returns it.
 * - Only $ |\nu| < \nu_\infty $ exists on a hyperbola; see {@link asymptoteTrueAnomaly}.
 *
 * :::
 *
 * @param nu - True anomaly $ \nu $ in **radians** (finite, inside the asymptotes).
 * @param e - Eccentricity $ e $ (finite, > 1).
 * @returns Hyperbolic anomaly $ F $ in **radians**: negative before periapsis, positive after.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `e <= 1` or `nu` is at or beyond the asymptotes.
 * @group Anomalies
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const F = trueToHyperbolicAnomaly((Math.PI / 2) as Radians, 2);
 * // F ≈ 1.317 (cosh F = e)
 * ```
 *
 * @see {@link hyperbolicToTrueAnomaly}
 * @see https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly Hyperbolic anomaly
 */
export const trueToHyperbolicAnomaly = (nu: Radians, e: number): number => {
  for (const [name, x] of [
    ['nu', nu],
    ['e', e]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (e <= 1) throw new RangeError(`e must be > 1. Received: ${e}`);

  const wrapped = Math.atan2(Math.sin(nu), Math.cos(nu));

  if (Math.abs(wrapped) >= asymptoteTrueAnomaly(e))
    throw new RangeError(
      `nu is at or beyond the asymptotes (|nu| >= acos(-1/e)). Received: nu=${nu}, e=${e}`
    );

  return 2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan(wrapped / 2));
};
