[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / zonalHarmonicsAcceleration

# Function: zonalHarmonicsAcceleration()

```ts
function zonalHarmonicsAcceleration(
  r: Vector3DTupleType,
  mu: number,
  Re: number,
  J: readonly number[]
): Vector3DTupleType;
```

Defined in:
[gravity/zonal-harmonics-acceleration.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/gravity/zonal-harmonics-acceleration.ts#L78)

The pull of a planet's **flattening and pear shape** on a satellite: the
acceleration from its zonal harmonics, $J_2$ and up, on top of the central
$-\mu\mathbf r/r^3$.

A planet isn't a sphere. Earth bulges at the equator, $J_2$, and is slightly
pear-shaped, $J_3$; the higher zonals are smaller ripples from pole to pole. The
bulge turns a satellite's orbit plane and its perigee, which is what makes
sun-synchronous orbits and frozen orbits possible.

$$
\mathbf a = \sum_{n \ge 2} \frac{\mu J_n}{r^2}\left(\frac{R}{r}\right)^n
\Big[\big((n + 1)P_n(u) + u\,P_n'(u)\big)\,\hat{\mathbf r} - P_n'(u)\,\hat{\mathbf z}\Big],
\qquad u = \frac{z}{r}
$$

Where:

- $\mathbf r$ is the position from the planet's centre, on axes with $z$ along
  its rotation axis (m)
- $\mu$ is the planet's gravitational parameter (m³/s²) and $R$ the reference
  radius of its $J_n$ (m)
- $P_n$ is the Legendre polynomial of degree $n$, and $P_n'$ its derivative

**Units**

- Inputs: `r` and `Re` in **m**, `mu` in **m³/s²**, `J` dimensionless.
- Output: the acceleration in **m/s²**, on the axes of `r`.

::: info Notes

- **Only the perturbation**: add the central acceleration $-\mu\mathbf r/r^3$
  for the full gravity.
- $J_2$ is a few thousandths of the central pull in low Earth orbit; $J_3$ to
  $J_6$ are each a few thousandths of $J_2$ or less.
- The $J_n$ belong with the reference radius they were fitted with: for EGM2008,
  6 378 136.3 m.
- Zonal harmonics only: the tesseral terms, which make gravity vary with
  longitude, matter for geostationary station-keeping and precise orbits, not
  for most satellite lifetimes.
- The series describes the field outside the planet; it doesn't converge inside
  it.

:::

::: practice J₂ on the ISS

**0.014 m/s²**

_420 km up, over 45° latitude_

A six-hundredth of the 8.6 m/s² of the central pull, and up to 0.025 m/s² over
the poles: enough to turn the ISS's orbit plane 5° a day westward.

```ts
const r = 6_798_000;
const at45 = [r * Math.SQRT1_2, 0, r * Math.SQRT1_2];
const a = zonalHarmonicsAcceleration(
  at45,
  3.986004418e14,
  6_378_136.3,
  [1.0826e-3]
);

Math.hypot(...a); // ≈ 0.0138 m/s²
```

:::

## Parameters

| Parameter | Type                                                                 | Description                                                                                                   |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Position $\mathbf r$ in **m**, from the planet's centre, with $z$ along its rotation axis (finite, not zero). |
| `mu`      | `number`                                                             | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).                                                     |
| `Re`      | `number`                                                             | Reference radius $R$ in **m** of the coefficients (finite, > 0).                                              |
| `J`       | readonly `number`\[]                                                 | The zonal coefficients $J_2, J_3, \ldots$ in order, from $J_2$ (finite numbers).                              |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

The acceleration in **m/s²**, without the central term.

## Throws

If `r` is not three finite numbers, or a number in `mu`, `Re` or `J` is not
finite.

## Throws

If `r` is zero, or `mu` or `Re` is not > 0.

## Example

```ts
// EGM2008's J2 to J6, at a satellite over the equator
zonalHarmonicsAcceleration(
  [7_000_000, 0, 0],
  3.986004415e14,
  6_378_136.3,
  [1.0826e-3, -2.5324e-6, -1.6199e-6, -2.2775e-7, 5.4067e-7]
); // ≈ [-0.0110, 0, 0]: toward the planet, from the bulge's extra mass under it
```

## See

- [j2NodalPrecessionRate](j2NodalPrecessionRate.md)
- [thirdBodyAcceleration](thirdBodyAcceleration.md)
- Vallado, _Fundamentals of Astrodynamics and Applications_, 4th ed. (2013), on
  the zonal harmonics
