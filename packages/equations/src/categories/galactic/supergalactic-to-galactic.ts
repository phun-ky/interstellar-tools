import type {
  DegreesType,
  GalacticDirectionInterface,
  SupergalacticDirectionInterface
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { transpose3 } from '../helpers/transpose-3.js';

import {
  angles,
  GALACTIC_TO_SUPERGALACTIC,
  skyBasis
} from './galactic-frame.js';

const SUPERGALACTIC_TO_GALACTIC = transpose3(GALACTIC_TO_SUPERGALACTIC);

/* node:coverage disable */
/**
 * The **galactic coordinates of a supergalactic direction**: the inverse of
 * {@link galacticToSupergalactic}.
 *
 * @param {SupergalacticDirectionInterface} direction - Supergalactic longitude `sgl` and latitude `sgb`, in degrees.
 * @returns {GalacticDirectionInterface} Galactic longitude `l`, from 0° up to 360°, and latitude `b`.
 * @throws {RangeError} If an angle isn't finite, or `sgb` is outside −90° to 90°.
 *
 * @example
 * ```ts
 * import type { DegreesType } from '@interstellar-tools/types';
 *
 * // The supergalactic north pole
 * supergalacticToGalactic({ sgl: 0 as DegreesType, sgb: 90 as DegreesType });
 * // { l: 47.37, b: 6.32 }
 * ```
 *
 * @see {@link galacticToSupergalactic}, its inverse.
 * @group Galactic
 */
/* node:coverage enable */
export const supergalacticToGalactic = (
  direction: SupergalacticDirectionInterface
): GalacticDirectionInterface => {
  const { sgl, sgb } = direction;

  if (!Number.isFinite(sgl) || !Number.isFinite(sgb))
    throw new RangeError(
      `sgl and sgb must be finite. Received: ${sgl}, ${sgb}`
    );

  if (sgb < -90 || sgb > 90)
    throw new RangeError(
      `sgb must be from -90 to 90 degrees. Received: ${sgb}`
    );

  const [l, b] = angles(
    applyMatrix3(SUPERGALACTIC_TO_GALACTIC, skyBasis(sgl, sgb).r)
  );

  return { l: l as DegreesType, b: b as DegreesType };
};
