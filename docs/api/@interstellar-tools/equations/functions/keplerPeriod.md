[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / keplerPeriod

# Function: keplerPeriod()

```ts
function keplerPeriod(a: number, mu: number): number;
```

Defined in:
[orbits/kepler-period.ts:44](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/orbits/kepler-period.ts#L44)

**Kepler's 3rd law** - orbital period ($T$) from semi-major axis ($a$) and
gravitational parameter ($\mu$).

**Definition**

$$
T = 2\pi \sqrt{\frac{a^3}{\mu}}
$$

**Units**

- Inputs: ($a$) in **meters (m)**, ($\mu$) in **m³/s²**.
- Output: ($T$) in **seconds (s)**.

::: info

- Valid for **Keplerian (two-body) bound orbits** with ($a>0$) (ellipses). Not
  defined for parabolic/hyperbolic trajectories.
- ($\mu$) is the **standard gravitational parameter** of the central body (e.g.,
  Earth ($\approx 3.986004418\times10^{14}\ \text{m}^3/\text{s}^2$)).

:::

## Parameters

| Parameter | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| `a`       | `number` | Semi-major axis (m), must be finite and **> 0**.             |
| `mu`      | `number` | Gravitational parameter (m³/s²), must be finite and **> 0**. |

## Returns

`number`

Orbital period ($T$) (s).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If inputs are non-finite or out of domain.

## Examples

```ts
// GEO: a ≈ 42,164 km → T ≈ 86,164 s (one sidereal day)
const a = 42164e3; // m
const muEarth = 3.986004418e14; // m³/s²
const T = keplerPeriod(a, muEarth); // ≈ 86164 s
```

```ts
// LEO-ish circular: a ≈ Earth radius + 400 km
const a = 6378e3 + 400e3; // m
const muEarth = 3.986004418e14; // m³/s²
const T = keplerPeriod(a, muEarth); // ≈ 5550 s (~92.5 min)
```
