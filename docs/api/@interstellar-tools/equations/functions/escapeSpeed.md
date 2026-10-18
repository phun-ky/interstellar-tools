[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / escapeSpeed

# Function: escapeSpeed()

```ts
function escapeSpeed(r: number, mu: number): number;
```

Defined in:
[orbits/escape-speed.ts:65](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/equations/src/categories/orbits/escape-speed.ts#L65)

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

::: practice Leaving Earth

**11.19 km/s**

_Escape speed at Earth's surface_

That's √2 times the 7.91 km/s it takes to orbit just above the surface, which is
why a rocket for the Moon or Mars is so much bigger than one for low Earth
orbit.

```ts
escapeSpeed(6.371e6, 3.986004418e14); // ≈ 11 186 m/s
```

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
