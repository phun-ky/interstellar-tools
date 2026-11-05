[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / decayRate

# Function: decayRate()

```ts
function decayRate(a: number, beta: number, rho: number): number;
```

Defined in:
[orbits/decay-rate.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/decay-rate.ts#L48)

How much a near-circular orbit **sinks in one revolution** under atmospheric
drag: the change in its semi-major axis per orbit.

$$
\Delta a_{\text{rev}} \approx -2\pi\,\frac{\rho\,a^2}{\beta}
$$

Where:

- $\rho$ is the air density at the orbit's height (kg/m³), from
  [exponentialAtmosphereDensity](exponentialAtmosphereDensity.md) or
  `nrlmsise00`
- $a$ is the semi-major axis (m)
- $\beta = m / (C_D A)$ is the ballistic coefficient (kg/m²), from
  [ballisticCoefficient](ballisticCoefficient.md)

**Units**

- Inputs: `a` in **m**, `beta` in **kg/m²**, `rho` in **kg/m³**.
- Output: $\Delta a_{\text{rev}}$ in **m**, negative: the orbit sinks.

::: info Notes

- Drag takes energy out of the orbit, so it shrinks; the satellite speeds up as
  it sinks, into denser air, so the decay runs away near the end.
- For a near-circular orbit, with the density at its height. An elliptical orbit
  loses most of its height at apogee, as drag at perigee circularises it.
- Per unit time, divide by the period: $\dot a = -\rho\sqrt{\mu a}/\beta$.

:::

## Parameters

| Parameter | Type     | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `a`       | `number` | Semi-major axis $a$ in **m** (finite, > 0).               |
| `beta`    | `number` | Ballistic coefficient $\beta$ in **kg/m²** (finite, > 0). |
| `rho`     | `number` | Air density $\rho$ in **kg/m³** (finite, >= 0).           |

## Returns

`number`

The change in semi-major axis per revolution $\Delta a_{\text{rev}}$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `a` or `beta` is not > 0, or `rho < 0`.

## Example

```ts
// A 1U CubeSat, β ≈ 60 kg/m², 400 km up
const rho = exponentialAtmosphereDensity(400_000);

decayRate(6_778_137, ballisticCoefficient(1.33, 2.2, 0.01), rho); // ≈ -17.8 m an orbit
```

## See

- [estimateLifetime](estimateLifetime.md)
- [atmosphericDragAcceleration](atmosphericDragAcceleration.md)
