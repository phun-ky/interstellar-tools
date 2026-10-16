import { AsteroidBeltsType } from '@interstellar-tools/types';

/**
 * Predefined asteroid belts in the solar system visualization.
 *
 * ::: info
 *
 * - Radii are in astronomical units (au).
 * - `opacity` is a visual alpha in the range [0..1].
 * - `density` is a relative visual density for rendering, not physical.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 * {@include ../../../../docs/partials/asteroid-belts.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/asteroid-belts.ts#datasetAsteroidBelts}
 *
 * @example
 * ```ts
 * console.log(ASTEROID_BELTS[0].name); // "Main Asteroid Belt"
 * ```
 * @group Datasets
 * @see {@link AsteroidBeltsType}.
 * @see https://en.wikipedia.org/wiki/Asteroid_belt
 * @see https://en.wikipedia.org/wiki/Kuiper_belt
 */
export const ASTEROID_BELTS: AsteroidBeltsType = [
  // #region datasetAsteroidBelts
  {
    name: 'Main Asteroid Belt',
    innerRadius: 2.1,
    outerRadius: 3.3,
    color: '#C4C4C4', // Light gray (rocky bodies)
    opacity: 0.3,
    density: 0.8
  },
  // #endregion datasetAsteroidBelts
  {
    name: 'Kuiper Belt',
    innerRadius: 30,
    outerRadius: 50,
    color: '#88CCEE', // Light blue (icy bodies)
    opacity: 0.2,
    density: 0.5
  }
] as const satisfies AsteroidBeltsType;
