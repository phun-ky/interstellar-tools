/**
 * **Specific mechanical energy** ($  \varepsilon  $) of a point mass in a central gravity field.
 *
 * **Definition**
 *
 * $$
 * \varepsilon = \frac{v^2}{2} - \frac{\mu}{r}
 * $$
 *
 * where ($ v $) is the speed, ($ r $) the distance to the central body, and ($ \mu $) the gravitational parameter.
 *
 * **Units**
 * - Inputs: ($ v $) in **m/s**, ($ r $) in **m**, ($ \mu $) in **m³/s²**.
 * - Output: ($ \varepsilon $) in **J/kg** (i.e., m²/s²).
 *
 * **Orbit-type by sign**
 * - ($ \varepsilon < 0 $) → **elliptic** (bound)
 * - ($ \varepsilon = 0 $) → **parabolic**
 * - ($ \varepsilon > 0 $) → **hyperbolic**
 *
 * ::: tip
 *
 * - For circular orbits ($ v = \sqrt{\mu/r} $), so ($  \varepsilon = -\mu/(2r)  $).
 * - If you have the semi-major axis ($ a $), then ($  \varepsilon = -\mu/(2a)  $).
 *
 * :::
 *
 * @param {number} v  Speed magnitude ($ v $) (m/s).
 * @param {number} r  Radius ($ r=\|\mathbf r\| $) from the central body (m).
 * @param {number} mu Gravitational parameter ($ \mu $) (m³/s²).
 * @returns {number} Specific mechanical energy ($ \varepsilon $) (J/kg).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `v` is not finite or negative.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `r` is not finite or non-positive.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} If `mu` is not finite or negative.
 *
 * @example
 * ```ts
 * // LEO example around Earth (~400 km altitude)
 * const muEarth = 3.986004418e14; // m^3/s^2
 * const r = 6378e3 + 400e3;       // Earth radius + 400 km
 * const v = Math.sqrt(muEarth / r); // near-circular speed
 * const eps = specificMechanicalEnergy(v, r, muEarth);
 * // eps ≈ -mu/(2r)
 * ```
 * @category Dynamics
 */
export const specificMechanicalEnergy = (
  v: number,
  r: number,
  mu: number
): number => {
  if (!Number.isFinite(v) || v < 0)
    throw new Error('v must be a finite, non-negative number (m/s).');

  if (!Number.isFinite(r) || r <= 0)
    throw new Error('r must be a finite, positive number (m).');

  if (!Number.isFinite(mu) || mu < 0)
    throw new Error('mu must be a finite, non-negative number (m^3/s^2).');

  return 0.5 * v * v - mu / r;
};
