import {
  JULIAN_YEAR_SECONDS,
  KM_PER_AU,
  SUN_GALACTOCENTRIC_DISTANCE,
  SUN_HEIGHT_ABOVE_GALACTIC_PLANE
} from '@interstellar-tools/constants';
import type {
  DistanceInterface,
  DistanceUnitType,
  Matrix3x3Type,
  Radians,
  Vector3DTupleType
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

/**
 * km/s for a proper motion of 1 mas/yr at 1 kpc: 1 au a year, $4.74047$.
 */
export const KM_S_PER_KPC_MAS_YR = KM_PER_AU / JULIAN_YEAR_SECONDS;

/**
 * The sky's directions at a point, in the frame its angles are measured in:
 * `r` away from the Sun, `east` and `north` across the sky, with longitude
 * and latitude in degrees.
 */
export const skyBasis = (longitude: number, latitude: number) => {
  const lon = longitude * DEG;
  const lat = latitude * DEG;
  const r: Vector3DTupleType = [
    Math.cos(lat) * Math.cos(lon),
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat)
  ];
  const east: Vector3DTupleType = [-Math.sin(lon), Math.cos(lon), 0];
  const north: Vector3DTupleType = [
    -Math.sin(lat) * Math.cos(lon),
    -Math.sin(lat) * Math.sin(lon),
    Math.cos(lat)
  ];

  return { r, east, north };
};

/**
 * Tilts a vector in galactic coordinates into the galactocentric frame's axes,
 * by $\theta = \arcsin(z_\odot / R_0)$ about `y`, given its cosine and sine.
 */
export const tilt = (
  [x, y, z]: Vector3DTupleType,
  cos: number,
  sin: number
): Vector3DTupleType => [x * cos + z * sin, y, -x * sin + z * cos];

/**
 * From galactic to supergalactic coordinates (de Vaucouleurs et al. 1991, as
 * Lahav et al. 2000 give it): the rows are the supergalactic axes, the origin
 * at galactic longitude 137.37°, latitude 0°, and the north pole at 47.37°,
 * 6.32°, with `y` completing them.
 */
const SUPERGALACTIC_X = skyBasis(137.37, 0).r;
const SUPERGALACTIC_Z = skyBasis(47.37, 6.32).r;

export const GALACTIC_TO_SUPERGALACTIC: Matrix3x3Type = [
  SUPERGALACTIC_X,
  [
    SUPERGALACTIC_Z[1] * SUPERGALACTIC_X[2] -
      SUPERGALACTIC_Z[2] * SUPERGALACTIC_X[1],
    SUPERGALACTIC_Z[2] * SUPERGALACTIC_X[0] -
      SUPERGALACTIC_Z[0] * SUPERGALACTIC_X[2],
    SUPERGALACTIC_Z[0] * SUPERGALACTIC_X[1] -
      SUPERGALACTIC_Z[1] * SUPERGALACTIC_X[0]
  ],
  SUPERGALACTIC_Z
];

/** Longitude and latitude in degrees of a unit vector. */
export const angles = ([x, y, z]: Vector3DTupleType): [number, number] => [
  wrapDegrees(Math.atan2(y, x) / DEG),
  Math.atan2(z, Math.hypot(x, y)) / DEG
];
