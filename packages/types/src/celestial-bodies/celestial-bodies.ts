import type { AsteroidInterface } from './asteroids.js';
import type { CometInterface } from './comets.js';
import type { MoonInterface } from './moons.js';
import type { PlanetInterface } from './planets.js';
import type { StarInterface } from './stars.js';

/**
 * A list of celestial bodies of any kind: stars, planets, moons, comets and
 * asteroids, mixed.
 *
 * @example
 * ```ts
 * import { MOONS, PLANETS, STARS } from '@interstellar-tools/constants';
 *
 * const solarSystem: CelestialBodiesType = [...STARS, ...PLANETS, ...MOONS];
 * const earth = solarSystem.find((body) => body.id === 'earth');
 * ```
 * @group Celestial Bodies
 */
export type CelestialBodiesType = CelestialBodyType[];

/**
 * Type alias representing a single celestial body.
 *
 * Includes:
 * - **Stars** (`StarInterface`)
 * - **Planets** (`PlanetInterface`)
 * - **Moons** (`MoonInterface`)
 * - **Comets** (`CometInterface`)
 *
 * @typedef {StarInterface | PlanetInterface | MoonInterface | CometInterface | AsteroidInterface} CelestialBodyType
 *
 * @example
 * ```ts
 * const describe = (body: CelestialBodyType) => `${body.name}, bound to ${body.parent}`;
 * ```
 * @group Celestial Bodies
 */
export type CelestialBodyType =
  | StarInterface
  | PlanetInterface
  | MoonInterface
  | CometInterface
  | AsteroidInterface;
