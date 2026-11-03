[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / meridionalRadiusOfCurvature

# Function: meridionalRadiusOfCurvature()

```ts
function meridionalRadiusOfCurvature(
  phi: Radians,
  a: number,
  eSquared: number
): number;
```

Defined in:
[cartography/meridional-radius-of-curvature.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/meridional-radius-of-curvature.ts#L63)

Compute the **meridional radius of curvature** $M$ of an oblate spheroid at a
geodetic latitude.

$$
M = \frac{a(1 - e^2)}{\left(1 - e^2\sin^2\varphi\right)^{3/2}}
$$

Where:

- $\varphi$ is the geodetic latitude (rad)
- $a$ is the equatorial radius (m) and $e^2$ the first eccentricity squared

**Units**

- Inputs: `phi` in **radians**, `a` in **m**, `eSquared` dimensionless.
- Output: $M$ in **m**.

::: info Notes

- The radius of the curve the surface makes north–south, along the meridian. A
  small step $\Delta\varphi$ in latitude covers $M\,\Delta\varphi$.
- It runs from $a(1 - e^2)$ at the equator, where an oblate body is flattest
  north–south, to $a/\sqrt{1 - e^2}$ at the poles: a degree of latitude is
  longer near the poles.
- With $e^2 = 0$, $M = N = a$: a sphere.

:::

::: practice Apollo 11, on Pad 39A

**110.83 km**

_One degree of latitude at 28.608° N on WGS 84, from M = 6 350.1 km_

A degree of latitude is 110.57 km at the equator and 111.69 km at the poles.
East–west, a degree of longitude at the pad is 97.80 km (see
`primeVerticalRadiusOfCurvature`).

```ts
meridionalRadiusOfCurvature(toRad(28.608422), 6_378_137, 0.00669437999014) *
  (Math.PI / 180);
// ≈ 110 829 m
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

The meridional radius of curvature $M$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` is outside \[-π/2, π/2], `a <= 0`, or `eSquared` is outside \[0, 1).

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// At the equator, M = a(1 − e²)
meridionalRadiusOfCurvature(0 as Radians, 6_378_137, 0.00669437999014); // ≈ 6 335 439 m
```

## See

- [primeVerticalRadiusOfCurvature](primeVerticalRadiusOfCurvature.md)
- [eccentricitySquaredOblateSpheroid](eccentricitySquaredOblateSpheroid.md)
- https://en.wikipedia.org/wiki/Earth_radius#Meridional Meridional radius of
  curvature
