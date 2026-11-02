[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / initialMassForDeltaV

# Function: initialMassForDeltaV()

```ts
function initialMassForDeltaV(
  mf: number,
  dv: number,
  Isp: number,
  g0?: number
): number;
```

Defined in:
[manoeuvres/initial-mass-for-delta-v.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/initial-mass-for-delta-v.ts#L59)

Compute the **mass needed at ignition** to give a final mass a delta-v: the
rocket equation solved for $m_0$.

$$
m_0 = m_f\, e^{\Delta v/(I_{sp}\, g_0)}
$$

Where:

- $m_f$ is the mass left after the burn (kg)
- $\Delta v$ is the delta-v of the burn (m/s)
- $I_{sp}$ is the specific impulse (s)
- $g_0$ is standard gravity (m/s²)

**Units**

- Inputs: `mf` in **kg**, `dv` in **m/s**, `Isp` in **s**, `g0` in **m/s²**.
- Output: $m_0$ in **kg**.

::: info Notes

- The factor $e^{\Delta v/(I_{sp} g_0)}$ is the price of the burn: every
  kilogram left after it costs that many kilograms before it.
- For a sequence of burns, work backwards from the last one: each burn's $m_0$
  is the previous burn's $m_f$.
- This is the ideal rocket equation: the result counts propellant, not the tanks
  and engines that hold and burn it.

:::

::: practice Apollo 11's lunar module, before landing

**9 905 kg**

_To land with a 4 888 kg ascent stage, for 2 112.3 m/s at 305 s_

The real lunar module weighed 15 279 kg at undocking: the rest is the descent
stage's own structure, engine and legs.

```ts
initialMassForDeltaV(4888, 2112.3, 305); // ≈ 9905 kg
```

:::

## Parameters

| Parameter | Type     | Default value | Description                                                              |
| --------- | -------- | ------------- | ------------------------------------------------------------------------ |
| `mf`      | `number` | `undefined`   | Mass after the burn $m_f$ in **kg** (finite, > 0).                       |
| `dv`      | `number` | `undefined`   | Delta-v of the burn $\Delta v$ in **m/s** (finite, >= 0).                |
| `Isp`     | `number` | `undefined`   | Specific impulse $I_{sp}$ in **seconds** (finite, > 0).                  |
| `g0?`     | `number` | `9.80665`     | Standard gravity $g_0$ in **m/s²** (finite, > 0). Defaults to `9.80665`. |

## Returns

`number`

Mass at ignition $m_0$ in **kg**.

## Throws

If any input is not a finite number.

## Throws

If `mf <= 0`, `dv < 0`, `Isp <= 0` or `g0 <= 0`.

## Example

```ts
// 800 kg left after a 1270 m/s burn at Isp = 320 s
const m0 = initialMassForDeltaV(800, 1270, 320);
// m0 ≈ 800 * e^(1270 / 3138.1) ≈ 1200 kg
```

## See

- [rocketDeltaVFromIsp](rocketDeltaVFromIsp.md)
- https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation Tsiolkovsky rocket
  equation
