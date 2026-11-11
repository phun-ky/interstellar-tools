import type { DistanceInterface } from '../distance.js';
import type { OpenOrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';
import type { RotationInterface } from './rotation.js';

/**
 * An **interstellar object**: a body from another star's system, passing
 * through the Solar System once, on an open orbit around the Sun. The IAU's
 * Minor Planet Center designates them with an `I`: 1I/ʻOumuamua,
 * 2I/Borisov, 3I/ATLAS.
 *
 * ::: info
 *
 * - **Orbit**: an {@link OpenOrbitInterface}, a hyperbola with no period. That
 *   is why these objects aren't in {@link CelestialBodyType}: code that reads
 *   any body's `orbit.period` would break on them.
 * - **Type**: `'interstellar comet'` for one with a coma, as Borisov's and
 *   3I/ATLAS's, and `'interstellar object'` for ʻOumuamua, which showed no
 *   coma but was pushed by more than gravity, so is neither a clear comet nor
 *   a clear asteroid.
 *
 * :::
 *
 * @example
 * ```ts
 * const borisov: InterstellarObjectInterface = {
 *   id: '2i-borisov',
 *   name: 'Borisov',
 *   designation: '2I/2019 Q4',
 *   type: 'interstellar comet',
 *   category: 'interstellar object',
 *   parent: 'sun',
 *   orbit: {
 *     a: { value: -0.8515, unit: 'au' },
 *     e: 3.3565,
 *     q: { value: 2.0065, unit: 'au' },
 *     i: 44.053 as DegreesType,
 *     w: 209.124 as DegreesType,
 *     om: 308.148 as DegreesType,
 *     angle: -1.8537 as Radians,
 *     periapsisTime: new Date('2019-12-08T13:16:04Z'),
 *     excessSpeed: 32.28,
 *     frame: { plane: 'ecliptic' }
 *   },
 *   radius: { value: 0.4, unit: 'km' }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface InterstellarObjectInterface {
  /** Stable identifier. Never translated. */
  id: string;
  /** Name (e.g., "ʻOumuamua", "Borisov"). */
  name: string;
  /** The Minor Planet Center's designation, e.g. `'1I/2017 U1'`. */
  designation: string;
  /** `'interstellar comet'` with a coma, `'interstellar object'` without. */
  type: 'interstellar comet' | 'interstellar object';
  /** Category classification: every one is an interstellar object. */
  category: 'interstellar object';
  /** Id of the star it passes, `'sun'`. */
  parent: string;
  /** Its open orbit around the parent. */
  orbit: OpenOrbitInterface;
  /** How it spins, where that's measured. */
  rotation?: RotationInterface;
  /** Radius of its nucleus or body, or an effective one for an elongated body. */
  radius: DistanceInterface;
  /** How to draw it: its colour and drawn size, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Type alias for an array of **interstellar objects**.
 *
 * @group Celestial Bodies
 */
export type InterstellarObjectsType = InterstellarObjectInterface[];
