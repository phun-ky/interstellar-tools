import { DistanceInterface, MeasureInterface } from '../distance';
import { Radians } from '../numeric';
import { TemporalInterface } from '../temporal';

import { CartesianCoordinatesInterface } from './planets';

/**
 * Represents a **comet** in the solar system simulation.
 *
 * **Cometary Orbital Parameters:**
 * - **Semi-major axis (`a`)**: Defines the **size** of the comet’s orbit in **Astronomical Units (AU)**.
 * - **Orbital eccentricity (`e`)**: Determines how **elliptical** the orbit is ($0 = $ circular, closer to $1$ = highly elliptical).
 * - **Inclination (`i`)**: The tilt of the orbit relative to the **ecliptic plane**, measured in **degrees**.
 * - **Argument of perihelion (`w`)**: The angle from the **ascending node** to the **perihelion**.
 * - **Longitude of the ascending node (`om`)**: Defines where the orbit crosses the ecliptic.
 * - **Perihelion distance (`q`)**: The closest approach to the Sun in **AU**.
 *
 * **Visualization Parameters:**
 * - **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
 * - **Color (`color`)**: Used for visual representation.
 * - **Size (`size`)**: Scaled size for display (not the actual physical size).
 *
 * @category Celestial Bodies
 */
export interface CometInterface {
  /** Name of the comet (e.g., "Halley", "Hale-Bopp"). */
  name: string;
  /** Type of comet based on its orbital characteristics. */
  type: 'periodic comet' | 'oort cloud comet' | 'short-period comet';
  /** Category classification of the comet. */
  category: 'halley-type comet' | 'long-period comet' | 'jupiter-family comet';
  /** The star system where the comet is located. */
  system: string;
  /** Semi-major axis of the orbit in AU. */
  a: MeasureInterface;
  /** Orbital eccentricity (0 = circular, closer to 1 = highly elliptical). */
  e: number;
  /** Orbital inclination in degrees. */
  i: number;
  /** Argument of perihelion in degrees. */
  w: number;
  /** Longitude of the ascending node in degrees. */
  om: number;
  /** Mean anomaly at epoch in radians. */
  angle: Radians;
  /** Orbital period in Earth days. Negative values indicate counter clockwise orbit */
  period: TemporalInterface;
  /** Perihelion distance in AU. */
  q: number;
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
 * const halley: CometInterface = {
 *   name: 'Halley',
 *   type: 'periodic comet',
 *   category: 'halley-type comet',
 *   system: 'Sun,
 *   a: { value: 17.8, unit: 'au' },
 *   e: 0.967,
 *   i: 162.26,
 *   w: 111.33,
 *   om: 58.42,
 *   angle: 0,
 *   period: { value: 76, unit: 'years' },
 *   q: 0.586,
 *   radius: { value: 11, unit: 'km' },
 *   color: '#ffffff',
 *   size: 1.2
 * };
 * ```
 * @category Celestial Bodies
 */
export type CometsType = CometInterface[];
