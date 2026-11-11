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

/**
 * A **velocity in 3D**, in a named frame, in km/s: the Sun's motion around
 * the Milky Way's centre, for example, or a galaxy's, from its
 * {@link ObservedMotionInterface}.
 *
 * @example
 * ```ts
 * // The Sun's motion around the Milky Way's centre
 * const sun: VelocityInterface = {
 *   frame: 'galactocentric',
 *   x: 12.9,
 *   y: 251.51,
 *   z: 8.56
 * };
 * ```
 * @group Positions
 */
export interface VelocityInterface {
  /** The frame the components are in. */
  frame: PositionFrameType;
  /** Velocity along `x`, in km/s. */
  x: number;
  /** Velocity along `y`, in km/s. */
  y: number;
  /** Velocity along `z`, in km/s. */
  z: number;
}

/**
 * A **proper motion**: how fast something moves across the sky, in
 * milliarcseconds per year, as catalogues give it.
 *
 * ::: info
 *
 * - `rightAscension` is $\mu_{\alpha*} = \mu_\alpha \cos\delta$, eastwards,
 *   so it's an angle on the sky, not a change in right ascension.
 * - `declination` is $\mu_\delta$, northwards.
 *
 * :::
 *
 * @example
 * ```ts
 * // Andromeda (Salomon et al. 2021, Gaia EDR3)
 * const andromeda: ProperMotionInterface = {
 *   rightAscension: 0.0489,
 *   declination: -0.0369
 * };
 * ```
 * @group Positions
 */
export interface ProperMotionInterface {
  /** Eastwards, $\mu_\alpha \cos\delta$, in mas/yr. */
  rightAscension: number;
  /** Northwards, $\mu_\delta$, in mas/yr. */
  declination: number;
}

/**
 * The **motion of something as seen from the Sun**, as it's measured: its
 * velocity along the line of sight, and where measured, its proper motion
 * across the sky.
 *
 * ::: info
 *
 * - `radialVelocity` is heliocentric, in km/s, positive moving away.
 * - With the direction and distance, they give the 3D velocity.
 *
 * :::
 *
 * @example
 * ```ts
 * // Andromeda, coming towards us
 * const andromeda: ObservedMotionInterface = {
 *   radialVelocity: -300,
 *   properMotion: { rightAscension: 0.0489, declination: -0.0369 }
 * };
 * ```
 * @group Positions
 */
export interface ObservedMotionInterface {
  /** Velocity along the line of sight from the Sun, in km/s, positive moving away. */
  radialVelocity: number;
  /** Motion across the sky. Omitted where it isn't measured. */
  properMotion?: ProperMotionInterface;
}

/**
 * A **direction in supergalactic coordinates**, from the Sun, in degrees.
 *
 * ::: info
 *
 * - The supergalactic plane is where the nearby galaxies and clusters
 *   gather, the Local Supercluster. Its north pole is at galactic longitude
 *   47.37° and latitude 6.32° (de Vaucouleurs et al. 1991).
 * - `sgl`, the supergalactic longitude, runs along the plane from 0° at
 *   galactic longitude 137.37°, latitude 0°.
 * - `sgb`, the supergalactic latitude, is the angle north of the plane, from
 *   −90° to 90°.
 *
 * :::
 *
 * @example
 * ```ts
 * // M87, near the plane, at the heart of the Virgo Cluster
 * const m87: SupergalacticDirectionInterface = {
 *   sgl: 102.88 as DegreesType,
 *   sgb: -2.35 as DegreesType
 * };
 * ```
 * @group Positions
 */
export interface SupergalacticDirectionInterface {
  /** Supergalactic longitude, in degrees. */
  sgl: DegreesType;
  /** Supergalactic latitude, north of the supergalactic plane, in degrees. */
  sgb: DegreesType;
}
