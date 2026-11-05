[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ coverageFootprint

# Function: coverageFootprint()

```ts
function coverageFootprint(
  position: GeodeticCoordinatesInterface,
  minElevation?: Radians,
  points?: number
): GeodeticCoordinatesInterface[];
```

Defined in:
[satellites/ground-track.ts:260](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/ground-track.ts#L260)

The **coverage footprint** of a satellite: the circle on the ground from which
it's above a minimum elevation, as a polygon of latitudes and longitudes, ready
to draw on a map.

The circle's angular radius is [footprintRadius](footprintRadius.md), and its
points are the destinations at that distance from the point below the satellite,
in every direction:

$$
\begin{aligned}
\varphi_k &= \arcsin(\sin\varphi\cos\lambda_0 + \cos\varphi\sin\lambda_0\cos\alpha_k) \\
\lambda_k &= \lambda + \operatorname{atan2}(\sin\alpha_k\sin\lambda_0\cos\varphi,\ \cos\lambda_0 - \sin\varphi\sin\varphi_k)
\end{aligned}
$$

Where:

- $\varphi$, $\lambda$ are the latitude and longitude below the satellite (rad)
- $\lambda_0$ is the footprint's angular radius (rad)
- $\alpha_k = 2\pi k / n$ are the directions, clockwise from north

**Units**

- Inputs: the position's `phi` and `lambda` in **radians** and `h` in **m**;
  `minElevation` in **radians**.
- Output: the polygon's points, `phi` and `lambda` in **radians**, longitude in
  (-π, π], and `h` 0.

::: info Notes

- On a sphere of Earth's equatorial radius: the flattening moves the edge by a
  fraction of a percent.
- **Near the antimeridian or a pole**, the polygon wraps: points jump from one
  edge of a flat map to the other, or circle the pole. Split it, or draw it on
  an azimuthal projection, before filling it.
- Its area on the sphere is $2\pi R^2 (1 - \cos\lambda_0)$; with many points,
  `sphericalPolygonArea` in `@interstellar-tools/equations` gives the same.

:::

## Parameters

| Parameter       | Type                                                                                     | Default value | Description                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| `position`      | [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md) | `undefined`   | The point below the satellite and its height, as [subSatellitePoint](subSatellitePoint.md) returns them. |
| `minElevation?` | [`Radians`](../../types/type-aliases/Radians.md)                                         | `...`         | Minimum elevation in **radians** (in \[0, π/2), default 0).                                              |
| `points?`       | `number`                                                                                 | `72`          | Number of points on the circle (an integer, at least 3): 72 by default, one every 5°.                    |

## Returns

[`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)\[]

The polygon, in order clockwise from north: geodetic latitude `phi` and
longitude `lambda` in **radians**, and `h` 0.

## Throws

If a value is not a finite number, or `points` is not an integer.

## Throws

If `phi` is outside \[-π/2, π/2], `h <= 0`, `minElevation` is outside \[0, π/2),
or `points < 3`.

## Example

```ts
const below = subSatellitePoint(iss, new Date());

// Where the ISS is at least 10° above the horizon
const footprint = coverageFootprint(below, toRad(10));
```

## See

- [footprintRadius](footprintRadius.md)
- [groundTrack](groundTrack.md)
