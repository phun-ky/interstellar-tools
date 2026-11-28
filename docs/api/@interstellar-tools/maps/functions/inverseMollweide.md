[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseMollweide

# Function: inverseMollweide()

```ts
function inverseMollweide(
  x: number,
  y: number,
  R: number,
  options?: ProjectionOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/mollweide.ts:212](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/mollweide.ts#L212)

Find the point on a sphere for a point on a **Mollweide** map: the inverse of
[mollweide](mollweide.md).

$$
\theta = \arcsin\frac{y}{\sqrt2 R},
\qquad
\varphi = \arcsin\frac{2\theta + \sin 2\theta}{\pi},
\qquad
\lambda = \lambda_0 + \frac{\pi x}{2\sqrt2 R\cos\theta}
$$

**Units**

- Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
- Output: `{ phi, lambda }` in **radians**, with $\lambda$ in (−π, π].

::: info Notes

- No iteration is needed this way round. Near a pole it works with the angles
  from the pole, as [mollweide](mollweide.md) does, so $\varphi$ comes back to
  within about $10^{-12}$ rad even there: what $y$, rounded so close to $\sqrt2
  R$, still tells apart. $\lambda$ is less certain so near a pole, but the
  parallels are so short there that the point is still within about $10^{-12} R$
  along them.
- Only points inside the ellipse have an inverse: a point outside it throws a
  `RangeError`. Near a pole the ellipse narrows faster than `y` can say where it
  is, so points that rounding puts just outside it are taken as on its edge: up
  to about $10^{-7} R$ outside, right at the pole.
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

- If any input is not a finite number.
- If the point is outside the map's ellipse, or `R <= 0`.

## Example

```ts
inverseMollweide(2 * Math.SQRT2, 0, 1); // { phi: 0, lambda: π }
```

## See

- [mollweide](mollweide.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 31
