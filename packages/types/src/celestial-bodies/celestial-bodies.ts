import { AsteroidInterface, AsteroidsType } from './asteroids';
import { CometInterface, CometsType } from './comets';
import { MoonInterface, MoonsType } from './moons';
import { PlanetInterface, PlanetsType } from './planets';
import { StarInterface, StarsType } from './stars';

/**
 * Type alias representing a collection of celestial bodies.
 *
 * Includes:
 * - **Stars** (`StarsType`)
 * - **Planets** (`PlanetsType`)
 * - **Moons** (`MoonsType`)
 * - **Comets** (`CometsType`)
 *
 * @typedef {StarsType | PlanetsType | MoonsType | CometsType | AsteroidsType} CelestialBodiesType
 *
 * @example
 * ```ts
 * const celestialObjects: CelestialBodiesType = [
 *   { name: 'Sun', type: 'star', mass: 1.989e30 },
 *   { name: 'Earth', type: 'planet', mass: 5.972e24 }
 * ];
 * ```
 * @category Celestial Bodies
 */
export type CelestialBodiesType =
  | StarsType
  | PlanetsType
  | MoonsType
  | CometsType
  | AsteroidsType;

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
 * const earth: CelestialBodyType = { name: 'Earth', type: 'planet', mass: 5.972e24 };
 * ```
 * @category Celestial Bodies
 */
export type CelestialBodyType =
  | StarInterface
  | PlanetInterface
  | MoonInterface
  | CometInterface
  | AsteroidInterface;
