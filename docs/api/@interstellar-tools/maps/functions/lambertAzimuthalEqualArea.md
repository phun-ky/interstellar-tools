[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
lambertAzimuthalEqualArea

# Function: lambertAzimuthalEqualArea()

```ts
function lambertAzimuthalEqualArea(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: AzimuthalOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/lambert-azimuthal-equal-area.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/lambert-azimuthal-equal-area.ts#L64)

Project a point on a sphere with the **Lambert azimuthal equal-area
projection**: an equal-area map centred on any point, with true directions from
the centre.

$$
\cos c = \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0),
\qquad
k' = \sqrt{\frac{2}{1 + \cos c}}
$$

$$
x = R\,k'\cos\varphi\sin(\lambda - \lambda_0),
\qquad
y = R\,k'\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\varphi_0$ and $\lambda_0$ are the map's centre (rad)
- $c$ is the point's angular distance from the centre (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- **Equal-area**: a region's area on the map is its area on the sphere. A point
  at angular distance $c$ from the centre is $2R\sin(c/2)$ from it on the map,
  in its true direction, so shapes are kept near the centre and squashed towards
  the edge.
- The whole sphere fits in a circle of radius $2R$, and one hemisphere in a
  circle of radius $\sqrt2 R$. Polar caps and the hemispheres of planets and
  moons are often mapped with it.
- The centre's antipode is the whole edge circle, so it has no single place on
  the map: it throws a `RangeError`, as does a point within rounding of it,
  about $10^{-15}$ rad. $1 + \cos c$ is computed in haversine form, so points
  close to the antipode keep their precision.

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

If `phi` or `phi0` is outside \[−π/2, π/2], `R <= 0`, or the point is the
centre's antipode.

## Example

```ts
// The Moon's far side, centred on 0° N, 180° E: the limb, 90° from the centre, is √2 R away
lambertAzimuthalEqualArea(0 as Radians, toRad(90), 1_737_400, {
  lambda0: toRad(180)
});
// ≈ { x: −2 457 055, y: 0 } m
```

## See

- [inverseLambertAzimuthalEqualArea](inverseLambertAzimuthalEqualArea.md)
- [stereographic](stereographic.md)
- [orthographic](orthographic.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 24
