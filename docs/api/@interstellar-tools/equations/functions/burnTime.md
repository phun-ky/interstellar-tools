[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / burnTime

# Function: burnTime()

```ts
function burnTime(
  m0: number,
  dv: number,
  F: number,
  Isp: number,
  g0?: number
): number;
```

Defined in:
[manoeuvres/burn-time.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/burn-time.ts#L62)

Compute the **burn time** needed for a given delta-v, at constant thrust and
mass flow.

$$
t_b = \frac{m_0 - m_f}{\dot m} = \frac{m_0\, I_{sp}\, g_0}{F}\left(1 - e^{-\Delta v/(I_{sp} g_0)}\right)
$$

Where:

- $m_0$ is the mass at ignition (kg)
- $\Delta v$ is the delta-v of the burn (m/s)
- $F$ is the thrust (N)
- $I_{sp}$ is the specific impulse (s)
- $g_0$ is standard gravity (m/s²)

**Units**

- Inputs: `m0` in **kg**, `dv` in **m/s**, `F` in **N**, `Isp` in **s**, `g0` in
  **m/s²**.
- Output: $t_b$ in **s**.

::: info Notes

- The propellant used, $m_0 - m_f$, comes from the rocket equation; the burn
  time is that mass divided by the [massFlowRate](massFlowRate.md).
- Assumes constant thrust and specific impulse. A throttled engine, like
  Apollo's descent engine, needs the burn split into steps.
- `dv = 0` gives a burn time of 0.

:::

::: practice Apollo 11's lunar module, leaving the Moon

**439 s**

_Ascent stage, 4 888 kg, for 1 850.2 m/s_

The flown burn took 434.9 s, 1% less: the thrust and specific impulse used here
are the pre-flight predictions.

```ts
burnTime(4888, 1850.2, 15_409, 309); // ≈ 439.3 s
```

:::

## Parameters

| Parameter | Type     | Default value | Description                                                              |
| --------- | -------- | ------------- | ------------------------------------------------------------------------ |
| `m0`      | `number` | `undefined`   | Mass at ignition $m_0$ in **kg** (finite, > 0).                          |
| `dv`      | `number` | `undefined`   | Delta-v of the burn $\Delta v$ in **m/s** (finite, >= 0).                |
| `F`       | `number` | `undefined`   | Thrust $F$ in **N** (finite, > 0).                                       |
| `Isp`     | `number` | `undefined`   | Specific impulse $I_{sp}$ in **seconds** (finite, > 0).                  |
| `g0?`     | `number` | `9.80665`     | Standard gravity $g_0$ in **m/s²** (finite, > 0). Defaults to `9.80665`. |

## Returns

`number`

Burn time $t_b$ in **s**.

## Throws

If any input is not a finite number.

## Throws

If `m0 <= 0`, `dv < 0`, `F <= 0`, `Isp <= 0` or `g0 <= 0`.

## Example

```ts
// A 1200 kg spacecraft, 500 m/s with a 400 N engine at Isp = 320 s
const t = burnTime(1200, 500, 400, 320);
// t ≈ 1200 * 3138.1 / 400 * (1 - e^(-500/3138.1)) ≈ 1387 s
```

## See

- [massFlowRate](massFlowRate.md)
- [rocketDeltaVFromIsp](rocketDeltaVFromIsp.md)
- https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation Tsiolkovsky rocket
  equation
