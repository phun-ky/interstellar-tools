import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';

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
 * - **Drawing (`display`)**: colour, and state a renderer computes; see {@link DisplayInterface}.
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
 *     period: { value: 480, unit: 'Myr' },
 *     angle: 1.5699 as Radians
 *   },
 *   radius: { value: 2600000, unit: 'km' },
 *   display: { color: 'blue' }
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
  /**
   * Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s²,
   * as the orbit equations take it. Given where JPL publishes one.
   */
  mu?: number;
  /** Physical radius of the star. */
  radius: DistanceInterface;
  /** X-coordinate in the parent's frame. */
  x?: DistanceInterface;
  /** Y-coordinate in the parent's frame. */
  y?: DistanceInterface;
  /** Z-coordinate in the parent's frame. */
  z?: DistanceInterface;
  /** How to draw the star: its colour, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Type alias for a collection of **stars**.
 *
 * @typedef {StarInterface[]} StarsType
 * @group Celestial Bodies
 */
export type StarsType = StarInterface[];
