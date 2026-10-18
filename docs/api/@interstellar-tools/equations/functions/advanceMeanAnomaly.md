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
[anomalies/advance-mean-anomaly.ts:65](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/equations/src/categories/anomalies/advance-mean-anomaly.ts#L65)

Advances an orbit by a time step and returns its new **mean anomaly** ($M$).

The orbit's `angle` (true anomaly) is the starting point. To get the eccentric
anomaly from the result, pass it to [solveKepler](solveKepler.md). To find a
body at a given date, use [meanAnomalyAt](meanAnomalyAt.md) or
[trueAnomalyAt](trueAnomalyAt.md).

**Mathematical Explanation:**

The **mean anomaly** is a measure of the position of an orbiting body as if it
moved with uniform angular motion along a circular orbit with the same period as
the actual elliptical orbit. It grows linearly with time:

$M = M_0 + n \cdot \Delta T, \qquad n = \frac{2\pi}{|P|}$

where:

- $M_0$ is the **initial mean anomaly**, converted from the true anomaly
  `angle`.
- $n$ is the **mean motion**, from the period $P$ in days. The sign of $P$ is
  ignored, so a positive step always moves the body forward along its orbit.
- $\Delta T$ is the time step, converted to days from its unit.

The step can be any length, from a fraction of a second to many orbits, and
negative to go back in time. The result is wrapped to $[0, 2\pi)$.

## Parameters

| Parameter  | Type                                                                                                                                                        | Description                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `orbit`    | [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`OrbitInterface`](../../types/interfaces/OrbitInterface.md), `"e"` | `"angle"`                                                             | `"period"`> | The body's orbit, for example `body.orbit` from a dataset. |
| `timeStep` | [`TemporalInterface`](../../types/interfaces/TemporalInterface.md)                                                                                          | How far to advance, in any temporal unit; negative goes back in time. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The mean anomaly after the time step, in $[0, 2\pi)$.

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

advanceMeanAnomaly(marsOrbit, { value: 1, unit: 'd' }); // one day on
advanceMeanAnomaly(marsOrbit, { value: 10, unit: 'yr' }); // ten years on
advanceMeanAnomaly(marsOrbit, { value: -1, unit: 'd' }); // one day back
```

## See

- [solveKepler](solveKepler.md) to convert the mean anomaly to the eccentric
  anomaly.
- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
