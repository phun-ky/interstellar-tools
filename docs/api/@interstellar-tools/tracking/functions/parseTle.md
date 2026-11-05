[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ parseTle

# Function: parseTle()

```ts
function parseTle(
  line1: string,
  line2: string,
  name?: string
): MeanElementsInterface;
```

Defined in:
[satellites/tle.ts:199](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/tle.ts#L199)

Parse a **two-line element set** (TLE): the format NORAD has published satellite
orbits in since the 1960s, for SGP4.

```text
ISS (ZARYA)
1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991
2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483
```

Each line is checked before it's read: its length, line number, the blank
columns between the fields, and the checksum. An error names the line, the
columns and the field.

::: info Notes

- **Alpha-5 catalogue numbers** are read: with five digits running out, a letter
  in the first column stands for 10 to 33, skipping I and O, so `A0001` is 100
  001 and `Z9999` is 339 999. Larger numbers only fit in an OMM: see
  [parseOmm](parseOmm.md).
- A two-digit epoch year from 57 is 19xx, and below 57 is 20xx.
- The epoch is in UTC. `epochJulianDate` keeps all eight decimals of the day, a
  resolution of 0.9 ms; `epoch`, a `Date`, rounds to the millisecond.
- A name line from a three-line file can be passed as `name`, with or without
  the `0 ` that some files start it with.

:::

## Parameters

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `line1`   | `string` | The first line of the TLE, 69 characters; trailing spaces are ignored. |
| `line2`   | `string` | The second line, 69 characters.                                        |
| `name?`   | `string` | The satellite's name, from the line before the TLE (optional).         |

## Returns

[`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)

The mean elements, in radians and rad/s: see
[MeanElementsInterface](../../types/interfaces/MeanElementsInterface.md).

## Throws

If a line or `name` is not a string.

## Throws

If a line is malformed, its checksum is wrong, the lines' catalogue numbers
differ, or a value is out of range; the message names the field.

## Example

```ts
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483',
  'ISS (ZARYA)'
);

iss.catalogNumber; // 25544
iss.epoch.toISOString(); // '2026-11-04T08:52:07.404Z'
(iss.meanMotion * 86_400) / (2 * Math.PI); // 15.49173979 revolutions a day
```

## See

- [parseOmm](parseOmm.md)
- [tleChecksum](tleChecksum.md)
- https://celestrak.org/columns/v04n03/ Kelso, "Frequently asked questions:
  two-line element set format"
- https://celestrak.org/publications/AIAA/2006-6753/ Vallado et al. (2006),
  Revisiting Spacetrack Report
  [#3](https://github.com/phun-ky/interstellar-tools/issues/3)
