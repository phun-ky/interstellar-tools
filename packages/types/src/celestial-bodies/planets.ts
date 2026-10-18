import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';

/**
 * Represents a **planet** or **planetoid**.
 *
 * A planet is bound to one `parent`: usually a star, a binary system for a
 * circumbinary planet, or the galaxy for a rogue planet. Its `orbit` describes
 * the motion around that parent; see {@link OrbitInterface}.
 *
 * **Classification & Visualization:**
 * - **Type (`type`)**: Scientific classification of the planet (e.g., **terrestrial, gas giant, ice planet**).
 * - **Category (`category`)**: Defines whether the object is a **planet** or a **planetoid**.
 * - **Drawing (`display`)**: colour, and state a renderer computes; see {@link DisplayInterface}.
 * - **Size (`radius`)**: Physical planet radius in **kilometers (km)**.
 *
 * @example
 * ```ts
 * const earth: PlanetInterface = {
 *   id: 'earth',
 *   name: 'Earth',
 *   type: 'terrestrial planet',
 *   category: 'planet',
 *   parent: 'sun',
 *   orbit: {
 *     a: { value: 1.0, unit: 'au' },
 *     e: 0.0167,
 *     period: { value: 365.256, unit: 'd' },
 *     angle: 1.753 as Radians
 *   },
 *   radius: { value: 6371, unit: 'km' },
 *   display: { color: '#4287f5' },
 *   x: { value: 0, unit: 'au' },
 *   y: { value: 1, unit: 'au' },
 *   z: { value: 0, unit: 'au' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface PlanetInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Name of the planet (e.g., "Earth", "Mars"). */
  name: string;
  /** Type classification of the planet. */
  type:
    | 'chthonian planet'
    | 'carbon planet'
    | 'coreless planet'
    | 'desert planet'
    | 'gas dwarf'
    | 'gas giant'
    | 'helium planet'
    | 'hycean planet'
    | 'ice giant'
    | 'ice planet'
    | 'iron planet'
    | 'lava planet'
    | 'ocean planet'
    | 'proto planet'
    | 'puffy planet'
    | 'super-puff'
    | 'silicate planet'
    | 'terrestrial planet';
  /** Defines whether the object is a planet or a planetoid. */
  category: 'planet' | 'planetoid';
  /** Id of the star, system or galaxy the planet is bound to. */
  parent?: string;
  /** Orbit around the parent. */
  orbit?: OrbitInterface;
  /** Physical radius of the planet in kilometres. */
  radius: DistanceInterface;
  /**
   * Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s²,
   * as the orbit equations take it. Given where JPL publishes one.
   */
  mu?: number;
  /** X-coordinate in the parent's frame. Optional: a rogue planet or an exoplanet may have no known position. */
  x?: DistanceInterface;
  /** Y-coordinate in the parent's frame. */
  y?: DistanceInterface;
  /** Z-coordinate in the parent's frame. */
  z?: DistanceInterface;
  /** How to draw the planet: its colour, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Type alias for a collection of **planets**.
 *
 * @typedef {PlanetInterface[]} PlanetsType
 * @group Celestial Bodies
 */
export type PlanetsType = PlanetInterface[];
