[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseMercator

# Function: inverseMercator()

```ts
function inverseMercator(
  x: number,
  y: number,
  R: number,
  options?: ProjectionOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/mercator.ts:120](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/mercator.ts#L120)

Find the point on a sphere for a point on a **Mercator** map: the inverse of
[mercator](mercator.md).

$$
\varphi = \arctan\sinh\frac{y}{R},
\qquad
\lambda = \lambda_0 + \frac{x}{R}
$$

**Units**

- Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
- Output: `{ phi, lambda }` in **radians**, with $\lambda$ in (−π, π].

::: info Notes

- Every $y$ has a latitude, so the whole map inverts; the poles are never
  reached.
- $\lambda$ is wrapped to (−π, π]: the map repeats every $2\pi R$ east–west.
- A square map, $2\pi R$ on each side, reaches $\arctan\sinh\pi \approx
  85.0511°$ north and south: the limit of web map tiles.

:::

## Parameters

| Parameter  | Type                                                                        | Description                                               |
| ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| `x`        | `number`                                                                    | Distance east of the origin in **m** (finite).            |
| `y`        | `number`                                                                    | Distance north of the origin in **m** (finite).           |
| `R`        | `number`                                                                    | Radius $R$ of the sphere in **m** (finite, > 0).          |
| `options?` | [`ProjectionOptionsInterface`](../interfaces/ProjectionOptionsInterface.md) | `lambda0`, the central meridian (radians, defaults to 0). |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)

The point on the sphere, `{ phi, lambda }` in **radians**.

## Throws

If any input is not a finite number.

## Throws

If `R <= 0`.

## Example

```ts
// The top of a square web map
inverseMercator(0, Math.PI * 6_378_137, 6_378_137).phi; // ≈ 1.4844 rad, 85.0511°
```

## See

- [mercator](mercator.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 7
