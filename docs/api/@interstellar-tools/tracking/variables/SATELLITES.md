[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ SATELLITES

# Variable: SATELLITES

```ts
const SATELLITES: readonly SatelliteRecordInterface[];
```

Defined in:
[satellites/dataset.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/dataset.ts#L49)

A small **snapshot of well-known satellites**, with their elements as OMM
records from CelesTrak, dated 4 November 2026. Examples, tests and demos work
with it without the network.

Twelve satellites across the orbit regimes, so both SGP4 and SDP4 are exercised:

- **Low Earth orbit**: the ISS, Tiangong, Hubble, a Starlink, Landsat 9, NOAA-20
  and Envisat, a large defunct satellite.
- **Medium Earth orbit**: a GPS and a Galileo navigation satellite.
- **Geostationary**: the weather satellites GOES-19 and Meteosat-11.
- **Highly elliptical**: Molniya 1-29, a 12-hour Molniya orbit.

::: warning The elements go stale within days

SGP4 positions from elements a few days old are off by kilometres, more for low
orbits, and a manoeuvre or reboost changes the orbit outright. This snapshot is
for examples, not for tracking: for live data, fetch fresh elements from
CelesTrak, for example
`https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=json`, and
follow its usage policy: no more than once every 2 hours.

:::

::: info Notes

- Each entry's epoch is in `omm.EPOCH`.
- Data from [CelesTrak](https://celestrak.org/), from the US Space Force's
  public catalogue.

:::

## Example

```ts
const hubble = SATELLITES.find(({ id }) => id === 'hubble');
const elements = parseOmm(hubble.omm);

subSatellitePoint(elements, elements.epoch); // where Hubble was, at the epoch
```

## See

- [parseOmm](../functions/parseOmm.md)
- https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak's GP
  data formats and usage
