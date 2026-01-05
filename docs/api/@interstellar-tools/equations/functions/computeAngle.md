[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / computeAngle

# Function: computeAngle()

```ts
function computeAngle(
  body: CelestialBodyType,
  timeStep: TimeStepInterface
): Radians;
```

Defined in:
[angle/compute-angle.ts:77](https://github.com/phun-ky/interstellar-tools/blob/eba42da13df2a93d9bf5de153f401b02d475cf3b/packages/equations/src/categories/angle/compute-angle.ts#L77)

Computes the orbital angle (true anomaly, $ν$) of a celestial body for a given
date and time step.

**Mathematical Explanation:**

This function determines the **true anomaly** ($ν$) based on the time elapsed
since the **J2000 epoch** (January 1, 2000) and the provided time step. The
calculation follows these steps:

**Step 1: Compute Time Elapsed Since J2000**

The number of days since **J2000** is computed as:
$\Delta T = \frac{t - t_{J2000}}{\text{MILLISECONDS\_PER\_DAY}}$ where:

- $t$ is the current date in milliseconds.
- $t_{J2000}$ is **J2000** (2000-01-01T00:00:00Z).
- **MILLISECONDS_PER_DAY** is the number of milliseconds in one day.

**Step 2: Compute the Mean Anomaly ($M$)**

The **mean anomaly** is calculated as:
$M = M_0 + n \cdot (\Delta T + \text{timeStep})$ where:

- $M_0$ is the initial mean anomaly at **J2000**.
- $n$ is the mean motion (orbital angular velocity).
- $\text{timeStep}$ is the time step in days.

**Step 3: Solve Kepler’s Equation for Eccentric Anomaly ($E$)**

Kepler’s equation: $M = E - e \sin(E)$ is solved numerically to obtain the
**eccentric anomaly** ($E$).

**Step 4: Convert Eccentric Anomaly ($E$) to True Anomaly ($ν$)**

Using the relation:
$ν = 2 \tan^{-1} \left( \sqrt{\frac{1+e}{1-e}} \tan\left(\frac{E}{2}\right) \right)$

**Step 5: Adjust the True Anomaly for Certain Bodies**

- For **comets**, the final **true anomaly** is adjusted by subtracting the
  **eccentricity** ($e$).
- For **stars and other celestial objects**, the computed **true anomaly** is
  used directly.

## Parameters

| Parameter  | Type                                                                 | Description                                               |
| ---------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| `body`     | [`CelestialBodyType`](../../types/type-aliases/CelestialBodyType.md) | The celestial body for which to compute the true anomaly. |
| `timeStep` | [`TimeStepInterface`](../../types/interfaces/TimeStepInterface.md)   | The time step in days since the last frame.               |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The computed true anomaly in radians.

## Example

```ts
import { computeAngle } from './compute-angle';

const earth: CelestialBodyType = {
  name: 'Earth',
  e: 0.0167, // Orbital eccentricity
  angle: 0 // Initial angle
};

const timeStep: TimeStepInterface = { days: 1 }; // Time step of 1 day
const angle: Radians = computeAngle(earth, timeStep);
console.log(angle); // Output: Computed true anomaly in radians
```

## See

- [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
- [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
- [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
- [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
