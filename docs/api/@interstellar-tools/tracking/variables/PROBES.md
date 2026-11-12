[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ PROBES

# Variable: PROBES

```ts
const PROBES: readonly ProbeRecordInterface[];
```

Defined in:
[probes/probes.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/probes.ts#L81)

**Notable space probes**, with a dated ephemeris for each from JPL Horizons:
where Voyager 1 is, how far New Horizons has gone, where JWST sits. With
[stateAt](../functions/stateAt.md), they answer "where is it now" without the
network, from 1 November 2026 to 31 December 2027.

| Probe                                            | Near                             | On its way to                           |
| ------------------------------------------------ | -------------------------------- | --------------------------------------- |
| Voyager 1 and 2, Pioneer 10 and 11, New Horizons | leaving the Solar System         |                                         |
| James Webb Space Telescope                       | Sun-Earth L2                     |                                         |
| Parker Solar Probe, Solar Orbiter                | the Sun, close in                |                                         |
| Europa Clipper                                   |                                  | Europa                                  |
| JUICE                                            |                                  | Ganymede                                |
| Psyche                                           |                                  | 16 Psyche                               |
| Lucy                                             |                                  | the Trojan asteroids, at Sun-Jupiter L4 |
| Juno                                             | Jupiter, in a 33-day polar orbit |                                         |

::: info Notes

- **Positions are from the Sun's centre**, in the ICRF, as Horizons gives them:
  `r` in m and `v` in m/s. Subtract Earth's position for one from Earth.
- **Within 1 000 km.** The samples are spaced to keep
  [stateAt](../functions/stateAt.md) within 1 000 km of Horizons: months apart
  for the probes leaving the Solar System, hours apart through flybys and Parker
  Solar Probe's perihelia, and minutes apart as Juno swings past Jupiter's cloud
  tops.
- **Predictions.** Past the date the ephemerides were fetched, 5 November 2026,
  Horizons' positions are the missions' planned trajectories: a manoeuvre that's
  changed or added moves the probe off them.
- The span runs from 1 November 2026 to 31 December 2027 at 00:00 TDB, 69 s
  before midnight UTC. Outside it, [stateAt](../functions/stateAt.md) throws:
  fetch an ephemeris from Horizons with `horizonsId`, and read it with
  [parseHorizonsVectors](../functions/parseHorizonsVectors.md).

:::

## Example

```ts
const voyager1 = PROBES.find(({ id }) => id === 'voyager-1')!;
const { r } = stateAt(voyager1.ephemeris, new Date('2027-01-01T00:00:00Z'));

Math.hypot(...r) / AU_METERS; // ≈ 172.8: au from the Sun
```

## See

- [stateAt](../functions/stateAt.md)
- https://ssd.jpl.nasa.gov/horizons/ JPL Horizons
