import {
  DegreesType,
  InterstellarObjectsType,
  Radians
} from '@interstellar-tools/types';

import { DISCOVERIES } from './discoveries.js';
import { INTERSTELLAR_OBJECT_OBSERVATIONS } from './interstellar-observations.js';
import { withObservations } from './with-observations.js';

// The interstellar objects, with what draws and moves them
const INTERSTELLAR_OBJECT_BODIES: InterstellarObjectsType = [
  // #region datasetInterstellarObjects
  {
    id: '1i-oumuamua',
    name: 'ʻOumuamua',
    designation: '1I/2017 U1',
    type: 'interstellar object',
    category: 'interstellar object',
    parent: 'sun',
    orbit: {
      /** Semi-major axis in au, negative on an open orbit */
      a: { value: -1.283872207, unit: 'au' },
      e: 1.199436003,
      /** Perihelion distance */
      q: { value: 0.2560503413, unit: 'au' },
      i: 122.7369906 as DegreesType,
      w: 241.8407041 as DegreesType,
      om: 24.60030787 as DegreesType,
      retrograde: true,
      frame: { plane: 'ecliptic' },
      /** True anomaly at J2000, on the way in */
      angle: -2.548421093178 as Radians,
      periapsisTime: new Date('2017-09-09T11:51:02.065Z'),
      /** Speed coming in, in km/s */
      excessSpeed: 26.39
    },
    /** Tumbling: its spin axis circles every 8.67 h (Belton et al. 2018) */
    rotation: { period: { value: 8.67, unit: 'h' }, tumbling: true },
    display: {
      /** Visual representation color */
      color: '#A0522D', // Red (Meech et al. 2017)
      /** Scaled size for visualization */
      size: 2
    },
    /** Effective radius in km, of an elongated body */
    radius: { value: 0.07, unit: 'km' }
  },
  // #endregion datasetInterstellarObjects
  {
    id: '2i-borisov',
    name: 'Borisov',
    designation: '2I/2019 Q4',
    type: 'interstellar comet',
    category: 'interstellar object',
    parent: 'sun',
    orbit: {
      a: { value: -0.8514920069, unit: 'au' },
      e: 3.356479267,
      q: { value: 2.00652326, unit: 'au' },
      i: 44.05261629 as DegreesType,
      w: 209.1242735 as DegreesType,
      om: 308.1477014 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: -1.8537256788316 as Radians,
      periapsisTime: new Date('2019-12-08T13:16:03.851Z'),
      excessSpeed: 32.28
    },
    display: {
      color: '#FFFFFF', // A comet's coma, rich in carbon monoxide
      size: 3
    },
    /** Radius of the nucleus in km, 0.2 to 0.5 km */
    radius: { value: 0.4, unit: 'km' }
  },
  {
    id: '3i-atlas',
    name: 'ATLAS',
    designation: '3I/2025 N1',
    type: 'interstellar comet',
    category: 'interstellar object',
    parent: 'sun',
    orbit: {
      a: { value: -0.2639344647, unit: 'au' },
      e: 6.139341308,
      q: { value: 1.356449297, unit: 'au' },
      i: 175.1130288 as DegreesType,
      w: 128.0075103 as DegreesType,
      om: 322.1556249 as DegreesType,
      retrograde: true,
      frame: { plane: 'ecliptic' },
      angle: -1.7293706146496 as Radians,
      periapsisTime: new Date('2025-10-29T11:33:25.411Z'),
      excessSpeed: 57.97
    },
    display: {
      color: '#FFFFFF', // A comet's coma, rich in carbon dioxide
      size: 3
    },
    /** Radius of the nucleus in km, 1.3 ± 0.2 km */
    radius: { value: 1.3, unit: 'km' }
  }
];

/**
 * Represents the **interstellar objects** seen so far: bodies from other
 * stars' systems, passing the Sun once on open orbits.
 *
 * ::: info
 *
 * - Units: `a` and `q` (au), `radius` (km), `excessSpeed` (km/s); angles `i`, `w`, `om` in
 *   degrees, against the J2000 ecliptic, `frame`.
 * - The orbits are JPL Horizons' heliocentric elements osculating at perihelion, from JPL's
 *   orbit solutions with their non-gravitational forces: #16 for ʻOumuamua (Micheli et al.
 *   2018), #54 for Borisov and #55 for 3I/ATLAS. They describe the pass near the Sun: elements
 *   osculating at J2000, when the objects were 100 to 320 au out, put perihelion about 2 days off.
 * - `orbit.angle` is the true anomaly at J2000 on that hyperbola, so it agrees with
 *   `periapsisTime` through Kepler's equation, $M = e \sinh F - F$. It has 13 decimals: so near
 *   the asymptote, $10^{-9}$ rad is minutes of time.
 * - `excessSpeed` is the speed each came in at, from its orbit around the Solar System's
 *   barycentre: ʻOumuamua's from Bailer-Jones et al. 2018, Borisov's from Bailer-Jones et al.
 *   2020, and 3I/ATLAS's from JPL's solution, within 0.03 km/s of Seligman et al. 2025's.
 * - ʻOumuamua and 3I/ATLAS go round the Sun backwards, `retrograde: true`.
 * - 3I/ATLAS's orbit is from JPL's solution #55, on observations from 3 October 2025 to
 *   16 October 2026.
 * - `radius`: ʻOumuamua's is an effective one, for a body perhaps 6 to 10 times longer than wide,
 *   from Spitzer's limit (Trilling et al. 2018); Borisov's nucleus is 0.2 to 0.5 km (Jewitt et
 *   al. 2020, Hui et al. 2020), and 3I/ATLAS's 1.3 ± 0.2 km from the Hubble Space Telescope (Hui
 *   et al. 2026).
 * - `rotation`: ʻOumuamua tumbles, its spin axis circling every 8.67 h (Belton et al. 2018).
 *   Borisov's and 3I/ATLAS's spins aren't settled, so they have none.
 * - `observations` are also exported apart, keyed by id: {@link INTERSTELLAR_OBJECT_OBSERVATIONS}, and their
 *   discoveries in {@link DISCOVERIES}. Import those to load only what an app shows; {@link withObservations} puts
 *   them back. From 3.0, `INTERSTELLAR_OBJECTS` won't carry them (#417).
 * - `observations.orbitSolution` is the JPL solution each orbit comes from, as its Small-Body
 *   Database gives it on 12 November 2026: its epoch, arc and observation count, the elements'
 *   1σ uncertainties at that epoch, and the fitted non-gravitational accelerations A1, A2 and A3
 *   at 1 au, in au/d², with the comets' ΔT, how long after perihelion their outgassing peaked.
 *   ʻOumuamua's `anomalousAcceleration` is its A1 in m/s²: it had no coma to explain it.
 * - `observations.incomingRadiant` is where each came from, in the ICRS: the incoming asymptote
 *   of its orbit around the Solar System's barycentre, from JPL Horizons' elements at J2000.
 * - `observations.discovery` and the old designations in `identifiers.aliases` are from the Minor
 *   Planet Center's circulars, MPECs 2017-U181, 2017-V17, 2019-R106, 2019-S72 and 2025-N12. The
 *   comets' total magnitudes, M1 and K1, and ʻOumuamua's H are JPL's.
 *
 * - Sources: compiled from public references, mainly NASA JPL and the IAU's Minor Planet Center. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 * {@include ../../../../docs/partials/interstellar-objects.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/interstellar-objects.ts#datasetInterstellarObjects}
 *
 * @group Datasets
 * @see {@link InterstellarObjectsType}.
 * @example
 * ```ts
 * console.log(INTERSTELLAR_OBJECTS[1].designation); // "2I/2019 Q4"
 * ```
 */
export const INTERSTELLAR_OBJECTS: InterstellarObjectsType = withObservations(
  INTERSTELLAR_OBJECT_BODIES,
  INTERSTELLAR_OBJECT_OBSERVATIONS,
  DISCOVERIES
);
