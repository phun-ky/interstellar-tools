[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
sinusoidal

# Function: sinusoidal()

```ts
function sinusoidal(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: ProjectionOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/sinusoidal.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/sinusoidal.ts#L64)

Project a point on a sphere with the **sinusoidal projection**: an equal-area
map, with every parallel at its true length.

$$
x = R\,(\lambda - \lambda_0)\cos\varphi,
\qquad
y = R\,\varphi
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\lambda_0$ is the central meridian (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- **Equal-area**: a region's area on the map is its area on the sphere, so it
  suits geology, coverage and density maps. Shapes shear away from the central
  meridian and the equator.
- Every parallel is drawn at its true length, and so is the central meridian.
  The other meridians are sine curves, which meet at the poles: the map is $2\pi
  R$ wide and $\pi R$ tall.
- Global planetary mosaics often use it, for example of Mars and the Moon.
- $\lambda - \lambda_0$ is wrapped to (−π, π], so the map is centred on the
  central meridian.

:::

## Parameters

| Parameter  | Type                                                                        | Description                                                  |
| ---------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md)                            | Latitude $\varphi$ in **radians** (finite, in \[−π/2, π/2]). |
| `lambda`   | [`Radians`](../../types/type-aliases/Radians.md)                            | Longitude $\lambda$ in **radians** (finite).                 |
| `R`        | `number`                                                                    | Radius $R$ of the sphere in **m** (finite, > 0).             |
| `options?` | [`ProjectionOptionsInterface`](../interfaces/ProjectionOptionsInterface.md) | `lambda0`, the central meridian (radians, defaults to 0).    |

## Returns

[`ProjectedPointInterface`](../interfaces/ProjectedPointInterface.md)

The point on the map, `{ x, y }` in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` is outside \[−π/2, π/2], or `R <= 0`.

## Example

```ts
// 60° N, 90° E on a 1 737.4 km Moon: the parallel is half as long as the equator
sinusoidal(toRad(60), toRad(90), 1_737_400);
// ≈ { x: 1 364 551, y: 1 819 401 } m
```

## See

- [inverseSinusoidal](inverseSinusoidal.md)
- [mollweide](mollweide.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 30
