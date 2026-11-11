import type { DistanceInterface } from './distance.js';
import type { DegreesType } from './numeric.js';

/**
 * A **direction in galactic coordinates**, from the Sun, in degrees as
 * catalogues give it.
 *
 * ::: info
 *
 * - `l`, the galactic longitude, runs along the Milky Way's plane, from 0°
 *   towards its centre, through 90° in the direction the Sun moves around it.
 * - `b`, the galactic latitude, is the angle above (north of) the plane, from
 *   −90° to 90°.
 *
 * :::
 *
 * @example
 * ```ts
 * // Andromeda (McConnachie 2012)
 * const andromeda: GalacticDirectionInterface = {
 *   l: 121.17 as DegreesType,
 *   b: -21.57 as DegreesType
 * };
 * ```
 * @group Positions
 */
export interface GalacticDirectionInterface {
  /** Galactic longitude, from 0° towards the Milky Way's centre, in degrees. */
  l: DegreesType;
  /** Galactic latitude, north of the Milky Way's plane, in degrees. */
  b: DegreesType;
}

/**
 * The **frame** of a {@link PositionInterface}.
 *
 * ::: info
 *
 * - `'galactocentric'`: centred on the Milky Way's centre, as Astropy's
 *   `Galactocentric` frame is: the IAU's galactic centre, at galactic
 *   longitude and latitude 0°, as far from the Sun as Sagittarius A*, $R_0$.
 *   Sagittarius A*, its central black hole, is 4.3′ from it, 10.5 pc at $R_0$.
 *   `x` points from the Sun towards the centre, `y` in the direction the Sun
 *   moves around it (galactic longitude 90°), and `z` to the galaxy's north
 *   pole, out of its disk. The Sun is $z_\odot$ above the plane, so the plane
 *   is tilted by $\arcsin(z_\odot / R_0)$ from the galactic equator, and the
 *   Sun sits at $(-\sqrt{R_0^2 - z_\odot^2}, 0, z_\odot)$.
 *
 * :::
 *
 * @group Positions
 */
export type PositionFrameType = 'galactocentric';

/**
 * A **position in 3D**, in a named frame: what a conversion such as
 * `galactocentricPosition` in `@interstellar-tools/equations` returns, from a
 * direction and distance measured from the Sun.
 *
 * @example
 * ```ts
 * // Andromeda, 765 kpc from the Milky Way's centre
 * const andromeda: PositionInterface = {
 *   frame: 'galactocentric',
 *   x: { value: -1_224_100, unit: 'ly' },
 *   y: { value: 1_974_900, unit: 'ly' },
 *   z: { value: -909_500, unit: 'ly' }
 * };
 * ```
 * @group Positions
 */
export interface PositionInterface {
  /** The frame the coordinates are in. */
  frame: PositionFrameType;
  /** X-coordinate in the frame. */
  x: DistanceInterface;
  /** Y-coordinate in the frame. */
  y: DistanceInterface;
  /** Z-coordinate in the frame. */
  z: DistanceInterface;
}
