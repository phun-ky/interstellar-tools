import type {
  Matrix3x3Type,
  OrbitFrameInterface,
  Radians
} from '@interstellar-tools/types';

import { matMul3 } from '../helpers/mat-mul3.js';
import { rot1 } from '../helpers/rot-1.js';
import { rot3 } from '../helpers/rot-3.js';

const DEG = Math.PI / 180;
/**
 * The obliquity of the J2000 ecliptic, 84 381.448″, the angle JPL's
 * "ecliptic and equinox of J2000" frame is tilted by from the ICRF equator.
 */
const J2000_OBLIQUITY = ((84_381.448 / 3600) * DEG) as Radians;

/* node:coverage disable */
/**
 * The **rotation from an orbit's reference plane to the ICRF**, the J2000
 * equator and equinox: multiply a vector in the plane's coordinates by it to
 * get the vector in the ICRF.
 *
 * In the plane's coordinates, `x` points to where the plane's `om` is counted
 * from, and `z` to the plane's pole:
 *
 * - `'ecliptic'`: `x` to the J2000 equinox, `z` to the ecliptic's north pole.
 *   The rotation is $R_1(\varepsilon)$, with $\varepsilon$ = 84 381.448″.
 * - `'equator'`: the ICRF itself.
 * - `'laplace'` and `'parent-equator'`: `x` to the plane's ascending node on
 *   the ICRF equator, at right ascension $\alpha + 90°$, and `z` to its pole
 *   $(\alpha, \delta)$, as JPL's satellite mean elements count `om`. The
 *   rotation is $R_3(\alpha + 90°) \, R_1(90° - \delta)$.
 *
 * @param {OrbitFrameInterface} frame - An orbit's `frame`, for example `body.orbit.frame` from a dataset.
 * @returns {Matrix3x3Type} The rotation matrix from the plane's coordinates to the ICRF.
 * @throws {RangeError} If `frame` is a `'laplace'` or `'parent-equator'` plane without a `pole`.
 * @throws {RangeError} If `frame` is `'sky'` or `'galactic'`: the sky needs the direction to the
 * system, and the galactic plane where its `om` is counted from, which the datasets don't give yet.
 *
 * @example
 * ```ts
 * import { MOONS } from '@interstellar-tools/constants';
 * import { applyMatrix3, orbitFrameToIcrf } from '@interstellar-tools/equations';
 *
 * const titan = MOONS.find((moon) => moon.id === 'titan')!;
 * const toIcrf = orbitFrameToIcrf(titan.orbit.frame!);
 *
 * applyMatrix3(toIcrf, [0, 0, 1]); // ≈ [0.084, 0.062, 0.995]: the pole of Titan's Laplace plane
 * ```
 *
 * @see {@link stateAt}, which uses it to place a dataset orbit in the ICRF.
 * @group Orbits
 */
/* node:coverage enable */
export const orbitFrameToIcrf = (frame: OrbitFrameInterface): Matrix3x3Type => {
  switch (frame.plane) {
    case 'ecliptic':
      return rot1(J2000_OBLIQUITY);
    case 'equator':
      return rot3(0 as Radians);
    case 'laplace':
    case 'parent-equator': {
      if (!frame.pole)
        throw new RangeError(
          `A '${frame.plane}' frame needs its pole. Received: ${JSON.stringify(frame)}`
        );

      const { rightAscension, declination } = frame.pole;

      return matMul3(
        rot3(((rightAscension + 90) * DEG) as Radians),
        rot1(((90 - declination) * DEG) as Radians)
      );
    }
    default:
      throw new RangeError(
        `A '${frame.plane}' frame can't be placed in the ICRF yet: the datasets don't give its direction from the Sun.`
      );
  }
};
