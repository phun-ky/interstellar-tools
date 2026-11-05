[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ predictPasses

# Function: predictPasses()

```ts
function predictPasses(
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  from: Date,
  to: Date,
  options?: PredictPassesOptionsInterface
): SatellitePassInterface[];
```

Defined in:
[satellites/passes.ts:83](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/passes.ts#L83)

**Predict the passes** of a satellite over a ground observer between two
moments: when it rises above the horizon, when it's highest, and when it sets.
It's the first question a tracking app answers.

Steps through the window in coarse steps, finds where the elevation from
[lookAngles](lookAngles.md) crosses the minimum, and refines each crossing by
bisection to the millisecond. The highest point is refined by a golden-section
search around the highest step.

::: info Notes

- **Accuracy**: no better than the elements. Rise and set times are good to
  seconds with elements a day old, and drift by tens of seconds a day after
  that, more for low orbits. Use fresh elements.
- Only whole passes are returned: a pass already in progress at `from`, or still
  in progress at `to`, is left out. A geostationary satellite never rises or
  sets, so it has no passes, above the horizon or not.
- A pass shorter than the step, grazing the minimum elevation, can be missed.
  Pass a smaller `step` to catch those.
- The elevation is geometric: refraction makes a satellite visible about half a
  degree below the horizon, a few seconds earlier.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md).                                                       |
| `observer` | [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)  | The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**. |
| `from`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Start of the window, as a `Date`.                                                                                                 |
| `to`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | End of the window, as a `Date` after `from`.                                                                                      |
| `options?` | [`PredictPassesOptionsInterface`](../interfaces/PredictPassesOptionsInterface.md)         | `minElevation` in **radians** (in (-π/2, π/2), default 0) and the coarse `step` in **s** (finite, > 0).                           |

## Returns

[`SatellitePassInterface`](../../types/interfaces/SatellitePassInterface.md)\[]

The passes in the window, in order: see
[SatellitePassInterface](../../types/interfaces/SatellitePassInterface.md).

## Throws

If `from` or `to` is not a valid `Date`, an option is not a finite number, or a
value of `elements` or `observer` is not a finite number.

## Throws

If `to` is not after `from`, `minElevation` is outside (-π/2, π/2), `step <= 0`,
or SGP4 fails within the window, as in [propagate](propagate.md).

## Example

```ts
const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
const from = new Date('2026-11-04T12:00:00Z');
const to = new Date('2026-11-05T12:00:00Z');

for (const pass of predictPasses(iss, oslo, from, to, {
  minElevation: toRad(10)
}))
  console.log(pass.rise.toISOString(), toDeg(pass.maxElevation));
```

## See

[lookAngles](lookAngles.md)
