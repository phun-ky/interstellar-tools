import type {
  ByBodyIdType,
  DegreesType,
  InterstellarObjectObservationsInterface,
  ObservationSourceInterface
} from '@interstellar-tools/types';

import { sigma } from './sources.js';

// JPL's Small-Body Database record: the orbit solution, its non-gravitational
// fit and the magnitudes
const sbdb = (designation: string): ObservationSourceInterface => ({
  catalog: 'JPL SBDB',
  url: `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${designation}`,
  retrievedAt: new Date('2026-11-12')
});
// A Minor Planet Electronic Circular, by its path
const mpec = (path: string): ObservationSourceInterface => ({
  catalog: 'MPC',
  url: `https://minorplanetcenter.net/mpec/${path}.html`
});

/**
 * What is **measured about the interstellar objects**, keyed by id: their
 * catalogue identifiers, JPL's orbit solutions with the fitted
 * non-gravitational accelerations, the radiants they came from, their
 * magnitudes and, for ʻOumuamua, its push in m/s².
 *
 * Kept apart from {@link INTERSTELLAR_OBJECTS}, so an app loads these only
 * when it shows them; their discoveries are in {@link DISCOVERIES}.
 * {@link withObservations} puts both on the objects.
 *
 * @group Observations
 * @example
 * ```ts
 * INTERSTELLAR_OBJECT_OBSERVATIONS['1i-oumuamua'].anomalousAcceleration?.value; // 5.59155e-6, in m/s²
 * ```
 */
export const INTERSTELLAR_OBJECT_OBSERVATIONS: ByBodyIdType<
  Omit<InterstellarObjectObservationsInterface, 'discovery'>
> = {
  '1i-oumuamua': {
    identifiers: { spkId: 50788063, aliases: ['A/2017 U1', 'C/2017 U1'] },
    /** JPL's solution #16, at its epoch, with A1, A2 and A3 at 1 au */
    orbitSolution: {
      epoch: { jd: 2458080.5, timeScale: 'TDB' },
      observationArc: { value: 80, unit: 'd' },
      observationCount: 207,
      firstObservation: new Date('2017-10-14'),
      lastObservation: new Date('2018-01-02'),
      sigma: {
        e: 2.1064e-5,
        a: 1.0015e-4,
        q: 6.6635e-6,
        i: 2.8826e-4,
        om: 2.5422e-4,
        w: 1.2495e-3
      },
      nonGravitational: {
        a1: {
          value: 2.790193364e-7,
          unit: 'au/d2',
          uncertainty: sigma(3.574e-8)
        },
        a2: {
          value: 1.44126416e-8,
          unit: 'au/d2',
          uncertainty: sigma(2.445e-8)
        },
        a3: {
          value: 1.573922616e-8,
          unit: 'au/d2',
          uncertainty: sigma(2.249e-8)
        }
      },
      source: sbdb('1I')
    },
    /** Where it came from: near Vega, in Lyra */
    incomingRadiant: {
      rightAscension: 279.499 as DegreesType,
      declination: 33.865 as DegreesType
    },
    /** A1 in m/s², with no coma to push it */
    anomalousAcceleration: {
      value: 5.59155e-6,
      unit: 'm/s2',
      uncertainty: sigma(7.162e-7),
      provenance: 'derived',
      note: 'JPL’s A1 at 1 au, from au/d²',
      source: sbdb('1I')
    },
    nucleus: {
      reflectance: {
        absoluteMagnitude: {
          value: 22.08,
          unit: 'mag',
          uncertainty: sigma(0.445),
          source: sbdb('1I')
        }
      }
    },
    sources: [sbdb('1I'), mpec('K17/K17UI1'), mpec('K17/K17V17')]
  },
  '2i-borisov': {
    identifiers: { spkId: 1003639, aliases: ['C/2019 Q4 (Borisov)'] },
    orbitSolution: {
      epoch: { jd: 2458853.5, timeScale: 'TDB' },
      observationArc: { value: 584, unit: 'd' },
      observationCount: 964,
      firstObservation: new Date('2019-02-24'),
      lastObservation: new Date('2020-09-30'),
      sigma: {
        e: 1.9039e-5,
        a: 5.8802e-6,
        q: 3.2904e-6,
        i: 1.6673e-5,
        om: 4.5021e-5,
        w: 1.1012e-4
      },
      nonGravitational: {
        a1: {
          value: 4.859588264e-8,
          unit: 'au/d2',
          uncertainty: sigma(4.051e-9)
        },
        a2: {
          value: 1.879898691e-8,
          unit: 'au/d2',
          uncertainty: sigma(5.999e-9)
        },
        a3: {
          value: 2.83550322e-9,
          unit: 'au/d2',
          uncertainty: sigma(7.186e-10)
        },
        dt: { value: -65.13009705, unit: 'd', uncertainty: sigma(10.96) }
      },
      source: sbdb('2I')
    },
    /** In Cassiopeia */
    incomingRadiant: {
      rightAscension: 32.803 as DegreesType,
      declination: 59.442 as DegreesType
    },
    totalMagnitude: {
      absolute: {
        value: 13.8,
        unit: 'mag',
        uncertainty: sigma(0.8),
        source: sbdb('2I')
      },
      slope: { value: 4.5, source: sbdb('2I') }
    },
    sources: [sbdb('2I'), mpec('K19/K19RA6'), mpec('K19/K19S72')]
  },
  '3i-atlas': {
    identifiers: {
      spkId: 1004083,
      aliases: ['C/2025 N1 (ATLAS)', 'A11pl3Z']
    },
    orbitSolution: {
      epoch: { jd: 2461340.5, timeScale: 'TDB' },
      observationArc: { value: 378, unit: 'd' },
      observationCount: 117,
      firstObservation: new Date('2025-10-03'),
      lastObservation: new Date('2026-10-16'),
      sigma: {
        e: 4.3958e-5,
        a: 1.7786e-6,
        q: 4.0631e-6,
        i: 7.6824e-5,
        om: 5.2433e-4,
        w: 5.2907e-4
      },
      nonGravitational: {
        a1: {
          value: 4.618075729e-8,
          unit: 'au/d2',
          uncertainty: sigma(4.838e-9)
        },
        a2: {
          value: -9.559184899e-9,
          unit: 'au/d2',
          uncertainty: sigma(2.012e-9)
        },
        a3: {
          value: -8.294590265e-9,
          unit: 'au/d2',
          uncertainty: sigma(1.651e-9)
        },
        dt: { value: 28.46530796, unit: 'd', uncertainty: sigma(9.195) }
      },
      source: sbdb('3I')
    },
    /** In Sagittarius */
    incomingRadiant: {
      rightAscension: 295.039 as DegreesType,
      declination: -19.071 as DegreesType
    },
    totalMagnitude: {
      absolute: {
        value: 11.8,
        unit: 'mag',
        uncertainty: sigma(1),
        source: sbdb('3I')
      },
      slope: { value: 7.5, source: sbdb('3I') }
    },
    sources: [sbdb('3I'), mpec('K25/K25N12')]
  }
};
