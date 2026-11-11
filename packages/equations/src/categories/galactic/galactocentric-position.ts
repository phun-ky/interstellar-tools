import type {
  DistanceInterface,
  DistanceUnitAliasType,
  DistanceUnitType,
  GalacticDirectionInterface,
  PositionInterface
} from '@interstellar-tools/types';

import { convertDistanceUnit } from '../helpers/convert-distance-unit.js';

import { DEG, sunPlacement } from './galactic-frame.js';

/**
 * Options for {@link galactocentricPosition}.
 *
 * @group Galactic
 */
export interface GalactocentricPositionOptionsInterface {
  /** The unit of the position. Defaults to the unit of `distance`. */
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

/* node:coverage disable */
/**
 * The **position around the Milky Way's centre** of something seen from the
 * Sun: turns a direction in galactic coordinates and a distance, as `GALAXIES`
 * in `@interstellar-tools/constants` gives them, into $x$, $y$, $z$ in the
 * `'galactocentric'` frame.
 *
 * The frame is Astropy's `Galactocentric`: `x` points from the Sun towards the
 * centre, `y` in the direction the Sun moves around it (galactic longitude
 * 90°), and `z` to the galaxy's north pole. From the Sun's position in galactic
 * coordinates,
 *
 * $$
 * X = d \cos b \cos l - R_0, \quad Y = d \cos b \sin l, \quad Z = d \sin b
 * $$
 *
 * the plane is tilted by $\theta = \arcsin(z_\odot / R_0)$, because the Sun is
 * $z_\odot$ above it:
 *
 * $$
 * x = X \cos\theta + Z \sin\theta, \quad y = Y, \quad z = -X \sin\theta + Z \cos\theta
 * $$
 *
 * ::: info Notes
 *
 * - The centre is where Astropy puts it: at $R_0$ towards galactic longitude
 *   and latitude 0°, the IAU's galactic centre, 4.3′ (10.5 pc) from
 *   Sagittarius A*.
 * - It matches Astropy's transform from right ascension and declination to
 *   about 2 parts in a million of the distance, the size of the difference
 *   between the IAU's galactic coordinates and Astropy's centre.
 * - The Sun itself, at distance 0, is at $(-\sqrt{R_0^2 - z_\odot^2}, 0, z_\odot)$.
 *
 * :::
 *
 * @param {GalacticDirectionInterface} direction - The direction from the Sun: galactic longitude `l` and latitude `b`, in degrees.
 * @param {DistanceInterface} distance - The distance from the Sun.
 * @param {GalactocentricPositionOptionsInterface} [options] - The unit of the result, and the Sun's place, if not the defaults.
 * @returns {PositionInterface} The position in the `'galactocentric'` frame, in `options.unit` or the unit of `distance`.
 * @throws {RangeError} If an angle or a distance isn't finite, `b` is outside −90° to 90°, `distance` is negative,
 * or the Sun's height isn't less than its distance from the centre.
 *
 * @example
 * ```ts
 * import { GALAXIES } from '@interstellar-tools/constants';
 * import { galactocentricPosition } from '@interstellar-tools/equations';
 *
 * const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
 * const position = galactocentricPosition(andromeda.direction!, andromeda.distance, { unit: 'kpc' });
 *
 * console.log(position.x.value, position.y.value, position.z.value); // ≈ -375.31 605.50 -278.87
 * ```
 *
 * @see https://docs.astropy.org/en/stable/coordinates/galactocentric.html Astropy: the Galactocentric frame
 * @group Galactic
 */
/* node:coverage enable */
export const galactocentricPosition = (
  direction: GalacticDirectionInterface,
  distance: DistanceInterface,
  options: GalactocentricPositionOptionsInterface = {}
): PositionInterface => {
  const d = convertDistanceUnit(distance, options.unit ?? distance.unit);
  const { l, b } = direction;

  if (![l, b, d.value].every(Number.isFinite))
    throw new RangeError(
      `The direction and distance must be finite. Received: l ${l}, b ${b}, distance ${d.value}`
    );

  if (b < -90 || b > 90)
    throw new RangeError(`b must be from -90 to 90 degrees. Received: ${b}`);

  if (d.value < 0)
    throw new RangeError(
      `distance must not be negative. Received: ${distance.value}`
    );

  const { r0, cos, sin } = sunPlacement(options, d.unit);
  const cosB = Math.cos(b * DEG);
  const X = d.value * cosB * Math.cos(l * DEG) - r0;
  const Y = d.value * cosB * Math.sin(l * DEG);
  const Z = d.value * Math.sin(b * DEG);

  return {
    frame: 'galactocentric',
    x: { value: X * cos + Z * sin, unit: d.unit },
    y: { value: Y, unit: d.unit },
    z: { value: -X * sin + Z * cos, unit: d.unit }
  };
};
