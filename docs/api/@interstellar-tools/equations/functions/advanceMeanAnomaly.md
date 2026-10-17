[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / advanceMeanAnomaly

# Function: advanceMeanAnomaly()

```ts
function advanceMeanAnomaly(
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  timeStep: TemporalInterface
): Radians;
```

Defined in:
[anomalies/advance-mean-anomaly.ts:63](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/equations/src/categories/anomalies/advance-mean-anomaly.ts#L63)

Advances an orbit by a time step and returns its new **mean anomaly** ($M$).

The orbit's `angle` (true anomaly) is the starting point. To get the eccentric
anomaly from the result, pass it to [solveKepler](solveKepler.md).

**Mathematical Explanation:**

The **mean anomaly** is a measure of the position of an orbiting body as if it
moved with uniform angular motion along a circular orbit with the same period as
the actual elliptical orbit. It is computed as:

$M = M_0 + n \cdot \Delta T$

where:

- $M_0$ is the **initial mean anomaly** (converted from true anomaly if
  necessary).
- $n$ is the **mean motion**, given by: $n = \frac{2\pi}{P}$ where $P$ is the
  orbital period in days.
- $\Delta T$ is the time step, converted to days from its unit.

## Parameters

| Parameter  | Type                                                                                                                                                        | Description                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `orbit`    | [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`OrbitInterface`](../../types/interfaces/OrbitInterface.md), `"e"` | `"angle"`                                                             | `"period"`> | The body's orbit, for example `body.orbit` from a dataset. |
| `timeStep` | [`TemporalInterface`](../../types/interfaces/TemporalInterface.md)                                                                                          | The time step over which to compute the change, in any temporal unit. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The computed mean anomaly in radians.

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the orbit's eccentricity is outside the range $0 \leq e < 1$.

## Example

```ts
import { advanceMeanAnomaly } from '@interstellar-tools/equations';

const marsOrbit = {
  e: 0.0934, // Eccentricity of Mars' orbit
  angle: 1.047 as Radians, // Initial true anomaly (in radians)
  period: { value: 687, unit: 'd' } // Orbital period in days
};

const timeStep: TemporalInterface = { value: 1, unit: 'd' }; // 1-day step
const meanAnomaly = advanceMeanAnomaly(marsOrbit, timeStep);
console.log(meanAnomaly); // Output: Computed mean anomaly in radians
```

## See

- [solveKepler](solveKepler.md) to convert the mean anomaly to the eccentric
  anomaly.
- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
