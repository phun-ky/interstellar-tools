import { DistanceInterface } from '../distance.js';
import type { Radians } from '../numeric.js';
import type { GalacticDirectionInterface } from '../positions.js';

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
