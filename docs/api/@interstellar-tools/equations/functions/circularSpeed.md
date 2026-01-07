[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / circularSpeed

# Function: circularSpeed()

```ts
function circularSpeed(r: number, mu: number): number;
```

Defined in:
[orbits/circular-speed.ts:41](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/orbits/circular-speed.ts#L41)

**Circular speed** ($v_c$) for a body in a circular orbit at radius ($r$).

**Definition**

$$
v_c=\sqrt{\frac{\mu}{r}}
$$

where ($\mu$) is the standard gravitational parameter and ($r$) is the distance
from the central body's center to the orbiting body.

**Units**

- Inputs: ($r$) in **meters (m)**, ($\mu$) in **m³/s²**.
- Output: ($v_c$) in **m/s**.

::: info

- This is the special case of the vis-viva equation for circular orbits
  (($a=r$)).
- If you need a non-circular orbit, use `visVivaSpeed(r, a, mu)`.

:::

## Parameters

| Parameter | Type     | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------- |
| `r`       | `number` | Orbital radius ($r$) (m), must be finite and **> 0**.                |
| `mu`      | `number` | Gravitational parameter ($\mu$) (m³/s²), must be finite and **≥ 0**. |

## Returns

`number`

Circular speed ($v_c$) (m/s).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If inputs are non-finite or out of domain.

## See

[visVivaSpeed](visVivaSpeed.md)

## Example

```ts
// LEO ~400 km altitude around Earth
const muEarth = 3.986004418e14; // m³/s²
const r = 6378e3 + 400e3; // m
const v = circularSpeed(r, muEarth); // ≈ 7670 m/s
```
