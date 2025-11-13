import { CartesianCoordinatesInterface } from './planets';

/**
 * Represents an asteroid belt within the solar system simulation.
 *
 * **Asteroid Belt Properties:**
 * - **Inner and Outer Radius**: Defines the spatial boundaries of the belt in **Astronomical Units (AU)**.
 * - **Density**: Determines the number of simulated asteroids within the belt.
 * - **Color and Opacity**: Used for visualization.
 * - **Orbit Path (Optional)**: Stores a precomputed path for asteroid positioning.
 *
 * @category Celestial Bodies
 */
export interface AsteroidBeltInterface {
  /** Name of the asteroid belt. */
  name: string;
  /** Inner radius of the belt in Astronomical Units (AU). */
  innerRadius: number;
  /** Outer radius of the belt in Astronomical Units (AU). */
  outerRadius: number;
  /** Belt color for visualization. */
  color: string;
  /** Transparency level (0 = fully transparent, 1 = solid). */
  opacity: number;
  /** Density factor affecting how many asteroids are simulated. */
  density: number;
  /** Optional: Orbit path for finer asteroid positioning. */
  orbitPath?: CartesianCoordinatesInterface[];
}

/**
 * Type alias for a collection of asteroid belts.
 *
 * @typedef {AsteroidBeltInterface[]} AsteroidBeltsType
 * @example
 * ```ts
 * const asteroidBelt: AsteroidBeltInterface = {
 *   name: 'Main Belt',
 *   innerRadius: 2.1,
 *   outerRadius: 3.3,
 *   color: '#888888',
 *   opacity: 0.5,
 *   density: 100,
 * };
 * ```
 * @category Celestial Bodies
 */
export type AsteroidBeltsType = AsteroidBeltInterface[];
