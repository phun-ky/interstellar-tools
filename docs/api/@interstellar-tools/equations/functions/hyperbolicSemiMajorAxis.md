[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hyperbolicSemiMajorAxis

# Function: hyperbolicSemiMajorAxis()

```ts
function hyperbolicSemiMajorAxis(vInfinity: number, mu: number): number;
```

Defined in:
[orbits/hyperbolic-semi-major-axis.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/hyperbolic-semi-major-axis.ts#L52)

Compute the **semi-major axis of a hyperbola** from the hyperbolic excess speed.

$$
a = -\frac{\mu}{v_\infty^2}
$$

Where:

- $v_\infty$ is the hyperbolic excess speed: the speed left over far from the
  body (m/s)
- $\mu$ is the body's gravitational parameter (m³/s²)

**Units**

- Inputs: `vInfinity` in **m/s**, `mu` in **m³/s²**.
- Output: $a$ in **m**, negative.

::: info Notes

- Negative by convention, so that vis-viva $v^2 = \mu(2/r - 1/a)$ holds for
  hyperbolas too.
- $v_\infty$ comes from a speed $v$ at distance $r$ by energy: $v_\infty^2 =
  v^2 - 2\mu/r$, or from [characteristicEnergyC3](characteristicEnergyC3.md) as
  $\sqrt{C_3}$.

:::

::: practice Apollo 11, arriving at the Moon

**−4 203 km**

_Approach hyperbola, with 1.08 km/s left over far from the Moon_

```ts
hyperbolicSemiMajorAxis(1080, 4.902800118e12); // ≈ -4 203 361 m
```

:::

## Parameters

| Parameter   | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `vInfinity` | `number` | Hyperbolic excess speed $v_\infty$ in **m/s** (finite, > 0). |
| `mu`        | `number` | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).    |

## Returns

`number`

Semi-major axis $a$ in **m** (negative).

## Throws

If any input is not a finite number.

## Throws

If `vInfinity <= 0` or `mu <= 0`.

## Example

```ts
// Leaving Earth for Mars with v∞ ≈ 2.95 km/s
const a = hyperbolicSemiMajorAxis(2950, 3.986004418e14);
// a ≈ -45 803 km
```

## See

- [hyperbolicEccentricity](hyperbolicEccentricity.md)
- [hyperbolicPeriapsisSpeed](hyperbolicPeriapsisSpeed.md)
