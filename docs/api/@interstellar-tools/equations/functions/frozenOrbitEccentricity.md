[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / frozenOrbitEccentricity

# Function: frozenOrbitEccentricity()

```ts
function frozenOrbitEccentricity(
  J2: number,
  J3: number,
  Re: number,
  a: number,
  i: Radians
): number;
```

Defined in:
[orbits/frozen-orbit-eccentricity.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/frozen-orbit-eccentricity.ts#L54)

The eccentricity of a **frozen orbit**: the small eccentricity at which the pear
shape of the planet, J3, and its bulge, J2, balance, so the perigee stays put at
90° and the orbit's height over each latitude stays the same, orbit after orbit.
Earth-observation missions fly them for steady imaging heights.

$$
e_f \approx -\frac{J_3}{2 J_2}\,\frac{R}{a}\,\sin i
$$

with the argument of perigee frozen at $\omega = 90^\circ$.

Where:

- $J_2$, $J_3$ are the planet's second and third zonal harmonics: 1.08263 × 10⁻³
  and −2.53266 × 10⁻⁶ for Earth
- $R$ is the planet's equatorial radius, and $a$ the semi-major axis (same unit)
- $i$ is the inclination (rad)

**Units**

- Inputs: `Re` and `a` in the same unit, `i` in **radians**.
- Output: $e_f$, dimensionless; negative means the perigee freezes at 270°
  instead, with eccentricity $|e_f|$.

::: info Notes

- Earth's J3 is negative, so its frozen orbits have their perigee in the north,
  at 90°: about 0.001 for low orbits.
- First order in J2 and J3, away from the critical inclinations 63.4° and
  116.6°, where the perigee doesn't drift anyway.

:::

## Parameters

| Parameter | Type                                             | Description                                             |
| --------- | ------------------------------------------------ | ------------------------------------------------------- |
| `J2`      | `number`                                         | The planet's second zonal harmonic $J_2$ (finite, ≠ 0). |
| `J3`      | `number`                                         | The planet's third zonal harmonic $J_3$ (finite).       |
| `Re`      | `number`                                         | The planet's equatorial radius $R$ (finite, > 0).       |
| `a`       | `number`                                         | Semi-major axis $a$, in the unit of `Re` (finite, > 0). |
| `i`       | [`Radians`](../../types/type-aliases/Radians.md) | Inclination $i$ in **radians** (finite).                |

## Returns

`number`

The frozen eccentricity $e_f$.

## Throws

If any input is not a finite number.

## Throws

If `J2` is 0, or `Re` or `a` is not > 0.

## Example

```ts
// Earth, 700 km up at 98.2°
frozenOrbitEccentricity(
  1.08262668e-3,
  -2.53265649e-6,
  6_378_137,
  7_078_137,
  toRad(98.2)
);
// ≈ 0.00104
```

## See

- [j2ArgumentOfPerigeeRate](j2ArgumentOfPerigeeRate.md)
- [sunSynchronousInclination](sunSynchronousInclination.md)
