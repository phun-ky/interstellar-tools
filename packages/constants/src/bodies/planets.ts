import { PlanetsType, Radians } from '@interstellar-tools/types';

/**
 * Represents a dataset of planets and planetoids in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in au.
 * - `orbit.angle` is the true anomaly at J2000 (2000-01-01 12:00 TT). `x`,`y`,`z` are the heliocentric
 *   position at J2000 in the J2000 ecliptic frame, x towards the equinox.
 * - Both are computed from the J2000 elements in JPL's "Approximate Positions of the Planets" (Table 1),
 *   and for Ceres and Pluto from the JPL Small-Body Database, using this dataset's `a` and `e`.
 * - Some entries may encode integration direction via a negative `period`; the table reflects the raw value.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 *
 * {@include ../../../../docs/partials/planets.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/planets.ts#datasetPlanets}
 * @see {@link PlanetsType}.
 * @group Datasets
 * @example
 * ```ts
 * console.log(PLANETS[0].name); // "Mercury"
 * ```
 */
export const PLANETS: PlanetsType = [
  // #region datasetPlanets
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      /** Semi-major axis in AU */
      a: { value: 0.387, unit: 'au' },
      /** Orbital eccentricity */
      e: 0.2056,
      /** Orbital period in days */
      period: { value: -87.969, unit: 'd' },
      /** True anomaly at J2000 */
      angle: 3.080377 as Radians
    },
    /** Radius in km */
    radius: { value: 2440, unit: 'km' },
    /** Visual representation color */
    color: '#8B8B8B',
    /** Heliocentric position at J2000 (J2000 ecliptic frame) in au */
    x: { value: -0.1301, unit: 'au' },
    y: { value: -0.4472, unit: 'au' },
    z: { value: -0.0246, unit: 'au' }
  },
  // #endregion datasetPlanets
  {
    id: 'venus',
    name: 'Venus',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 0.723, unit: 'au' },
      e: 0.0068,
      period: { value: -224.701, unit: 'd' },
      angle: 0.88977 as Radians
    },
    radius: { value: 6052, unit: 'km' },
    color: '#E49B0F',
    x: { value: -0.718, unit: 'au' },
    y: { value: -0.0327, unit: 'au' },
    z: { value: 0.041, unit: 'au' }
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 1.0, unit: 'au' },
      e: 0.0167,
      period: { value: -365.256, unit: 'd' },
      angle: 6.238549 as Radians
    },
    radius: { value: 6371, unit: 'km' },
    color: '#1E90FF',
    x: { value: -0.1772, unit: 'au' },
    y: { value: 0.9672, unit: 'au' },
    z: { value: 0, unit: 'au' }
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'desert planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 1.524, unit: 'au' },
      e: 0.0934,
      period: { value: -686.98, unit: 'd' },
      angle: 0.408015 as Radians
    },
    radius: { value: 3389, unit: 'km' },
    color: '#D14A28',
    x: { value: 1.3909, unit: 'au' },
    y: { value: -0.0134, unit: 'au' },
    z: { value: -0.0345, unit: 'au' }
  },
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 2.766, unit: 'au' },
      e: 0.079,
      period: { value: -1680.5, unit: 'd' },
      angle: 0.106686 as Radians
    },
    radius: { value: 469.7, unit: 'km' },
    color: '#C0C0C0',
    x: { value: -2.3475, unit: 'au' },
    y: { value: 0.8788, unit: 'au' },
    z: { value: 0.4603, unit: 'au' }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 5.203, unit: 'au' },
      e: 0.0489,
      period: { value: -4332.59, unit: 'd' },
      angle: 0.378185 as Radians
    },
    radius: { value: 69911, unit: 'km' },
    color: '#C08850',
    x: { value: 3.9953, unit: 'au' },
    y: { value: 2.9459, unit: 'au' },
    z: { value: -0.1016, unit: 'au' }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 9.537, unit: 'au' },
      e: 0.0565,
      period: { value: -10759.22, unit: 'd' },
      angle: 5.458247 as Radians
    },
    radius: { value: 58232, unit: 'km' },
    color: '#D2B48C',
    x: { value: 6.4288, unit: 'au' },
    y: { value: 6.5083, unit: 'au' },
    z: { value: -0.3691, unit: 'au' }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 19.191, unit: 'au' },
      e: 0.0463,
      period: { value: -30687.15, unit: 'd' },
      angle: 2.537459 as Radians
    },
    radius: { value: 25362, unit: 'km' },
    color: '#78D6FF',
    x: { value: 14.4012, unit: 'au' },
    y: { value: -13.7439, unit: 'au' },
    z: { value: -0.2377, unit: 'au' }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 30.069, unit: 'au' },
      e: 0.0086,
      period: { value: -60190.03, unit: 'd' },
      angle: 4.519475 as Radians
    },
    radius: { value: 24622, unit: 'km' },
    color: '#0053D6',
    x: { value: 16.8038, unit: 'au' },
    y: { value: -24.9923, unit: 'au' },
    z: { value: 0.1274, unit: 'au' }
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 39.482, unit: 'au' },
      e: 0.2488,
      period: { value: -90560.0, unit: 'd' },
      angle: 0.436892 as Radians
    },
    radius: { value: 1188, unit: 'km' },
    color: '#B0A99F',
    x: { value: -9.984, unit: 'au' },
    y: { value: -27.916, unit: 'au' },
    z: { value: 5.8767, unit: 'au' }
  }
] as const satisfies PlanetsType;
