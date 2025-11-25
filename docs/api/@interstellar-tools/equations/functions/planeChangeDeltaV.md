[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / planeChangeDeltaV

# Function: planeChangeDeltaV()

```ts
function planeChangeDeltaV(v: number, deltaI: Radians): number;
```

Defined in:
[manoeuvres/plane-change-delta-v.ts:57](https://github.com/phun-ky/interstellar-tools/blob/9c13350dafd209031a6cfebe54b6883c404a0515/packages/equations/src/categories/manoeuvres/plane-change-delta-v.ts#L57)

**Inclination (plane) change** Δv at speed ($v$).

**Definition**

$$
\Delta v = 2\,v\,\sin\!\left(\frac{\Delta i}{2}\right)
$$

**Units**

- Inputs: ($v$) in **m/s**, ($\Delta i$) in **radians**.
- Output: ($\Delta v$) in **m/s**.

::: info Notes

- Valid for an **instantaneous** plane change (impulsive) performed at speed
  ($v$) (e.g., at a node). For best efficiency, perform at **apogee** (lowest
  speed) when possible.
- Domain for ($\Delta i$) is (
  $[0,\pi] $) (0–180°). Larger angles can be reduced modulo ($2\pi$).

:::

## Parameters

| Parameter | Type                                             | Description                                                           |
| --------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| `v`       | `number`                                         | Current speed magnitude (m/s). Must be finite and ≥ 0.                |
| `deltaI`  | [`Radians`](../../types/type-aliases/Radians.md) | Inclination change angle Δi (radians). Must be finite and 0 ≤ Δi ≤ π. |

## Returns

`number`

Required impulsive Δv (m/s).

## Throws

If `v` is not a number or `deltaI` not a number (radians).

## Throws

If `v` is non-finite or < 0; if `deltaI` is non-finite or outside \[0, π].

## Example

```ts
import {
  planeChangeDeltaV,
  circularSpeed
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

// Helper: degrees → radians (branded)
const toRadians = (deg: number): Radians => ((deg * Math.PI) / 180) as Radians;

// Earth’s GM (μ) in m^3/s^2
const muEarth = 3.986004418e14;

// Example: instantaneous plane change at LEO (~400 km altitude)
const rLEO = 6378e3 + 400e3; // meters
const vLEO = circularSpeed(rLEO, muEarth); // m/s

// Change from 28.5° (Kennedy inclination) to equatorial (0°) → Δi = 28.5°
const deltaI = toRadians(28.5);
const dv_LEO = planeChangeDeltaV(vLEO, deltaI);

console.log(`LEO speed: ${vLEO.toFixed(1)} m/s`);
console.log(`Δi: 28.5°  →  Δv ≈ ${dv_LEO.toFixed(1)} m/s`);

// Another quick check: a modest 10° plane change at the same altitude
const dv_10deg = planeChangeDeltaV(vLEO, toRadians(10));
console.log(`Δi: 10°    →  Δv ≈ ${dv_10deg.toFixed(1)} m/s`);
```
