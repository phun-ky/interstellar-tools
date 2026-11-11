import type {
  CelestialDirectionInterface,
  DegreesType,
  GalacticDirectionInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import { DEG, ICRS_TO_GALACTIC, wrapDegrees } from './galactic-frame.js';

/* node:coverage disable */
/**
 * The **galactic coordinates of a direction on the sky**: from right ascension
 * and declination in the ICRS (J2000), as catalogues give them, to galactic
 * longitude `l` and latitude `b`.
 *
 * It uses the IAU's galactic coordinates as Hipparcos defines them in the ICRS:
 * the north galactic pole at right ascension 192.85948° and declination
 * 27.12825°, and the galactic plane crossing the equator northwards at
 * $l = 32.93192°$. The rotation is the Hipparcos matrix $A_G$:
 *
 * $$
 * \begin{pmatrix} \cos b \cos l \\ \cos b \sin l \\ \sin b \end{pmatrix}
 * = A_G \begin{pmatrix} \cos\delta \cos\alpha \\ \cos\delta \sin\alpha \\ \sin\delta \end{pmatrix}
 * $$
 *
 * ::: info Notes
 *
 * - It agrees with Astropy's `Galactic` frame, which starts from the older
 *   B1950 definition, to better than 0.0001° for the galaxies in `GALAXIES`.
 * - At the galactic poles, `l` is 0.
 *
 * :::
 *
 * @param {CelestialDirectionInterface} direction - Right ascension and declination, in degrees.
 * @returns {GalacticDirectionInterface} Galactic longitude `l`, from 0° up to 360°, and latitude `b`, from −90° to 90°.
 * @throws {RangeError} If an angle isn't finite, or the declination is outside −90° to 90°.
 *
 * @example
 * ```ts
 * import type { DegreesType } from '@interstellar-tools/types';
 *
 * // Andromeda (NED)
 * const andromeda = equatorialToGalactic({
 *   rightAscension: 10.68479292 as DegreesType,
 *   declination: 41.269065 as DegreesType
 * }); // { l: 121.1744, b: -21.5730 }
 * ```
 *
 * @see {@link galacticToEquatorial}, its inverse.
 * @see ESA 1997, The Hipparcos and Tycho Catalogues, ESA SP-1200, Vol. 1, §1.5.3
 * @group Galactic
 */
/* node:coverage enable */
export const equatorialToGalactic = (
  direction: CelestialDirectionInterface
): GalacticDirectionInterface => {
  const { rightAscension, declination } = direction;

  if (!Number.isFinite(rightAscension) || !Number.isFinite(declination))
    throw new RangeError(
      `Right ascension and declination must be finite. Received: ${rightAscension}, ${declination}`
    );

  if (declination < -90 || declination > 90)
    throw new RangeError(
      `declination must be from -90 to 90 degrees. Received: ${declination}`
    );

  const ra = rightAscension * DEG;
  const dec = declination * DEG;
  const icrs: Vector3DTupleType = [
    Math.cos(dec) * Math.cos(ra),
    Math.cos(dec) * Math.sin(ra),
    Math.sin(dec)
  ];
  const [x, y, z] = applyMatrix3(ICRS_TO_GALACTIC, icrs);

  return {
    l: wrapDegrees(Math.atan2(y, x) / DEG) as DegreesType,
    b: (Math.asin(Math.max(-1, Math.min(1, z))) / DEG) as DegreesType
  };
};
