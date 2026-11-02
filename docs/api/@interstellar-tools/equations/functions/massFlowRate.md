[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / massFlowRate

# Function: massFlowRate()

```ts
function massFlowRate(F: number, Isp: number, g0?: number): number;
```

Defined in:
[manoeuvres/mass-flow-rate.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/mass-flow-rate.ts#L56)

Compute the **mass flow rate** of a rocket engine from its thrust and specific
impulse.

$$
\dot m = \frac{F}{I_{sp}\, g_0}
$$

Where:

- $F$ is the thrust (N)
- $I_{sp}$ is the specific impulse (s)
- $g_0$ is standard gravity (m/s²)

**Units**

- Inputs: `F` in **N**, `Isp` in **s**, `g0` in **m/s²**.
- Output: $\dot m$ in **kg/s**.

::: info Notes

- $I_{sp}\, g_0$ is the effective exhaust velocity $v_e$, so this is $F = \dot
  m\, v_e$ solved for $\dot m$.
- `g0` defaults to **9.80665 m/s²** (standard gravity). It converts the units of
  $I_{sp}$; it is not the local gravity.

:::

::: practice Apollo 11's lunar module, leaving the Moon

**5.09 kg/s**

_Ascent engine, 15 409 N at 309 s_

The ascent stage burned about 5 kg of propellant a second for its 7-minute climb
to lunar orbit.

```ts
massFlowRate(15_409, 309); // ≈ 5.085 kg/s
```

:::

## Parameters

| Parameter | Type     | Default value | Description                                                              |
| --------- | -------- | ------------- | ------------------------------------------------------------------------ |
| `F`       | `number` | `undefined`   | Thrust $F$ in **N** (finite, > 0).                                       |
| `Isp`     | `number` | `undefined`   | Specific impulse $I_{sp}$ in **seconds** (finite, > 0).                  |
| `g0?`     | `number` | `9.80665`     | Standard gravity $g_0$ in **m/s²** (finite, > 0). Defaults to `9.80665`. |

## Returns

`number`

Mass flow rate $\dot m$ in **kg/s**.

## Throws

If any input is not a finite number.

## Throws

If `F <= 0`, `Isp <= 0` or `g0 <= 0`.

## Example

```ts
// A 1 kN thruster with Isp = 300 s
const mDot = massFlowRate(1000, 300);
// mDot ≈ 1000 / (300 * 9.80665) ≈ 0.340 kg/s
```

## See

- [burnTime](burnTime.md)
- [rocketThrust](rocketThrust.md)
