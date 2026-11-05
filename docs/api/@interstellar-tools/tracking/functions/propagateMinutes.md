[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ propagateMinutes

# Function: propagateMinutes()

```ts
function propagateMinutes(
  elements: MeanElementsInterface,
  minutes: number
): StateVectorInterface;
```

Defined in:
[propagate.ts:108](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate.ts#L108)

Propagate a satellite's mean elements with **SGP4** to a number of minutes from
their epoch: its position and velocity in the TEME frame.

SGP4 is the model TLEs and OMMs are fitted with, so it's the only one that gives
correct positions from them. For periods of 225 minutes or more it runs as
**SDP4**, adding the pull of the Moon and Sun and the resonances of 12- and
24-hour orbits.

::: info Notes

- **TEME** (true equator, mean equinox) is the frame SGP4 works in: Earth
  centred, with z along the true rotation axis of the moment and x towards the
  mean equinox. Turn it by Greenwich mean sidereal time to get Earth-fixed
  coordinates.
- **In SI units**: the model works in kilometres and km/s, and the result is
  converted to m and m/s like the rest of the library. Divide by 1000 to compare
  with other SGP4 implementations.
- **Accuracy**: about 1 km at the epoch, growing by a few kilometres a day,
  faster for low orbits in a busy solar cycle. Use fresh elements.
- The model uses the WGS-72 constants the elements were fitted with, not WGS-84,
  and the "improved" mode of Vallado et al. (2006), which matches their
  verification set.
- The model is set up once per elements object and reused, so treat the elements
  as read-only.

:::

## Parameters

| Parameter  | Type                                                                       | Description                                                                 |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md) | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md). |
| `minutes`  | `number`                                                                   | Time since the epoch in **minutes** (finite); negative goes back in time.   |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s**, in the TEME frame.

## Throws

If `minutes` or a value of `elements` is not a finite number.

## Throws

If the elements are out of range, or SGP4 fails at that time: the satellite has
decayed, or its eccentricity or mean motion left the model's range.

## Example

```ts
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);
const { r, v } = propagateMinutes(iss, 90);

Math.hypot(...r) / 1000; // ≈ 6 790 km from Earth's centre
Math.hypot(...v); // ≈ 7 660 m/s
```

## See

- [propagate](propagate.md)
- https://celestrak.org/publications/AIAA/2006-6753/ Vallado, Crawford, Hujsak &
  Kelso (2006), Revisiting Spacetrack Report
  [#3](https://github.com/phun-ky/interstellar-tools/issues/3)
