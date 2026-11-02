[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hyperbolicTimeOfFlight

# Function: hyperbolicTimeOfFlight()

```ts
function hyperbolicTimeOfFlight(
  nu1: Radians,
  nu2: Radians,
  e: number,
  a: number,
  mu: number
): number;
```

Defined in:
[orbits/hyperbolic-time-of-flight.ts:66](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/hyperbolic-time-of-flight.ts#L66)

Compute the **time of flight between two points on a hyperbola**, given by their
true anomalies.

$$
t_2 - t_1 = \sqrt{\frac{-a^3}{\mu}}\,\Big[(e\sinh F_2 - F_2) - (e\sinh F_1 - F_1)\Big]
$$

with each hyperbolic anomaly $F$ from
[trueToHyperbolicAnomaly](trueToHyperbolicAnomaly.md).

**Units**

- Inputs: `nu1`, `nu2` in **radians**, `e` dimensionless, `a` in **m**
  (negative), `mu` in **m³/s²**.
- Output: time in **s**, negative if `nu2` comes before `nu1`.

::: info Notes

- Both points must lie inside the asymptotes. The incoming branch can be given
  as negative angles or just below 2π.
- Crossing periapsis needs no special handling: $F$ changes sign there.
- To go from a time to a position, solve $M_h = e\sinh F - F$ with
  [solveKeplerHyperbolic](solveKeplerHyperbolic.md), then use
  [hyperbolicToTrueAnomaly](hyperbolicToTrueAnomaly.md).

:::

::: practice Apollo 11, falling towards the Moon

**13.8 h**

_From the edge of the Moon's sphere of influence, 62 640 km out, to closest
approach_

The flight took 14 h 10 min from crossing into the sphere to lighting the engine
for lunar orbit insertion. Patched conics leave out Earth's pull inside the
sphere, one reason the two differ.

```ts
const e = 1.44; // approach hyperbola
const a = -4_203_000; // m
const p = a * (1 - e * e);
const nuSoi = -Math.acos((p / 62_640_000 - 1) / e) as Radians; // incoming
hyperbolicTimeOfFlight(nuSoi, 0 as Radians, e, a, 4.902800118e12); // ≈ 49 600 s
```

:::

## Parameters

| Parameter | Type                                             | Description                                                                       |
| --------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `nu1`     | [`Radians`](../../types/type-aliases/Radians.md) | True anomaly at the start $\nu_1$ in **radians** (finite, inside the asymptotes). |
| `nu2`     | [`Radians`](../../types/type-aliases/Radians.md) | True anomaly at the end $\nu_2$ in **radians** (finite, inside the asymptotes).   |
| `e`       | `number`                                         | Eccentricity $e$ (finite, > 1).                                                   |
| `a`       | `number`                                         | Semi-major axis $a$ in **m** (finite, < 0).                                       |
| `mu`      | `number`                                         | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).                         |

## Returns

`number`

Time of flight in **s** from `nu1` to `nu2`.

## Throws

If any input is not a finite number.

## Throws

If `e <= 1`, `a >= 0`, `mu <= 0`, or either true anomaly is at or beyond the
asymptotes.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// From periapsis to 90° on a hyperbola with e = 2, a = -10 000 km, around Earth
const t = hyperbolicTimeOfFlight(
  0 as Radians,
  (Math.PI / 2) as Radians,
  2,
  -10_000e3,
  3.986004418e14
);
// t ≈ 3 401 s
```

## See

- [solveKeplerHyperbolic](solveKeplerHyperbolic.md)
- https://en.wikipedia.org/wiki/Hyperbolic_trajectory Hyperbolic trajectory
