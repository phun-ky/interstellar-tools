import { DistanceInterface } from '../distance.js';

/**
 * Represents a **black hole** at the center of a galaxy.
 *
 * **Black Hole Properties:**
 * - **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
 * - **Schwarzschild radius (`radius`)**: $r_s = 2GM/c^2$, from its mass, in **Astronomical Units (AU)**.
 * - **Position (`x`, `y`)**: Coordinates relative to the galaxy center in **AU**.
 *
 * @example
 * ```ts
 * const sagittariusA: BlackHoleInterface = {
 *   name: 'Sagittarius A*',
 *   mass: 4.2996e6,
 *   radius: { value: 0.08488, unit: 'au' },
 *   x: { value: 0, unit: 'au' },
 *   y: { value: 0, unit: 'au' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface BlackHoleInterface {
  /** Name of the central black hole. */
  name: string;
  /** Mass of the black hole in solar masses. */
  mass: number;
  /** Schwarzschild radius of the black hole in AU. */
  radius: DistanceInterface;
  /** X-coordinate relative to the galaxy center in AU. */
  x: DistanceInterface;
  /** Y-coordinate relative to the galaxy center in AU. */
  y: DistanceInterface;
}

/**
 * Represents a **galaxy** in the universe simulation.
 *
 * **Galaxy Properties:**
 * - **Name (`name`)**: The galaxy's official designation.
 * - **Type (`type`)**: The morphological classification (e.g., Spiral, Elliptical).
 * - **Diameter (`diameter`)**: Measured in **light-years**.
 * - **Distance (`distance`)**: The distance from the Sun, also in **light-years**: 0 for the Milky Way itself.
 * - **Black Hole (`blackHole`)**: The central supermassive black hole, where one is detected.
 *   Triangulum (M33) has none: observations only limit its mass to a few thousand $M_\odot$.
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
