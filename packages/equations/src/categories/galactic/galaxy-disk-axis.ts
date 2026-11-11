import type {
  DistanceInterface,
  GalacticDirectionInterface,
  GalaxyDiskInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

import { applyMatrix3 } from '../helpers/apply-matrix-3.js';

import {
  DEG,
  ICRS_TO_GALACTIC,
  skyBasis,
  sunPlacement,
  tilt
} from './galactic-frame.js';
import { galacticToEquatorial } from './galactic-to-equatorial.js';

/**
 * Options for {@link galaxyDiskAxis}.
 *
 * @group Galactic
 */
export interface GalaxyDiskAxisOptionsInterface {
  /**
   * The Sun's distance from the Milky Way's centre, $R_0$, for the frame's
   * tilt. Defaults to `SUN_GALACTOCENTRIC_DISTANCE`, 8275.9 pc.
   */
  sunDistance?: DistanceInterface;
  /**
   * The Sun's height above the Milky Way's plane, $z_\odot$, for the frame's
   * tilt. Defaults to `SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, 20.8 pc.
   */
  sunHeight?: DistanceInterface;
}

/* node:coverage disable */
/**
 * The **spin axis of a galaxy's disk**, in the `'galactocentric'` frame's
 * axes: the unit vector its disk turns around, counter-clockwise seen from its
 * tip. Draw the disk at right angles to it.
 *
 * On the sky at the galaxy, with $\hat{r}$ pointing away from the Sun and
 * $\hat{s}(\varphi)$ the direction at position angle $\varphi$, east of north:
 *
 * $$
 * \hat{\ell} = \hat{s}(\varphi_\text{receding}), \qquad
 * \hat{e} = \cos i \, \hat{s}(\varphi_\text{near}) - \sin i \, \hat{r}, \qquad
 * \hat{L} = \hat{e} \times \hat{\ell}
 * $$
 *
 * $\hat{\ell}$ points along the major axis to the half moving away from us, and
 * $\hat{e}$ across the disk to its nearer side, tilted towards us.
 *
 * ::: info Notes
 *
 * - It needs the disk's `nearSide`: without it, the disk could tilt either way.
 * - Seen from the Sun, the disk turns counter-clockwise when $\hat{L}$ points
 *   towards us, as Andromeda's does.
 *
 * :::
 *
 * @param {GalacticDirectionInterface} direction - The galaxy's direction from the Sun, in galactic coordinates.
 * @param {GalaxyDiskInterface} disk - How its disk is turned on the sky.
 * @param {GalaxyDiskAxisOptionsInterface} [options] - The Sun's place, for the frame's tilt, if not the default.
 * @returns {Vector3DTupleType} The unit spin axis, in the `'galactocentric'` frame's axes.
 * @throws {RangeError} If the disk has no `nearSide`, the near side isn't 90° from `positionAngle`,
 * an angle isn't finite, or the inclination is outside 0° to 90°.
 *
 * @example
 * ```ts
 * import { GALAXIES } from '@interstellar-tools/constants';
 *
 * const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
 * const axis = galaxyDiskAxis(andromeda.direction!, andromeda.disk!);
 * // ≈ [-0.4186, -0.7544, -0.5057]
 * ```
 *
 * @group Galactic
 */
/* node:coverage enable */
export const galaxyDiskAxis = (
  direction: GalacticDirectionInterface,
  disk: GalaxyDiskInterface,
  options: GalaxyDiskAxisOptionsInterface = {}
): Vector3DTupleType => {
  const { inclination, positionAngle, nearSide } = disk;

  if (nearSide === undefined)
    throw new RangeError(
      `The disk needs its nearSide: without it, it could tilt either way. Received: ${JSON.stringify(disk)}`
    );

  if (![inclination, positionAngle, nearSide].every(Number.isFinite))
    throw new RangeError(
      `The disk's angles must be finite. Received: ${JSON.stringify(disk)}`
    );

  if (inclination < 0 || inclination > 90)
    throw new RangeError(
      `inclination must be from 0 to 90 degrees. Received: ${inclination}`
    );

  if (Math.abs(Math.cos((nearSide - positionAngle) * DEG)) > 1e-6)
    throw new RangeError(
      `nearSide must be 90 degrees from positionAngle. Received: ${nearSide} and ${positionAngle}`
    );

  // Checks the direction too
  const { rightAscension, declination } = galacticToEquatorial(direction);
  const { cos, sin } = sunPlacement(options, 'pc');
  const { r, east, north } = skyBasis(rightAscension, declination);
  const toward = (angle: number) =>
    east.map(
      (_, k) =>
        Math.sin(angle * DEG) * east[k]! + Math.cos(angle * DEG) * north[k]!
    ) as unknown as Vector3DTupleType;
  const [lx, ly, lz] = toward(positionAngle);
  const near = toward(nearSide);
  const [ex, ey, ez] = near.map(
    (value, k) =>
      Math.cos(inclination * DEG) * value - Math.sin(inclination * DEG) * r[k]!
  ) as unknown as Vector3DTupleType;
  // ê × ℓ̂: both unit vectors at right angles, so already a unit vector
  const axis: Vector3DTupleType = [
    ey * lz - ez * ly,
    ez * lx - ex * lz,
    ex * ly - ey * lx
  ];

  return tilt(applyMatrix3(ICRS_TO_GALACTIC, axis), cos, sin);
};
