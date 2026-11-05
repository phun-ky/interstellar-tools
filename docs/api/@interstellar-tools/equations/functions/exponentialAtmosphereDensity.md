[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / exponentialAtmosphereDensity

# Function: exponentialAtmosphereDensity()

```ts
function exponentialAtmosphereDensity(h: number): number;
```

Defined in:
[orbits/exponential-atmosphere-density.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/exponential-atmosphere-density.ts#L93)

The **density of Earth's atmosphere** at a height, from the exponential model:
within each band of heights, the density falls by a factor of $e$ every scale
height. It's the quick estimate for drag on a satellite.

$$
\rho = \rho_0 \, e^{-(h - h_0)/H}
$$

Where:

- $h$ is the height above the surface (m)
- $h_0$ is the base of the band $h$ falls in, $\rho_0$ the density there
  (kg/m³), and $H$ the band's scale height, from Vallado's table 8-4: 28 bands
  from the ground to 1 000 km

**Units**

- Input: `h` in **m**.
- Output: $\rho$ in **kg/m³**.

::: info Notes

- **An average.** The table is the CIRA-72 reference atmosphere at moderate
  solar activity. Above about 200 km, the real density swings by a factor of ten
  between solar minimum and maximum, and between day and night: use a model with
  solar activity, such as NRLMSISE-00, for anything more than an estimate.
- Above 1 000 km, the last band's scale height carries on.
- Feed it to [atmosphericDragAcceleration](atmosphericDragAcceleration.md) for
  the drag on a satellite.

:::

::: practice The ISS, 420 km up

**2.6 × 10⁻¹² kg/m³**

_A trillionth of the air at sea level_

Thin enough to orbit through, thick enough that the ISS loses a couple of
kilometres of height a month and has to be boosted back up.

```ts
exponentialAtmosphereDensity(420_000); // ≈ 2.647e-12 kg/m³
```

:::

## Parameters

| Parameter | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `h`       | `number` | Height above the surface $h$ in **m** (finite, >= 0). |

## Returns

`number`

The density $\rho$ in **kg/m³**.

## Throws

If `h` is not a finite number.

## Throws

If `h < 0`.

## Example

```ts
// Vallado, example 8-4: 747.2119 km up
exponentialAtmosphereDensity(747_211.9); // ≈ 2.1219854e-14 kg/m³
```

## See

- [atmosphericDragAcceleration](atmosphericDragAcceleration.md)
- Vallado, _Fundamentals of Astrodynamics and Applications_, 4th ed. (2013),
  table 8-4 and example 8-4
