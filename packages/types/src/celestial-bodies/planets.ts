import { DistanceInterface, MeasureInterface } from '../distance';
import { Radians } from '../numeric';
import { TemporalInterface } from '../temporal';

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
 * Represents a **planet** in the solar system simulation.
 *
 * **Orbital Properties:**
 * - **Semi-major axis (`a`)**: Defines the planet’s orbit size in **Astronomical Units (AU)**.
 * - **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is ($0 =$ circular, closer to $1 =$ highly elliptical).
 * - **Orbital period (`period`)**: Time taken for one full orbit in **Earth days**.
 * - **True anomaly (`angle`)**: The planet’s current position in its orbit (in **radians**).
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
 *   name: 'Earth',
 *   type: 'terrestrial planet',
 *   category: 'planet',
 *   color: '#4287f5',
 *   system: 'Sun',
 *   radius: { value: 6371, unit: 'km' },
 *   a: { value: 1.0, unit: 'au' },
 *   e: 0.0167,
 *   period: { value: 365.25, unit: 'd' },
 *   angle: 0,
 *   x: { value: 0, unit: 'au' },
 *   y: { value: 1, unit: 'au' },
 *   z: { value: 0, unit: 'au' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface PlanetInterface {
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
  /** The planetary system in which the planet exists. */
  system: string;
  /** Physical radius of the planet in kilometres. */
  radius: DistanceInterface;
  /** Semi-major axis of the orbit in AU. */
  a: MeasureInterface;
  /** Orbital eccentricity (0 = circular, closer to 1 = highly elliptical). */
  e: number;
  /** Semi-minor axis of the orbit (calculated from `a` and `e`). */
  miA?: number;
  /** X-offset for the ellipse focus (accounts for eccentricity). */
  focus_x?: number;
  /** Current orbital position in radians (True Anomaly). */
  angle: Radians;
  /** X-coordinate in a distance-based system. */
  x: DistanceInterface;
  /** Y-coordinate in a distance-based system. */
  y: DistanceInterface;
  /** Z-coordinate in a distance-based system. */
  z: DistanceInterface;
  /** Orbital period in Earth days. Negative values indicate counter clockwise orbit */
  period: TemporalInterface;
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
