[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / greatCircleDistance

# Function: greatCircleDistance()

```ts
function greatCircleDistance(
  lat1: Radians,
  lon1: Radians,
  lat2: Radians,
  lon2: Radians,
  R: number
): number;
```

Defined in:
[cartography/great-circle-distance.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/great-circle-distance.ts#L67)

Compute the **great-circle distance** between two points on a sphere: the
shortest path along its surface.

$$
d = R\,\Delta\sigma
$$

with the central angle $\Delta\sigma$ from [centralAngle](centralAngle.md)
(haversine).

**Units**

- Inputs: latitudes and longitudes in **radians**, `R` in **m**.
- Output: $d$ in **m**.

::: info Notes

- On a sphere of radius $R$, the distance is at most $\pi R$, half the
  circumference.
- For an oblate body, the mean radius gives distances good to about 0.5%; exact
  ellipsoidal distances need Vincenty's or Karney's methods.
- Ground tracks, distances between landing sites, and how far a rover has to
  drive all start here.

:::

::: practice Apollo 11, Tranquility Base to Apollo 12

**1 426 km**

_From 0.674° N, 23.473° E to 3.012° S, 23.422° W, on a 1 737.4 km Moon_

Four months after Apollo 11, Apollo 12 landed in the Ocean of Storms, 47° of arc
to the west. Apollo 17, the last landing, came down 630 km from Tranquility
Base.

```ts
greatCircleDistance(
  toRad(0.67408),
  toRad(23.47297),
  toRad(-3.01239),
  toRad(-23.42157),
  1_737_400
);
// ≈ 1 425 826 m
```

:::

## Parameters

| Parameter | Type                                             | Description                                                            |
| --------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `lat1`    | [`Radians`](../../types/type-aliases/Radians.md) | Latitude of the first point in **radians** (finite, in \[-π/2, π/2]).  |
| `lon1`    | [`Radians`](../../types/type-aliases/Radians.md) | Longitude of the first point in **radians** (finite).                  |
| `lat2`    | [`Radians`](../../types/type-aliases/Radians.md) | Latitude of the second point in **radians** (finite, in \[-π/2, π/2]). |
| `lon2`    | [`Radians`](../../types/type-aliases/Radians.md) | Longitude of the second point in **radians** (finite).                 |
| `R`       | `number`                                         | Radius $R$ of the sphere in **m** (finite, > 0).                       |

## Returns

`number`

The great-circle distance $d$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If a latitude is outside \[-π/2, π/2], or `R <= 0`.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

// London to New York on a 6 371 km Earth
greatCircleDistance(
  toRad(51.5074),
  toRad(-0.1278),
  toRad(40.7128),
  toRad(-74.006),
  6_371_000
);
// ≈ 5 570 km
```

## See

- [centralAngle](centralAngle.md)
- [centralAngleFromVectors](centralAngleFromVectors.md)
- https://en.wikipedia.org/wiki/Great-circle_distance Great-circle distance
