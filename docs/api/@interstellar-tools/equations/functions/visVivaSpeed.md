[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / visVivaSpeed

# Function: visVivaSpeed()

```ts
function visVivaSpeed(r: number, a: number, mu: number): number;
```

Defined in:
[orbits/vis-viva-speed.ts:41](https://github.com/phun-ky/interstellar-tools/blob/832c313b094c927abcdab3b706dc5f72fdc7bae0/packages/equations/src/categories/orbits/vis-viva-speed.ts#L41)

**Vis-viva (orbital speed)** - compute speed magnitude ($v$) from ($r$), ($a$),
and ($\mu$).

**Definition**

$$
v = \sqrt{\mu\!\left(\frac{2}{r}-\frac{1}{a}\right)}
$$

- ($r$): current distance from the focus (m)
- ($a$): semi-major axis (m). Elliptic ($a>0$), parabolic ($a\to\infty$),
  hyperbolic ($a<0$)
- ($\mu$): gravitational parameter (m³/s²)

**Units**

- Inputs: ($r$) in **m**, ($a$) in **m**, ($\mu$) in **m³/s²**.
- Output: ($v$) in **m/s**.

::: tip

- For circular orbits (($a=r$)): ($v=\sqrt{\mu/r}$).
- For parabolic trajectories, pass `a = Infinity` (so ($1/a=0$)):
  ($v=\sqrt{2\mu/r}$).

:::

## Parameters

| Parameter | Type     | Description                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| `r`       | `number` | Radius ($r$) (m), distance to the attracting body.                                |
| `a`       | `number` | Semi-major axis ($a$) (m). Use `Infinity` for parabolic, negative for hyperbolic. |
| `mu`      | `number` | Gravitational parameter ($\mu$) (m³/s²).                                          |

## Returns

`number`

Speed magnitude ($v$) (m/s).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If inputs are non-finite / out of domain, or the radicand becomes negative.

## Example

```ts
// LEO (~400 km): a ≈ r for near-circular
const muEarth = 3.986004418e14; // m^3/s^2
const r = 6378e3 + 400e3; // m
const a = r; // circular
const v = visVivaSpeed(r, a, muEarth); // ≈ 7670 m/s
```
