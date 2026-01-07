import type { Radians } from '@interstellar-tools/types';

/**
 * Compute **J2 nodal precession** (RAAN drift) for an orbit about an oblate body.
 *
 * Equation (common approximation):
 * $$
 * \dot{\Omega}\approx-\frac{3}{2}J_2\,n\left(\frac{R_e}{a}\right)^2\frac{\cos i}{(1-e^2)^2}
 * $$
 *
 * Where:
 * - $ J_2 $ is the second zonal harmonic (dimensionless)
 * - $ n $ is mean motion (rad/s)
 * - $ R_e $ is the body's equatorial radius (m or km)
 * - $ a $ is semi-major axis (m or km)
 * - $ i $ is inclination (radians)
 * - $ e $ is eccentricity (dimensionless)
 *
 * Units:
 * - If `n` is in rad/s and `i` is in radians, the result is in **rad/s**.
 * - `Re` and `a` must use the same distance unit.
 *
 * @param {number} J2 Second zonal harmonic (finite).
 * @param {number} n Mean motion (finite, >= 0), in rad/s.
 * @param {number} Re Equatorial radius (finite, > 0).
 * @param {number} a Semi-major axis (finite, > 0).
 * @param {Radians} i Inclination (finite), in radians.
 * @param {number} e Eccentricity (finite, 0 <= e < 1).
 * @returns {number} RAAN drift rate $\dot{\Omega}$ in rad/s.
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `n < 0`, `Re <= 0`, `a <= 0`, or `e` is outside [0,1].
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth-ish example (units must be consistent):
 * const J2 = 1.08262668e-3;
 * const n = 0.001078;            // rad/s (roughly LEO)
 * const Re = 6378.137;           // km
 * const a = 7000;                // km
 * const i = (98 * Math.PI) / 180 as Radians;
 * const e = 0.001;
 *
 * const raanDot = j2NodalPrecessionRate(J2, n, Re, a, i, e);
 * ```
 * @see https://science.nasa.gov/wp-content/uploads/2023/05/GDC_OrbitPrimer.pdf?emrc=5e452c NASA GSFC - GDC Orbit Primer (includes nodal precession / regression formulas)
 * @see https://en.wikipedia.org/wiki/Nodal_precession Wikipedia - Nodal precession (gives common J2 RAAN drift approximation)
 * @see https://ai-solutions.com/_freeflyeruniversityguide/j2_perturbation.htm FreeFlyer University Guide - J2 perturbation (mission-design oriented explanation + formulas)
 * @see https://articles.adsabs.harvard.edu/pdf/1959AJ.....64..367K Kozai (1959) - The Motion of a Close Earth Satellite (classic primary source on secular J2 effects)
 * @see https://help.agi.com/stk/Content/stk/vehSat_orbitProp_2bodyJ2J4.htm AGI/STK Help - Two-Body with J2/J4 perturbations (practical propagation context)
 */
export const j2NodalPrecessionRate = (
  J2: number,
  n: number,
  Re: number,
  a: number,
  i: Radians,
  e: number
): number => {
  for (const [name, v] of [
    ['J2', J2],
    ['n', n],
    ['Re', Re],
    ['a', a],
    ['i', i],
    ['e', e]
  ] as const) {
    if (!Number.isFinite(v)) {
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
    }
  }

  if (n < 0) throw new RangeError(`n must be >= 0. Received: ${n}`);

  if (Re <= 0) throw new RangeError(`Re must be > 0. Received: ${Re}`);

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (e < 0 || e >= 1)
    throw new RangeError(`e must be in [0, 1]. Received: ${e}`);

  const oneMinusESq = 1 - e * e;

  // Guard against division by (near) zero when e ~ 1.
  if (oneMinusESq === 0) {
    throw new RangeError(`(1 - e^2) must be non-zero. Received e: ${e}`);
  }

  const factor = -1.5 * J2 * n * Math.pow(Re / a, 2);
  const denom = Math.pow(oneMinusESq, 2);

  return (factor * Math.cos(i)) / denom;
};
