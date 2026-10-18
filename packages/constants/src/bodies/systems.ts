import { Radians, SystemsType } from '@interstellar-tools/types';

/**
 * Predefined systems: the barycenters that stars and planets orbit.
 *
 * ::: info
 *
 * - Systems don't list their members; stars and planets name their system as `parent`.
 * - Systems nest: `alpha-centauri-ab` orbits inside `alpha-centauri`.
 * - `distance` (from the Sun) and galactic `x`,`y`,`z` are in light-years (ly).
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
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
    id: 'solar-system',
    name: 'Solar System',
    kind: 'planetary',
    parent: 'milky-way',
    /** One galactic orbit for the whole system, shared by everything in it */
    orbit: {
      a: { value: 27000, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.5707963267948966 as Radians
    },
    distance: { value: 0, unit: 'ly' },
    /** Galactic position in light-years (relative to Milky Way center) */
    x: { value: 0, unit: 'ly' },
    y: { value: 27000, unit: 'ly' },
    z: { value: 20, unit: 'ly' }
  },
  // #region datasetSystems
  {
    id: 'alpha-centauri',
    name: 'Alpha Centauri',
    kind: 'multiple',
    parent: 'milky-way',
    // ~4.4 ly away, so its galactic orbit is approximated by the Sun's
    orbit: {
      a: { value: 27000.000353646294, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.570634474946578 as Radians
    },
    distance: { value: 4.37, unit: 'ly' },
    x: { value: 4.37, unit: 'ly' },
    y: { value: 27000.000353646294, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    // The A-B pair, orbiting the system barycenter opposite Proxima (Kervella et al. 2017)
    id: 'alpha-centauri-ab',
    name: 'Alpha Centauri AB',
    kind: 'binary',
    parent: 'alpha-centauri',
    orbit: {
      a: { value: 503, unit: 'au' }, // 8700 au × m_P / (m_AB + m_P)
      e: 0.5,
      period: { value: 547, unit: 'kyr' },
      angle: 3.099566485428788 as Radians
    }
  }
  // #endregion datasetSystems
] as const satisfies SystemsType;
