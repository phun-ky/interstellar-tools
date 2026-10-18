import type { DisplayInterface } from './display.js';

/**
 * Represents an asteroid belt within the solar system simulation.
 *
 * **Asteroid Belt Properties:**
 * - **Inner and Outer Radius**: Defines the spatial boundaries of the belt in **Astronomical Units (AU)**.
 * - **Drawing (`display`)**: colour, opacity, and density (how many asteroids to draw); see
 *   {@link DisplayInterface}.
 *
 * @group Celestial Bodies
 */
export interface AsteroidBeltInterface {
  /** Stable identifier. Never translated. */
  id: string;
  /** Name of the asteroid belt. */
  name: string;
  /** Id of the star the belt orbits (e.g., `'sun'`). */
  parent: string;
  /** Inner radius of the belt in Astronomical Units (AU). */
  innerRadius: number;
  /** Outer radius of the belt in Astronomical Units (AU). */
  outerRadius: number;
  /** How to draw the belt: colour, opacity and density, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Type alias for a collection of asteroid belts.
 *
 * @typedef {AsteroidBeltInterface[]} AsteroidBeltsType
 * @example
 * ```ts
 * const asteroidBelts: AsteroidBeltsType = [{
 *   id: 'main-asteroid-belt',
 *   name: 'Main Belt',
 *   parent: 'sun',
 *   innerRadius: 2.1,
 *   outerRadius: 3.3,
 *   display: { color: '#888888', opacity: 0.5, density: 100 }
 * }];
 * ```
 * @group Celestial Bodies
 */
export type AsteroidBeltsType = AsteroidBeltInterface[];
