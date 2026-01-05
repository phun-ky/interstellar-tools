/* node:coverage disable */
/**
 * Compute **hyperbolic periapsis speed** for a flyby/escape hyperbola.
 *
 * Equation:
 * $$
 * v_p = \sqrt{v_{\infty}^2 + \frac{2\mu}{r_p}}
 * $$
 *
 * Where:
 * - $ v_{\infty} $ is the hyperbolic excess speed (m/s or km/s)
 * - $ \mu $ is the standard gravitational parameter of the central body (m³/s² or km³/s²)
 * - $ r_p $ is the periapsis radius measured from the body's center (m or km)
 *
 * Unit consistency is required:
 * - If $ \mu $ is in m³/s², then $r_p$ must be in m and speeds are in m/s.
 * - If $ \mu $ is in km³/s², then $r_p$ must be in km and speeds are in km/s.
 *
 * @param vInfinity Hyperbolic excess speed $ v_{\infty} $ (must be finite, >= 0).
 * @param mu Standard gravitational parameter $ \mu $ (must be finite, > 0).
 * @param rp Periapsis radius $ r_p $ from the central body's center (must be finite, > 0).
 * @returns Periapsis speed $ v_p $ in the same speed units as `vInfinity`.
 * @throws {TypeError} If any input is not finite.
 * @throws {RangeError} If `vInfinity < 0`, `mu <= 0`, or `rp <= 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth example (km-based):
 * // mu = 398600.4418 km³/s², rp ~ 6678 km (LEO-ish), v∞ = 3.2 km/s
 * const vp = hyperbolicPeriapsisSpeed(3.2, 398600.4418, 6678);
 * ```
 */
/* node:coverage enable */
export const hyperbolicPeriapsisSpeed = (
  vInfinity: number,
  mu: number,
  rp: number
): number => {
  if (!Number.isFinite(vInfinity)) {
    throw new TypeError(
      `vInfinity must be a finite number. Received: ${vInfinity}`
    );
  }

  if (!Number.isFinite(mu)) {
    throw new TypeError(`mu must be a finite number. Received: ${mu}`);
  }

  if (!Number.isFinite(rp)) {
    throw new TypeError(`rp must be a finite number. Received: ${rp}`);
  }

  if (vInfinity < 0) {
    throw new RangeError(`vInfinity must be >= 0. Received: ${vInfinity}`);
  }

  if (mu <= 0) {
    throw new RangeError(`mu must be > 0. Received: ${mu}`);
  }

  if (rp <= 0) {
    throw new RangeError(`rp must be > 0. Received: ${rp}`);
  }

  const term = vInfinity * vInfinity + (2 * mu) / rp;

  // With valid ranges above, term should be positive, but guard anyway.
  if (term < 0) {
    throw new RangeError(
      `Expression under square root must be >= 0. Computed: ${term}`
    );
  }

  return Math.sqrt(term);
};
