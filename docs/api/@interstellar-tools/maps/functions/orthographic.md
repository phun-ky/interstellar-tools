[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
orthographic

# Function: orthographic()

```ts
function orthographic(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: AzimuthalOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/orthographic.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/orthographic.ts#L58)

Project a point on a sphere with the **orthographic projection**: the globe as
it looks from infinitely far away, above the map's centre.

$$
x = R\cos\varphi\sin(\lambda - \lambda_0),
\qquad
y = R\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\varphi_0$ and $\lambda_0$ are the map's centre (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- The near hemisphere fills a disc of radius $R$: a point at angular distance
  $c$ from the centre is $R\sin c$ from it, in its true direction. It keeps
  neither areas nor angles; shapes are squashed towards the edge, as on a
  photograph of a planet.
- Only the near hemisphere can be shown. A point on the far side, with $\cos c =
  \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0) <
  0$, throws a `RangeError`; to draw a globe, skip the points where $\cos c$ is
  negative. Points on the horizon, $\cos c = 0$, are shown, allowing for
  rounding.

:::

## Parameters

| Parameter  | Type                                                                      | Description                                                          |
| ---------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md)                          | Latitude $\varphi$ in **radians** (finite, in \[−π/2, π/2]).         |
| `lambda`   | [`Radians`](../../types/type-aliases/Radians.md)                          | Longitude $\lambda$ in **radians** (finite).                         |
| `R`        | `number`                                                                  | Radius $R$ of the sphere in **m** (finite, > 0).                     |
| `options?` | [`AzimuthalOptionsInterface`](../interfaces/AzimuthalOptionsInterface.md) | `phi0` and `lambda0`, the map's centre (radians, both default to 0). |

## Returns

[`ProjectedPointInterface`](../interfaces/ProjectedPointInterface.md)

The point on the map, `{ x, y }` in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` or `phi0` is outside \[−π/2, π/2], `R <= 0`, or the point is on the far
side.

## Example

```ts
// Mars seen from far above 0° N, 0° E: a point at 30° N, 60° E
orthographic(toRad(30), toRad(60), 3_389_500);
// ≈ { x: 2 542 125, y: 1 694 750 } m
```

## See

- [inverseOrthographic](inverseOrthographic.md)
- [lambertAzimuthalEqualArea](lambertAzimuthalEqualArea.md)
- [stereographic](stereographic.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 20
