import { G_SI } from '@interstellar-tools/constants';

/**
 * Two-body **gravitational parameter** ($ \mu $).
 *
 * **Definition**
 *
 * $$
 * \mu = G\,(M + m)
 * $$
 *
 * **Common approximation, when** ($ M \gg m $)
 *
 * $$
 * \mu \approx G\,M
 * $$
 *
 * **Units**
 * - Inputs: masses in **kg**, ( $ G $ ) in **m³·kg⁻¹·s⁻²** (defaults to `G_SI`).
 * - Output: ($ \mu $) in **m³/s²**.
 *
 * ::: tip
 *
 * - Use `m = 0` (default) for the standard published ($ \mu $) of a central body.
 * - When modelling a binary with comparable masses, pass both `M` and `m`.
 *
 * :::
 *
 * @param {number} M Mass of the primary body (kg).
 * @param {number} m Mass of the secondary body (kg). Defaults to `0`.
 * @param {number} [G] Gravitational constant. Defaults to `G_SI`.
 * @returns {number} Gravitational parameter ($ \mu $) in m³/s².
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `M` is non-finite or negative.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `m` is non-finite or negative.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `G` is non-finite or negative.
 *
 * @example
 * ```ts
 * // Standard gravitational parameter for Earth (approximate: m ~ 0)
 * const muEarth = gravitationalParameter(5.97219e24); // ≈ 3.986004e14 m³/s²
 *
 * // Earth + 1000 kg satellite: practically identical to GM
 * const muExact = gravitationalParameter(5.97219e24, 1000);
 *
 * // Earth–Moon system (two-body μ)
 * const muEarthMoon = gravitationalParameter(5.97219e24, 7.342e22);
 * ```
 * @group Gravity
 */
export const gravitationalParameter = (
  M: number,
  m: number = 0,
  G: number = G_SI
): number => {
  if (!Number.isFinite(M) || M < 0) {
    throw new Error('M must be a finite, positive number (kg).');
  }

  if (!Number.isFinite(m) || m < 0) {
    throw new Error('m must be a finite, positive number (kg).');
  }

  if (!Number.isFinite(G) || G <= 0) {
    throw new Error('G must be a finite, positive number (m^3·kg^-1·s^-2).');
  }

  return G * (M + m);
};
