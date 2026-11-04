[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
stereographic

# Function: stereographic()

```ts
function stereographic(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: AzimuthalOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/stereographic.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/stereographic.ts#L65)

Project a point on a sphere with the **stereographic projection**: a conformal
map centred on any point, the usual choice for polar maps.

$$
\cos c = \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0),
\qquad
k = \frac{2}{1 + \cos c}
$$

$$
x = R\,k\cos\varphi\sin(\lambda - \lambda_0),
\qquad
y = R\,k\big(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)\big)
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\varphi_0$ and $\lambda_0$ are the map's centre (rad)
- $c$ is the point's angular distance from the centre (rad)
- $k$ is the map's scale at the point, the same in every direction
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- **Conformal**: angles and small shapes are kept, and every circle on the
  sphere is a circle (or a line) on the map. The scale is true at the centre and
  grows to $k$ away from it: a point at angular distance $c$ is $2R\tan(c/2)$
  from the centre, in its true direction.
- With $\varphi_0 = \pm\pi/2$ it's the **polar stereographic** projection, used
  for polar caps, such as those of Mars, and for sea ice on Earth.
- The whole sphere maps to the infinite plane except the centre's antipode,
  which is infinitely far away: it throws a `RangeError`, as does a point within
  rounding of it, about $10^{-15}$ rad.

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
// Mars's south polar cap: 80° S, 45° E, on a map centred on the south pole
stereographic(toRad(-80), toRad(45), 3_389_500, { phi0: toRad(-90) });
// ≈ { x: 419 375, y: 419 375 } m, 593 086 m from the pole
```

## See

- [inverseStereographic](inverseStereographic.md)
- [lambertAzimuthalEqualArea](lambertAzimuthalEqualArea.md)
- [orthographic](orthographic.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 21
