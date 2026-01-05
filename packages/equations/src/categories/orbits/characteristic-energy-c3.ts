/**
 * Compute **characteristic energy** (C3) from hyperbolic excess speed.
 *
 * Characteristic energy is defined as the square of the hyperbolic excess velocity:
 *
 * $$
 * C_3 = v_{\infty}^2
 * $$
 *
 * - If `vInfinity` is in **km/s**, `C3` is in **(km/s)²**.
 * - If `vInfinity` is in **m/s**, `C3` is in **(m/s)²**.
 *
 * Common usage: preliminary interplanetary mission design and launch performance
 * comparisons (e.g., "available C3" from a launch vehicle).
 *
 * @param vInfinity - Hyperbolic excess speed $ v_{\infty} $ (must be a finite number).
 * @returns Characteristic energy $ C_3 $ in squared speed units (e.g., (km/s)² or (m/s)²).
 * @throws {TypeError} If `vInfinity` is not a finite number.
 * @group Orbits
 *
 * @example
 * ```ts
 * // v∞ in km/s
 * const vInf = 3.2;
 * const c3 = characteristicEnergyC3(vInf);
 * // c3 === 10.24  // (km/s)²
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Characteristic_energy
 */
export const characteristicEnergyC3 = (vInfinity: number): number => {
  if (!Number.isFinite(vInfinity)) {
    throw new TypeError(
      `vInfinity must be a finite number. Received: ${vInfinity}`
    );
  }

  return vInfinity * vInfinity;
};
