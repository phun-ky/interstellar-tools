import { CometsType, DegreesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of well-known comets within the solar system simulation.
 *
 * ::: info
 *
 * - Units: `a` (au), `period` (days), `radius` (km); angles `i`, `w`, `om` in degrees.
 * - `orbit.angle` is the true anomaly at J2000, from the mean anomaly in JPL Horizons' osculating
 *   elements at J2000, converted with this dataset's `e`.
 * - `period` is always positive; retrograde orbits have `retrograde: true`.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 * {@include ../../../../docs/partials/comets.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/comets.ts#datasetComets}
 *
 * @group Datasets
 * @see {@link CometsType}.
 * @example
 * ```ts
 * console.log(COMETS[0].name); // "Halley's Comet"
 * ```
 *
 */
export const COMETS: CometsType = [
  {
    id: '1p-halley',
    // eslint-disable-next-line @stylistic/quotes
    name: "Halley's Comet",
    type: 'periodic comet',
    category: 'halley-type comet',
    parent: 'sun',
    orbit: {
      /** Semi-major axis in AU */
      a: { value: 17.834, unit: 'au' },
      /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
      e: 0.96714,
      /** Inclination in degrees */
      i: 162.26 as DegreesType,
      /** Argument of perihelion in degrees */
      w: 111.33 as DegreesType,
      /** Longitude of the ascending node in degrees */
      om: 58.42 as DegreesType,
      /** True anomaly at J2000 */
      angle: 2.97966 as Radians,
      /** Orbital period in days */
      period: { value: 27576, unit: 'd' }, // ~76 years
      retrograde: true,
      /** Perihelion distance */
      q: { value: 0.586, unit: 'au' }
    },
    display: {
      /** Visual representation color */
      color: '#FFFFFF', // Bright white (reflective comet dust)
      /** Scaled size for visualization */
      size: 5
    },
    /** Radius of the comet's nucleus in km */
    radius: { value: 5.5, unit: 'km' }
  },
  {
    id: 'c-1995-o1-hale-bopp',
    name: 'Comet Hale-Bopp',
    type: 'oort cloud comet',
    category: 'long-period comet',
    parent: 'sun',
    orbit: {
      a: { value: 186.0, unit: 'au' },
      e: 0.9951,
      i: 89.4 as DegreesType,
      w: 130.6 as DegreesType,
      om: 282.5 as DegreesType,
      angle: 2.550719 as Radians,
      period: { value: 926530, unit: 'd' }, // ~2,537 years (Kepler's third law with a = 186 au),
      q: { value: 0.914, unit: 'au' }
    },
    display: {
      color: '#00A6FF', // Electric blue (ionized tail appearance)
      size: 4
    },
    radius: { value: 30, unit: 'km' }
  },
  {
    id: '67p-churyumov-gerasimenko',
    name: 'Comet 67P/Churyumov–Gerasimenko',
    category: 'jupiter-family comet',
    type: 'short-period comet',
    parent: 'sun',
    orbit: {
      a: { value: 3.464, unit: 'au' }, // Semi-major axis
      e: 0.641, // Eccentricity
      i: 7.04 as DegreesType, // Inclination in degrees
      w: 12.78 as DegreesType, // Argument of perihelion in degrees
      om: 50.14 as DegreesType, // Longitude of ascending node in degrees
      angle: 3.32542 as Radians,
      period: { value: 2355, unit: 'd' }, // ~6.45 years
      q: { value: 1.243, unit: 'au' } // Perihelion distance
    },
    display: {
      color: '#AAAAAA', // Greyish surface color
      size: 4 // Visualization size
    },
    radius: { value: 2, unit: 'km' } // Approximate average radius (~4km total diameter)
  },
  // #region datasetComets
  {
    id: '2p-encke',
    name: 'Comet Encke',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    parent: 'sun',
    orbit: {
      a: { value: 2.22, unit: 'au' },
      e: 0.85,
      i: 11.8 as DegreesType,
      w: 186.5 as DegreesType,
      om: 334.6 as DegreesType,
      angle: 3.479299 as Radians,
      period: { value: 1204, unit: 'd' }, // ~3.3 years
      q: { value: 0.34, unit: 'au' }
    },
    display: {
      color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
      size: 3
    },
    radius: { value: 4.8, unit: 'km' }
  }
  // #endregion datasetComets
] as const satisfies CometsType;
