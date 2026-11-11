import type {
  CelestialDirectionInterface,
  DegreesType,
  GalacticDirectionInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import { DEG, GALACTIC_TO_ICRS, wrapDegrees } from './galactic-frame.js';

/* node:coverage disable */
/**
 * The **right ascension and declination of a galactic direction**: from
 * galactic longitude `l` and latitude `b` to the ICRS (J2000), the inverse of
 * {@link equatorialToGalactic}, with the transpose of the Hipparcos matrix
 * $A_G$.
 *
 * ::: info Notes
 *
 * - At the celestial poles, the right ascension is 0.
 *
 * :::
 *
 * @param {GalacticDirectionInterface} direction - Galactic longitude `l` and latitude `b`, in degrees.
 * @returns {CelestialDirectionInterface} Right ascension, from 0° up to 360°, and declination, from −90° to 90°.
 * @throws {RangeError} If an angle isn't finite, or `b` is outside −90° to 90°.
 *
 * @example
 * ```ts
 * import type { DegreesType } from '@interstellar-tools/types';
 *
 * // The galactic centre, l = b = 0
 * const centre = galacticToEquatorial({
 *   l: 0 as DegreesType,
 *   b: 0 as DegreesType
 * }); // { rightAscension: 266.4050, declination: -28.9362 }
 * ```
 *
 * @see {@link equatorialToGalactic}, its inverse.
 * @group Galactic
 */
/* node:coverage enable */
export const galacticToEquatorial = (
  direction: GalacticDirectionInterface
): CelestialDirectionInterface => {
  const { l, b } = direction;

  if (!Number.isFinite(l) || !Number.isFinite(b))
    throw new RangeError(`l and b must be finite. Received: ${l}, ${b}`);

  if (b < -90 || b > 90)
    throw new RangeError(`b must be from -90 to 90 degrees. Received: ${b}`);

  const galactic: Vector3DTupleType = [
    Math.cos(b * DEG) * Math.cos(l * DEG),
    Math.cos(b * DEG) * Math.sin(l * DEG),
    Math.sin(b * DEG)
  ];
  const [x, y, z] = applyMatrix3(GALACTIC_TO_ICRS, galactic);

  return {
    rightAscension: wrapDegrees(Math.atan2(y, x) / DEG) as DegreesType,
    declination: (Math.asin(Math.max(-1, Math.min(1, z))) / DEG) as DegreesType
  };
};
