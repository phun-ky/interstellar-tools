import { DistanceInterface } from '../distance.js';
import type { DegreesType, Radians } from '../numeric.js';
import type {
  GalacticDirectionInterface,
  ObservedMotionInterface
} from '../positions.js';

import type {
  BlackHoleObservationsInterface,
  GalaxyObservationsInterface
} from './body-observations.js';

/**
 * Represents a **black hole** at the center of a galaxy.
 *
 * **Black Hole Properties:**
 * - **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
 * - **Schwarzschild radius (`radius`)**: $r_s = 2GM/c^2$, from its mass, in **Astronomical Units (AU)**.
 * - **Position (`x`, `y`, `z`)**: Coordinates relative to the galaxy center in **AU**, `z` out of its disk.
 * - **Id (`id`)**: given where stars orbit it, so they can name it as their `parent`,
 *   like the S-stars around Sagittarius A*. Their orbits take its `mu`.
 * - **Ring (`ringDiameter`)**: the angular diameter of the bright ring around its
 *   shadow, where the Event Horizon Telescope has imaged it.
 *
 * @example
 * ```ts
 * const sagittariusA: BlackHoleInterface = {
 *   id: 'sagittarius-a-star',
 *   name: 'Sagittarius A*',
 *   mass: 4.2996e6,
 *   mu: 5.706e26,
 *   radius: { value: 0.08488, unit: 'au' },
 *   distance: { value: 26992, unit: 'ly' },
 *   ringDiameter: 2.511e-10 as Radians, // 51.8 μas
 *   x: { value: 0, unit: 'au' },
 *   y: { value: 0, unit: 'au' },
 *   z: { value: 0, unit: 'au' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface BlackHoleInterface {
  /** Stable identifier, used by `parent` references. Given where something orbits it. */
  id?: string;
  /** Name of the central black hole. */
  name: string;
  /** Mass of the black hole in solar masses. */
  mass: number;
  /**
   * Standard gravitational parameter $\mu = G M$, in m³/s², as the orbit
   * equations take it. Given where something orbits it.
   */
  mu?: number;
  /** Distance from the Sun, where it's measured apart from its galaxy's. */
  distance?: DistanceInterface;
  /** Angular diameter of the ring the Event Horizon Telescope imaged around its shadow. */
  ringDiameter?: Radians;
  /** Schwarzschild radius of the black hole in AU. */
  radius: DistanceInterface;
  /** X-coordinate relative to the galaxy center in AU. */
  x: DistanceInterface;
  /** Y-coordinate relative to the galaxy center in AU. */
  y: DistanceInterface;
  /** Z-coordinate relative to the galaxy center in AU, out of its disk. */
  z?: DistanceInterface;
  /**
   * What is measured about it, with uncertainties and sources, apart from
   * the values the equations use.
   */
  observations?: BlackHoleObservationsInterface;
}

/**
 * How a **galaxy's disk** is turned, as seen from the Sun.
 *
 * ::: info
 *
 * - `inclination` is the angle between the disk and the sky: 0° face-on,
 *   90° edge-on.
 * - `positionAngle` is the direction on the sky, east of north, of the
 *   receding half of the disk's major axis, where the disk crosses the sky's
 *   plane: from its rotation, 0° up to 360°.
 * - `nearSide` is the direction of the half of the minor axis that's nearer to
 *   us, `positionAngle` plus or minus 90°. Without it, the disk could tilt
 *   either way.
 *
 * :::
 *
 * @example
 * ```ts
 * // Andromeda (Corbelli et al. 2010): its north-east half recedes, and its
 * // north-west side is nearer
 * const andromeda: GalaxyDiskInterface = {
 *   inclination: 77.7 as DegreesType,
 *   positionAngle: 38 as DegreesType,
 *   nearSide: 308 as DegreesType
 * };
 * ```
 * @group Celestial Bodies
 */
export interface GalaxyDiskInterface {
  /** Angle between the disk and the sky, 0° face-on to 90° edge-on. */
  inclination: DegreesType;
  /** Position angle of the receding half of the major axis, east of north, in degrees. */
  positionAngle: DegreesType;
  /** Position angle of the nearer half of the minor axis, in degrees. Omitted where it isn't known. */
  nearSide?: DegreesType;
}

/**
 * Represents a **galaxy** in the universe simulation.
 *
 * **Galaxy Properties:**
 * - **Name (`name`)**: The galaxy's official designation.
 * - **Type (`type`)**: The morphological classification (e.g., Spiral, Elliptical).
 * - **Diameter (`diameter`)**: Measured in **light-years**.
 * - **Distance (`distance`)**: The distance from the Sun, also in **light-years**: 0 for the Milky Way itself.
 *   Like `direction`, it's measured from the Sun, where every observation is made from.
 * - **Black Hole (`blackHole`)**: The central supermassive black hole, where one is detected.
 *   Triangulum (M33) has none: observations only limit its mass to a few thousand $M_\odot$.
 * - **Direction (`direction`)**: Where it is on the sky, in galactic coordinates from the Sun.
 *   With `distance`, it places the galaxy from the Sun; to draw it around the Milky Way's
 *   centre instead, shift it by the Sun's place there, as `galactocentricPosition` in
 *   `@interstellar-tools/equations` does.
 * - **Disk (`disk`)**: How its disk is turned on the sky, where it has a disk
 *   that's measured. Elliptical and disrupted galaxies have none.
 * - **Motion (`motion`)**: Its velocity along the line of sight and, where
 *   measured, across the sky, from the Sun.
 *
 * @example
 * ```ts
 * const milkyWay: GalaxyInterface = {
 *   id: 'milky-way',
 *   name: 'Milky Way',
 *   type: 'SBbc',
 *   diameter: { value: 87410, unit: 'ly' },
 *   distance: { value: 0, unit: 'ly' },
 *   blackHole: sagittariusA
 * };
 * ```
 * @group Celestial Bodies
 */
export interface GalaxyInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Name of the galaxy. */
  name: string;
  /** Morphological classification of the galaxy. */
  type: string;
  /** Diameter of the galaxy in light-years. */
  diameter: DistanceInterface;
  /** Distance from the Sun in light-years: 0 for the Milky Way itself. */
  distance: DistanceInterface;
  /** Central supermassive black hole of the galaxy. Omitted where none is detected. */
  blackHole?: BlackHoleInterface;
  /** Direction from the Sun, in galactic coordinates. Omitted for the Milky Way itself. */
  direction?: GalacticDirectionInterface;
  /** How its disk is turned on the sky. Omitted where it has no measured disk. */
  disk?: GalaxyDiskInterface;
  /** Its motion seen from the Sun. Omitted for the Milky Way itself. */
  motion?: ObservedMotionInterface;
  /**
   * What is measured about it, with uncertainties and sources, apart from
   * the values the equations use.
   */
  observations?: GalaxyObservationsInterface;
}

/**
 * Type alias for a collection of **galaxies**.
 *
 * @typedef {GalaxyInterface[]} GalaxiesType
 * @group Celestial Bodies
 */
export type GalaxiesType = GalaxyInterface[];

/**
 * Type alias for a collection of **black holes**.
 *
 * @typedef {BlackHoleInterface[]} BlackHolesType
 * @group Celestial Bodies
 */
export type BlackHolesType = BlackHoleInterface[];
