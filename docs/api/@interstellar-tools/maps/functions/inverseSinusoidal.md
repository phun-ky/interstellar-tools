[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseSinusoidal

# Function: inverseSinusoidal()

```ts
function inverseSinusoidal(
  x: number,
  y: number,
  R: number,
  options?: ProjectionOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/sinusoidal.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/sinusoidal.ts#L118)

Find the point on a sphere for a point on a **sinusoidal** map: the inverse of
[sinusoidal](sinusoidal.md).

$$
\varphi = \frac{y}{R},
\qquad
\lambda = \lambda_0 + \frac{x}{R\cos\varphi}
$$

**Units**

- Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
- Output: `{ phi, lambda }` in **radians**, with $\lambda$ in (−π, π].

::: info Notes

- Only points on the map have an inverse: a `y` beyond a pole, or an `x` beyond
  the edge meridians, $|x| > \pi R\cos\varphi$, throws a `RangeError`.
- Every longitude meets at a pole, so there $\lambda$ is $\lambda_0$.

:::

## Parameters

| Parameter  | Type                                                                        | Description                                                 |
| ---------- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `x`        | `number`                                                                    | Distance east of the origin in **m** (finite, on the map).  |
| `y`        | `number`                                                                    | Distance north of the origin in **m** (finite, on the map). |
| `R`        | `number`                                                                    | Radius $R$ of the sphere in **m** (finite, > 0).            |
| `options?` | [`ProjectionOptionsInterface`](../interfaces/ProjectionOptionsInterface.md) | `lambda0`, the central meridian (radians, defaults to 0).   |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)

The point on the sphere, `{ phi, lambda }` in **radians**.

## Throws

If any input is not a finite number.

## Throws

If the point is off the map, or `R <= 0`.

## Example

```ts
inverseSinusoidal(1_364_551, 1_819_401, 1_737_400);
// ≈ { phi: 60° N, lambda: 90° E }, in radians
```

## See

- [sinusoidal](sinusoidal.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 30
