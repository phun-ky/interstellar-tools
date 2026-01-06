[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / escapeSpeed

# Function: escapeSpeed()

```ts
function escapeSpeed(r: number, mu: number): number;
```

Defined in:
[orbits/escape-speed.ts:49](https://github.com/phun-ky/interstellar-tools/blob/c92c21e64c6c17a1e137f86d826c046c9ea440ca/packages/equations/src/categories/orbits/escape-speed.ts#L49)

**Escape speed** ($v_{\text{esc}}$) - minimum speed to escape a central body's
gravity from radius ($r$) (ignoring drag/perturbations).

**Definition**

$$
v_{\text{esc}}=\sqrt{\frac{2\mu}{r}}
$$

where ($\mu$) is the standard gravitational parameter and ($r$) is the distance
from the central body's center.

**Units**

- Inputs: ($r$) in **meters (m)**, ($\mu$) in **m³/s²**.
- Output: ($v_{\text{esc}}$) in **m/s**.

::: info

- Relationship to circular speed ($v_c$): ($v_{\text{esc}}=\sqrt{2}\,v_c$).
- This corresponds to **parabolic** specific energy (($\varepsilon = 0$)).
- For general (non-escape) orbital speed use `visVivaSpeed(r, a, mu)`.

:::

## Parameters

| Parameter | Type     | Description                                                                             |
| --------- | -------- | --------------------------------------------------------------------------------------- |
| `r`       | `number` | Radius ($r$) (m), distance from the central body’s center (must be finite and **> 0**). |
| `mu`      | `number` | Gravitational parameter ($\mu$) (m³/s²), must be finite and **≥ 0**.                    |

## Returns

`number`

Escape speed ($v_{\text{esc}}$) (m/s).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If inputs are non-finite or out of domain.

## Examples

```ts
// Near Earth's surface (approx.)
const muEarth = 3.986004418e14; // m³/s²
const rSurface = 6378e3; // m
const vEsc = escapeSpeed(rSurface, muEarth); // ≈ 11186 m/s
```

```ts
// LEO ~400 km altitude: r = R_E + 400 km
const muEarth = 3.986004418e14;
const rLEO = 6378e3 + 400e3;
const vEsc = escapeSpeed(rLEO, muEarth); // ≈ 10860 m/s
```
