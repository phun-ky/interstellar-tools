import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import { CartesianCoordinatesInterface } from './planets.js';

/**
 * Represents a **star**.
 *
 * A star is bound to one `parent`: a galaxy for a single star like Vega, or a
 * system barycenter for a star in a planetary, binary or multiple system. Its
 * `orbit` describes the motion around that parent. A star without a `parent`
 * is unbound, like a hypervelocity star leaving its galaxy.
 *
 * **Classification & Visualization:**
 * - **Type (`type`)**: Spectral classification of the star (e.g., `'G2V'`).
 * - **Category (`category`)**: Defined as `'star'`.
 * - **Color (`color`)**: Used for visual representation.
 *
 * @example
 * ```ts
 * const vega: StarInterface = {
 *   id: 'vega',
 *   name: 'Vega',
 *   type: 'A0V',
 *   category: 'star',
 *   parent: 'milky-way',
 *   orbit: {
 *     a: { value: 27230, unit: 'ly' },
 *     e: 0.005,
 *     period: { value: -480, unit: 'Myr' },
 *     angle: 1.5699 as Radians
 *   },
 *   radius: { value: 2600000, unit: 'km' },
 *   color: 'blue'
 * };
 * ```
 * @group Celestial Bodies
 */
export interface StarInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Name of the star. */
  name: string;
  /** Spectral classification of the star (e.g., `'G2V'`). */
  type: string;
  /** Defines the category as a star. */
  category: 'star';
  /** Id of the galaxy or system the star is bound to. */
  parent?: string;
  /** Orbit around the parent. */
  orbit?: OrbitInterface;
  /** Mass in solar masses ($M_\odot$). */
  mass?: number;
  /** Physical radius of the star. */
  radius: DistanceInterface;
  /** Visual representation color. */
  color: string;
  /** Semi-minor axis of the orbit (calculated from `a` and `e`). */
  miA?: number;
  /** X-offset for the ellipse focus (accounts for eccentricity). */
  focus_x?: number;
  /** X-coordinate in the parent's frame. */
  x?: DistanceInterface;
  /** Y-coordinate in the parent's frame. */
  y?: DistanceInterface;
  /** Z-coordinate in the parent's frame. */
  z?: DistanceInterface;
  /** Precomputed orbital path points for visualization (optional). */
  orbitPath?: CartesianCoordinatesInterface[];
}

/**
 * Type alias for a collection of **stars**.
 *
 * @typedef {StarInterface[]} StarsType
 * @group Celestial Bodies
 */
export type StarsType = StarInterface[];
