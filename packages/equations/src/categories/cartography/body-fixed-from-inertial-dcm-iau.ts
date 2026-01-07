import { Matrix3x3Type, Radians } from '@interstellar-tools/types';

import { matMul3 } from '../helpers/mat-mul3';
import { rot1 } from '../helpers/rot-1';
import { rot3 } from '../helpers/rot-3';

/**
 * Build the **IAU-style inertial → body-fixed** direction cosine matrix (DCM).
 *
 * This constructs the 3×3 rotation matrix that transforms a vector expressed in an inertial
 * frame (commonly ICRF/J2000-like) into the body-fixed, planetocentric frame defined by:
 * - the body's north pole right ascension ($ \alpha_p $),
 * - the body's north pole declination ($ \delta_p $),
 * - the prime meridian angle ($ W(t) $).
 *
 * Using the common 3-1-3 sequence:
 *
 * $$
 * \mathbf R_{\text{BF}\leftarrow\text{ICRF}} =
 * \mathbf R_3(W)\,\mathbf R_1\!\left(\frac{\pi}{2}-\delta_p\right)\,\mathbf R_3\!\left(\frac{\pi}{2}+\alpha_p\right)
 * $$
 *
 * ::: info Notes:
 *
 * - All angles are in **radians**.
 * - Matrices are **row-major** (`M[row][col]`).
 * - The returned matrix can be applied to inertial vectors via `applyMatrix3(R, v)`.
 *
 * :::
 *
 * @param alphaP - Right ascension of the north pole ($ \alpha_p $) in radians (finite).
 * @param deltaP - Declination of the north pole ($ \delta_p $) in radians (finite).
 * @param W - Prime meridian angle ($ W(t) $) in radians (finite).
 * @returns {Matrix3x3Type} 3×3 DCM ($ \mathbf R_{\text{BF}\leftarrow\text{ICRF}} $) (row-major).
 * @throws {TypeError} If any input is not a finite number.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Given IAU pole and prime meridian angles (radians):
 * const R = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);
 *
 * // Transform an inertial vector into body-fixed:
 * const vBF = applyMatrix3(R, vICRF);
 * ```
 *
 * @see {@link applyMatrix3}
 * @see https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/FORTRAN/req/pck.html NAIF SPICE PCK Required Reading (RA, DEC, W orientation model)
 * @see https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/frames.html NAIF SPICE Frames Required Reading (reference frames and transformations)
 * @see https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/tipbod_c.html SPICE `tipbod_c` (inertial → body-equator-and-prime-meridian rotation)
 * @see https://www.iau.org/WG100/WG100/Home.aspx IAU WGCCRE / WG100 (cartographic coordinates & rotational elements reports)
 * @see https://aa.usno.navy.mil/downloads/reports/Archinaletal2011a.pdf Archinal et al. (2011) IAU WGCCRE report (pole and prime meridian definitions)
 */
export const bodyFixedFromInertialDcmIAU = (
  alphaP: Radians,
  deltaP: Radians,
  W: Radians
): Matrix3x3Type => {
  for (const [name, v] of [
    ['alphaP', alphaP],
    ['deltaP', deltaP],
    ['W', W]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be finite. Received: ${v}`);
  }

  const halfPi = (Math.PI / 2) as Radians;

  // R3(W) * R1(π/2 - δp) * R3(π/2 + αp)
  return matMul3(
    matMul3(rot3(W), rot1((halfPi - deltaP) as Radians)),
    rot3((halfPi + alphaP) as Radians)
  );
};
