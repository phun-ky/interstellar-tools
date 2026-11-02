import type { Radians } from '@interstellar-tools/types';

/**
 * Compute the **true anomaly of a hyperbola's asymptotes**: the limit a body on a hyperbola approaches but never reaches.
 *
 * $$
 * \nu_\infty = \arccos\left(-\frac{1}{e}\right)
 * $$
 *
 * **Units**
 * - Input: `e` dimensionless.
 * - Output: $ \nu_\infty $ in **radians**, in (π/2, π).
 *
 * ::: info Notes
 *
 * - The body comes in from $ -\nu_\infty $ and leaves towards $ +\nu_\infty $.
 * - The trajectory turns through $ 2\nu_\infty - \pi = 2\arcsin(1/e) $, the turning angle of a flyby; see `gravityAssistTurningAngle`.
 * - Just above $ e = 1 $ the asymptotes open to almost π (a near-parabola); for large $ e $ they close towards π/2 (a near-straight line).
 *
 * :::
 *
 * ::: practice Apollo 11, arriving at the Moon
 *
 * **134.0°**
 *
 * _Asymptote of the approach hyperbola, e = 1.44_
 *
 * Without the lunar orbit insertion burn at closest approach, the Moon's gravity would have bent Apollo 11's path through 88° and sent it back out of the Moon's sphere of influence.
 *
 * ```ts
 * asymptoteTrueAnomaly(1.44); // ≈ 2.338 rad, 134.0°
 * ```
 *
 * :::
 *
 * @param e - Eccentricity $ e $ (finite, > 1).
 * @returns Asymptote true anomaly $ \nu_\infty $ in **radians**.
 * @throws {TypeError} If `e` is not a finite number.
 * @throws {RangeError} If `e <= 1`.
 * @group Anomalies
 *
 * @example
 * ```ts
 * asymptoteTrueAnomaly(2); // 2π/3 (120°)
 * ```
 *
 * @see {@link trueToHyperbolicAnomaly}
 * @see https://en.wikipedia.org/wiki/Hyperbolic_trajectory Hyperbolic trajectory
 */
export const asymptoteTrueAnomaly = (e: number): Radians => {
  if (!Number.isFinite(e))
    throw new TypeError(`e must be a finite number. Received: ${e}`);

  if (e <= 1) throw new RangeError(`e must be > 1. Received: ${e}`);

  return Math.acos(-1 / e) as Radians;
};
