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
 * - `rotation.period` is the nucleus's rotation when it was measured: comets change their spin
 *   as they outgas. 67P's, Tempel 1's and Borrelly's are the IAU's, from Rosetta, Deep Impact and
 *   Deep Space 1. Halley and Hartley 2 tumble, `tumbling: true`.
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
    /**
     * Rotation in days: Halley tumbles. Its spin axis circles every 3.69 d,
     * and its orientation repeats every 7.4 d (Belton et al. 1991)
     */
    rotation: { period: { value: 7.4, unit: 'd' }, tumbling: true },
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
    /** Rotation in hours: Licandro et al. 1998 */
    rotation: { period: { value: 11.34, unit: 'h' } },
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
    /**
     * Sidereal rotation in hours: IAU, from Rosetta in 2014. Outgassing
     * sped it up to 12.055 h through its 2015 perihelion passage
     */
    rotation: { period: { value: 12.4041, unit: 'h' } },
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
    /** Rotation in hours: Lowry & Weissman 2007. It slows by minutes each orbit, and may tumble */
    rotation: { period: { value: 11.083, unit: 'h' } },
    display: {
      color: '#FFD700', // Golden yellow (dusty tail, lower albedo)
      size: 3
    },
    radius: { value: 4.8, unit: 'km' }
  },
  // #endregion datasetComets
  {
    id: '9p-tempel-1',
    name: 'Comet Tempel 1',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    parent: 'sun',
    orbit: {
      a: { value: 3.1183, unit: 'au' },
      e: 0.51896,
      i: 10.541 as DegreesType,
      w: 178.911 as DegreesType,
      om: 68.967 as DegreesType,
      angle: 6.270289 as Radians,
      period: { value: 2011.3, unit: 'd' },
      q: { value: 1.5, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU, at Deep Impact in 2005. Stardust measured 40.6 h in 2011 */
    rotation: { period: { value: 40.783766, unit: 'h' } },
    display: {
      color: '#B5A48A',
      size: 3
    },
    radius: { value: 2.83, unit: 'km' }
  },
  {
    id: '19p-borrelly',
    name: 'Comet Borrelly',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    parent: 'sun',
    orbit: {
      a: { value: 3.6125, unit: 'au' },
      e: 0.62364,
      i: 30.321 as DegreesType,
      w: 353.33 as DegreesType,
      om: 75.419 as DegreesType,
      angle: 3.681708 as Radians,
      period: { value: 2507.9, unit: 'd' },
      q: { value: 1.3596, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU, from Mueller et al. 2010. Its pole lies within the error of 90° from the Sun's, so the spin direction is unknown */
    rotation: { period: { value: 26.641998, unit: 'h' } },
    display: {
      color: '#6E6259',
      size: 3
    },
    radius: { value: 2.5, unit: 'km' }
  },
  {
    id: '81p-wild-2',
    name: 'Comet Wild 2',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    parent: 'sun',
    orbit: {
      a: { value: 3.4453, unit: 'au' },
      e: 0.53862,
      i: 3.2402 as DegreesType,
      w: 41.885 as DegreesType,
      om: 136.146 as DegreesType,
      angle: 2.950501 as Radians,
      period: { value: 2335.8, unit: 'd' },
      q: { value: 1.5896, unit: 'au' }
    },
    /** Rotation in hours: Farnham, Samarasinha & Mueller 2010. Its spin direction comes only from models of the coma */
    rotation: { period: { value: 13.5, unit: 'h' } },
    display: {
      color: '#8C8070',
      size: 3
    },
    radius: { value: 1.98, unit: 'km' }
  },
  {
    id: '103p-hartley-2',
    name: 'Comet Hartley 2',
    type: 'short-period comet',
    category: 'jupiter-family comet',
    parent: 'sun',
    orbit: {
      a: { value: 3.4463, unit: 'au' },
      e: 0.70055,
      i: 13.624 as DegreesType,
      w: 180.781 as DegreesType,
      om: 219.933 as DegreesType,
      angle: 2.837671 as Radians,
      period: { value: 2336.8, unit: 'd' },
      q: { value: 1.032, unit: 'au' }
    },
    /** Rotation in hours: Hartley 2 tumbles. At EPOXI's flyby its long axis circled every 18.40 h, and it rolled about that axis every 26.72 h (Belton et al. 2013) */
    rotation: { period: { value: 18.4, unit: 'h' }, tumbling: true },
    display: {
      color: '#9FC3D1',
      size: 2
    },
    radius: { value: 0.58, unit: 'km' }
  },
  {
    id: 'c-2020-f3-neowise',
    name: 'Comet NEOWISE',
    type: 'oort cloud comet',
    category: 'long-period comet',
    parent: 'sun',
    orbit: {
      a: { value: 274.8, unit: 'au' },
      e: 0.998873,
      i: 129.784 as DegreesType,
      w: 37.876 as DegreesType,
      om: 62.264 as DegreesType,
      angle: 3.308662 as Radians,
      period: { value: 1663874, unit: 'd' }, // ~4555 years, heliocentric at J2000
      retrograde: true,
      q: { value: 0.30962, unit: 'au' }
    },
    /** Rotation in hours: Manzini et al. 2021 */
    rotation: { period: { value: 7.8, unit: 'h' } },
    display: {
      color: '#F2C46D',
      size: 4
    },
    radius: { value: 2.5, unit: 'km' }
  }
] as const satisfies CometsType;
