[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rocketDeltaVFromIsp

# Function: rocketDeltaVFromIsp()

```ts
function rocketDeltaVFromIsp(
  Isp: number,
  m0: number,
  mf: number,
  g0: number
): number;
```

Defined in:
[manoeuvres/rocket-delta-v-from-isp.ts:45](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/manoeuvres/rocket-delta-v-from-isp.ts#L45)

Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using
specific impulse.

$$
\Delta v = g_0 I_{sp}\ln\!\left(\frac{m_0}{m_f}\right)
$$

Where:

- $I_{sp}$ is the specific impulse (s)
- $g_0$ is standard gravity (m/s²)
- $m_0$ is initial (wet) mass before the burn (kg)
- $m_f$ is final (dry / post-burn) mass after the burn (kg)

**Units**

- Inputs: `Isp` in **s**, `g0` in **m/s²**, masses in **kg**.
- Output: $\Delta v$ in **m/s**.

::: info Notes

- This is the **ideal** rocket equation (no gravity/drag losses, finite burn
  effects, steering losses, etc.).
- `g0` defaults to **9.80665 m/s²** (standard gravity).
- Requires `mf < m0` to yield a positive delta-v.

:::

## Parameters

| Parameter | Type     | Default value | Description                                                              |
| --------- | -------- | ------------- | ------------------------------------------------------------------------ |
| `Isp`     | `number` | `undefined`   | Specific impulse $I_{sp}$ in **seconds** (finite, > 0).                  |
| `m0`      | `number` | `undefined`   | Initial mass $m_0$ in **kg** (finite, > 0).                              |
| `mf`      | `number` | `undefined`   | Final mass $m_f$ in **kg** (finite, > 0 and < `m0`).                     |
| `g0`      | `number` | `9.80665`     | Standard gravity $g_0$ in **m/s²** (finite, > 0). Defaults to `9.80665`. |

## Returns

`number`

Ideal delta-v $\Delta v$ in **m/s**.

## Throws

If any input is not a finite number.

## Throws

If `Isp <= 0`, `g0 <= 0`, `m0 <= 0`, `mf <= 0`, or `mf >= m0`.

## Example

```ts
// Example:
// Isp = 320 s, m0 = 1200 kg, mf = 800 kg
const dv = rocketDeltaVFromIsp(320, 1200, 800);
// dv ≈ 9.80665 * 320 * ln(1200/800) ≈ 1270 m/s
```

## See

https://en.wikipedia.org/wiki/Tsiolkovsky\_rocket\_equation Tsiolkovsky rocket
equation (background and derivation)
