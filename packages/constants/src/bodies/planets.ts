import { PlanetsType, Radians } from '@interstellar-tools/types';

/**
 * Represents a dataset of planets and planetoids in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in au.
 * - Some entries may encode integration direction via a negative `period`; the table reflects the raw value.
 *
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
    name: 'Mercury',
    type: 'silicate planet',
    category: 'planet',
    system: 'Sun',
    /** Semi-major axis in AU */
    a: { value: 0.387, unit: 'au' },
    /** Orbital eccentricity */
    e: 0.2056,
    /** Radius in km */
    radius: { value: 2440, unit: 'km' },
    /** Visual representation color */
    color: '#8B8B8B',
    /** Initial angle in orbit at J2000 */
    angle: 0.843 as Radians,
    /** Orbital period in days */
    period: { value: -87.969, unit: 'd' },
    /** Initial position coordinates in AU */
    x: { value: 0.387, unit: 'au' },
    y: { value: 0.024, unit: 'au' },
    z: { value: 0.001, unit: 'au' }
  },
  // #endregion datasetPlanets
  {
    name: 'Venus',
    type: 'silicate planet',
    category: 'planet',
    system: 'Sun',
    a: { value: 0.723, unit: 'au' },
    e: 0.0068,
    radius: { value: 6052, unit: 'km' },
    color: '#E49B0F',
    angle: 1.338 as Radians,
    period: { value: -224.701, unit: 'd' },
    x: { value: 0.723, unit: 'au' },
    y: { value: 0.012, unit: 'au' },
    z: { value: 0.002, unit: 'au' }
  },
  {
    name: 'Earth',
    type: 'silicate planet',
    category: 'planet',
    system: 'Sun',
    a: { value: 1.0, unit: 'au' },
    e: 0.0167,
    radius: { value: 6371, unit: 'km' },
    color: '#1E90FF',
    angle: 1.796 as Radians,
    period: { value: -365.256, unit: 'd' },
    x: { value: 1.0, unit: 'au' },
    y: { value: 0.017, unit: 'au' },
    z: { value: 0.0, unit: 'au' }
  },
  {
    name: 'Mars',
    type: 'desert planet',
    category: 'planet',
    system: 'Sun',
    a: { value: 1.524, unit: 'au' },
    e: 0.0934,
    radius: { value: 3389, unit: 'km' },
    color: '#D14A28',
    angle: 2.182 as Radians,
    period: { value: -686.98, unit: 'd' },
    x: { value: 1.524, unit: 'au' },
    y: { value: 0.024, unit: 'au' },
    z: { value: 0.002, unit: 'au' }
  },
  {
    name: 'Ceres',
    type: 'ice planet',
    category: 'planetoid',
    system: 'Sun',
    a: { value: 2.766, unit: 'au' },
    e: 0.079,
    angle: 1.97920337 as Radians,
    period: { value: -1680.5, unit: 'd' },
    radius: { value: 469.7, unit: 'km' },
    color: '#C0C0C0',
    x: { value: 2.766, unit: 'au' },
    y: { value: 0, unit: 'au' },
    z: { value: 0, unit: 'au' }
  },
  {
    name: 'Jupiter',
    type: 'gas giant',
    category: 'planet',
    system: 'Sun',
    a: { value: 5.203, unit: 'au' },
    e: 0.0489,
    radius: { value: 69911, unit: 'km' },
    color: '#C08850',
    angle: 0.634 as Radians,
    period: { value: -4332.59, unit: 'd' },
    x: { value: 5.203, unit: 'au' },
    y: { value: 0.017, unit: 'au' },
    z: { value: 0.003, unit: 'au' }
  },
  {
    name: 'Saturn',
    type: 'gas giant',
    category: 'planet',
    system: 'Sun',
    a: { value: 9.537, unit: 'au' },
    e: 0.0565,
    radius: { value: 58232, unit: 'km' },
    color: '#D2B48C',
    angle: 1.101 as Radians,
    period: { value: -10759.22, unit: 'd' },
    x: { value: 9.537, unit: 'au' },
    y: { value: 0.019, unit: 'au' },
    z: { value: 0.003, unit: 'au' }
  },
  {
    name: 'Uranus',
    type: 'ice giant',
    category: 'planet',
    system: 'Sun',
    a: { value: 19.191, unit: 'au' },
    e: 0.0463,
    radius: { value: 25362, unit: 'km' },
    color: '#78D6FF',
    angle: 2.983 as Radians,
    period: { value: -30687.15, unit: 'd' },
    x: { value: 19.191, unit: 'au' },
    y: { value: -0.021, unit: 'au' },
    z: { value: 0.004, unit: 'au' }
  },
  {
    name: 'Neptune',
    type: 'ice giant',
    category: 'planet',
    system: 'Sun',
    a: { value: 30.069, unit: 'au' },
    e: 0.0086,
    radius: { value: 24622, unit: 'km' },
    color: '#0053D6',
    angle: 0.526 as Radians,
    period: { value: -60190.03, unit: 'd' },
    x: { value: 30.069, unit: 'au' },
    y: { value: 0.03, unit: 'au' },
    z: { value: 0.005, unit: 'au' }
  },
  {
    name: 'Pluto',
    type: 'ice planet',
    category: 'planetoid',
    system: 'Sun',
    a: { value: 39.482, unit: 'au' },
    e: 0.2488,
    radius: { value: 1188, unit: 'km' },
    color: '#B0A99F',
    angle: 4.585 as Radians,
    period: { value: -90560.0, unit: 'd' },
    x: { value: 39.482, unit: 'au' },
    y: { value: -0.033, unit: 'au' },
    z: { value: 0.006, unit: 'au' }
  }
] as const satisfies PlanetsType;
