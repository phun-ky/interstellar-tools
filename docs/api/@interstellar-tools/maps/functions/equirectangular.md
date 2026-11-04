[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
equirectangular

# Function: equirectangular()

```ts
function equirectangular(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: EquirectangularOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/equirectangular.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L88)

Project a point on a sphere with the **equirectangular projection**: the simple
cylindrical map, with latitude and longitude spaced evenly.

$$
x = R\,(\lambda - \lambda_0)\cos\varphi_1,
\qquad
y = R\,(\varphi - \varphi_0)
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\lambda_0$ is the central meridian and $\varphi_0$ the latitude of the origin
  (rad)
- $\varphi_1$ is the standard parallel, where the scale is true (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- The usual format for global mosaics and elevation models, where it's called
  **simple cylindrical**: a grid in degrees is a grid on the map. With
  $\varphi_1 = 0$ it's the plate carrée, twice as wide as tall.
- Distances are true along every meridian, and along the standard parallels
  $\pm\varphi_1$ east–west. Elsewhere east–west distances are stretched by
  $\cos\varphi_1/\cos\varphi$, so it keeps neither angles nor areas.
- Choose $\varphi_1$ near the latitude of interest for a regional map: Mars
  mosaics of mid-latitude sites, for example.
- $\lambda - \lambda_0$ is wrapped to (−π, π].

:::

## Parameters

| Parameter  | Type                                                                                  | Description                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md)                                      | Latitude $\varphi$ in **radians** (finite, in \[−π/2, π/2]).                                                                        |
| `lambda`   | [`Radians`](../../types/type-aliases/Radians.md)                                      | Longitude $\lambda$ in **radians** (finite).                                                                                        |
| `R`        | `number`                                                                              | Radius $R$ of the sphere in **m** (finite, > 0).                                                                                    |
| `options?` | [`EquirectangularOptionsInterface`](../interfaces/EquirectangularOptionsInterface.md) | `lambda0`, the central meridian, `phi0`, the latitude of the origin, and `phi1`, the standard parallel (radians, all default to 0). |

## Returns

[`ProjectedPointInterface`](../interfaces/ProjectedPointInterface.md)

The point on the map, `{ x, y }` in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` or `phi0` is outside \[−π/2, π/2], `phi1` outside (−π/2, π/2), or
`R <= 0`.

## Example

```ts
// 10° N, 20° E on a 3 389.5 km Mars, true to scale at 45°
equirectangular(toRad(10), toRad(20), 3_389_500, { phi1: toRad(45) });
// ≈ { x: 837 km, y: 592 km }
```

## See

- [inverseEquirectangular](inverseEquirectangular.md)
- [mercator](mercator.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 12
