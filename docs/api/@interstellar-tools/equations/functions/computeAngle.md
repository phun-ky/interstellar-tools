[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / computeAngle

# Function: computeAngle()

```ts
function computeAngle(
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  timeStep: TimeStepInterface
): Radians;
```

Defined in:
[angle/compute-angle.ts:66](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/equations/src/categories/angle/compute-angle.ts#L66)

Advances a body along its orbit by one time step and returns its new **true
anomaly** ($\nu$).

The orbit's `angle` is the starting true anomaly. There is no date input: call
this once per frame or step, and feed the result back in as the next `angle` to
move the body over time.

**Step 1: Mean anomaly after the time step ($M$)**

Done by [advanceMeanAnomaly](advanceMeanAnomaly.md): $M = M_0 + n \cdot \Delta
t, \qquad n = \frac{2\pi}{|P|}$ where:

- $M_0$ is the mean anomaly at the start, converted from the true anomaly
  `angle` (equal to it when $e = 0$).
- $n$ is the mean motion, from the period $P$ converted to days. The sign of $P$
  is ignored, so the angle always increases.
- $\Delta t$ is `timeStep.value` in days, clamped to at least $10^{-5}$ days and
  at most $10\,|P|$ ($|P|$ when $e \geq 0.9$).

The result is wrapped to $[0, 2\pi)$.

**Step 2: Solve Kepler's equation for the eccentric anomaly ($E$)**

$M = E - e \sin(E)$ is solved numerically by [solveKepler](solveKepler.md).

**Step 3: Convert the eccentric anomaly to the true anomaly ($\nu$)**

Done by [eccentricToTrueAnomaly](eccentricToTrueAnomaly.md): $\nu = 2 \tan^{-1}
\left( \sqrt{\frac{1+e}{1-e}} \tan\left(\frac{E}{2}\right) \right)$

## Parameters

| Parameter  | Type                                                                                                                                                        | Description                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `orbit`    | [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`OrbitInterface`](../../types/interfaces/OrbitInterface.md), `"e"` | `"angle"`                    | `"period"`> | The body's orbit, for example `body.orbit` from a dataset. |
| `timeStep` | [`TimeStepInterface`](../../types/interfaces/TimeStepInterface.md)                                                                                          | How far to advance, in days. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The true anomaly after the time step, in radians.

## Throws

[RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
If the orbit's eccentricity is outside $0 \leq e < 1$.

## Example

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { computeAngle } from '@interstellar-tools/equations';

const earth = PLANETS.find((planet) => planet.id === 'earth')!;
const timeStep: TimeStepInterface = { value: 1, unit: 'd' };

// Earth's true anomaly one day after its dataset position
const angle: Radians = computeAngle(earth.orbit!, timeStep);
```

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
