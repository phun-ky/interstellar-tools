import type { Radians } from '@interstellar-tools/types';

/**
 * The semi-major axis of a **repeat ground track** orbit: one whose track
 * over the ground repeats exactly after a whole number of revolutions in a
 * whole number of days, so a satellite revisits the same places on a fixed
 * cycle. Landsat 8 and 9 make 233 revolutions in 16 days.
 *
 * The track repeats when the satellite has crossed the equator northbound
 * $ k $ times while the ground has turned $ N $ times under the orbit's
 * plane:
 *
 * $$
 * k\,(\omega_\oplus - \dot\Omega) = N\,(n + \dot\omega + \dot M)
 * $$
 *
 * with the J2 drifts of the node, the perigee and the mean anomaly:
 *
 * $$
 * \begin{aligned}
 * \dot\Omega &= -\tfrac{3}{2} J_2 n \left(\tfrac{R}{p}\right)^2 \cos i \\
 * \dot\omega &= \tfrac{3}{4} J_2 n \left(\tfrac{R}{p}\right)^2 (5\cos^2 i - 1) \\
 * \dot M &= \tfrac{3}{4} J_2 n \left(\tfrac{R}{p}\right)^2 \sqrt{1 - e^2}\,(3\cos^2 i - 1)
 * \end{aligned}
 * $$
 *
 * solved for $ a $ by fixed-point iteration from the Kepler orbit.
 *
 * Where:
 * - $ k $, $ N $ are the revolutions and the days of the cycle
 * - $ \omega_\oplus $ is the planet's rotation rate (rad/s): 7.292115 × 10⁻⁵ for Earth
 * - $ n = \sqrt{\mu / a^3} $ is the mean motion, and $ p = a(1 - e^2) $
 * - $ J_2 $, $ R $, $ \mu $ are the planet's second zonal harmonic, equatorial radius (m) and gravitational parameter (m³/s²)
 *
 * **Units**
 * - Inputs: `mu` in **m³/s²**, `Re` in **m**, `i` in **radians**, `rotationRate` in **rad/s**.
 * - Output: $ a $ in **m**.
 *
 * ::: info Notes
 *
 * - `days` are **nodal days**: the time for the ground to turn once under the
 *   orbit's plane. For a sun-synchronous orbit they're solar days.
 * - Keep `revolutions` and `days` without a common factor: 30 in 2 repeats
 *   after 1 day, as 15 in 1.
 * - First order in J2. Drag lowers a real orbit slowly, so missions trim it
 *   to keep the cycle.
 *
 * :::
 *
 * @param revolutions - Revolutions in the cycle $ k $ (an integer, > 0).
 * @param days - Nodal days in the cycle $ N $ (an integer, > 0).
 * @param J2 - The planet's second zonal harmonic $ J_2 $ (finite).
 * @param mu - The planet's gravitational parameter $ \mu $ in **m³/s²** (finite, > 0).
 * @param Re - The planet's equatorial radius $ R $ in **m** (finite, > 0).
 * @param i - Inclination $ i $ in **radians** (finite).
 * @param e - Eccentricity $ e $ (finite, in [0, 1)).
 * @param rotationRate - The planet's rotation rate $ \omega_\oplus $ in **rad/s** (finite, > 0).
 * @returns The semi-major axis $ a $ in **m**.
 * @throws {TypeError} If any input is not a finite number, or `revolutions` or `days` is not an integer.
 * @throws {RangeError} If `revolutions`, `days`, `mu`, `Re` or `rotationRate` is not > 0, `e` is outside [0, 1), or the cycle has no orbit above the planet's surface.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Landsat 8 and 9: 233 revolutions in 16 days, at 98.2°
 * repeatGroundTrack(233, 16, 1.08262668e-3, 3.986004418e14, 6_378_137, toRad(98.2), 0.0001, 7.292115e-5);
 * // ≈ 7 077 700 m: Landsat's semi-major axis, 700 km above the equator
 * ```
 *
 * @see {@link sunSynchronousInclination}
 * @see {@link j2NodalPrecessionRate}
 */
export const repeatGroundTrack = (
  revolutions: number,
  days: number,
  J2: number,
  mu: number,
  Re: number,
  i: Radians,
  e: number,
  rotationRate: number
): number => {
  for (const [name, x] of [
    ['revolutions', revolutions],
    ['days', days],
    ['J2', J2],
    ['mu', mu],
    ['Re', Re],
    ['i', i],
    ['e', e],
    ['rotationRate', rotationRate]
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  for (const [name, x] of [
    ['revolutions', revolutions],
    ['days', days]
  ] as const)
    if (!Number.isInteger(x))
      throw new TypeError(`${name} must be an integer. Received: ${x}`);

  for (const [name, x] of [
    ['revolutions', revolutions],
    ['days', days],
    ['mu', mu],
    ['Re', Re],
    ['rotationRate', rotationRate]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  if (e < 0 || e >= 1)
    throw new RangeError(`e must be in [0, 1). Received: ${e}`);

  const cos2 = Math.cos(i) ** 2;
  const eta = Math.sqrt(1 - e * e);
  const ratio = revolutions / days;

  // Start from the Kepler orbit with that period, then let J2 move it: the
  // corrections are small, so a few rounds settle it to the last digit
  let n = ratio * rotationRate;
  let a = Math.cbrt(mu / (n * n));

  for (let k = 0; k < 30; k++) {
    const factor = 0.75 * J2 * (Re / (a * (1 - e * e))) ** 2;
    const nodeRate = -2 * factor * Math.cos(i);
    // The drifts are proportional to n: solve the condition for n
    const drift = factor * (5 * cos2 - 1 + eta * (3 * cos2 - 1));

    n = (ratio * rotationRate) / (1 + drift + ratio * nodeRate);
    a = Math.cbrt(mu / (n * n));
  }

  if (a * (1 - e) <= Re)
    throw new RangeError(
      `${revolutions} revolutions in ${days} days has no orbit above the surface: a = ${a} m.`
    );

  return a;
};
