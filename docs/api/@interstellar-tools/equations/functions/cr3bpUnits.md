[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cr3bpUnits

# Function: cr3bpUnits()

```ts
function cr3bpUnits(
  gm1: number,
  gm2: number,
  separation: number
): Cr3bpUnitsInterface;
```

Defined in:
[three-body/cr3bp-units.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/cr3bp-units.ts#L62)

Compute the **units of the normalised CR3BP frame** for a pair of bodies.

$$
L = a, \qquad T = \frac{1}{n} = \sqrt{\frac{a^3}{\mu_1 + \mu_2}}, \qquad V = \frac{L}{T}
$$

Where:

- $a$ is the separation of the two bodies (m)
- $\mu_1$, $\mu_2$ are their gravitational parameters (m³/s²)
- $n$ is their mean motion around each other (rad/s)

**Units**

- Inputs: `gm1` and `gm2` in **m³/s²**, `separation` in **m**.
- Output: the mass ratio, and the length, time and speed units in **m**, **s**
  and **m/s**.

::: info Notes

- The CR3BP equations are written with $G(m_1 + m_2) = 1$, the separation 1 and
  the angular rate 1. Multiply normalised lengths, times and speeds by these
  units to get SI, and divide to go back.
- One revolution of the two bodies takes $2\pi$ time units.
- The real Moon's distance varies by about ±5% over a month; use its mean
  distance, 384 400 km, or the distance on the day.

:::

::: practice Apollo 11, the Earth–Moon frame

**4.342 days**

_The time unit for Earth and Moon at the mean distance of 384 400 km_

One time unit is $1/n$, so a month in the rotating frame is $2\pi$ units: 27.28
days. The speed unit is 1 024.5 m/s, close to the Moon's own orbital speed.

```ts
const { mu, time, speed } = cr3bpUnits(
  3.986004418e14,
  4.902800118e12,
  384_400_000
);
// mu ≈ 0.012151, time / 86 400 ≈ 4.342 days, speed ≈ 1 024.5 m/s
```

:::

## Parameters

| Parameter    | Type     | Description                                                                       |
| ------------ | -------- | --------------------------------------------------------------------------------- |
| `gm1`        | `number` | Gravitational parameter of the larger body in **m³/s²** (finite, > 0).            |
| `gm2`        | `number` | Gravitational parameter of the smaller body in **m³/s²** (finite, > 0, <= `gm1`). |
| `separation` | `number` | Distance between the two bodies in **m** (finite, > 0).                           |

## Returns

[`Cr3bpUnitsInterface`](../../types/interfaces/Cr3bpUnitsInterface.md)

The mass ratio and the length, time and speed units.

## Throws

If any input is not a finite number.

## Throws

If any input is `<= 0`, or `gm2 > gm1`.

## Example

```ts
// Sun and Earth, 1 au apart
const { time } = cr3bpUnits(1.32712440018e20, 3.986004418e14, 1.495978707e11);
// 2π · time ≈ 365.26 days, a sidereal year
```

## See

- [cr3bpMassRatio](cr3bpMassRatio.md)
- [cr3bpDerivatives](cr3bpDerivatives.md)
