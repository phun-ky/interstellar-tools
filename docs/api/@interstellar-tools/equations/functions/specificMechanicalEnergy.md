[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / specificMechanicalEnergy

# Function: specificMechanicalEnergy()

```ts
function specificMechanicalEnergy(v: number, r: number, mu: number): number;
```

Defined in:
[orbits/specific-mechanical-energy.ts:48](https://github.com/phun-ky/interstellar-tools/blob/a9fba345cd0b686a5973e9d84ea531c0bb0f99da/packages/equations/src/categories/orbits/specific-mechanical-energy.ts#L48)

**Specific mechanical energy** ($ \varepsilon $) of a point mass in a central
gravity field.

**Definition**

$$
\varepsilon = \frac{v^2}{2} - \frac{\mu}{r}
$$

where ($v$) is the speed, ($r$) the distance to the central body, and ($\mu$)
the gravitational parameter.

**Units**

- Inputs: ($v$) in **m/s**, ($r$) in **m**, ($\mu$) in **m³/s²**.
- Output: ($\varepsilon$) in **J/kg** (i.e., m²/s²).

**Orbit-type by sign**

- ($\varepsilon < 0$) → **elliptic** (bound)
- ($\varepsilon = 0$) → **parabolic**
- ($\varepsilon > 0$) → **hyperbolic**

::: tip

- For circular orbits ($v = \sqrt{\mu/r}$), so ($ \varepsilon = -\mu/(2r) $).
- If you have the semi-major axis ($a$), then ($ \varepsilon = -\mu/(2a) $).

:::

## Parameters

| Parameter | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `v`       | `number` | Speed magnitude ($v$) (m/s).                          |
| `r`       | `number` | Radius ($r=\|\mathbf r\|$) from the central body (m). |
| `mu`      | `number` | Gravitational parameter ($\mu$) (m³/s²).              |

## Returns

`number`

Specific mechanical energy ($\varepsilon$) (J/kg).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `v` is not finite or negative.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `r` is not finite or non-positive.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `mu` is not finite or negative.

## Example

```ts
// LEO example around Earth (~400 km altitude)
const muEarth = 3.986004418e14; // m^3/s^2
const r = 6378e3 + 400e3; // Earth radius + 400 km
const v = Math.sqrt(muEarth / r); // near-circular speed
const eps = specificMechanicalEnergy(v, r, muEarth);
// eps ≈ -mu/(2r)
```
