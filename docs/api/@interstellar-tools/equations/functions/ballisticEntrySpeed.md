[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / ballisticEntrySpeed

# Function: ballisticEntrySpeed()

```ts
function ballisticEntrySpeed(
  h: number,
  VE: number,
  gamma: number,
  beta: number,
  rho0: number,
  H: number
): number;
```

Defined in:
[entry/ballistic-entry-speed.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/entry/ballistic-entry-speed.ts#L57)

Compute the **speed of a ballistic entry** at an altitude, with the Allen–Eggers
solution.

$$
V(h) = V_E \exp\left(-\frac{\rho_0 H}{2\beta\sin\lvert\gamma\rvert}\, e^{-h/H}\right)
$$

Where:

- $V_E$ is the speed at entry (m/s)
- $\gamma$ is the flight-path angle, constant along the straight path (rad)
- $\beta$ is the ballistic coefficient (kg/m²)
- $\rho_0$ and $H$ describe an exponential atmosphere, $\rho = \rho_0 e^{-h/H}$

**Units**

- Inputs: `h` and `H` in **m**, `VE` in **m/s**, `gamma` in **radians**, `beta`
  in **kg/m²**, `rho0` in **kg/m³**.
- Output: $V$ in **m/s**.

::: info Notes

- Assumes drag dominates: no lift, no gravity, and a straight path at a constant
  angle. That holds well for steep, fast entries of non-lifting bodies.
- The deceleration at any altitude is $\rho V^2 / (2\beta)$; its peak is
  [ballisticPeakDeceleration](ballisticPeakDeceleration.md), at
  [ballisticPeakDecelerationAltitude](ballisticPeakDecelerationAltitude.md).
- `gamma` can be given as negative (descending, the usual convention) or
  positive: only its size is used.
- Earth's lower atmosphere is roughly $\rho_0 = 1.225$ kg/m³ with $H \approx
  7.2$ km. A single exponential is a rough fit; see the density models in
  [#226](https://github.com/phun-ky/interstellar-tools/issues/226).

:::

## Parameters

| Parameter | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| `h`       | `number` | Altitude $h$ in **m** (finite).                                                    |
| `VE`      | `number` | Entry speed $V_E$ in **m/s** (finite, > 0).                                        |
| `gamma`   | `number` | Flight-path angle $\gamma$ in **radians** (finite, non-zero, within \[-π/2, π/2]). |
| `beta`    | `number` | Ballistic coefficient $\beta$ in **kg/m²** (finite, > 0).                          |
| `rho0`    | `number` | Reference density $\rho_0$ in **kg/m³** (finite, > 0).                             |
| `H`       | `number` | Scale height $H$ in **m** (finite, > 0).                                           |

## Returns

`number`

Speed $V$ in **m/s**.

## Throws

If any input is not a finite number.

## Throws

If `VE`, `beta`, `rho0` or `H` is `<= 0`, or `gamma` is zero or past vertical.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A 322 kg/m² capsule entering at 11 km/s, 6.5° below horizontal
const v = ballisticEntrySpeed(
  40_000,
  11_000,
  ((-6.5 * Math.PI) / 180) as Radians,
  322,
  1.225,
  7200
);
// v ≈ 6.9 km/s at 40 km
```

## See

- [ballisticCoefficient](ballisticCoefficient.md)
- [ballisticPeakDeceleration](ballisticPeakDeceleration.md)
- https://en.wikipedia.org/wiki/Atmospheric_entry Atmospheric entry
