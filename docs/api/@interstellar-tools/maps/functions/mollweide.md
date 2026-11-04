[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
mollweide

# Function: mollweide()

```ts
function mollweide(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: ProjectionOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/mollweide.ts:104](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/mollweide.ts#L104)

Project a point on a sphere with the **Mollweide projection**: an equal-area map
of the whole sphere inside an ellipse twice as wide as tall.

$$
2\theta + \sin 2\theta = \pi\sin\varphi,
\qquad
x = \frac{2\sqrt2}{\pi}R\,(\lambda - \lambda_0)\cos\theta,
\qquad
y = \sqrt2\,R\sin\theta
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\theta$ is an auxiliary angle, found with Newton's method (rad)
- $\lambda_0$ is the central meridian (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**.

::: info Notes

- **Equal-area**: a region's area on the map is its area on the sphere. The
  whole sphere fills an ellipse $4\sqrt2 R$ wide and $2\sqrt2 R$ tall, with
  straight parallels and elliptical meridians, which distorts shapes less near
  the edges than [sinusoidal](sinusoidal.md). Sky surveys, such as maps of the
  cosmic microwave background, use it.
- Newton's method slows down near the poles, where $2\theta + \sin 2\theta$
  flattens out; the solver starts closer there and falls back to bisection, so
  it always converges. The poles themselves are solved directly.
- $\lambda - \lambda_0$ is wrapped to (−π, π].

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
// The edge of the map: 180° E on the equator, and the north pole
mollweide(0 as Radians, Math.PI as Radians, 1); // { x: 2√2, y: 0 }
mollweide((Math.PI / 2) as Radians, 0 as Radians, 1); // { x: 0, y: √2 }
```

## See

- [inverseMollweide](inverseMollweide.md)
- [sinusoidal](sinusoidal.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 31
