import type {
  DegreesType,
  DistanceInterface,
  DistanceUnitAliasType,
  DistanceUnitType,
  GalacticDirectionInterface,
  PositionInterface
} from '@interstellar-tools/types';

import { convertDistanceUnit } from '../helpers/convert-distance-unit.js';

import { DEG, sunPlacement, wrapDegrees } from './galactic-frame.js';

/**
 * Options for {@link galactocentricToGalactic}.
 *
 * @group Galactic
 */
export interface GalactocentricToGalacticOptionsInterface {
  /** The unit of the distance. Defaults to the unit of the position's `x`. */
  unit?: DistanceUnitType | DistanceUnitAliasType;
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
}

/**
 * A direction and distance from the Sun, as {@link galactocentricToGalactic}
 * gives them.
 *
 * @group Galactic
 */
export interface GalacticDirectionAndDistanceInterface {
  /** The direction from the Sun, in galactic coordinates. */
  direction: GalacticDirectionInterface;
  /** The distance from the Sun. */
  distance: DistanceInterface;
}

/* node:coverage disable */
/**
 * The **direction and distance from the Sun of a galactocentric position**: the
 * inverse of {@link galactocentricPosition}. It untilts the plane by
 * $\theta = \arcsin(z_\odot / R_0)$, moves the origin back to the Sun, and
 * reads off the galactic longitude, latitude and distance:
 *
 * $$
 * X = x \cos\theta - z \sin\theta + R_0, \quad Y = y, \quad Z = x \sin\theta + z \cos\theta
 * $$
 *
 * $$
 * d = \sqrt{X^2 + Y^2 + Z^2}, \quad l = \operatorname{atan2}(Y, X), \quad b = \operatorname{atan2}\left(Z, \sqrt{X^2 + Y^2}\right)
 * $$
 *
 * ::: info Notes
 *
 * - Use the same `sunDistance` and `sunHeight` as the position was made with.
 * - At the Sun itself, distance 0, the direction means nothing.
 *
 * :::
 *
 * @param {PositionInterface} position - A position in the `'galactocentric'` frame.
 * @param {GalactocentricToGalacticOptionsInterface} [options] - The unit of the distance, and the Sun's place, if not the defaults.
 * @returns {GalacticDirectionAndDistanceInterface} The direction from the Sun, `l` from 0° up to 360°, and the distance.
 * @throws {RangeError} If the position isn't in the `'galactocentric'` frame, a coordinate isn't finite,
 * or the Sun's height isn't less than its distance from the centre.
 *
 * @example
 * ```ts
 * // The origin, the Milky Way's centre: R0 from the Sun, towards l = b = 0
 * const { direction, distance } = galactocentricToGalactic({
 *   frame: 'galactocentric',
 *   x: { value: 0, unit: 'pc' },
 *   y: { value: 0, unit: 'pc' },
 *   z: { value: 0, unit: 'pc' }
 * }); // direction { l: 0, b: 0 }, distance { value: 8275.9, unit: 'pc' }
 * ```
 *
 * @see {@link galactocentricPosition}, its inverse.
 * @group Galactic
 */
/* node:coverage enable */
export const galactocentricToGalactic = (
  position: PositionInterface,
  options: GalactocentricToGalacticOptionsInterface = {}
): GalacticDirectionAndDistanceInterface => {
  if (position.frame !== 'galactocentric')
    throw new RangeError(
      `The position must be in the 'galactocentric' frame. Received: ${String(position.frame)}`
    );

  const unit = convertDistanceUnit(
    position.x,
    options.unit ?? position.x.unit
  ).unit;
  const [x, y, z] = [position.x, position.y, position.z].map(
    (coordinate) => convertDistanceUnit(coordinate, unit).value
  ) as [number, number, number];

  if (![x, y, z].every(Number.isFinite))
    throw new RangeError(
      `The coordinates must be finite. Received: ${x}, ${y}, ${z}`
    );

  const { r0, cos, sin } = sunPlacement(options, unit);
  const X = x * cos - z * sin + r0;
  const Z = x * sin + z * cos;
  const d = Math.hypot(X, y, Z);

  return {
    direction: {
      l: wrapDegrees(Math.atan2(y, X) / DEG) as DegreesType,
      b: (Math.atan2(Z, Math.hypot(X, y)) / DEG) as DegreesType
    },
    distance: { value: d, unit }
  };
};
