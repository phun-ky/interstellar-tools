[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / primeVerticalRadiusOfCurvature

# Function: primeVerticalRadiusOfCurvature()

```ts
function primeVerticalRadiusOfCurvature(
  phi: Radians,
  a: number,
  eSquared: number
): number;
```

Defined in:
[cartography/prime-vertical-radius-of-curvature.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/prime-vertical-radius-of-curvature.ts#L64)

Compute the **prime vertical radius of curvature** $N$ of an oblate spheroid at
a geodetic latitude.

$$
N = \frac{a}{\sqrt{1 - e^2\sin^2\varphi}}
$$

Where:

- $\varphi$ is the geodetic latitude (rad)
- $a$ is the equatorial radius (m) and $e^2$ the first eccentricity squared

**Units**

- Inputs: `phi` in **radians**, `a` in **m**, `eSquared` dimensionless.
- Output: $N$ in **m**.

::: info Notes

- The radius of the curve the surface makes east–west, at right angles to the
  meridian. A step $\Delta\lambda$ in longitude covers
  $N\cos\varphi\,\Delta\lambda$ along the parallel.
- $N$ is also the distance along the normal from the surface to the rotation
  axis; [geodeticToBodyFixed](geodeticToBodyFixed.md) uses it.
- It runs from $a$ at the equator to $a/\sqrt{1 - e^2}$ at the poles, and is
  never smaller than the meridional radius
  [meridionalRadiusOfCurvature](meridionalRadiusOfCurvature.md).

:::

::: practice Apollo 11, on Pad 39A

**97.80 km**

_One degree of longitude at 28.608° N on WGS 84, from N = 6 383.0 km_

At the equator, a degree of longitude is 111.32 km. A degree of latitude at the
pad is 110.83 km (see `meridionalRadiusOfCurvature`).

```ts
const N = primeVerticalRadiusOfCurvature(
  toRad(28.608422),
  6_378_137,
  0.00669437999014
);
N * Math.cos(toRad(28.608422)) * (Math.PI / 180); // ≈ 97 804 m
```

:::

## Parameters

| Parameter  | Type                                             | Description                                                           |
| ---------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md) | Geodetic latitude $\varphi$ in **radians** (finite, in \[-π/2, π/2]). |
| `a`        | `number`                                         | Equatorial radius $a$ in **m** (finite, > 0).                         |
| `eSquared` | `number`                                         | First eccentricity squared $e^2$ (finite, in \[0, 1)).                |

## Returns

`number`

The prime vertical radius of curvature $N$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` is outside \[-π/2, π/2], `a <= 0`, or `eSquared` is outside \[0, 1).

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// At the poles, N = a / √(1 − e²)
primeVerticalRadiusOfCurvature(
  (Math.PI / 2) as Radians,
  6_378_137,
  0.00669437999014
);
// ≈ 6 399 594 m
```

## See

- [meridionalRadiusOfCurvature](meridionalRadiusOfCurvature.md)
- [geodeticToBodyFixed](geodeticToBodyFixed.md)
- https://en.wikipedia.org/wiki/Earth_radius#Prime_vertical Prime vertical
  radius of curvature
