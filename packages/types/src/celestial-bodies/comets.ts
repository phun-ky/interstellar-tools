import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import { CartesianCoordinatesInterface } from './planets.js';

/**
 * Represents a **comet** in the solar system simulation.
 *
 * **Cometary Orbital Parameters**, all in `orbit`:
 * - **Semi-major axis (`a`)**: Defines the **size** of the comet’s orbit in **Astronomical Units (AU)**.
 * - **Orbital eccentricity (`e`)**: Determines how **elliptical** the orbit is ($0 = $ circular, closer to $1$ = highly elliptical).
 * - **Inclination (`i`)**: The tilt of the orbit relative to the **ecliptic plane**, measured in **degrees**.
 * - **Argument of perihelion (`w`)**: The angle from the **ascending node** to the **perihelion**.
 * - **Longitude of the ascending node (`om`)**: Defines where the orbit crosses the ecliptic.
 * - **Perihelion distance (`q`)**: The closest approach to the Sun in **AU**.
 * - **Angle (`angle`)**: For comets this is the **mean anomaly** at J2000, as in the source data.
 *
 * **Visualization Parameters:**
 * - **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
 * - **Color (`color`)**: Used for visual representation.
 * - **Size (`size`)**: Scaled size for display (not the actual physical size).
 *
 * @group Celestial Bodies
 */
export interface CometInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Name of the comet (e.g., "Halley", "Hale-Bopp"). */
  name: string;
  /** Type of comet based on its orbital characteristics. */
  type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
  /** Category classification of the comet. */
  category: 'halley-type comet' | 'long-period comet' | 'jupiter-family comet';
  /** Id of the star the comet orbits (e.g., `'sun'`). */
  parent: string;
  /** Orbit around the parent, with all elements including `i`, `w`, `om` and `q`. */
  orbit: Required<OrbitInterface>;
  /** X-coordinate in a distance-based system (optional). */
  x?: DistanceInterface;
  /** Y-coordinate in a distance-based system (optional). */
  y?: DistanceInterface;
  /** Z-coordinate in a distance-based system (optional). */
  z?: DistanceInterface;
  /** Semi-minor axis converted to pixels (calculated from `a` and `e`). */
  miA?: number;
  /** X-offset for the ellipse focus (accounts for eccentricity). */
  focus_x?: number;
  /** Radius of the comet (for visualization purposes). */
  radius: DistanceInterface;
  /** Precomputed orbital path points for visualization (optional). */
  orbitPath?: CartesianCoordinatesInterface[];
  /** Visual representation color. */
  color: string;
  /** Scaled size for visualization (not actual physical size). */
  size: number;
}

/**
 * Type alias for an array of **comets**.
 *
 * @typedef {CometInterface[]} CometsType
 * @example
 * ```ts
 * const halley: CometsType = [{
 *   id: '1p-halley',
 *   name: 'Halley',
 *   type: 'periodic comet',
 *   category: 'halley-type comet',
 *   parent: 'sun',
 *   orbit: {
 *     a: { value: 17.834, unit: 'au' },
 *     e: 0.96714,
 *     i: 162.26,
 *     w: 111.33,
 *     om: 58.42,
 *     angle: 0.669857 as Radians,
 *     period: { value: 27576, unit: 'd' },
 *     q: 0.586
 *   },
 *   radius: { value: 11, unit: 'km' },
 *   color: '#ffffff',
 *   size: 1.2
 * }];
 * ```
 * @group Celestial Bodies
 */
export type CometsType = CometInterface[];
