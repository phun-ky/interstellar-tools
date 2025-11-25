[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / oberthEnergyGain

# Function: oberthEnergyGain()

```ts
function oberthEnergyGain(v: number, dv: number): number;
```

Defined in:
[manoeuvres/oberth-energy-gain.ts:65](https://github.com/phun-ky/interstellar-tools/blob/9c13350dafd209031a6cfebe54b6883c404a0515/packages/equations/src/categories/manoeuvres/oberth-energy-gain.ts#L65)

**Oberth effect (specific energy gain near periapsis)**.

**Approximation**

$$
\Delta \varepsilon \;\approx\; v\,\Delta v
$$

where:

- ($v$) is the instantaneous **speed** at the burn point (typically periapsis),
- ($\Delta v$) is the **impulsive** prograde burn magnitude,
- ($\Delta \varepsilon$) is the change in **specific mechanical energy** (J/kg ≡
  m²/s²).

**Units**

- Inputs: ($v$) in **m/s**, ($\Delta v$) in **m/s**.
- Output: ($\Delta \varepsilon$) in **J/kg** (m²/s²).

::: info Notes

- This approximation assumes a **small**, **prograde** impulse (aligned with
  velocity) and neglects higher-order terms ($\tfrac{1}{2}(\Delta v)^2$).
- A more general small-angle form is
  ($\Delta \varepsilon \approx v\,\Delta v\cos\phi$), where ($\phi$) is the
  angle between the velocity vector and the burn direction.

:::

## Parameters

| Parameter | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `v`       | `number` | Instantaneous speed at burn point (m/s). Must be finite and ≥ 0. |
| `dv`      | `number` | Impulsive prograde Δv magnitude (m/s). Must be finite and ≥ 0.   |

## Returns

`number`

Specific energy gain ($\Delta \varepsilon$) (J/kg).

## Throws

If inputs are not numbers.

## Throws

If inputs are non-finite or negative.

## Example

```ts
import { oberthEnergyGain, circularSpeed } from '@interstellar-tools/equations';

// Earth's GM (μ) in m^3/s^2
const muEarth = 3.986004418e14;

// Example: small prograde burn at LEO periapsis (~400 km altitude)
const rLEO = 6378e3 + 400e3; // m
const vLEO = circularSpeed(rLEO, muEarth); // m/s ≈ 7670

// Suppose guidance commands a small impulsive burn Δv = 50 m/s at periapsis
const dv = 50; // m/s

// Oberth approximation: Δε ≈ v · Δv  (specific energy gain, J/kg ≡ m^2/s^2)
const deltaEps = oberthEnergyGain(vLEO, dv);

// For intuition, translate Δε to an approximate change in semi-major axis (elliptic case):
// ε = -μ/(2a)  ⇒  Δa ≈ (a^2 / μ) · Δε (valid for small changes around circular LEO)
const aLEO = rLEO; // circular → a = r
const deltaA = ((aLEO * aLEO) / muEarth) * deltaEps; // meters

console.log(`LEO speed v ≈ ${vLEO.toFixed(1)} m/s`);
console.log(`Prograde Δv  = ${dv.toFixed(1)} m/s`);
console.log(`Specific energy gain Δε ≈ ${deltaEps.toFixed(0)} J/kg`);
console.log(`Approx. semi-major axis change Δa ≈ ${deltaA.toFixed(0)} m`);

// Tip: If the burn is not perfectly prograde by angle φ (in radians),
// scale by cos φ: Δε ≈ v · Δv · cos φ  (small-angle approximation).
```
