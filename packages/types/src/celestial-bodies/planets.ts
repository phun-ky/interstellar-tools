import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

/**
 * Represents **2D coordinates** for planetary positioning.
 *
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 *
 * @example
 * ```ts
 * const position: CartesianCoordinatesInterface = { x: 100, y: 200 };
 * ```
 * @group Celestial Bodies
 */
export interface CartesianCoordinatesInterface {
  x: number;
  y: number;
}

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
 * - **Color (`color`)**: Used for visual representation in simulations.
 * - **Size (`radius`)**: Physical planet radius in **kilometers (km)**.
 *
 * @example
 * ```ts
 * const earth: PlanetInterface = {
 *   id: 'earth',
 *   name: 'Earth',
 *   type: 'terrestrial planet',
 *   category: 'planet',
 *   color: '#4287f5',
 *   parent: 'sun',
 *   orbit: {
 *     a: { value: 1.0, unit: 'au' },
 *     e: 0.0167,
 *     period: { value: -365.256, unit: 'd' },
 *     angle: 1.753 as Radians
 *   },
 *   radius: { value: 6371, unit: 'km' },
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
  /** Visual representation color. */
  color: string;
  /** Id of the star, system or galaxy the planet is bound to. */
  parent?: string;
  /** Orbit around the parent. */
  orbit?: OrbitInterface;
  /** Physical radius of the planet in kilometres. */
  radius: DistanceInterface;
  /** Semi-minor axis of the orbit (calculated from `a` and `e`). */
  miA?: number;
  /** X-offset for the ellipse focus (accounts for eccentricity). */
  focus_x?: number;
  /** X-coordinate in the parent's frame. */
  x: DistanceInterface;
  /** Y-coordinate in the parent's frame. */
  y: DistanceInterface;
  /** Z-coordinate in the parent's frame. */
  z: DistanceInterface;
  /** Precomputed orbital path points for visualization (optional). */
  orbitPath?: CartesianCoordinatesInterface[];
}

/**
 * Type alias for a collection of **planets**.
 *
 * @typedef {PlanetInterface[]} PlanetsType
 * @group Celestial Bodies
 */
export type PlanetsType = PlanetInterface[];
