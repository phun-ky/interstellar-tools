[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / INTERSTELLAR_OBJECTS

# Variable: INTERSTELLAR_OBJECTS

```ts
const INTERSTELLAR_OBJECTS: InterstellarObjectsType;
```

Defined in:
[bodies/interstellar-objects.ts:76](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/interstellar-objects.ts#L76)

Represents the **interstellar objects** seen so far: bodies from other stars'
systems, passing the Sun once on open orbits.

::: info

- Units: `a` and `q` (au), `radius` (km), `excessSpeed` (km/s); angles `i`, `w`,
  `om` in degrees, against the J2000 ecliptic, `frame`.

- The orbits are JPL Horizons' heliocentric elements osculating at perihelion,
  from JPL's orbit solutions with their non-gravitational forces:
  [#16](https://github.com/phun-ky/interstellar-tools/issues/16) for ʻOumuamua
  (Micheli et al. 2018\),
  [#54](https://github.com/phun-ky/interstellar-tools/issues/54) for Borisov and
  [#55](https://github.com/phun-ky/interstellar-tools/issues/55) for 3I/ATLAS.
  They describe the pass near the Sun: elements osculating at J2000, when the
  objects were 100 to 320 au out, put perihelion about 2 days off.

- `orbit.angle` is the true anomaly at J2000 on that hyperbola, so it agrees
  with `periapsisTime` through Kepler's equation, $M = e \sinh F - F$. It has 13
  decimals: so near the asymptote, $10^{-9}$ rad is minutes of time.

- `excessSpeed` is the speed each came in at, from its orbit around the Solar
  System's barycentre: ʻOumuamua's from Bailer-Jones et al. 2018, Borisov's from
  Bailer-Jones et al. 2020, and 3I/ATLAS's from JPL's solution, within 0.03 km/s
  of Seligman et al. 2025's.

- ʻOumuamua and 3I/ATLAS go round the Sun backwards, `retrograde: true`.

- 3I/ATLAS's orbit is from JPL's temporary solution, on observations from
  October 2025 on.

- `radius`: ʻOumuamua's is an effective one, for a body perhaps 6 to 10 times
  longer than wide, from Spitzer's limit (Trilling et al. 2018); Borisov's
  nucleus is 0.2 to 0.5 km (Jewitt et al. 2020, Hui et al. 2020), and 3I/ATLAS's
  1.3 ± 0.2 km from the Hubble Space Telescope (Hui et al. 2026).

- `rotation`: ʻOumuamua tumbles, its spin axis circling every 8.67 h (Belton et
  al. 2018). Borisov's and 3I/ATLAS's spins aren't settled, so they have none.

- `observations.orbitSolution` is the JPL solution each orbit comes from, as its
  Small-Body Database gives it on 12 November 2026: its epoch, arc and
  observation count, the elements' 1σ uncertainties at that epoch, and the
  fitted non-gravitational accelerations A1, A2 and A3 at 1 au, in au/d², with
  the comets' ΔT, how long after perihelion their outgassing peaked. ʻOumuamua's
  `anomalousAcceleration` is its A1 in m/s²: it had no coma to explain it.

- `observations.incomingRadiant` is where each came from, in the ICRS: the
  incoming asymptote of its orbit around the Solar System's barycentre, from JPL
  Horizons' elements at J2000.

- `observations.discovery` and the old designations in `identifiers.aliases` are
  from the Minor Planet Center's circulars, MPECs 2017-U181, 2017-V17,
  2019-R106, 2019-S72 and 2025-N12. The comets' total magnitudes, M1 and K1, and
  ʻOumuamua's H are JPL's.

- Sources: compiled from public references, mainly NASA JPL and the IAU's Minor
  Planet Center. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of interstellar objects in the dataset

Every interstellar object seen so far, as of 2026.

<div class="ph table-overflow">

| id          | name      | designation | type                | category            | parent | orbit.a          | orbit.e     | orbit.q         | orbit.i     | orbit.w     | orbit.om    | orbit.angle      | orbit.retrograde | orbit.periapsisTime      | orbit.excessSpeed (km/s) | rotation.period | rotation.tumbling | display.color | display.size | radius  |
| ----------- | --------- | ----------- | ------------------- | ------------------- | ------ | ---------------- | ----------- | --------------- | ----------- | ----------- | ----------- | ---------------- | ---------------- | ------------------------ | ------------------------ | --------------- | ----------------- | ------------- | ------------ | ------- |
| 1i-oumuamua | ʻOumuamua | 1I/2017 U1  | interstellar object | interstellar object | sun    | -1.283872207 au  | 1.199436003 | 0.2560503413 au | 122.7369906 | 241.8407041 | 24.60030787 | -2.548421093178  | yes              | 2017-09-09T11:51:02.065Z | 26.39                    | 8.67 h          | yes               | #A0522D       | 2            | 0.07 km |
| 2i-borisov  | Borisov   | 2I/2019 Q4  | interstellar comet  | interstellar object | sun    | -0.8514920069 au | 3.356479267 | 2.00652326 au   | 44.05261629 | 209.1242735 | 308.1477014 | -1.8537256788316 |                  | 2019-12-08T13:16:03.851Z | 32.28                    |                 |                   | #FFFFFF       | 3            | 0.4 km  |
| 3i-atlas    | ATLAS     | 3I/2025 N1  | interstellar comet  | interstellar object | sun    | -0.2639344647 au | 6.139341308 | 1.356449297 au  | 175.1130288 | 128.0075103 | 322.1556249 | -1.7293706146496 | yes              | 2025-10-29T11:33:25.411Z | 57.97                    |                 |                   | #FFFFFF       | 3            | 1.3 km  |

</div>

**Example item in dataset:**

```ts
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
  radius: { value: 0.07, unit: 'km' },
  observations: {
    identifiers: { spkId: 50788063, aliases: ['A/2017 U1', 'C/2017 U1'] },
    discovery: {
      date: new Date('2017-10-19'),
      discoverers: ['R. Weryk'],
      facility: 'Pan-STARRS 1, Haleakala (F51)'
    },
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
  }
},
```

## See

[InterstellarObjectsType](../../types/type-aliases/InterstellarObjectsType.md).

## Example

```ts
console.log(INTERSTELLAR_OBJECTS[1].designation); // "2I/2019 Q4"
```
