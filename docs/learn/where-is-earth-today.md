# Where is Earth today?

Earth doesn't move around the Sun at a steady pace. It's fastest in early
January, when it's closest, and slowest in early July. In this tutorial you'll
find where Earth is on its orbit today, using three equations and the idea that
ties them together: **Kepler's equation**.

- **You'll use:** `solveKepler`, `eccentricToTrueAnomaly`, `norm2pi`
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

The mean anomaly is the easy part. At J2000 (1 January 2000, 12:00), Earth's
mean anomaly was -2.473°: its mean longitude (100.464°) minus its longitude of
perihelion (102.937°), both from
[JPL's orbital elements](https://ssd.jpl.nasa.gov/planets/approx_pos.html). It
advances by $2\pi / P$ every day:

```ts
import { norm2pi } from '@interstellar-tools/equations';

const e = 0.0167; // Earth's eccentricity
const P = 365.256; // orbital period, days
const M0 = -2.473 * (Math.PI / 180); // mean anomaly at J2000
const days = 9786; // J2000 to 17 October 2026
const M = norm2pi(M0 + ((2 * Math.PI) / P) * days); // 282.7°
```

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
