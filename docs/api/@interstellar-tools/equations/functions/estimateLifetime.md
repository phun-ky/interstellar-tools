[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / estimateLifetime

# Function: estimateLifetime()

```ts
function estimateLifetime(
  a: number,
  beta: number,
  mu: number,
  Re: number,
  options?: EstimateLifetimeOptionsInterface
): number;
```

Defined in:
[orbits/estimate-lifetime.ts:102](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/estimate-lifetime.ts#L102)

Estimate how long a satellite in a near-circular low orbit **stays up**: the
time for atmospheric drag to bring it down to re-entry. For a student CubeSat,
it sets the mission's length, and checks the guideline to deorbit within five
years of the mission's end.

Integrates the decay of the semi-major axis, from its height down to the
re-entry height, with the density at each height:

$$
\dot a = -\frac{\rho(a - R)\,\sqrt{\mu a}}{\beta}, \qquad
t = \int_{R + h_{\text{re}}}^{a_0} \frac{\beta}{\rho(a - R)\sqrt{\mu a}}\,da
$$

by Simpson's rule, in steps of at most 500 m.

Where:

- $\beta = m / (C_D A)$ is the ballistic coefficient (kg/m²), from
  [ballisticCoefficient](ballisticCoefficient.md)
- $\rho(h)$ is the air density at a height (kg/m³)
- $R$ is the planet's radius, $\mu$ its gravitational parameter
- $h_{\text{re}}$ is the re-entry height

**Units**

- Inputs: `a` and `Re` in **m**, `beta` in **kg/m²**, `mu` in **m³/s²**.
- Output: the lifetime in **s**.

::: warning An estimate

Uncertain by tens of percent at the least. The density high up changes tenfold
with solar activity, which over a lifetime of years follows the 11-year solar
cycle and can't be predicted well: a satellite launched at solar minimum can
last several times longer than one launched at maximum. The default exponential
model is an average. For a better estimate, pass a `density` from `nrlmsise00`
with forecast space weather, and compare low, moderate and high activity.

:::

::: info Notes

- The satellite's attitude matters through $\beta$: a tumbling CubeSat's average
  drag area is about a quarter of its surface.
- Twice as heavy, or half the area, lasts twice as long: the lifetime is
  proportional to $\beta$.

:::

::: practice A 1U CubeSat from 400 km

**Half a year**

_1.33 kg, 10 cm across, with the average atmosphere_

From 500 km, the same CubeSat lasts about three years. At solar minimum it lasts
several times longer than at maximum.

```ts
const beta = ballisticCoefficient(1.33, 2.2, 0.01);

estimateLifetime(6_778_137, beta, 3.986004418e14, 6_378_137) / 86_400; // ≈ 187 days
```

:::

## Parameters

| Parameter  | Type                                                                                    | Description                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `a`        | `number`                                                                                | Semi-major axis $a$ in **m** (finite, above the re-entry height).                                                |
| `beta`     | `number`                                                                                | Ballistic coefficient $\beta$ in **kg/m²** (finite, > 0).                                                        |
| `mu`       | `number`                                                                                | The planet's gravitational parameter $\mu$ in **m³/s²** (finite, > 0).                                           |
| `Re`       | `number`                                                                                | The planet's radius $R$ in **m** (finite, > 0).                                                                  |
| `options?` | [`EstimateLifetimeOptionsInterface`](../interfaces/EstimateLifetimeOptionsInterface.md) | `density`, a function from height in **m** to density in **kg/m³**; and `reentryHeight` in **m** (finite, >= 0). |

## Returns

`number`

The lifetime in **s**.

## Throws

If a number is not finite, or `density` is not a function.

## Throws

If `beta`, `mu` or `Re` is not > 0, `reentryHeight < 0`, `a` is not above the
re-entry height, or the density at a height is not a finite number > 0.

## Example

```ts
// The same CubeSat, with NRLMSISE-00 at low solar activity
const quiet = { f107: 70, f107a: 70, ap: 4 };
const density = (h: number) =>
  nrlmsise00(new Date(), h, 0, 0, quiet).effectiveDensity;

estimateLifetime(6_778_137, beta, 3.986004418e14, 6_378_137, { density });
```

## See

- [decayRate](decayRate.md)
- [exponentialAtmosphereDensity](exponentialAtmosphereDensity.md)
