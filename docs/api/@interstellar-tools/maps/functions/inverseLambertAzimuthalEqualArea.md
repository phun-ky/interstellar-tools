[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseLambertAzimuthalEqualArea

# Function: inverseLambertAzimuthalEqualArea()

```ts
function inverseLambertAzimuthalEqualArea(
  x: number,
  y: number,
  R: number,
  options?: AzimuthalOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/lambert-azimuthal-equal-area.ts:124](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/lambert-azimuthal-equal-area.ts#L124)

Find the point on a sphere for a point on a **Lambert azimuthal equal-area**
map: the inverse of [lambertAzimuthalEqualArea](lambertAzimuthalEqualArea.md).

$$
\rho = \sqrt{x^2 + y^2},
\qquad
c = 2\arcsin\frac{\rho}{2R}
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

- Only points within $2R$ of the centre have an inverse: a point beyond that
  circle throws a `RangeError`. The circle itself is the centre's antipode.
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

If the point is more than $2R$ from the centre, `phi0` is outside \[−π/2, π/2],
or `R <= 0`.

## Example

```ts
inverseLambertAzimuthalEqualArea(-2_457_055, 0, 1_737_400, {
  lambda0: toRad(180)
});
// ≈ { phi: 0, lambda: 90° E }, in radians
```

## See

- [lambertAzimuthalEqualArea](lambertAzimuthalEqualArea.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 24
