[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / meanToEccentricAnomaly

# Function: meanToEccentricAnomaly()

```ts
function meanToEccentricAnomaly(
  body: CelestialBodyType,
  timeStep: TemporalInterface
): number;
```

Defined in:
[anomalies/mean-to-eccentric-anomaly.ts:60](https://github.com/phun-ky/interstellar-tools/blob/832c313b094c927abcdab3b706dc5f72fdc7bae0/packages/equations/src/categories/anomalies/mean-to-eccentric-anomaly.ts#L60)

Computes the **mean anomaly** ($M$) of a celestial body for a given time step.

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
- $\Delta T$ is the time step.

## Parameters

| Parameter  | Type                                                                 | Description                                               |
| ---------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| `body`     | [`CelestialBodyType`](../../types/type-aliases/CelestialBodyType.md) | The celestial body for which to compute the mean anomaly. |
| `timeStep` | [`TemporalInterface`](../../types/interfaces/TemporalInterface.md)   | The time step over which to compute the change.           |

## Returns

`number`

The computed mean anomaly in radians.

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the body's eccentricity is outside the range $0 \leq e < 1$.

## Example

```ts
import { meanToEccentricAnomaly } from './mean-to-eccentric-anomaly';

const mars: CelestialBodyType = {
  name: 'Mars',
  e: 0.0934, // Eccentricity of Mars' orbit
  angle: 1.047, // Initial true anomaly (in radians)
  period: { value: 687, unit: 'day' } // Orbital period in days
};

const timeStep: TemporalInterface = { value: 1, unit: 'day' }; // 1-day step
const meanAnomaly = meanToEccentricAnomaly(mars, timeStep);
console.log(meanAnomaly); // Output: Computed mean anomaly in radians
```

## See

- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
