import { DistanceInterface, MeasureInterface } from '../distance';
import type { Radians } from '../numeric';
import { TemporalInterface } from '../temporal';

import { CartesianCoordinatesInterface } from './planets';

/**
 * Represents a **moon** (natural satellite) orbiting a planet.
 *
 * **Orbital Properties:**
 * - **Semi-major axis (`a`)**: Defines the moon’s orbit size in **Astronomical Units (AU)**.
 * - **Orbital eccentricity (`e`)**: Determines how elliptical the orbit is ($0 =$ circular, closer to $1 =$ highly elliptical).
 * - **Orbital period (`period`)**: Time taken for one full orbit in **Earth days**. Negative values indicate counter clockwise direction.
 * - **True anomaly (`angle`)**: The moon’s current position in its orbit (in **radians**).
 *
 * **Visualization Properties:**
 * - **Orbit Path (`orbitPath`)**: Precomputed trajectory for rendering.
 * - **Color (`color`)**: Visual representation.
 * - **Size (`radius`)**: Actual moon radius in **kilometers (km)**.
 *
 * @example
 * ```ts
 * const europa: MoonInterface = {
 *   name: 'Europa',
 *   category: 'natural satellite',
 *   system: 'Jupiter',
 *   a: { value: 0.00448, unit: 'au' },
 *   e: 0.009,
 *   period: { value: 3.55, unit: 'd' },
 *   radius: { value: 1560.8, unit: 'km' },
 *   color: '#a6a6a6',
 *   angle: 0,
 * };
 * ```
 * @group Celestial Bodies
 */
export interface MoonInterface {
  /** Name of the moon (e.g., "Io", "Europa", "Titan"). */
  name: string;
  type?: undefined;
  /** Classification of the moon. */
  category:
    | 'natural satellite'
    | 'irregular satellite'
    | 'retrograde satellite';
  /** The planetary system where the moon is located (e.g., "Jupiter"). */
  system: string;
  /** Semi-major axis of the orbit in AU. */
  a: MeasureInterface;
  /** Orbital eccentricity (0 = circular, closer to 1 = highly elliptical). */
  e: number;
  /** Semi-minor axis converted to pixels (calculated from `a` and `e`). */
  miA?: number;
  /** X-offset for the ellipse focus (accounts for eccentricity). */
  focus_x?: number;
  /** Orbital period in Earth days. Negative values indicate counter clockwise orbit */
  period: TemporalInterface;
  /** Physical radius of the moon in kilometres. */
  radius: DistanceInterface;
  /** Visual representation color. */
  color: string;
  /** Current orbital position in radians (True Anomaly). */
  angle: Radians;
  /** X-coordinate in a distance-based system (optional). */
  x?: DistanceInterface;
  /** Y-coordinate in a distance-based system (optional). */
  y?: DistanceInterface;
  /** Z-coordinate in a distance-based system (optional). */
  z?: DistanceInterface;
  /** Precomputed orbital path points for visualization (optional). */
  orbitPath?: CartesianCoordinatesInterface[];
}

/**
 * Type alias for a collection of **moons**.
 *
 * @typedef {MoonInterface[]} MoonsType
 * @group Celestial Bodies
 */
export type MoonsType = MoonInterface[];
