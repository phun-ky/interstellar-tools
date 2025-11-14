/**
 * **Circular speed** ($ v_c $) for a body in a circular orbit at radius ($ r $).
 *
 * **Definition**
 *
 * $$
 * v_c=\sqrt{\frac{\mu}{r}}
 * $$
 *
 * where ($ \mu $) is the standard gravitational parameter and ($ r $) is the distance
 * from the central body's center to the orbiting body.
 *
 * **Units**
 * - Inputs: ($ r $) in **meters (m)**, ($ \mu $) in **m³/s²**.
 * - Output: ($ v_c $) in **m/s**.
 *
 * ::: info
 *
 * - This is the special case of the vis-viva equation for circular orbits (($ a=r $)).
 * - If you need a non-circular orbit, use `visVivaSpeed(r, a, mu)`.
 *
 * :::
 *
 * @param {number} r  Orbital radius ($ r $) (m), must be finite and **> 0**.
 * @param {number} mu Gravitational parameter ($ \mu $) (m³/s²), must be finite and **≥ 0**.
 * @returns {number} Circular speed ($ v_c $) (m/s).
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If inputs are non-finite or out of domain.
 *
 * @see {@link visVivaSpeed}
 *
 * @example
 * ```ts
 * // LEO ~400 km altitude around Earth
 * const muEarth = 3.986004418e14; // m^3/s^2
 * const r = 6378e3 + 400e3;       // m
 * const v = circularSpeed(r, muEarth); // ≈ 7670 m/s
 * ```
 *
 * @category Orbits
 */
export const circularSpeed = (r: number, mu: number): number => {
  if (!Number.isFinite(r) || r <= 0) {
    throw new Error('r must be a finite, positive number (m).');
  }

  if (!Number.isFinite(mu) || mu < 0) {
    throw new Error('mu must be a finite, non-negative number (m^3/s^2).');
  }

  return Math.sqrt(mu / r);
};
