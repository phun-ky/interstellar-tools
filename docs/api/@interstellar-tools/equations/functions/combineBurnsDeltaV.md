[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / combineBurnsDeltaV

# Function: combineBurnsDeltaV()

```ts
function combineBurnsDeltaV(
  v1: number,
  v2: number,
  deltaTheta: Radians
): number;
```

Defined in:
[manoeuvres/combine-burns-delta-v.ts:71](https://github.com/phun-ky/interstellar-tools/blob/5913e0f9278db38f2861e82332044588e9643757/packages/equations/src/categories/manoeuvres/combine-burns-delta-v.ts#L71)

**Combine non-collinear burns** (vector law / law of cosines for velocities).

**Definition**

$$
\Delta v=\sqrt{v_1^2+v_2^2-2\,v_1 v_2\cos\Delta\theta}
$$

where:

- ($v_1$) and ($v_2$) are the **magnitudes** of two impulsive burns, and
- ($\Delta\theta$) is the **angle between their directions** (radians).

**Units**

- Inputs: ($v_1,v_2$) in **m/s**, ($\Delta\theta$) in **radians**.
- Output: ($\Delta v$) in **m/s**.

**Domain**

- ($v_1 \ge 0,\ v_2 \ge 0,\ \Delta\theta \in [0,\pi]$).

::: info Notes

- Special cases:
  - ($\Delta\theta=0$) (same direction) → ($\Delta v = |v_1 - v_2|$).
  - ($\Delta\theta=\pi$) (opposite) → ($\Delta v = v_1 + v_2$).
- This computes the **single equivalent impulse** from two burns applied with
  mutual angle ($\Delta\theta$) (i.e., magnitude of the vector sum).

:::

## Parameters

| Parameter    | Type                                             | Description                                          |
| ------------ | ------------------------------------------------ | ---------------------------------------------------- |
| `v1`         | `number`                                         | Magnitude of burn 1 (m/s). Must be finite and ≥ 0.   |
| `v2`         | `number`                                         | Magnitude of burn 2 (m/s). Must be finite and ≥ 0.   |
| `deltaTheta` | [`Radians`](../../types/type-aliases/Radians.md) | Angle between burn directions (radians), in \[0, π]. |

## Returns

`number`

Equivalent single ($\Delta v$) (m/s).

## Throws

If any input is not a number.

## Throws

If inputs are non-finite or out of domain.

## Example

```ts
import { combineBurnsDeltaV } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

// Helper: degrees → branded radians
const toRadians = (deg: number): Radians => ((deg * Math.PI) / 180) as Radians;

// Two burns (magnitudes in m/s)
const v1 = 500; // first impulse
const v2 = 300; // second impulse

// 1) Same direction (Δθ = 0°) → Δv = |v1 - v2|
const dv_same = combineBurnsDeltaV(v1, v2, toRadians(0));
console.log('Δθ = 0°   → Δv =', dv_same.toFixed(3), 'm/s');

// 2) Opposite directions (Δθ = 180°) → Δv = v1 + v2
const dv_opp = combineBurnsDeltaV(v1, v2, toRadians(180));
console.log('Δθ = 180° → Δv =', dv_opp.toFixed(3), 'm/s');

// 3) General non-collinear case (e.g., Δθ = 60°)
const dv_60 = combineBurnsDeltaV(v1, v2, toRadians(60));
console.log('Δθ = 60°  → Δv =', dv_60.toFixed(3), 'm/s');

// 4) Another example (Δθ = 25°)
const dv_25 = combineBurnsDeltaV(1200, 800, toRadians(25));
console.log('Δθ = 25°  → Δv =', dv_25.toFixed(3), 'm/s');
```
