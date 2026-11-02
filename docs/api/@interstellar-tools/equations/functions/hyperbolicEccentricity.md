[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hyperbolicEccentricity

# Function: hyperbolicEccentricity()

```ts
function hyperbolicEccentricity(
  vInfinity: number,
  rp: number,
  mu: number
): number;
```

Defined in:
[orbits/hyperbolic-eccentricity.ts:55](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/hyperbolic-eccentricity.ts#L55)

Compute the **eccentricity of a hyperbola** from the excess speed and the
periapsis distance.

$$
e = 1 + \frac{r_p\, v_\infty^2}{\mu}
$$

Where:

- $r_p$ is the periapsis distance from the body's centre (m)
- $v_\infty$ is the hyperbolic excess speed (m/s)
- $\mu$ is the body's gravitational parameter (m³/s²)

**Units**

- Inputs: `vInfinity` in **m/s**, `rp` in **m**, `mu` in **m³/s²**.
- Output: $e$ dimensionless, > 1.

::: info Notes

- From $r_p = a(1 - e)$ with $a = -\mu / v_\infty^2$.
- A slow, close pass gives $e$ just above 1, a nearly parabolic swing; a fast,
  distant one gives a large $e$ and a nearly straight path.
- The trajectory turns through $2\arcsin(1/e)$; see `gravityAssistTurningAngle`.

:::

::: practice Apollo 11, arriving at the Moon

**1.44**

_Approach hyperbola: 1.08 km/s excess speed, closest approach 113.9 km above the
surface_

```ts
hyperbolicEccentricity(1080, 1_737_400 + 113_900, 4.902800118e12); // ≈ 1.440
```

:::

## Parameters

| Parameter   | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `vInfinity` | `number` | Hyperbolic excess speed $v_\infty$ in **m/s** (finite, > 0). |
| `rp`        | `number` | Periapsis distance $r_p$ in **m** (finite, > 0).             |
| `mu`        | `number` | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).    |

## Returns

`number`

Eccentricity $e$ (> 1).

## Throws

If any input is not a finite number.

## Throws

If `vInfinity <= 0`, `rp <= 0` or `mu <= 0`.

## Example

```ts
// A Jupiter flyby: v∞ = 6 km/s, periapsis at 5 Jupiter radii
const e = hyperbolicEccentricity(6000, 5 * 71_492e3, 1.26686534e17);
// e ≈ 1.102
```

## See

- [hyperbolicSemiMajorAxis](hyperbolicSemiMajorAxis.md)
- [asymptoteTrueAnomaly](asymptoteTrueAnomaly.md)
