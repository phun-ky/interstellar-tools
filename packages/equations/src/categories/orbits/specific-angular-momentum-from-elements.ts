/**
 * **Specific angular momentum** ($ h $) from **orbital elements**.
 *
 * **Definition**
 *
 * $$
 * h=\sqrt{\mu\,a\,(1-e^2)}
 * $$
 *
 * where ($ a $) is the semi-major axis, ($ e $) the eccentricity, and ($ \mu $) the gravitational parameter.
 *
 * **Validity by conic**
 * - **Elliptic**: ($ a>0,\; 0\le e<1 $) → ($ 1-e^2>0 $) ⇒ radicand ($ >0 $).
 * - **Hyperbolic**: ($ a<0,\; e>1 $) → ($ 1-e^2<0 $) and ($ a<0 $) ⇒ product still ($ >0 $).
 * - **Parabolic**: ($ e=1 $) is not represented by finite ($ a $). Use state vectors or
 *   ($ h=\sqrt{2\mu r_p} $) (with periapsis radius ($ r_p $)).
 *
 * **Units**
 * - Inputs: ($ a $) in **m**, ($ e $) dimensionless, ($ \mu $) in **m³/s²**.
 * - Output: ($ h $) in **m²/s**.
 *
 * ::: info
 *
 * - This returns the **magnitude** of ($ \mathbf h = \mathbf r \times \mathbf v $).
 * - For numerical robustness, tiny negative radicands from FP cancellation are clamped to zero.
 *
 * :::
 *
 * @param {number} a  Semi-major axis ($ a $) (m). Must be finite and **≠ 0** (elliptic ($ a>0 $), hyperbolic ($ a<0 $)).
 * @param {number} e  Eccentricity ($ e $) (dimensionless). Must be finite and **≥ 0**.
 * @param {number} mu Gravitational parameter ($ \mu $) (m³/s²). Must be finite and **≥ 0**.
 * @returns {number} Specific angular momentum ($ h $) (m²/s).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error}
 * If ($ a $) is non-finite or zero; if ($ e $) is non-finite or negative; if ($ \mu $) is non-finite or negative; or if
 * ($ \mu\,a\,(1-e^2) < 0 $) beyond a tiny FP tolerance (invalid element set for this formula).
 *
 * @example
 * ```ts
 * // Near-circular LEO-like elements
 * const muEarth = 3.986004418e14; // m^3/s^2
 * const a = 6778e3;               // m
 * const e = 0.001;
 * const h = specificAngularMomentumFromElements(a, e, muEarth); // ≈ sqrt(μ a)
 * ```
 *
 * @example
 * ```ts
 * // Hyperbolic flyby example
 * const muEarth = 3.986004418e14; // m^3/s^2
 * const a = -50000e3;             // m (negative for hyperbola)
 * const e = 1.2;
 * const h = specificAngularMomentumFromElements(a, e, muEarth);
 * ```
 *
 * @see {@link specificAngularMomentum} - compute ($ h $) from state vectors ($ (\mathbf r,\mathbf v) $).
 * @category Orbits
 */
export const specificAngularMomentumFromElements = (
  a: number,
  e: number,
  mu: number
): number => {
  if (!Number.isFinite(a) || a === 0)
    throw new Error('a must be finite and non-zero (meters).');

  if (!Number.isFinite(e) || e < 0)
    throw new Error('e must be finite and ≥ 0.');

  if (!Number.isFinite(mu) || mu < 0)
    throw new Error('mu must be finite and ≥ 0 (m^3/s^2).');

  const radicand = mu * a * (1 - e * e);

  if (radicand < 0) {
    // Allow tiny negatives due to FP cancellation
    const tol = Math.abs(1e-14 * mu * Math.abs(a));

    if (radicand > -tol) return 0;

    throw new Error(
      `Invalid (a,e) for this formula: μ·a·(1-e²) < 0 (μ=${mu}, a=${a}, e=${e}).`
    );
  }

  return Math.sqrt(radicand);
};
