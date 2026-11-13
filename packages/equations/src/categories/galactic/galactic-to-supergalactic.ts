import type {
  DegreesType,
  GalacticDirectionInterface,
  SupergalacticDirectionInterface
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import {
  angles,
  GALACTIC_TO_SUPERGALACTIC,
  skyBasis
} from './galactic-frame.js';

/* node:coverage disable */
/**
 * The **supergalactic coordinates of a galactic direction**: the frame of the
 * Local Supercluster, where the nearby galaxies and clusters gather in a plane.
 *
 * ::: info Notes
 *
 * - The supergalactic north pole is at galactic longitude 47.37° and latitude
 *   6.32°, and supergalactic longitude 0° at galactic longitude 137.37°,
 *   latitude 0°, where the two planes cross (de Vaucouleurs et al. 1991).
 * - It matches Astropy's `Supergalactic` frame to well under 0.001°.
 *
 * :::
 *
 * @param {GalacticDirectionInterface} direction - Galactic longitude `l` and latitude `b`, in degrees.
 * @returns {SupergalacticDirectionInterface} Supergalactic longitude `sgl`, from 0° up to 360°, and latitude `sgb`.
 * @throws {RangeError} If an angle isn't finite, or `b` is outside −90° to 90°.
 *
 * @example
 * ```ts
 * import { GALAXIES } from '@interstellar-tools/constants';
 *
 * const m87 = GALAXIES.find((galaxy) => galaxy.id === 'm87')!;
 * galacticToSupergalactic(m87.direction!); // { sgl: 102.88, sgb: -2.35 }: in the plane
 * ```
 *
 * @see {@link supergalacticToGalactic}, its inverse.
 * @see https://arxiv.org/abs/astro-ph/9809343 Lahav et al. 2000, MNRAS 312, 166
 * @group Galactic
 */
/* node:coverage enable */
export const galacticToSupergalactic = (
  direction: GalacticDirectionInterface
): SupergalacticDirectionInterface => {
  const { l, b } = direction;

  if (!Number.isFinite(l) || !Number.isFinite(b))
    throw new RangeError(`l and b must be finite. Received: ${l}, ${b}`);

  if (b < -90 || b > 90)
    throw new RangeError(`b must be from -90 to 90 degrees. Received: ${b}`);

  const [sgl, sgb] = angles(
    applyMatrix3(GALACTIC_TO_SUPERGALACTIC, skyBasis(l, b).r)
  );

  return { sgl: sgl as DegreesType, sgb: sgb as DegreesType };
};
