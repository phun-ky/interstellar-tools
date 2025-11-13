/**
 * Gravitational constant **G** in SI units.
 *
 * Numerical value from CODATA 2018: `6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²` (relative standard uncertainty 2.2e-5).
 * Use this for Newtonian gravity calculations:
 *
 * $$
 * F = G\,\frac{m_1 m_2}{r^2}
 * $$
 *
 * @type {number}
 * @default 6.67430e-11
 *
 * @see https://physics.nist.gov/cgi-bin/cuu/Value?bg
 * @see https://en.wikipedia.org/wiki/Gravitational_constant
 *
 * @example
 * ```ts
 * // Standard gravitational parameter (mu) for Earth:
 * const M_earth = 5.97219e24; // kg
 * const mu_earth = G_SI * M_earth; // ≈ 3.986004e14 m^3/s^2
 * ```
 */
export const G_SI: number = 6.6743e-11;
