[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / gravityLoss

# Function: gravityLoss()

```ts
function gravityLoss(
  g: number | readonly number[],
  gamma: readonly Radians[],
  dt: number
): number;
```

Defined in:
[manoeuvres/gravity-loss.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/gravity-loss.ts#L48)

Compute the **gravity loss** of a burn from samples of gravity and flight-path
angle.

$$
\Delta v_g = \int_0^{t_b} g \sin\gamma \, dt
$$

integrated with the trapezoidal rule over equally spaced samples.

Where:

- $g$ is the local gravitational acceleration (m/s²)
- $\gamma$ is the flight-path angle above the local horizontal (rad)
- $t_b$ is the burn time (s)

**Units**

- Inputs: `g` in **m/s²**, `gamma` in **radians**, `dt` in **s**.
- Output: $\Delta v_g$ in **m/s**.

::: info Notes

- Thrust spent holding a rocket up against gravity doesn't speed it up. The loss
  is largest for a vertical climb ($\gamma = 90°$) and zero for a horizontal
  burn ($\gamma = 0$).
- The delta-v a rocket must carry is its orbital delta-v plus its gravity, drag
  and steering losses.
- Pass `g` as one number when it's constant over the burn, or as samples
  matching `gamma`.

:::

## Parameters

| Parameter | Type                                                         | Description                                                                                               |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `g`       | `number`                                                     | readonly `number`\[]                                                                                      | Gravitational acceleration in **m/s²**: one value, or one sample per entry of `gamma` (finite, >= 0). |
| `gamma`   | readonly [`Radians`](../../types/type-aliases/Radians.md)\[] | Flight-path angles $\gamma$ in **radians**, sampled every `dt` seconds (at least 2 samples, each finite). |
| `dt`      | `number`                                                     | Time between samples in **s** (finite, > 0).                                                              |

## Returns

`number`

Gravity loss $\Delta v_g$ in **m/s**. Negative when the vehicle is mostly
descending.

## Throws

If any input is not a finite number, or `g` and `gamma` have different lengths.

## Throws

If `gamma` has fewer than 2 samples, `dt <= 0` or any `g < 0`.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A 10 s vertical climb in constant Earth gravity
const vertical = Array.from({ length: 11 }, () => (Math.PI / 2) as Radians);
gravityLoss(9.80665, vertical, 1); // ≈ 98.07 m/s
```

## See

https://en.wikipedia.org/wiki/Gravity_drag Gravity drag
