import { assertFinite, assertPositive } from './validate.js';

/**
 * Compute the **convective heat flux at the stagnation point** of an entry vehicle, with the Sutton–Graves relation.
 *
 * $$
 * \dot q = k\,\sqrt{\frac{\rho}{R_n}}\;V^3
 * $$
 *
 * Where:
 * - $ \rho $ is the free-stream density (kg/m³)
 * - $ R_n $ is the nose radius: the radius of curvature at the stagnation point (m)
 * - $ V $ is the speed (m/s)
 * - $ k $ depends on the atmosphere's composition: about $ 1.7415 \times 10^{-4} $ kg$^{1/2}$/m for Earth's air and $ 1.9027 \times 10^{-4} $ for Mars
 *
 * **Units**
 * - Inputs: `rho` in **kg/m³**, `V` in **m/s**, `Rn` in **m**, `k` in **kg^½/m**.
 * - Output: $ \dot q $ in **W/m²**.
 *
 * ::: info Notes
 *
 * - The $ V^3 $ is why returning from the Moon is so much harder on a heat shield than returning from Earth orbit: 11 km/s against 7.8 km/s is almost three times the heating.
 * - A blunter nose (larger $ R_n $) heats less, which is why capsules have broad, rounded heat shields rather than sharp points.
 * - Convective heating only. At lunar return speeds the hot shock layer also radiates, which this doesn't include.
 *
 * :::
 *
 * @param rho - Free-stream density $ \rho $ in **kg/m³** (finite, > 0).
 * @param V - Speed $ V $ in **m/s** (finite, > 0).
 * @param Rn - Nose radius $ R_n $ in **m** (finite, > 0).
 * @param k - Sutton–Graves constant $ k $ (finite, > 0). Defaults to `1.7415e-4`, for Earth.
 * @returns Stagnation-point heat flux $ \dot q $ in **W/m²**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If any input is `<= 0`.
 * @group Entry
 *
 * @example
 * ```ts
 * // 11 km/s at about 60 km (ρ ≈ 3 × 10⁻⁴ kg/m³), with a 4.7 m nose radius
 * const q = stagnationHeatFlux(3e-4, 11_000, 4.69);
 * // q ≈ 1.85 MW/m²
 * ```
 *
 * @see {@link ballisticEntrySpeed}
 * @see https://en.wikipedia.org/wiki/Atmospheric_entry Atmospheric entry
 */
export const stagnationHeatFlux = (
  rho: number,
  V: number,
  Rn: number,
  k = 1.7415e-4
): number => {
  const inputs = [
    ['rho', rho],
    ['V', V],
    ['Rn', Rn],
    ['k', k]
  ] as const;

  assertFinite(inputs);
  assertPositive(inputs);

  return k * Math.sqrt(rho / Rn) * V ** 3;
};
