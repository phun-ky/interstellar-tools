import type { Radians } from '@interstellar-tools/types';

import { trueToHyperbolicAnomaly } from '../anomalies/true-to-hyperbolic-anomaly.js';

/**
 * Compute the **time of flight between two points on a hyperbola**, given by their true anomalies.
 *
 * $$
 * t_2 - t_1 = \sqrt{\frac{-a^3}{\mu}}\,\Big[(e\sinh F_2 - F_2) - (e\sinh F_1 - F_1)\Big]
 * $$
 *
 * with each hyperbolic anomaly $ F $ from {@link trueToHyperbolicAnomaly}.
 *
 * **Units**
 * - Inputs: `nu1`, `nu2` in **radians**, `e` dimensionless, `a` in **m** (negative), `mu` in **m³/s²**.
 * - Output: time in **s**, negative if `nu2` comes before `nu1`.
 *
 * ::: info Notes
 *
 * - Both points must lie inside the asymptotes. The incoming branch can be given as negative angles or just below 2π.
 * - Crossing periapsis needs no special handling: $ F $ changes sign there.
 * - To go from a time to a position, solve $ M_h = e\sinh F - F $ with {@link solveKeplerHyperbolic}, then use {@link hyperbolicToTrueAnomaly}.
 *
 * :::
 *
 * ::: practice Apollo 11, falling towards the Moon
 *
 * **13.8 h**
 *
 * _From the edge of the Moon's sphere of influence, 62 640 km out, to closest approach_
 *
 * The flight took 14 h 10 min from crossing into the sphere to lighting the engine for lunar orbit insertion. Patched conics leave out Earth's pull inside the sphere, one reason the two differ.
 *
 * ```ts
 * const e = 1.44; // approach hyperbola
 * const a = -4_203_000; // m
 * const p = a * (1 - e * e);
 * const nuSoi = -Math.acos((p / 62_640_000 - 1) / e) as Radians; // incoming
 * hyperbolicTimeOfFlight(nuSoi, 0 as Radians, e, a, 4.902800118e12); // ≈ 49 600 s
 * ```
 *
 * :::
 *
 * @param nu1 - True anomaly at the start $ \nu_1 $ in **radians** (finite, inside the asymptotes).
 * @param nu2 - True anomaly at the end $ \nu_2 $ in **radians** (finite, inside the asymptotes).
 * @param e - Eccentricity $ e $ (finite, > 1).
 * @param a - Semi-major axis $ a $ in **m** (finite, < 0).
 * @param mu - Gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @returns Time of flight in **s** from `nu1` to `nu2`.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `e <= 1`, `a >= 0`, `mu <= 0`, or either true anomaly is at or beyond the asymptotes.
 * @group Orbits
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // From periapsis to 90° on a hyperbola with e = 2, a = -10 000 km, around Earth
 * const t = hyperbolicTimeOfFlight(0 as Radians, (Math.PI / 2) as Radians, 2, -10_000e3, 3.986004418e14);
 * // t ≈ 3 401 s
 * ```
 *
 * @see {@link solveKeplerHyperbolic}
 * @see https://en.wikipedia.org/wiki/Hyperbolic_trajectory Hyperbolic trajectory
 */
export const hyperbolicTimeOfFlight = (
  nu1: Radians,
  nu2: Radians,
  e: number,
  a: number,
  mu: number
): number => {
  for (const [name, x] of [
    ['nu1', nu1],
    ['nu2', nu2],
    ['e', e],
    ['a', a],
    ['mu', mu]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (e <= 1) throw new RangeError(`e must be > 1. Received: ${e}`);

  if (a >= 0)
    throw new RangeError(`a must be < 0 for a hyperbola. Received: ${a}`);

  if (mu <= 0) throw new RangeError(`mu must be > 0. Received: ${mu}`);

  const meanAnomaly = (nu: Radians) => {
    const F = trueToHyperbolicAnomaly(nu, e);

    return e * Math.sinh(F) - F;
  };

  return Math.sqrt((-a * a * a) / mu) * (meanAnomaly(nu2) - meanAnomaly(nu1));
};
