import type { EllipsoidInterface } from '../cartography.js';
import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

import type { MoonObservationsInterface } from './body-observations.js';
import type { DisplayInterface } from './display.js';
import type { RotationInterface } from './rotation.js';

/**
 * Represents a **moon** (natural satellite) orbiting a planet, a dwarf planet or an
 * asteroid.
 *
 * A moon always has a `parent` (its planet, or an asteroid like Dimorphos's Didymos)
 * and an `orbit` around it; see
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
  /** Id of the planet, or asteroid, the moon orbits (e.g., `'jupiter'`, `'65803-didymos'`). */
  parent: string;
  /** Orbit around the parent. */
  orbit: OrbitInterface;
  /**
   * How the moon spins: its sidereal rotation period and direction. Given
   * where the IAU, or a measurement, publishes one.
   */
  rotation?: RotationInterface;
  /** Mean radius of the moon in kilometres; the IAU's, where it gives one. */
  radius: DistanceInterface;
  /**
   * Reference ellipsoid, from the IAU Working Group on Cartographic
   * Coordinates and Rotational Elements, where it gives one. `radius` is the
   * mean radius.
   */
  ellipsoid?: EllipsoidInterface;
  /**
   * Standard gravitational parameter $\mu = G M$ of the body alone, in m³/s²,
   * as the orbit equations take it. Given where JPL publishes one.
   */
  mu?: number;
  /** X-coordinate in a distance-based system (optional). */
  x?: DistanceInterface;
  /** Y-coordinate in a distance-based system (optional). */
  y?: DistanceInterface;
  /** Z-coordinate in a distance-based system (optional). */
  z?: DistanceInterface;
  /** How to draw the moon: its colour, and state a renderer computes. */
  display?: DisplayInterface;
  /**
   * What is measured about it, with uncertainties and sources, apart from
   * the values the equations use.
   */
  observations?: MoonObservationsInterface;
}

/**
 * Type alias for a collection of **moons**.
 *
 * @typedef {MoonInterface[]} MoonsType
 * @group Celestial Bodies
 */
export type MoonsType = MoonInterface[];
