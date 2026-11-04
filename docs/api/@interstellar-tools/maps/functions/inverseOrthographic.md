[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseOrthographic

# Function: inverseOrthographic()

```ts
function inverseOrthographic(
  x: number,
  y: number,
  R: number,
  options?: AzimuthalOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/orthographic.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/orthographic.ts#L118)

Find the point on a sphere for a point on an **orthographic** map: the inverse
of [orthographic](orthographic.md).

$$
\rho = \sqrt{x^2 + y^2},
\qquad
c = \arcsin\frac{\rho}{R}
$$

$$
\varphi = \arcsin\!\Big(\cos c\sin\varphi_0 + \frac{y\sin c\cos\varphi_0}{\rho}\Big),
\qquad
\lambda = \lambda_0 + \arctan\frac{x\sin c}{\rho\cos\varphi_0\cos c - y\sin\varphi_0\sin c}
$$

**Units**

- Inputs: `x`, `y` and `R` in **m**, `phi0` and `lambda0` in **radians**.
- Output: `{ phi, lambda }` in **radians**, with $\lambda$ in (−π, π].

::: info Notes

- Only points within $R$ of the centre, on the globe's disc, have an inverse: a
  point beyond it throws a `RangeError`. The answer is always on the near
  hemisphere.
- Near the edge of the disc, where the globe is seen edge-on, a small step on
  the map is a long way on the sphere, so the inverse loses precision there.
- $\varphi$ and $\lambda$ are found with `atan2`, which keeps full precision
  near the poles, and the arctangent takes the quadrant into account. At a pole,
  any $\lambda$ is the same point.

:::

## Parameters

| Parameter  | Type                                                                      | Description                                                          |
| ---------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `x`        | `number`                                                                  | Distance east of the centre in **m** (finite, on the map).           |
| `y`        | `number`                                                                  | Distance north of the centre in **m** (finite, on the map).          |
| `R`        | `number`                                                                  | Radius $R$ of the sphere in **m** (finite, > 0).                     |
| `options?` | [`AzimuthalOptionsInterface`](../interfaces/AzimuthalOptionsInterface.md) | `phi0` and `lambda0`, the map's centre (radians, both default to 0). |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)

The point on the sphere, `{ phi, lambda }` in **radians**.

## Throws

If any input is not a finite number.

## Throws

If the point is more than $R$ from the centre, `phi0` is outside \[−π/2, π/2],
or `R <= 0`.

## Example

```ts
inverseOrthographic(2_542_125, 1_694_750, 3_389_500);
// ≈ { phi: 30° N, lambda: 60° E }, in radians
```

## See

- [orthographic](orthographic.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 20
