import { DistanceInterface, MeasureInterface } from '../distance';
import { Radians } from '../numeric';
import { TemporalInterface } from '../temporal';

import { CartesianCoordinatesInterface } from './planets';

/**
 * Represents a **star system**, which can be a planetary system or a stellar system.
 *
 * @property {string} name - Name of the star system.
 * @property {'planetary system' | 'stellar system'} type - Specifies if it is a **planetary system** or a **stellar system**.
 *
 * @example
 * ```ts
 * const solarSystem: StarSystemInterface = {
 *   name: 'Solar System',
 *   type: 'planetary system'
 * };
 * ```
 * @category Celestial Bodies
 */
export interface StarSystemInterface {
  name: string;
  type: 'planetary system' | 'stellar system';
}

/**
 * Represents a **star** in a planetary or stellar system.
 *
 * **Orbital & Physical Properties:**
 * - **Semi-major axis (`a`)**: Defines the star’s orbit size (AU or light-years).
 * - **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is.
 * - **Orbital period (`period`)**: Time taken for one full orbit. Negative values indicates counter clockwise direction.
 * - **True anomaly (`angle`)**: The star’s current position in its orbit (in **radians**).
 * - **Radius (`radius`)**: Physical size of the star.
 *
 * **Classification & Visualization:**
 * - **Type (`type`)**: Classification of the star (e.g., **main-sequence star, white dwarf**).
 * - **Category (`category`)**: Defined as `'star'`.
 * - **Color (`color`)**: Used for visual representation.
 *
 * @example
 * ```ts
 * const sun: StarInterface = {
 *   name: 'Sun',
 *   type: 'G-type main-sequence',
 *   category: 'star',
 *   system: solarSystem,
 *   radius: { value: 695700, unit: 'km' },
 *   color: '#ffcc00',
 *   a: { value: 0, unit: 'au' },
 *   e: 0,
 *   period: { value: 0, unit: 'years' },
 *   angle: 0,
 *   x: { value: 0, unit: 'au' },
 *   y: { value: 0, unit: 'au' },
 *   z: { value: 0, unit: 'au' }
 * };
 * ```
 * @category Celestial Bodies
 */
export interface StarInterface {
  /** Name of the star. */
  name: string;
  /** Classification of the star (e.g., main-sequence, red giant, white dwarf). */
  type: string;
  /** Defines the category as a star. */
  category: 'star';
  /** The system in which the star exists. */
  system: StarSystemInterface;
  /** Physical radius of the star. */
  radius: DistanceInterface;
  /** Visual representation color. */
  color: string;
  /** Semi-major axis of the orbit (AU or light-years). */
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
  /** Orbital period of the star. Negative values indicate counter clockwise direction. */
  period: TemporalInterface;
  /** Precomputed orbital path points for visualization (optional). */
  orbitPath?: CartesianCoordinatesInterface[];
}

/**
 * Type alias for a collection of **stars**.
 *
 * @typedef {StarInterface[]} StarsType
 * @category Celestial Bodies
 */
export type StarsType = StarInterface[];
