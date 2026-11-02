[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / thrustToWeight

# Function: thrustToWeight()

```ts
function thrustToWeight(F: number, m: number, g: number): number;
```

Defined in:
[manoeuvres/thrust-to-weight.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/thrust-to-weight.ts#L56)

Compute the **thrust-to-weight ratio** of a vehicle in a gravity field.

$$
\frac{T}{W} = \frac{F}{m\, g}
$$

Where:

- $F$ is the thrust (N)
- $m$ is the vehicle's mass (kg)
- $g$ is the local gravitational acceleration (m/s²)

**Units**

- Inputs: `F` in **N**, `m` in **kg**, `g` in **m/s²**.
- Output: dimensionless ratio.

::: info Notes

- A vehicle can only lift off vertically when $T/W > 1$.
- Use the local $g$, e.g. $\mu / r^2$ for the body you're on, not standard
  gravity.
- The ratio grows during a burn as propellant is used up; pass the current mass.

:::

::: practice Apollo 11's lunar module, leaving the Moon

**1.94**

_Ascent stage at liftoff, in the Moon's 1.62 m/s² gravity_

On Earth the same stage would manage only 0.32: too little to lift off.

```ts
thrustToWeight(15_409, 4888, 1.624); // ≈ 1.94
```

:::

## Parameters

| Parameter | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `F`       | `number` | Thrust $F$ in **N** (finite, >= 0).                             |
| `m`       | `number` | Mass $m$ in **kg** (finite, > 0).                               |
| `g`       | `number` | Local gravitational acceleration $g$ in **m/s²** (finite, > 0). |

## Returns

`number`

Thrust-to-weight ratio (dimensionless).

## Throws

If any input is not a finite number.

## Throws

If `F < 0`, `m <= 0` or `g <= 0`.

## Example

```ts
// A 2000 kg lander with a 45 kN engine on Mars (g ≈ 3.71 m/s²)
const tw = thrustToWeight(45_000, 2000, 3.71);
// tw ≈ 6.06
```

## See

[massFlowRate](massFlowRate.md)
