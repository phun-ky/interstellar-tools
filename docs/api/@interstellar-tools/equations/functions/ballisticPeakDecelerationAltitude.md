[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / ballisticPeakDecelerationAltitude

# Function: ballisticPeakDecelerationAltitude()

```ts
function ballisticPeakDecelerationAltitude(
  gamma: number,
  beta: number,
  rho0: number,
  H: number
): number;
```

Defined in:
[entry/ballistic-peak-deceleration-altitude.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/entry/ballistic-peak-deceleration-altitude.ts#L52)

Compute the **altitude of peak deceleration** in a ballistic entry, with the
Allen–Eggers solution.

$$
h^\ast = H \ln\frac{\rho_0 H}{\beta \sin\lvert\gamma\rvert}
$$

Where:

- $\beta$ is the ballistic coefficient (kg/m²)
- $\gamma$ is the flight-path angle (rad)
- $\rho_0$ and $H$ describe an exponential atmosphere, $\rho = \rho_0 e^{-h/H}$

**Units**

- Inputs: `gamma` in **radians**, `beta` in **kg/m²**, `rho0` in **kg/m³**, `H`
  in **m**.
- Output: $h^\ast$ in **m**.

::: info Notes

- Unlike the size of the peak
  ([ballisticPeakDeceleration](ballisticPeakDeceleration.md)), its altitude does
  depend on the vehicle: a higher $\beta$ peaks lower down.
- A negative result means the vehicle would reach the surface before its
  deceleration peaks: it hits the ground still fast.
- Same assumptions as [ballisticEntrySpeed](ballisticEntrySpeed.md).

:::

## Parameters

| Parameter | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| `gamma`   | `number` | Flight-path angle $\gamma$ in **radians** (finite, non-zero, within \[-π/2, π/2]). |
| `beta`    | `number` | Ballistic coefficient $\beta$ in **kg/m²** (finite, > 0).                          |
| `rho0`    | `number` | Reference density $\rho_0$ in **kg/m³** (finite, > 0).                             |
| `H`       | `number` | Scale height $H$ in **m** (finite, > 0).                                           |

## Returns

`number`

Altitude of peak deceleration $h^\ast$ in **m** (negative if below the surface).

## Throws

If any input is not a finite number.

## Throws

If `beta`, `rho0` or `H` is `<= 0`, or `gamma` is zero or past vertical.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A 322 kg/m² capsule, 6.5° below horizontal, in Earth's atmosphere
const h = ballisticPeakDecelerationAltitude(
  ((-6.5 * Math.PI) / 180) as Radians,
  322,
  1.225,
  7200
);
// h ≈ 39.5 km
```

## See

- [ballisticPeakDeceleration](ballisticPeakDeceleration.md)
- [ballisticEntrySpeed](ballisticEntrySpeed.md)
