import { PeriApoRadiiType } from '@interstellar-tools/types';

/**
 * **Peri/apoapsis radii** from semi-major axis ($ a $) and eccentricity ($ e $).
 *
 * **Definitions**
 *
 * $$
 * r_p = a(1-e),\qquad r_a = a(1+e)
 * $$
 *
 * **Conic validity**
 * - **Elliptic / circular**: ($ a>0,\; 0\le e<1 $) → ($ r_p>0 $) and ($ r_a>0 $).
 * - **Hyperbolic**: ($ a<0,\; e>1 $) → ($ r_p = a(1-e) = |a|(e-1) > 0 $), **no apoapsis** (unbounded), so ($ r_a = null $).
 * - **Parabolic**: ($ e=1 $) is **not** defined with finite ($ a $). Use the parabolic form (e.g. ($ r_p = \tfrac{p}{2} $)) or state vectors.
 *
 * **Units**
 * - Inputs: ($ a $) in **meters (m)**, ($ e $) dimensionless.
 * - Output: ($ r_p, r_a $) in **meters (m)**.
 *
 * @param {number} a Semi-major axis ($ a $) (m). Must be finite and **≠ 0**.
 * @param {number} e Eccentricity ($ e $) (dimensionless). Must be finite and **≥ 0**.
 * @returns {{ rp: number; ra: number | null }} Object with periapsis `rp` and apoapsis `ra` (or `null` if undefined for hyperbolic).
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error | Error}
 * If inputs are invalid or the ($ (a,e) $) pair does not correspond to an ellipse/circle or hyperbola with finite ($ a $).
 *
 * @example
 * ```ts
 * // Elliptic example (LEO-like)
 * const a = 7000e3;  // m
 * const e = 0.01;
 * const { rp, ra } = periApoapsisRadii(a, e); // rp ≈ 6930 km, ra ≈ 7070 km
 * ```
 *
 * @example
 * ```ts
 * // Hyperbolic flyby (no apoapsis)
 * const a = -50_000e3; // m
 * const e = 1.2;
 * const { rp, ra } = periApoapsisRadii(a, e); // rp = |a|(e-1) = 10,000 km, ra = null
 * ```
 *
 * @category Orbits
 */
export const periApoapsisRadii = (a: number, e: number): PeriApoRadiiType => {
  if (!Number.isFinite(a) || a === 0) {
    throw new Error('a must be finite and non-zero (meters).');
  }

  if (!Number.isFinite(e) || e < 0) {
    throw new Error('e must be finite and ≥ 0.');
  }

  // Elliptic / circular
  if (a > 0) {
    if (e >= 1) {
      if (e === 1) {
        throw new Error(
          'Parabolic (e=1) is not defined with finite a. Use parabolic relations (e.g., rp = p/2) or state vectors.'
        );
      }

      throw new Error(
        'For a>0 (elliptic/circular), eccentricity must satisfy 0 ≤ e < 1.'
      );
    }

    const rp = a * (1 - e);
    const ra = a * (1 + e);

    // Both must be positive for a valid ellipse
    if (!(rp > 0 && ra > 0)) {
      throw new Error('Computed radii are non-physical for the given (a,e).');
    }

    return { rp, ra };
  }

  // Hyperbolic
  // a < 0 requires e > 1 for a valid hyperbola
  if (e <= 1) {
    throw new Error('For a<0 (hyperbolic), eccentricity must satisfy e > 1.');
  }

  const rp = a * (1 - e); // = |a|(e-1) > 0

  if (!(rp > 0)) {
    // tiny negatives due to FP?
    const tol = Math.abs(1e-14 * Math.abs(a));

    if (rp > -tol) {
      return { rp: 0, ra: null };
    }

    throw new Error('Computed periapsis radius is non-physical (≤ 0).');
  }

  return { rp, ra: null };
};
