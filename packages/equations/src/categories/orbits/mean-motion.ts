/**
 * Compute **mean motion** for a (near-)circular reference orbit.
 *
 * Mean motion is the angular rate of the reference orbit:
 *
 * $$
 * n=\sqrt{\frac{\mu}{a^3}}
 * $$
 *
 * Where:
 * - $ \mu $ is the standard gravitational parameter of the central body
 * - $ a $ is the (circular) orbit radius / semi-major axis
 *
 * **Unit consistency**
 * - If $ \mu $ is in **m³/s²**, then $ a $ must be in **m** and the result is in **rad/s**.
 * - If $ \mu $ is in **km³/s²**, then $ a $ must be in **km** and the result is in **rad/s**.
 *
 * Common usage: reference rate for relative motion models (e.g., Clohessy–Wiltshire / Hill),
 * orbital period estimates, and circular-orbit dynamics.
 *
 * ::: practice The ISS, orbit by orbit
 *
 * **15.51 orbits/day**
 *
 * _Mean motion at 420 km altitude_
 *
 * The function returns 0.001128 rad/s. Multiply by 86 400 s and divide by 2π for
 * orbits per day, the unit used in a satellite's two-line elements (TLEs).
 *
 * ```ts
 * meanMotion(3.986004418e14, 6.371e6 + 420e3); // ≈ 0.001128 rad/s
 * ```
 *
 * :::
 *
 * @param mu - Standard gravitational parameter $ \mu $ (finite, > 0).
 * @param a - Semi-major axis $ a $ (finite, > 0).
 * @returns Mean motion $ n $ in **rad/s**.
 * @throws {TypeError} If `mu` or `a` is not a finite number.
 * @throws {RangeError} If `mu <= 0` or `a <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth example (km-based):
 * const mu = 398600.4418; // km³/s²
 * const a = 7000;         // km
 * const n = meanMotion(mu, a); // rad/s
 * ```
 */
export const meanMotion = (mu: number, a: number): number => {
  if (!Number.isFinite(mu))
    throw new TypeError(`mu must be finite. Received: ${mu}`);

  if (!Number.isFinite(a))
    throw new TypeError(`a must be finite. Received: ${a}`);

  if (mu <= 0) throw new RangeError(`mu must be > 0. Received: ${mu}`);

  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  return Math.sqrt(mu / (a * a * a));
};
