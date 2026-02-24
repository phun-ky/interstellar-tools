[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rocketDeltaVFromVe

# Function: rocketDeltaVFromVe()

```ts
function rocketDeltaVFromVe(ve: number, m0: number, mf: number): number;
```

Defined in:
[manoeuvres/rocket-delta-v-from-ve.ts:43](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/equations/src/categories/manoeuvres/rocket-delta-v-from-ve.ts#L43)

Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using
effective exhaust velocity.

$$
\Delta v = v_e \ln\!\left(\frac{m_0}{m_f}\right)
$$

Where:

- $v_e$ is the effective exhaust velocity (m/s)
- $m_0$ is initial (wet) mass before the burn (kg)
- $m_f$ is final (dry / post-burn) mass after the burn (kg)

**Units**

- Inputs: `ve` in **m/s**, masses in **kg**.
- Output: $\Delta v$ in **m/s**.

::: info Notes

- This is the **ideal** rocket equation (no gravity/drag losses, finite burn
  effects, steering losses, etc.).
- Requires `mf < m0` to yield a positive delta-v.
- Relationship to specific impulse: $v_e = g_0 I_{sp}$.

:::

## Parameters

| Parameter | Type     | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `ve`      | `number` | Effective exhaust velocity $v_e$ in **m/s** (finite, > 0). |
| `m0`      | `number` | Initial mass $m_0$ in **kg** (finite, > 0).                |
| `mf`      | `number` | Final mass $m_f$ in **kg** (finite, > 0 and < `m0`).       |

## Returns

`number`

Ideal delta-v $\Delta v$ in **m/s**.

## Throws

If any input is not a finite number.

## Throws

If `ve <= 0`, `m0 <= 0`, `mf <= 0`, or `mf >= m0`.

## Example

```ts
// Example:
// ve = 3100 m/s, m0 = 1200 kg, mf = 800 kg
const dv = rocketDeltaVFromVe(3100, 1200, 800);
// dv ≈ 3100 * ln(1200/800) ≈ 1256 m/s
```

## See

https://en.wikipedia.org/wiki/Tsiolkovsky\_rocket\_equation Tsiolkovsky rocket
equation (background and derivation)
