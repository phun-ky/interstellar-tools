import {
  SUN_GALACTOCENTRIC_DISTANCE,
  SUN_HEIGHT_ABOVE_GALACTIC_PLANE
} from '@interstellar-tools/constants';
import type {
  DistanceInterface,
  DistanceUnitType,
  Matrix3x3Type,
  Radians
} from '@interstellar-tools/types';

import { convertDistanceUnit } from '../helpers/convert-distance-unit.js';
import { matMul3 } from '../helpers/mat-mul3.js';
import { rot1 } from '../helpers/rot-1.js';
import { rot3 } from '../helpers/rot-3.js';
import { transpose3 } from '../helpers/transpose-3.js';

// Shared by the functions in this folder. Not exported from the package.

export const DEG = Math.PI / 180;

/**
 * The IAU's galactic coordinates in the ICRS (Hipparcos, ESA 1997, Vol. 1,
 * §1.5.3): the north galactic pole is at right ascension 192.85948° and
 * declination 27.12825°, and the galactic plane crosses the equator northwards
 * at galactic longitude 32.93192°.
 */
const NORTH_GALACTIC_POLE_RA = 192.85948;
const NORTH_GALACTIC_POLE_DEC = 27.12825;
const ASCENDING_NODE_LONGITUDE = 32.93192;

/**
 * From galactic to ICRS coordinates: turn the node to the galactic plane's
 * ascending node on the equator, tilt the pole to the north galactic pole, and
 * turn the node to its right ascension, 90° past the pole's.
 */
export const GALACTIC_TO_ICRS: Matrix3x3Type = matMul3(
  matMul3(
    rot3(((NORTH_GALACTIC_POLE_RA + 90) * DEG) as Radians),
    rot1(((90 - NORTH_GALACTIC_POLE_DEC) * DEG) as Radians)
  ),
  rot3((-ASCENDING_NODE_LONGITUDE * DEG) as Radians)
);

/** From ICRS to galactic coordinates: the Hipparcos matrix $A_G$. */
export const ICRS_TO_GALACTIC: Matrix3x3Type = transpose3(GALACTIC_TO_ICRS);

/** The options that place the Sun in the galactocentric frame. */
export interface SunPlacementInterface {
  sunDistance?: DistanceInterface;
  sunHeight?: DistanceInterface;
}

/** An angle in degrees, from 0 up to 360. */
export const wrapDegrees = (angle: number): number =>
  ((angle % 360) + 360) % 360;

/**
 * The Sun's distance from the centre, $R_0$, and height above the plane,
 * $z_\odot$, in `unit`, with the cosine and sine of the plane's tilt,
 * $\arcsin(z_\odot / R_0)$.
 *
 * @throws {RangeError} If either isn't finite, or the height isn't less than the distance.
 */
export const sunPlacement = (
  {
    sunDistance = SUN_GALACTOCENTRIC_DISTANCE,
    sunHeight = SUN_HEIGHT_ABOVE_GALACTIC_PLANE
  }: SunPlacementInterface,
  unit: DistanceUnitType
) => {
  const r0 = convertDistanceUnit(sunDistance, unit).value;
  const z0 = convertDistanceUnit(sunHeight, unit).value;

  if (!Number.isFinite(r0) || !Number.isFinite(z0) || Math.abs(z0) >= r0)
    throw new RangeError(
      `The Sun's height must be less than its distance from the centre, and both finite. Received: R0 ${r0}, z ${z0}`
    );

  const theta = Math.asin(z0 / r0);

  return { r0, cos: Math.cos(theta), sin: Math.sin(theta) };
};
