[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ parseHorizonsVectors

# Function: parseHorizonsVectors()

```ts
function parseHorizonsVectors(text: string): EphemerisInterface;
```

Defined in:
[probes/horizons.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/horizons.ts#L88)

Parse a **JPL Horizons vector table**: the positions and velocities Horizons
gives for a spacecraft, planet or small body, as text or CSV. It's the easiest
way to an ephemeris of a deep-space probe, such as Voyager 1 or Parker Solar
Probe.

Ask Horizons for vectors with velocities (`EPHEM_TYPE=VECTORS`, `VEC_TABLE=2`),
for example through its API. `REF_PLANE=FRAME` gives the ICRF's equatorial axes;
Horizons' default is the ecliptic:

```text
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=-31
  &EPHEM_TYPE=VECTORS&VEC_TABLE=2&REF_PLANE=FRAME&CENTER=500@10
  &START_TIME=2026-01-01&STOP_TIME=2026-01-11&STEP_SIZE=1d
```

::: info Notes

- **Pass the whole output**, header included: the target, centre, frame, units
  and time scale are read from it. With `format=json`, pass the response's
  `result`.
- Units can be `KM-S`, `KM-D` or `AU-D`; positions and velocities are returned
  in m and m/s.
- Times can be TDB, the default, TT or UT, which is read as UTC. They're
  returned as UTC `Date`s, rounded to the millisecond.
- `objectName`, `center` and `frame` are Horizons' names, such as
  `'Voyager 1 (spacecraft)'`, `'Sun'` and `'ICRF'` or `'Ecliptic of J2000.0'`,
  and `objectId` is its id, such as `'-31'`.
- Horizons is a free service of JPL's Solar System Dynamics group. The library
  fetches nothing: fetch the table, then parse it.

:::

## Parameters

| Parameter | Type     | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| `text`    | `string` | The Horizons output, with its header and the table between `$$SOE` and `$$EOE`. |

## Returns

[`EphemerisInterface`](../../types/interfaces/EphemerisInterface.md)

The ephemeris: see
[EphemerisInterface](../../types/interfaces/EphemerisInterface.md).

## Throws

If `text` is not a string.

## Throws

If the table, the target, centre or frame is missing, the units or time scale
aren't read, a record has no velocity (`VEC_TABLE=1`), or the times don't
increase.

## Example

```ts
const response = await fetch(
  'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=-31&EPHEM_TYPE=VECTORS&VEC_TABLE=2&REF_PLANE=FRAME&CENTER=500@10&START_TIME=2026-01-01&STOP_TIME=2026-01-11&STEP_SIZE=1d'
);
const voyager1 = parseHorizonsVectors(await response.text());

stateAt(voyager1, new Date('2026-01-05T06:00:00Z')); // { r, v } from the Sun, in m and m/s
```

## See

- [stateAt](stateAt.md)
- [parseOem](parseOem.md)
- https://ssd-api.jpl.nasa.gov/doc/horizons.html The Horizons API
