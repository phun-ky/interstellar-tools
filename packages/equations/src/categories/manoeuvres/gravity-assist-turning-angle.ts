import type { Radians } from '@interstellar-tools/types';

/**
 * Compute **gravity-assist turning angle** (flyby deflection) for a hyperbolic encounter.
 *
 * Equation:
 * $$
 * \delta = 2\arcsin\!\left(\frac{1}{1+\frac{r_p v_{\infty}^2}{\mu}}\right)
 * $$
 *
 * Where:
 * - $ r_p $ is periapsis radius from the body's center (m or km)
 * - $ v_{\infty} $ is hyperbolic excess speed (m/s or km/s)
 * - $ \mu $ is the standard gravitational parameter (m³/s² or km³/s²)
 *
 * Unit consistency is required:
 * - If $ \mu $ is in m³/s², then $ r_p $ must be in m and $ v_{\infty} $ in m/s.
 * - If $ \mu $ is in km³/s², then $ r_p $ must be in km and $ v_{\infty} $ in km/s.
 *
 * @param {number} rp Periapsis radius $ r_p $ (finite, > 0).
 * @param {number} vInfinity Hyperbolic excess speed $ v_{\infty} $ (finite, >= 0).
 * @param {number} mu Standard gravitational parameter $ \mu $ (finite, > 0).
 * @returns {Radians} Turning angle $ \delta $ in **radians** (range: 0 to π).
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `rp <= 0`, `mu <= 0`, or `vInfinity < 0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // Example (km-based):
 * // rp = 7000 km, v∞ = 8 km/s, mu(Earth) = 398600.4418 km³/s²
 * const delta = gravityAssistTurningAngle(7000, 8, 398600.4418);
 * // delta is in radians
 * ```
 */
export const gravityAssistTurningAngle = (
  rp: number,
  vInfinity: number,
  mu: number
): Radians => {
  if (!Number.isFinite(rp)) {
    throw new TypeError(`rp must be a finite number. Received: ${rp}`);
  }

  if (!Number.isFinite(vInfinity)) {
    throw new TypeError(
      `vInfinity must be a finite number. Received: ${vInfinity}`
    );
  }

  if (!Number.isFinite(mu)) {
    throw new TypeError(`mu must be a finite number. Received: ${mu}`);
  }

  if (rp <= 0) {
    throw new RangeError(`rp must be > 0. Received: ${rp}`);
  }

  if (vInfinity < 0) {
    throw new RangeError(`vInfinity must be >= 0. Received: ${vInfinity}`);
  }

  if (mu <= 0) {
    throw new RangeError(`mu must be > 0. Received: ${mu}`);
  }

  // x = 1 / (1 + rp*vInf²/mu)
  const denom = 1 + (rp * vInfinity * vInfinity) / mu;
  const x = 1 / denom;
  // numerical guard: due to rounding x can slightly exceed 1
  const clamped = Math.min(1, Math.max(0, x));

  return (2 * Math.asin(clamped)) as Radians;
};
