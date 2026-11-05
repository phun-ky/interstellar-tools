[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ subSatellitePoint

# Function: subSatellitePoint()

```ts
function subSatellitePoint(
  elements: MeanElementsInterface,
  date: Date
): GeodeticCoordinatesInterface;
```

Defined in:
[earth-fixed.ts:125](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/earth-fixed.ts#L125)

Find the point on Earth **under a satellite** at a moment: the geodetic
latitude, longitude and height on the WGS 84 ellipsoid.

Propagates the elements with SGP4 ([propagate](propagate.md)), turns the
position with Earth ([temeToEarthFixed](temeToEarthFixed.md)) and converts it to
geodetic coordinates (`bodyFixedToGeodetic` in `@interstellar-tools/equations`).
Taking it at a series of times draws the satellite's **ground track**.

::: info Notes

- The point is where the normal to the ellipsoid through the satellite meets it:
  the geodetic latitude on maps and GPS receivers.
- The height is above the WGS 84 ellipsoid, not above the ground or sea level.
- It's as accurate as the elements: about 1 km at the epoch, growing a few
  kilometres a day.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md). |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`.                                                    |

## Returns

[`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)

`phi`, the geodetic latitude in **radians**, `lambda`, the longitude in
**radians** (east positive, in (-π, π]), and `h`, the height in **m**.

## Throws

If `date` is not a valid `Date`, or a value of `elements` is not a finite
number.

## Throws

If SGP4 fails at that time, as in [propagate](propagate.md).

## Example

```ts
const { phi, lambda, h } = subSatellitePoint(
  iss,
  new Date('2026-11-04T12:00:00Z')
);
// |phi| up to 51.6°, the ISS's inclination; h about 420 km
```

## See

[temeToEarthFixed](temeToEarthFixed.md)
