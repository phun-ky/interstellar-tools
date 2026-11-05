[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ groundTrack

# Function: groundTrack()

```ts
function groundTrack(
  elements: MeanElementsInterface,
  from: Date,
  to: Date,
  step?: number
): GeodeticCoordinatesInterface[][];
```

Defined in:
[satellites/ground-track.ts:69](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/ground-track.ts#L69)

The **ground track** of a satellite: the points on the ground directly below it
over time, ready to draw on a flat map.

Steps [subSatellitePoint](subSatellitePoint.md) from `from` to `to`, and splits
the track where it crosses the antimeridian, ±180°: each segment ends at the
edge of the map, and the next starts at the other edge, at the latitude where
the track crosses it. A renderer then never draws a line across the whole map.

::: info Notes

- **Westward drift.** Each orbit's track lies west of the one before, by the
  angle Earth turns in an orbit: about 23° for the ISS.
- A geostationary satellite's track is a point, or a small figure eight if its
  orbit is a little inclined.
- Each point's `h` is the satellite's height above the WGS 84 ellipsoid.
- Pick the step to suit the map: a minute draws a smooth track for a low orbit.
  The track is linear between points, so a step much longer than a few minutes
  cuts corners.

:::

## Parameters

| Parameter  | Type                                                                                      | Default value | Description                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | `undefined`   | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md). |
| `from`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | Start of the track, as a `Date`.                                            |
| `to`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | End of the track, as a `Date` after `from`.                                 |
| `step?`    | `number`                                                                                  | `60`          | Time between points in **s** (finite, > 0): 60 by default.                  |

## Returns

[`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)\[]\[]

The track, as segments of points: geodetic latitude `phi` and longitude `lambda`
in **radians**, longitude in (-π, π], and height `h` in **m**.

## Throws

If `from` or `to` is not a valid `Date`, `step` is not a finite number, or a
value of `elements` is not a finite number.

## Throws

If `to` is not after `from`, `step <= 0`, the track would have more than a
million points, or SGP4 fails along it, as in [propagate](propagate.md).

## Example

```ts
const now = new Date();
const later = new Date(now.getTime() + 92 * 60_000); // one ISS orbit

for (const segment of groundTrack(iss, now, later))
  drawLine(segment.map(({ phi, lambda }) => [toDeg(lambda), toDeg(phi)]));
```

## See

- [subSatellitePoint](subSatellitePoint.md)
- [coverageFootprint](coverageFootprint.md)
