[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ propagate

# Function: propagate()

```ts
function propagate(
  elements: MeanElementsInterface,
  date: Date
): StateVectorInterface;
```

Defined in:
[satellites/propagate.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate.ts#L154)

Propagate a satellite's mean elements with **SGP4** to a moment: its position
and velocity in the TEME frame. See [propagateMinutes](propagateMinutes.md).

::: info Notes

- The time since the epoch is taken in UTC, which SGP4 treats as UT1.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md). |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`.                                                    |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s**, in the TEME frame.

## Throws

If `date` is not a valid `Date`, or a value of `elements` is not a finite
number.

## Throws

If the elements are out of range, or SGP4 fails at that time: the satellite has
decayed, or its eccentricity or mean motion left the model's range.

## Example

```ts
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);

propagate(iss, new Date('2026-11-04T12:00:00Z')); // { r: [...], v: [...] }
```

## See

[propagateMinutes](propagateMinutes.md)
