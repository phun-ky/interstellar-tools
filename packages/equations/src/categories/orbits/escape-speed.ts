/**
 * **Escape speed** ($ v_{\text{esc}} $) - minimum speed to escape a central body's gravity from radius ($ r $) (ignoring drag/perturbations).
 *
 * **Definition**
 *
 * $$
 * v_{\text{esc}}=\sqrt{\frac{2\mu}{r}}
 * $$
 *
 * where ($ \mu $) is the standard gravitational parameter and ($ r $) is the distance
 * from the central body's center.
 *
 * **Units**
 * - Inputs: ($ r $) in **meters (m)**, ($ \mu $) in **m³/s²**.
 * - Output: ($ v_{\text{esc}} $) in **m/s**.
 *
 * ::: info
 *
 * - Relationship to circular speed ($ v_c $): ($ v_{\text{esc}}=\sqrt{2}\,v_c $).
 * - This corresponds to **parabolic** specific energy (($ \varepsilon = 0 $)).
 * - For general (non-escape) orbital speed use `visVivaSpeed(r, a, mu)`.
 *
 * :::
 *
 * @param {number} r  Radius ($ r $) (m), distance from the central body’s center (must be finite and **> 0**).
 * @param {number} mu Gravitational parameter ($ \mu $) (m³/s²), must be finite and **≥ 0**.
 * @returns {number} Escape speed ($ v_{\text{esc}} $) (m/s).
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error}
 * If inputs are non-finite or out of domain.
 *
 * @example
 * ```ts
 * // Near Earth's surface (approx.)
 * const muEarth = 3.986004418e14;     // m³/s²
 * const rSurface = 6378e3;            // m
 * const vEsc = escapeSpeed(rSurface, muEarth); // ≈ 11186 m/s
 * ```
 *
 * @example
 * ```ts
 * // LEO ~400 km altitude: r = R_E + 400 km
 * const muEarth = 3.986004418e14;
 * const rLEO = 6378e3 + 400e3;
 * const vEsc = escapeSpeed(rLEO, muEarth); // ≈ 10860 m/s
 * ```
 *
 * @group Orbits
 */
export const escapeSpeed = (r: number, mu: number): number => {
  if (!Number.isFinite(r) || r <= 0) {
    throw new Error('r must be a finite, positive number (m).');
  }

  if (!Number.isFinite(mu) || mu < 0) {
    throw new Error('mu must be a finite, non-negative number (m³/s²).');
  }

  return Math.sqrt((2 * mu) / r);
};
