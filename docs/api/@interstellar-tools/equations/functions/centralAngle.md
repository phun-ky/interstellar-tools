[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / centralAngle

# Function: centralAngle()

```ts
function centralAngle(
  lat1: Radians,
  lon1: Radians,
  lat2: Radians,
  lon2: Radians
): Radians;
```

Defined in:
[cartography/central-angle.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/central-angle.ts#L51)

Compute the **central angle** between two points on a sphere from their
latitudes and longitudes, with the haversine formula.

$$
h = \sin^2\frac{\Delta\varphi}{2} + \cos\varphi_1\cos\varphi_2\sin^2\frac{\Delta\lambda}{2},
\qquad
\Delta\sigma = 2\arcsin\sqrt{h}
$$

Where:

- $\varphi_1$, $\varphi_2$ are the latitudes and $\Delta\varphi$,
  $\Delta\lambda$ the differences in latitude and longitude (rad)
- $\Delta\sigma$ is the angle between the two points, seen from the centre (rad)

**Units**

- Inputs: latitudes and longitudes in **radians**.
- Output: $\Delta\sigma$ in **radians**, in \[0, π].

::: info Notes

- The haversine form stays accurate for points close together, where the
  spherical law of cosines loses precision. $h$ is clamped to 1 so rounding
  can't break antipodal points.
- On an oblate body, use geocentric latitudes for the angle between the position
  vectors, or accept an error of up to about 0.5% on Earth with geodetic ones.
  For exact distances on an ellipsoid, Vincenty's or Karney's methods are
  needed.
- Multiply by a radius for the distance:
  [greatCircleDistance](greatCircleDistance.md). From position vectors, use
  [centralAngleFromVectors](centralAngleFromVectors.md).

:::

## Parameters

| Parameter | Type                                             | Description                                                            |
| --------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `lat1`    | [`Radians`](../../types/type-aliases/Radians.md) | Latitude of the first point in **radians** (finite, in \[-π/2, π/2]).  |
| `lon1`    | [`Radians`](../../types/type-aliases/Radians.md) | Longitude of the first point in **radians** (finite).                  |
| `lat2`    | [`Radians`](../../types/type-aliases/Radians.md) | Latitude of the second point in **radians** (finite, in \[-π/2, π/2]). |
| `lon2`    | [`Radians`](../../types/type-aliases/Radians.md) | Longitude of the second point in **radians** (finite).                 |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The central angle $\Delta\sigma$ in **radians**.

## Throws

If any input is not a finite number.

## Throws

If a latitude is outside \[-π/2, π/2].

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A quarter of the equator
centralAngle(
  0 as Radians,
  0 as Radians,
  0 as Radians,
  (Math.PI / 2) as Radians
); // π/2
```

## See

- [greatCircleDistance](greatCircleDistance.md)
- [centralAngleFromVectors](centralAngleFromVectors.md)
- https://en.wikipedia.org/wiki/Haversine_formula Haversine formula
