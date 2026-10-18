import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';

/**
 * Represents a **moon** (natural satellite) orbiting a planet.
 *
 * A moon always has a `parent` (its planet) and an `orbit` around it; see
 * {@link OrbitInterface}.
 *
 * **Physical and drawing properties:**
 * - **Size (`radius`)**: Actual moon radius in **kilometers (km)**.
 * - **Drawing (`display`)**: colour, and state a renderer computes; see {@link DisplayInterface}.
 *
 * @example
 * ```ts
 * const europa: MoonInterface = {
 *   id: 'europa',
 *   name: 'Europa',
 *   category: 'natural satellite',
 *   parent: 'jupiter',
 *   orbit: {
 *     a: { value: 0.00448, unit: 'au' },
 *     e: 0.009,
 *     period: { value: 3.551, unit: 'd' },
 *     angle: 0 as Radians
 *   },
 *   radius: { value: 1560.8, unit: 'km' },
 *   display: { color: '#a6a6a6' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface MoonInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Name of the moon (e.g., "Io", "Europa", "Titan"). */
  name: string;
  type?: undefined;
  /** Classification of the moon. */
  category:
    'natural satellite' | 'irregular satellite' | 'retrograde satellite';
  /** Id of the planet the moon orbits (e.g., `'jupiter'`). */
  parent: string;
  /** Orbit around the parent planet. */
  orbit: OrbitInterface;
  /** Physical radius of the moon in kilometres. */
  radius: DistanceInterface;
  /** X-coordinate in a distance-based system (optional). */
  x?: DistanceInterface;
  /** Y-coordinate in a distance-based system (optional). */
  y?: DistanceInterface;
  /** Z-coordinate in a distance-based system (optional). */
  z?: DistanceInterface;
  /** How to draw the moon: its colour, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Type alias for a collection of **moons**.
 *
 * @typedef {MoonInterface[]} MoonsType
 * @group Celestial Bodies
 */
export type MoonsType = MoonInterface[];
