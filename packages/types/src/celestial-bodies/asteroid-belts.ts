import type { DistanceInterface } from '../distance.js';

import type { DisplayInterface } from './display.js';

/**
 * Represents an asteroid belt within the solar system simulation.
 *
 * **Asteroid Belt Properties:**
 * - **Inner and Outer Radius**: The belt's boundaries, as distances from the parent.
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
  /** Inner radius of the belt, from the parent. */
  innerRadius: DistanceInterface;
  /** Outer radius of the belt, from the parent. */
  outerRadius: DistanceInterface;
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
 *   innerRadius: { value: 2.1, unit: 'au' },
 *   outerRadius: { value: 3.3, unit: 'au' },
 *   display: { color: '#888888', opacity: 0.5, density: 100 }
 * }];
 * ```
 * @group Celestial Bodies
 */
export type AsteroidBeltsType = AsteroidBeltInterface[];
