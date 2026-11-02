[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / stagnationHeatFlux

# Function: stagnationHeatFlux()

```ts
function stagnationHeatFlux(
  rho: number,
  V: number,
  Rn: number,
  k?: number
): number;
```

Defined in:
[entry/stagnation-heat-flux.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/entry/stagnation-heat-flux.ts#L47)

Compute the **convective heat flux at the stagnation point** of an entry
vehicle, with the Sutton–Graves relation.

$$
\dot q = k\,\sqrt{\frac{\rho}{R_n}}\;V^3
$$

Where:

- $\rho$ is the free-stream density (kg/m³)
- $R_n$ is the nose radius: the radius of curvature at the stagnation point (m)
- $V$ is the speed (m/s)
- $k$ depends on the atmosphere's composition: about $1.7415 \times 10^{-4}$
  kg$^{1/2}$/m for Earth's air and $1.9027 \times 10^{-4}$ for Mars

**Units**

- Inputs: `rho` in **kg/m³**, `V` in **m/s**, `Rn` in **m**, `k` in **kg^½/m**.
- Output: $\dot q$ in **W/m²**.

::: info Notes

- The $V^3$ is why returning from the Moon is so much harder on a heat shield
  than returning from Earth orbit: 11 km/s against 7.8 km/s is almost three
  times the heating.
- A blunter nose (larger $R_n$) heats less, which is why capsules have broad,
  rounded heat shields rather than sharp points.
- Convective heating only. At lunar return speeds the hot shock layer also
  radiates, which this doesn't include.

:::

## Parameters

| Parameter | Type     | Default value | Description                                                                   |
| --------- | -------- | ------------- | ----------------------------------------------------------------------------- |
| `rho`     | `number` | `undefined`   | Free-stream density $\rho$ in **kg/m³** (finite, > 0).                        |
| `V`       | `number` | `undefined`   | Speed $V$ in **m/s** (finite, > 0).                                           |
| `Rn`      | `number` | `undefined`   | Nose radius $R_n$ in **m** (finite, > 0).                                     |
| `k?`      | `number` | `1.7415e-4`   | Sutton–Graves constant $k$ (finite, > 0). Defaults to `1.7415e-4`, for Earth. |

## Returns

`number`

Stagnation-point heat flux $\dot q$ in **W/m²**.

## Throws

If any input is not a finite number.

## Throws

If any input is `<= 0`.

## Example

```ts
// 11 km/s at about 60 km (ρ ≈ 3 × 10⁻⁴ kg/m³), with a 4.7 m nose radius
const q = stagnationHeatFlux(3e-4, 11_000, 4.69);
// q ≈ 1.85 MW/m²
```

## See

- [ballisticEntrySpeed](ballisticEntrySpeed.md)
- https://en.wikipedia.org/wiki/Atmospheric_entry Atmospheric entry
