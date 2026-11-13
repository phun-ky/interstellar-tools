import { SUN_GALACTOCENTRIC_VELOCITY } from '@interstellar-tools/constants';
import type {
  DistanceInterface,
  GalacticDirectionInterface,
  ObservedMotionInterface,
  VelocityInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { convertDistanceUnit } from '../helpers/convert-distance-unit.js';

import {
  ICRS_TO_GALACTIC,
  KM_S_PER_KPC_MAS_YR,
  skyBasis,
  sunPlacement,
  tilt
} from './galactic-frame.js';
import { galacticToEquatorial } from './galactic-to-equatorial.js';

/**
 * Options for {@link galactocentricVelocity}.
 *
 * @group Galactic
 */
export interface GalactocentricVelocityOptionsInterface {
  /**
   * The Sun's distance from the Milky Way's centre, $R_0$. Defaults to
   * `SUN_GALACTOCENTRIC_DISTANCE`, 8275.9 pc.
   */
  sunDistance?: DistanceInterface;
  /**
   * The Sun's height above the Milky Way's plane, $z_\odot$. Defaults to
   * `SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, 20.8 pc.
   */
  sunHeight?: DistanceInterface;
  /**
   * The Sun's velocity around the centre, in km/s. Defaults to
   * `SUN_GALACTOCENTRIC_VELOCITY`, (12.9, 251.51, 8.56).
   */
  sunVelocity?: VelocityInterface;
}

/* node:coverage disable */
/**
 * The **velocity around the Milky Way's centre** of something seen from the
 * Sun, in km/s, in the `'galactocentric'` frame: from its direction, distance
 * and motion, as `GALAXIES` in `@interstellar-tools/constants` gives them.
 *
 * With $\hat{r}$ the direction from the Sun and $\hat{p}$, $\hat{q}$ east and
 * north on the sky there, the velocity from the Sun is
 *
 * $$
 * \vec{v}_\odot = v_r \hat{r} + k\, d \left(\mu_{\alpha*} \hat{p} + \mu_\delta \hat{q}\right),
 * \qquad k = 4.74047\ \text{km/s per kpc·mas/yr}
 * $$
 *
 * It's turned into galactic coordinates, tilted into the frame's axes as
 * {@link galactocentricPosition} does, and the Sun's own velocity is added.
 *
 * ::: info Notes
 *
 * - It matches Astropy's `Galactocentric` frame to about 0.01 km/s, given the
 *   same Sun.
 * - Where the proper motion isn't measured, as for M87 and Centaurus A, it's
 *   taken as 0, so only the motion along the line of sight counts. At their
 *   distances, a sideways speed of hundreds of km/s is a few µas/yr, too
 *   small to measure yet.
 * - A proper motion of 10 µas/yr is 36 km/s at Andromeda's distance: its
 *   sideways speed is uncertain by about 40 km/s.
 *
 * :::
 *
 * @param {GalacticDirectionInterface} direction - The direction from the Sun, in galactic coordinates.
 * @param {DistanceInterface} distance - The distance from the Sun.
 * @param {ObservedMotionInterface} motion - The radial velocity in km/s and, where measured, the proper motion in mas/yr.
 * @param {GalactocentricVelocityOptionsInterface} [options] - The Sun's place and velocity, if not the defaults.
 * @returns {VelocityInterface} The velocity in the `'galactocentric'` frame, in km/s.
 * @throws {RangeError} If the direction, distance or motion isn't finite, `b` is outside −90° to 90°,
 * the distance is negative, or the Sun's height isn't less than its distance from the centre.
 *
 * @example
 * ```ts
 * import { GALAXIES } from '@interstellar-tools/constants';
 *
 * const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
 * const v = galactocentricVelocity(
 *   andromeda.direction!,
 *   andromeda.distance,
 *   andromeda.motion!
 * ); // { frame: 'galactocentric', x: 37.11, y: -119.81, z: -10.86 }
 * ```
 *
 * @see {@link galactocentricPosition}, for where it is.
 * @group Galactic
 */
/* node:coverage enable */
export const galactocentricVelocity = (
  direction: GalacticDirectionInterface,
  distance: DistanceInterface,
  motion: ObservedMotionInterface,
  options: GalactocentricVelocityOptionsInterface = {}
): VelocityInterface => {
  const d = convertDistanceUnit(distance, 'kpc').value;
  const { radialVelocity } = motion;
  const { rightAscension: muRa = 0, declination: muDec = 0 } =
    motion.properMotion ?? {};
  const sun = options.sunVelocity ?? SUN_GALACTOCENTRIC_VELOCITY;

  if (
    ![d, radialVelocity, muRa, muDec, sun.x, sun.y, sun.z].every(
      Number.isFinite
    )
  )
    throw new RangeError(
      `The distance and velocities must be finite. Received: distance ${d} kpc, motion ${JSON.stringify(motion)}, Sun ${JSON.stringify(sun)}`
    );

  if (d < 0)
    throw new RangeError(
      `distance must not be negative. Received: ${distance.value}`
    );

  // Checks the direction too
  const { rightAscension, declination } = galacticToEquatorial(direction);
  const { cos, sin } = sunPlacement(options, 'kpc');
  const { r, east, north } = skyBasis(rightAscension, declination);
  const across = KM_S_PER_KPC_MAS_YR * d;
  const icrs = r.map(
    (_, k) =>
      radialVelocity * r[k]! + across * (muRa * east[k]! + muDec * north[k]!)
  ) as unknown as Vector3DTupleType;
  const [x, y, z] = tilt(applyMatrix3(ICRS_TO_GALACTIC, icrs), cos, sin);

  return {
    frame: 'galactocentric',
    x: x + sun.x,
    y: y + sun.y,
    z: z + sun.z
  };
};
