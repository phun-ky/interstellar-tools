# Where is Earth today?

Earth doesn't move around the Sun at a steady pace. It's fastest in early
January, when it's closest, and slowest in early July. In this tutorial you'll
find where Earth is on its orbit today, using three equations and the idea that
ties them together: **Kepler's equation**.

- **You'll use:** `PLANETS`, `trueToMeanAnomaly`, `solveKepler`,
  `eccentricToTrueAnomaly`, `norm2pi`
- **Time:** about 10 minutes

## 1. Three ways to describe a position

An orbit position can be given as three different angles, all measured from
perihelion (the closest point to the Sun):

- **Mean anomaly $M$**: where Earth _would_ be if it moved at a steady pace. It
  grows by the same amount every day, so it's easy to compute.
- **Eccentric anomaly $E$**: a helper angle on a circle drawn around the orbit.
- **True anomaly $\nu$**: where Earth actually is.

Drag the sliders. With $e = 0$ all three are the same; the more stretched the
orbit, the further they drift apart.

<OrbitWidget :e="0.5" :mean-deg="60" />

## 2. Mean anomaly today

Start from Earth's orbit in the `PLANETS` dataset. Its `orbit.angle` is the true
anomaly at J2000 (1 January 2000, 12:00), so first turn it into a mean anomaly
with `trueToMeanAnomaly`. That's the easy direction, with a closed-form formula.
The mean anomaly then advances by the same $2\pi / P$ every day:

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { norm2pi, trueToMeanAnomaly } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';

const earth = PLANETS.find((planet) => planet.id === 'earth')!;
const { e, angle, period } = earth.orbit!; // e 0.0167, P 365.256 days
const M0 = trueToMeanAnomaly(angle, e); // -2.47°: just before perihelion
const days = 9786; // J2000 to 17 October 2026
const M = norm2pi(
  M0 + ((2 * Math.PI) / Math.abs(period.value)) * days
) as Radians; // 282.7°
```

::: tip Shortcut

`meanAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z'))` does this step
for any date, measuring from J2000 for you, and `trueAnomalyAt` does all three
steps of this tutorial in one call.

:::

## 3. Solve Kepler's equation

Going from $M$ to $E$ means solving $M = E - e \sin E$, which has no algebraic
solution. `solveKepler` does it numerically, and `eccentricToTrueAnomaly` takes
the last step:

```ts
import {
  eccentricToTrueAnomaly,
  solveKepler
} from '@interstellar-tools/equations';

const E = solveKepler(M, e); // 281.8°
const nu = eccentricToTrueAnomaly(E, e); // 280.8°
```

::: practice Earth, 17 October 2026

**280.8°**

_True anomaly, 287 days past perihelion_

Earth is 0.9966 au from the Sun, a little closer than average, and heading for
perihelion on 3 January.

:::

## 4. Try it yourself

- Set the widget to $e = 0.0167$. How far apart are $M$ and $\nu$ at most?
- Repeat the calculation for Mars ($e = 0.0934$, $P = 687$ days). Why is the
  difference bigger?
