import { DistanceInterface } from '../distance';

/**
 * Represents a **black hole** at the center of a galaxy.
 *
 * **Black Hole Properties:**
 * - **Mass (`mass`)**: Measured in **solar masses** ($M_\odot$).
 * - **Schwarzschild radius (`radius`)**: Defined in **Astronomical Units (AU)**.
 * - **Position (`x`, `y`)**: Coordinates relative to the galaxy center in **AU**.
 *
 * @example
 * ```ts
 * const sagittariusA: BlackHoleInterface = {
 *   name: 'Sagittarius A*',
 *   mass: 4.154e6,
 *   radius: { value: 0.08, unit: 'au' },
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
 * - **Distance (`distance`)**: The distance from the **Milky Way**, also in **light-years**.
 * - **Black Hole (`blackHole`)**: The central supermassive black hole.
 *
 * @example
 * ```ts
 * const milkyWay: GalaxyInterface = {
 *   name: 'Milky Way',
 *   type: 'Spiral',
 *   diameter: { value: 105700, unit: 'lightyears' },
 *   distance: { value: 0, unit: 'lightyears' },
 *   blackHole: sagittariusA
 * };
 * ```
 * @group Celestial Bodies
 */
export interface GalaxyInterface {
  /** Name of the galaxy. */
  name: string;
  /** Morphological classification of the galaxy. */
  type: string;
  /** Diameter of the galaxy in light-years. */
  diameter: DistanceInterface;
  /** Distance from the Milky Way in light-years. */
  distance: DistanceInterface;
  /** Central black hole of the galaxy. */
  blackHole: BlackHoleInterface;
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
