[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hohmannTransfer

# Function: hohmannTransfer()

```ts
function hohmannTransfer(
  r1: number,
  r2: number,
  mu: number
): HohmannTransferReturnType;
```

Defined in:
[manoeuvres/hohmann-transfer.ts:49](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/equations/src/categories/manoeuvres/hohmann-transfer.ts#L49)

**Hohmann transfer** (coplanar, circular ($r_1 \to r_2$)).

**Definitions**

$$
a_t=\frac{r_1+r_2}{2}
$$

$$
\Delta v_1=\sqrt{\frac{\mu}{r_1}}\!\left(\sqrt{\frac{2r_2}{r_1+r_2}}-1\right),\qquad
\Delta v_2=\sqrt{\frac{\mu}{r_2}}\!\left(1-\sqrt{\frac{2r_1}{r_1+r_2}}\right)
$$

$$
\Delta v_{\text{total}}=\Delta v_1+\Delta v_2,\qquad
t_t=\pi \sqrt{\frac{a_t^3}{\mu}}
$$

**Conventions**

- Inputs in **SI**: ($r_1,r_2$) in **meters**, ($\mu$) in **m³/s²**.
- The returned ($\Delta v_1,\Delta v_2$) are **magnitudes** (non-negative).
  Their **signs** (prograde/retrograde) are provided separately for clarity.
- Works for ($r_2>r_1$) (raise) and ($r_2<r_1$) (lower). If ($r_1=r_2$):
  ($\Delta v$)s are 0 and ($t_t$) is half the circular period.

**Domain**

- ($r_1>0,\ r_2>0,\ \mu>0$)

## Parameters

| Parameter | Type     | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| `r1`      | `number` | Initial circular-orbit radius (m).                |
| `r2`      | `number` | Target circular-orbit radius (m).                 |
| `mu`      | `number` | Standard gravitational parameter ($\mu$) (m³/s²). |

## Returns

[`HohmannTransferReturnType`](../type-aliases/HohmannTransferReturnType.md)

Object with transfer semi-major axis `at` (m), burn magnitudes `dv1`, `dv2`,
their sum `dvTotal` (m/s), transfer time `tTransfer` (s), and burn directions
`dir1`, `dir2`.

## Throws

If an input is not a number.

## Throws

If ($r_1\le 0$), ($r_2\le 0$), or ($\mu\le 0$), or a value is non-finite.
