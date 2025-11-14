/**
 * **Kepler's 3rd law** - orbital period ($ T $) from semi-major axis ($ a $) and gravitational parameter ($ \mu $).
 *
 * **Definition**
 *
 * $$
 * T = 2\pi \sqrt{\frac{a^3}{\mu}}
 * $$
 *
 * **Units**
 * - Inputs: ($ a $) in **meters (m)**, ($ \mu $) in **m³/s²**.
 * - Output: ($ T $) in **seconds (s)**.
 *
 * ::: info
 *
 * - Valid for **Keplerian (two-body) bound orbits** with ($ a>0 $) (ellipses). Not defined for parabolic/hyperbolic trajectories.
 * - ($ \mu $) is the **standard gravitational parameter** of the central body (e.g., Earth ($ \approx 3.986004418\times10^{14}\ \text{m}^3/\text{s}^2 $)).
 *
 * :::
 *
 * @param {number} a  Semi-major axis (m), must be finite and **> 0**.
 * @param {number} mu Gravitational parameter (m³/s²), must be finite and **> 0**.
 * @returns {number} Orbital period ($ T $) (s).
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If inputs are non-finite or out of domain.
 *
 * @example
 * ```ts
 * // GEO: a ≈ 42,164 km → T ≈ 86,164 s (one sidereal day)
 * const a = 42164e3;                 // m
 * const muEarth = 3.986004418e14;    // m^3/s^2
 * const T = keplerPeriod(a, muEarth); // ≈ 86164 s
 * ```
 *
 * @example
 * ```ts
 * // LEO-ish circular: a ≈ Earth radius + 400 km
 * const a = 6378e3 + 400e3;          // m
 * const muEarth = 3.986004418e14;    // m^3/s^2
 * const T = keplerPeriod(a, muEarth); // ≈ 5550 s (~92.5 min)
 * ```
 *
 * @category Orbits
 */
export const keplerPeriod = (a: number, mu: number): number => {
  if (!Number.isFinite(a) || a <= 0) {
    throw new Error('a must be a finite, positive number (meters).');
  }

  if (!Number.isFinite(mu) || mu <= 0) {
    throw new Error('mu must be a finite, positive number (m^3/s^2).');
  }

  const a3 = a * a * a; // a^3

  return 2 * Math.PI * Math.sqrt(a3 / mu);
};
