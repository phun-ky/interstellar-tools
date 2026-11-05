[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ parseOem

# Function: parseOem()

```ts
function parseOem(text: string): EphemerisInterface[];
```

Defined in:
[probes/oem.ts:112](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/probes/oem.ts#L112)

Parse a CCSDS **Orbit Ephemeris Message** (OEM) in its key-value (KVN) form: the
standard space agencies exchange spacecraft ephemerides in, a table of positions
and velocities over time.

```text
CCSDS_OEM_VERS = 3.0
CREATION_DATE = 1996-11-04T17:22:31
ORIGINATOR = NASA/JPL

META_START
OBJECT_NAME = MARS GLOBAL SURVEYOR
OBJECT_ID = 1996-062A
CENTER_NAME = MARS BARYCENTER
REF_FRAME = EME2000
TIME_SYSTEM = UTC
START_TIME = 2019-12-18T12:00:00.331
STOP_TIME = 2019-12-28T21:28:00.331
META_STOP

2019-12-18T12:00:00.331 2789.619 -280.045 -1746.755 4.73372 -2.49586 -1.04195
2019-12-18T12:01:00.331 2783.419 -308.143 -1877.071 5.18604 -2.42124 -1.99608
```

::: info Notes

- **One ephemeris per segment.** Each `META_START` block starts a segment, and
  the standard forbids interpolating across them: they often split an ephemeris
  at a manoeuvre. Pass each segment to [stateAt](stateAt.md) on its own.
- Positions and velocities are read in km and km/s, as the standard has them,
  and returned in m and m/s. Accelerations, when present, and covariance blocks
  are skipped.
- Epochs are read on the `TIME_SYSTEM` clock and returned as UTC `Date`s,
  rounded to the millisecond. UTC, TAI, TT, UT1, TDB and GPS are read;
  mission-elapsed and spacecraft clocks, TCB and TCG aren't.
- Epochs can be calendar dates or days of the year, as in `2019-352T12:00:00`.
  The XML form of OEM isn't read.

:::

## Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `text`    | `string` | The OEM, in KVN. |

## Returns

[`EphemerisInterface`](../../types/interfaces/EphemerisInterface.md)\[]

The segments, in order: see
[EphemerisInterface](../../types/interfaces/EphemerisInterface.md).

## Throws

If `text` is not a string.

## Throws

If the OEM is malformed: it doesn't start with `CCSDS_OEM_VERS`, a required
keyword is missing, the time system isn't one of those read, a segment has no
data, or a data line has the wrong number of values, an invalid epoch or epochs
out of order. The message names the line.

## Example

```ts
const [segment] = parseOem(text);

segment.objectName; // 'MARS GLOBAL SURVEYOR'
stateAt(segment, new Date('2019-12-18T12:00:30Z')); // { r, v } in m and m/s
```

## See

- [stateAt](stateAt.md)
- [parseHorizonsVectors](parseHorizonsVectors.md)
- https://ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages,
  section 5
