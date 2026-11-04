[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseStereographic

# Function: inverseStereographic()

```ts
function inverseStereographic(
  x: number,
  y: number,
  R: number,
  options?: AzimuthalOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/stereographic.ts:124](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/stereographic.ts#L124)

Find the point on a sphere for a point on a **stereographic** map: the inverse
of [stereographic](stereographic.md).

$$
\rho = \sqrt{x^2 + y^2},
\qquad
c = 2\arctan\frac{\rho}{2R}
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

- Every point on the plane has an inverse; the farther from the centre, the
  closer it is to the centre's antipode.
- $\varphi$ and $\lambda$ are found with `atan2`, which keeps full precision
  near the poles, and the arctangent takes the quadrant into account. At a pole,
  any $\lambda$ is the same point.

:::

## Parameters

| Parameter  | Type                                                                      | Description                                                          |
| ---------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `x`        | `number`                                                                  | Distance east of the centre in **m** (finite).                       |
| `y`        | `number`                                                                  | Distance north of the centre in **m** (finite).                      |
| `R`        | `number`                                                                  | Radius $R$ of the sphere in **m** (finite, > 0).                     |
| `options?` | [`AzimuthalOptionsInterface`](../interfaces/AzimuthalOptionsInterface.md) | `phi0` and `lambda0`, the map's centre (radians, both default to 0). |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)

The point on the sphere, `{ phi, lambda }` in **radians**.

## Throws

If any input is not a finite number.

## Throws

If `phi0` is outside \[−π/2, π/2], or `R <= 0`.

## Example

```ts
inverseStereographic(419_375, 419_375, 3_389_500, { phi0: toRad(-90) });
// ≈ { phi: 80° S, lambda: 45° E }, in radians
```

## See

- [stereographic](stereographic.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 21
