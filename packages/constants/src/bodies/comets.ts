import { CometsType } from '@interstellar-tools/types';

/**
 * Represents a collection of well-known comets within the solar system simulation.
 *
 * ::: info
 *
 * - Units: `a` (au), `period` (days), `radius` (km); angles `i`, `w`, `om` in degrees.
 * - Some entries may encode integration direction via a negative `period`; the table reflects the raw value.
 *
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
    // eslint-disable-next-line @stylistic/quotes
    name: "Halley's Comet",
    type: 'periodic comet',
    category: 'halley-type comet',
    system: 'Sun',
    /** Semi-major axis in AU */
    a: { value: 17.834, unit: 'au' },
    /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
    e: 0.96714,
    /** Inclination in degrees */
    i: 162.26,
    /** Argument of perihelion in degrees */
    w: 111.33,
    /** Longitude of the ascending node in degrees */
    om: 58.42,
    /** Mean anomaly in radians at J2000 epoch */
    angle: 0.669857,
    /** Orbital period in days */
    period: { value: 27576, unit: 'd' }, // ~76 years
    /** Perihelion distance in AU */
    q: 0.586,
    /** Visual representation color */
    color: '#FFFFFF', // Bright white (reflective comet dust)
    /** Scaled size for visualization */
    size: 5,
    /** Radius of the comet's nucleus in km */
    radius: { value: 5.5, unit: 'km' }
  },
  {
    name: 'Comet Hale-Bopp',
    type: 'oort cloud comet',
    category: 'long-period comet',
    system: 'Sun',
    a: { value: 186.0, unit: 'au' },
    e: 0.9951,
    i: 89.4,
    w: 130.6,
    om: 282.5,
    angle: 3.141593,
    period: { value: -253533, unit: 'd' }, // ~695 years
    q: 0.914,
    color: '#00A6FF', // Electric blue (ionized tail appearance)
    size: 4,
    radius: { value: 30, unit: 'km' }
  },
  {
    name: 'Comet 67P/Churyumov–Gerasimenko',
    category: 'jupiter-family comet',
    type: 'short-period comet',
    system: 'Sun',
    a: { value: 3.464, unit: 'au' }, // Semi-major axis
    e: 0.641, // Eccentricity
    i: 7.04, // Inclination in degrees
    w: 12.78, // Argument of perihelion in degrees
    om: 50.14, // Longitude of ascending node in degrees
    angle: 0.0, // Initial angle (could be updated based on epoch)
    period: { value: -2484, unit: 'd' }, // ~6.45 years
    q: 1.243, // Perihelion distance in AU
    color: '#AAAAAA', // Greyish surface color
    size: 4, // Visualization size
    radius: { value: 2, unit: 'km' } // Approximate average radius (~4km total diameter)
  },
  // #region datasetComets
  {
    name: 'Comet Encke',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    system: 'Sun',
    a: { value: 2.22, unit: 'au' },
    e: 0.85,
    i: 11.8,
    w: 186.5,
    om: 334.6,
    angle: 2.792527,
    period: { value: -1204, unit: 'd' }, // ~3.3 years
    q: 0.34,
    color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
    size: 3,
    radius: { value: 4.8, unit: 'km' }
  }
  // #endregion datasetComets
] as const satisfies CometsType;
