/**
 * Compute **sphere of influence** radius (patched conics approximation).
 *
 * Equation:
 * $$
 * r_{\text{SOI}} \approx a \left(\frac{m}{M}\right)^{2/5}
 * $$
 *
 * Where:
 * - `a` is the semi-major axis of the secondary body's orbit about the primary (m or km)
 * - `m` is the mass of the secondary body (e.g., planet) (kg)
 * - `M` is the mass of the primary body (e.g., Sun) (kg)
 *
 * Units:
 * - Output `rSOI` has the same distance unit as `a` (since the mass ratio is dimensionless).
 *
 * @param {number} a Semi-major axis `a` of the secondary around the primary (finite, > 0).
 * @param {number} m Mass of the secondary body `m` (finite, > 0).
 * @param {number} M Mass of the primary body `M` (finite, > 0).
 * @returns {number} Sphere of influence radius `rSOI` in the same distance units as `a`.
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `a <= 0`, `m <= 0`, or `M <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Example (Earth around Sun; km-based a):
 * const aKm = 149_597_870.7;      // km
 * const mEarth = 5.972e24;        // kg
 * const mSun = 1.9885e30;         // kg
 *
 * const rSoiKm = sphereOfInfluenceRadius(aKm, mEarth, mSun);
 * ```
 */
export const sphereOfInfluenceRadius = (
  a: number,
  m: number,
  M: number
): number => {
  if (!Number.isFinite(a)) {
    throw new TypeError(`a must be a finite number. Received: ${a}`);
  }

  if (!Number.isFinite(m)) {
    throw new TypeError(`m must be a finite number. Received: ${m}`);
  }

  if (!Number.isFinite(M)) {
    throw new TypeError(`M must be a finite number. Received: ${M}`);
  }

  if (a <= 0) {
    throw new RangeError(`a must be > 0. Received: ${a}`);
  }

  if (m <= 0) {
    throw new RangeError(`m must be > 0. Received: ${m}`);
  }

  if (M <= 0) {
    throw new RangeError(`M must be > 0. Received: ${M}`);
  }

  return a * Math.pow(m / M, 2 / 5);
};
