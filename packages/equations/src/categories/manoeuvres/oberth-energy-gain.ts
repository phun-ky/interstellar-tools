/**
 * **Oberth effect (specific energy gain near periapsis)**.
 *
 * **Approximation**
 *
 * $$
 * \Delta \varepsilon \;\approx\; v\,\Delta v
 * $$
 *
 * where:
 * - ($ v $) is the instantaneous **speed** at the burn point (typically periapsis),
 * - ($ \Delta v $) is the **impulsive** prograde burn magnitude,
 * - ($ \Delta \varepsilon $) is the change in **specific mechanical energy** (J/kg ≡ m²/s²).
 *
 * **Units**
 * - Inputs: ($ v $) in **m/s**, ($ \Delta v $) in **m/s**.
 * - Output: ($ \Delta \varepsilon $) in **J/kg** (m²/s²).
 *
 * ::: info Notes
 *
 * - This approximation assumes a **small**, **prograde** impulse (aligned with velocity) and
 *   neglects higher-order terms ($ \tfrac{1}{2}(\Delta v)^2 $).
 * - A more general small-angle form is ($ \Delta \varepsilon \approx v\,\Delta v\cos\phi $),
 *   where ($ \phi $) is the angle between the velocity vector and the burn direction.
 *
 * :::
 *
 * @param {number} v  Instantaneous speed at burn point (m/s). Must be finite and ≥ 0.
 * @param {number} dv Impulsive prograde Δv magnitude (m/s). Must be finite and ≥ 0.
 * @returns {number} Specific energy gain ($ \Delta \varepsilon $) (J/kg).
 * @throws {TypeError}  If inputs are not numbers.
 * @throws {RangeError} If inputs are non-finite or negative.
 * @group Manoeuvres
 * @example
 * ```ts
 * import { oberthEnergyGain, circularSpeed } from "@interstellar-tools/equations";
 *
 * // Earth's GM (μ) in m³/s²
 * const muEarth = 3.986004418e14;
 *
 * // Example: small prograde burn at LEO periapsis (~400 km altitude)
 * const rLEO = 6378e3 + 400e3;      // m
 * const vLEO = circularSpeed(rLEO, muEarth); // m/s ≈ 7670
 *
 * // Suppose guidance commands a small impulsive burn Δv = 50 m/s at periapsis
 * const dv = 50; // m/s
 *
 * // Oberth approximation: Δε ≈ v · Δv  (specific energy gain, J/kg ≡ m²/s²)
 * const deltaEps = oberthEnergyGain(vLEO, dv);
 *
 * // For intuition, translate Δε to an approximate change in semi-major axis (elliptic case):
 * // ε = -μ/(2a)  ⇒  Δa ≈ (a² / μ) · Δε (valid for small changes around circular LEO)
 * const aLEO = rLEO; // circular → a = r
 * const deltaA = (aLEO * aLEO / muEarth) * deltaEps; // meters
 *
 * console.log(`LEO speed v ≈ ${vLEO.toFixed(1)} m/s`);
 * console.log(`Prograde Δv  = ${dv.toFixed(1)} m/s`);
 * console.log(`Specific energy gain Δε ≈ ${deltaEps.toFixed(0)} J/kg`);
 * console.log(`Approx. semi-major axis change Δa ≈ ${deltaA.toFixed(0)} m`);
 *
 * // Tip: If the burn is not perfectly prograde by angle φ (in radians),
 * // scale by cos φ: Δε ≈ v · Δv · cos φ  (small-angle approximation).
 * ```
 */
export const oberthEnergyGain = (v: number, dv: number): number => {
  if (typeof v !== 'number' || typeof dv !== 'number') {
    throw new TypeError('v and dv must be numbers (m/s).');
  }

  if (!Number.isFinite(v) || v < 0) {
    throw new RangeError('v must be finite and ≥ 0 (m/s).');
  }

  if (!Number.isFinite(dv) || dv < 0) {
    throw new RangeError('dv must be finite and ≥ 0 (m/s).');
  }

  // Δε ≈ v · Δv  (prograde, small-Δv approximation)
  return v * dv;
};
