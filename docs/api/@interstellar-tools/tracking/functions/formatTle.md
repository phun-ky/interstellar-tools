[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ formatTle

# Function: formatTle()

```ts
function formatTle(
  elements: MeanElementsInterface
): [line1: string, line2: string];
```

Defined in:
[satellites/tle.ts:371](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/tle.ts#L371)

Write mean elements as a **two-line element set** (TLE), with checksums: the
reverse of [parseTle](parseTle.md), for tools and ground station networks that
take TLEs, such as SatNOGS.

```text
1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991
2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483
```

::: info Notes

- **Rounded to the TLE's columns**: angles to 0.0001°, the eccentricity to 7
  decimals, the mean motion to 8, B\* to 5 significant digits and the epoch to
  0.9 ms. That moves a low satellite's position by up to a few metres, well
  inside SGP4's own error. For every digit, use [formatOmm](formatOmm.md).
- Catalogue numbers from 100 000 to 339 999 are written in Alpha-5, with a
  letter for the first two digits. Larger ones only fit in an OMM.
- The revolution number keeps its last five digits, and the element set number
  its last four, as TLEs do.
- The name isn't part of the two lines: put `elements.name` on a line before
  them for a three-line file.

:::

## Parameters

| Parameter  | Type                                                                       | Description                                                                                                |
| ---------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md) | The mean elements, from [parseTle](parseTle.md), [parseOmm](parseOmm.md) or [fitElements](fitElements.md). |

## Returns

\[`line1`: `string`, `line2`: `string`]

The two lines of the TLE, 69 characters each.

## Throws

If a value of `elements` is not a finite number.

## Throws

If a value doesn't fit in a TLE: a catalogue number above 339 999, an epoch
outside 1957 to 2056, an international designator not like `1998-067A`, or a
mean motion of 100 revolutions a day or more.

## Example

```ts
const [line1, line2] = formatTle(iss);

parseTle(line1, line2); // the same elements, to the TLE's digits
```

## See

- [parseTle](parseTle.md)
- [formatOmm](formatOmm.md)
- https://celestrak.org/columns/v04n03/ Kelso, "Frequently asked questions:
  two-line element set format"
