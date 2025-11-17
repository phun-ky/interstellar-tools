import { SystemsType } from '@interstellar-tools/types';

/**
 * Predefined star systems in the galaxy.
 *
 * ::: info
 *
 * - `distance` is in light-years (ly).
 * - `stars` lists the primary named stars in the system (referenced by name).
 *
 * :::
 *
 * {@include ../../../../docs/partials/systems.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/systems.ts#datasetSystems}
 *
 * @example
 * ```ts
 * console.log(SYSTEMS[0].name); // "Solar System"
 * ```
 * @group Datasets
 * @see {@link SystemsType}
 * @see https://en.wikipedia.org/wiki/Alpha_Centauri
 */
export const SYSTEMS: SystemsType = [
  {
    name: 'Solar System',
    stars: ['Sun'],
    distance: 0
  },
  // #region datasetSystems
  {
    name: 'Alpha Centauri',
    stars: ['Alpha Centauri A', 'Alpha Centauri B', 'Proxima Centauri'],
    distance: 4.37
  }
  // #endregion datasetSystems
] as const satisfies SystemsType;
