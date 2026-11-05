[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ isVisiblePass

# Function: isVisiblePass()

```ts
function isVisiblePass(
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  pass: SatellitePassInterface,
  options?: IsVisiblePassOptionsInterface
): boolean;
```

Defined in:
[satellites/passes.ts:267](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L267)

Whether a pass is a **visible pass**: the satellite lit by the Sun while the sky
is dark for the observer, so it can be seen with the eye, a bright star moving
steadily across the sky.

Checks the pass every 10 s from rise to set. It's visible if, at any of those
moments, the Sun is below `sunElevation` for the observer and the satellite is
not in Earth's umbra ([earthShadow](earthShadow.md)).

::: info Notes

- The default -6°, the end of civil twilight, is when the brightest stars come
  out. Pass -12° for a properly dark sky, or 0 to count any pass after sunset.
- A satellite is easiest to see shortly after sunset or before sunrise: high up,
  it's still in sunlight while the ground is dark. Around midnight in winter,
  it's usually in Earth's shadow.
- Whether it's bright enough depends on its size and how the Sun catches it. The
  ISS is among the brightest objects in the night sky.

:::

## Parameters

| Parameter  | Type                                                                                     | Description                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)               | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md).                                                       |
| `observer` | [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md) | The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**. |
| `pass`     | [`SatellitePassInterface`](../../types/interfaces/SatellitePassInterface.md)             | A pass from [predictPasses](predictPasses.md); only its `rise` and `set` are used.                                                |
| `options?` | [`IsVisiblePassOptionsInterface`](../interfaces/IsVisiblePassOptionsInterface.md)        | `sunElevation` in **radians** (in \[-π/2, π/2], default -6°).                                                                     |

## Returns

`boolean`

`true` if the satellite can be seen during the pass.

## Throws

If `rise` or `set` is not a valid `Date`, `sunElevation` is not a finite number,
or a value of `elements` or `observer` is not a finite number.

## Throws

If `set` is before `rise`, `sunElevation` is outside \[-π/2, π/2], or SGP4 fails
during the pass, as in [propagate](propagate.md).

## Example

```ts
const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
const from = new Date('2026-11-04T12:00:00Z');
const to = new Date('2026-11-11T12:00:00Z');
const visible = predictPasses(iss, oslo, from, to).filter((pass) =>
  isVisiblePass(iss, oslo, pass)
);
```

## See

- [predictPasses](predictPasses.md)
- [earthShadow](earthShadow.md)
