[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ lookAngles

# Function: lookAngles()

```ts
function lookAngles(
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  date: Date
): LookAnglesInterface;
```

Defined in:
[look-angles.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/look-angles.ts#L157)

The **look angles** to a satellite from a ground observer at a moment: where to
point an antenna or a camera (azimuth and elevation), how far away the satellite
is (range), and how fast that changes (range rate, for the Doppler shift).

Propagates the elements with SGP4 ([propagate](propagate.md)), turns the result
with Earth ([temeToEarthFixed](temeToEarthFixed.md)) and finds the direction in
the observer's local frame
([lookAnglesFromEarthFixed](lookAnglesFromEarthFixed.md)).

::: info Notes

- The satellite is above the horizon while `elevation` is above 0; in practice
  trees, buildings and refraction set the limit a few degrees higher.
- As accurate as the elements: about 1 km at the epoch, a few hundredths of a
  degree for a satellite 1 000 km away, growing by a few kilometres a day.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md).                                                       |
| `observer` | [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)  | The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**. |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a `Date`.                                                                                                          |

## Returns

[`LookAnglesInterface`](../../types/interfaces/LookAnglesInterface.md)

The azimuth, elevation, range and range rate: see
[LookAnglesInterface](../../types/interfaces/LookAnglesInterface.md).

## Throws

If `date` is not a valid `Date`, or a value of `elements` or `observer` is not a
finite number.

## Throws

If the observer's `phi` is outside \[-π/2, π/2], or SGP4 fails at that time, as
in [propagate](propagate.md).

## Example

```ts
const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
const { azimuth, elevation } = lookAngles(iss, oslo, new Date());

elevation > 0; // the ISS is above Oslo's horizon
```

## See

- [lookAnglesFromEarthFixed](lookAnglesFromEarthFixed.md)
- [dopplerShift](dopplerShift.md)
