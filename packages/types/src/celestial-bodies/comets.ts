import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';

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
 * - **Angle (`angle`)**: The **true anomaly** at J2000, as for every other body.
 *
 * **Drawing (`display`)**: colour and a scaled drawing size (not the physical
 * `radius`), and state a renderer computes; see {@link DisplayInterface}.
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
  /** Radius of the comet (for visualization purposes). */
  radius: DistanceInterface;
  /** How to draw the comet: its colour and drawn size, and state a renderer computes. */
  display?: DisplayInterface;
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
 *     angle: 2.97966 as Radians,
 *     period: { value: 27576, unit: 'd' },
 *     q: 0.586
 *   },
 *   radius: { value: 11, unit: 'km' },
 *   display: { color: '#ffffff', size: 1.2 }
 * }];
 * ```
 * @group Celestial Bodies
 */
export type CometsType = CometInterface[];
