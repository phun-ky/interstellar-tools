[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
mercator

# Function: mercator()

```ts
function mercator(
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: ProjectionOptionsInterface
): ProjectedPointInterface;
```

Defined in:
[projections/mercator.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/mercator.ts#L59)

Project a point on a sphere with the **Mercator projection**: the conformal
cylindrical map, which keeps angles and shapes locally true.

$$
x = R\,(\lambda - \lambda_0),
\qquad
y = R\ln\tan\!\left(\frac{\pi}{4} + \frac{\varphi}{2}\right)
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $\lambda_0$ is the central meridian (rad)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: angles in **radians**, `R` in **m**.
- Output: `{ x, y }` in **m**, with $x$ in (−πR, πR].

::: info Notes

- The scale is $\sec\varphi$ in every direction: true on the equator, twice as
  large at 60°, and without bound towards the poles. That's why Greenland looks
  as large as Africa. Angles stay true, so a line of constant compass bearing (a
  rhumb line) is straight.
- $y$ grows without bound towards the poles, so the poles themselves throw a
  `RangeError`. Maps clip the latitude: web maps (see
  [inverseMercator](inverseMercator.md)) stop at $\arctan\sinh\pi \approx
  85.0511°$, where the map is as tall as it is wide.
- $\lambda - \lambda_0$ is wrapped to (−π, π], so the map is centred on the
  central meridian.
- A sphere only: on an oblate body this is the spherical Mercator web maps use,
  not the ellipsoidal one.

:::

## Parameters

| Parameter  | Type                                                                        | Description                                                 |
| ---------- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md)                            | Latitude $\varphi$ in **radians** (finite, in (−π/2, π/2)). |
| `lambda`   | [`Radians`](../../types/type-aliases/Radians.md)                            | Longitude $\lambda$ in **radians** (finite).                |
| `R`        | `number`                                                                    | Radius $R$ of the sphere in **m** (finite, > 0).            |
| `options?` | [`ProjectionOptionsInterface`](../interfaces/ProjectionOptionsInterface.md) | `lambda0`, the central meridian (radians, defaults to 0).   |

## Returns

[`ProjectedPointInterface`](../interfaces/ProjectedPointInterface.md)

The point on the map, `{ x, y }` in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` is not in (−π/2, π/2), or `R <= 0`.

## Example

```ts
// The edge of a web map: 180° E, 85.0511° N on a 6 378 137 m sphere
mercator(toRad(85.05112878), toRad(180), 6_378_137);
// ≈ { x: 20 037 508, y: 20 037 508 } m
```

## See

- [inverseMercator](inverseMercator.md)
- [equirectangular](equirectangular.md)
- https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working
  manual, ch. 7
