[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / ballisticPeakDeceleration

# Function: ballisticPeakDeceleration()

```ts
function ballisticPeakDeceleration(
  VE: number,
  gamma: number,
  H: number
): number;
```

Defined in:
[entry/ballistic-peak-deceleration.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/entry/ballistic-peak-deceleration.ts#L68)

Compute the **peak deceleration of a ballistic entry**, with the Allen–Eggers
solution.

$$
a_\text{max} = \frac{V_E^2 \sin\lvert\gamma\rvert}{2\,e\,H}
$$

reached when the speed has fallen to $V_E / \sqrt{e} \approx 0.61\,V_E$.

Where:

- $V_E$ is the speed at entry (m/s)
- $\gamma$ is the flight-path angle (rad)
- $H$ is the atmosphere's scale height (m)
- $e$ is Euler's number

**Units**

- Inputs: `VE` in **m/s**, `gamma` in **radians**, `H` in **m**.
- Output: $a_\text{max}$ in **m/s²**. Divide by 9.80665 for g.

::: info Notes

- The peak doesn't depend on the vehicle's mass, size or drag: a heavier one
  just reaches it lower down. Only the entry speed and angle matter.
- It grows with $\sin\lvert\gamma\rvert$: a steeper entry is a harder one.
- Same assumptions as [ballisticEntrySpeed](ballisticEntrySpeed.md): no lift, no
  gravity, a straight path. A lifting entry spreads the deceleration out and
  peaks much lower.

:::

::: practice Apollo 11, coming home

**35.8 g**

_A ballistic entry at 11.03 km/s and −6.48°, with H = 7.2 km_

The crew felt 6.56 g at the peak. The command module flew with lift, banking to
control it, so it slowed down more gradually than a ballistic body would.

```ts
ballisticPeakDeceleration(11_032, toRad(-6.48), 7200) / 9.80665; // ≈ 35.8 g
```

:::

## Parameters

| Parameter | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| `VE`      | `number` | Entry speed $V_E$ in **m/s** (finite, > 0).                                        |
| `gamma`   | `number` | Flight-path angle $\gamma$ in **radians** (finite, non-zero, within \[-π/2, π/2]). |
| `H`       | `number` | Scale height $H$ in **m** (finite, > 0).                                           |

## Returns

`number`

Peak deceleration $a_\text{max}$ in **m/s²**.

## Throws

If any input is not a finite number.

## Throws

If `VE <= 0`, `H <= 0`, or `gamma` is zero or past vertical.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// Entering at 7.8 km/s, 2° below horizontal
const a = ballisticPeakDeceleration(
  7800,
  ((-2 * Math.PI) / 180) as Radians,
  7200
);
// a ≈ 54 m/s², about 5.5 g
```

## See

- [ballisticPeakDecelerationAltitude](ballisticPeakDecelerationAltitude.md)
- [ballisticEntrySpeed](ballisticEntrySpeed.md)
