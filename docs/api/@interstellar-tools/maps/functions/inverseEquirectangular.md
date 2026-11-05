[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseEquirectangular

# Function: inverseEquirectangular()

```ts
function inverseEquirectangular(
  x: number,
  y: number,
  R: number,
  options?: EquirectangularOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/equirectangular.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L150)

Find the point on a sphere for a point on an **equirectangular** map: the
inverse of [equirectangular](equirectangular.md).

$$
\varphi = \varphi_0 + \frac{y}{R},
\qquad
\lambda = \lambda_0 + \frac{x}{R\cos\varphi_1}
$$

**Units**

- Inputs: `x`, `y` and `R` in **m**, the options in **radians**.
- Output: `{ phi, lambda }` in **radians**, with $\lambda$ in (−π, π].

::: info Notes

- The map ends at the poles: a `y` beyond them throws a `RangeError`.
- $\lambda$ is wrapped to (−π, π]: the map repeats east–west.

:::

## Parameters

| Parameter  | Type                                                                                  | Description                                                                 |
| ---------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `x`        | `number`                                                                              | Distance east of the origin in **m** (finite).                              |
| `y`        | `number`                                                                              | Distance north of the origin in **m** (finite, on the map).                 |
| `R`        | `number`                                                                              | Radius $R$ of the sphere in **m** (finite, > 0).                            |
| `options?` | [`EquirectangularOptionsInterface`](../interfaces/EquirectangularOptionsInterface.md) | `lambda0`, `phi0` and `phi1`, as for [equirectangular](equirectangular.md). |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)

The point on the sphere, `{ phi, lambda }` in **radians**.

## Throws

If any input is not a finite number.

## Throws

If `y` is beyond a pole, `phi0` is outside \[−π/2, π/2], `phi1` outside (−π/2,
π/2), or `R <= 0`.

## Example

```ts
inverseEquirectangular(836_620, 591_579, 3_389_500, { phi1: toRad(45) });
// ≈ { phi: 10° N, lambda: 20° E }, in radians
```

## See

- [equirectangular](equirectangular.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 12
