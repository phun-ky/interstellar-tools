[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hillSphereRadius

# Function: hillSphereRadius()

```ts
function hillSphereRadius(a: number, e: number, m: number, M: number): number;
```

Defined in:
[orbits/hill-sphere-radius.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/hill-sphere-radius.ts#L62)

Compute the **Hill sphere** radius: how far from a body its own gravity can hold
a moon or a spacecraft against the pull of the body it orbits.

$$
r_H \approx a(1 - e)\sqrt[3]{\frac{m}{3M}}
$$

Where:

- $a$ is the semi-major axis of the body's orbit around the larger one (m)
- $e$ is that orbit's eccentricity, which shrinks the sphere at the closest
  approach
- $m$ is the body's mass, $M$ the larger body's

**Units**

- Inputs: `a` in **m**; `m` and `M` in the same unit, kg or gravitational
  parameters in m³/s².
- Output: $r_H$ in **m**.

::: info Notes

- The Hill sphere reaches about as far as L1 and L2
  ([lagrangePoints](lagrangePoints.md)): it's where the body's pull and the tide
  of the larger one balance.
- Stable orbits lie well inside it, within about a half to a third of it.
- It's larger than the [sphereOfInfluenceRadius](sphereOfInfluenceRadius.md),
  which marks where it's simpler to treat a spacecraft as orbiting the body than
  the larger one.

:::

::: practice Earth's Hill sphere

**1.5 million km**

_How far Earth can hold a moon, against the Sun_

The Moon, at 384 400 km, is a quarter of the way out; JWST, at L2, is right at
the edge.

```ts
hillSphereRadius(1.495978707e11, 0.0167, 3.986004418e14, 1.32712440041e20); // ≈ 1.47e9 m
```

:::

## Parameters

| Parameter | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| `a`       | `number` | Semi-major axis $a$ of the body's orbit in **m** (finite, > 0).     |
| `e`       | `number` | Eccentricity $e$ of the orbit (finite, in \[0, 1)).                 |
| `m`       | `number` | Mass (or gravitational parameter) of the body (finite, > 0).        |
| `M`       | `number` | Mass (or gravitational parameter) of the larger body (finite, > 0). |

## Returns

`number`

The Hill sphere radius $r_H$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `a <= 0`, `e` is outside \[0, 1), `m <= 0` or `M <= 0`.

## Example

```ts
// The Moon's, against Earth: about 58 100 km
hillSphereRadius(384_400_000, 0.0549, 4.9028e12, 3.986004418e14);
```

## See

- [sphereOfInfluenceRadius](sphereOfInfluenceRadius.md)
- [lagrangePoints](lagrangePoints.md)
