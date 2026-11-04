# Choose a landing site on Mars

Perseverance landed in Jezero crater in 2021, near the delta a river once built
into the crater's lake. The delta's front, a slope of layered sediment, is where
the science is. It is also the last place you'd want to put a lander. In this
tutorial you'll take a small piece of real terrain on that front, find where a
lander stays upright, and measure how close it gets you to the rocks you came
for.

- **You'll use:** `createGrid`, `slopeGrid`, `aspectGrid`,
  `terrainRoughnessIndexGrid`, `hillshadeGrid`, `tipOverAngle`,
  `safeLandingGrid`, `greatCircleDistance`, `PLANETS`
- **Time:** about 15 minutes

## 1. A piece of the delta front

The terrain comes from a digital terrain model (DTM) made by the HiRISE camera
on NASA's Mars Reconnaissance Orbiter, from two images taken from different
angles. It has a height every metre. This tutorial takes one height every 20 m:
a grid of 10 × 10 cells, about 200 m on a side, whose north-west cell is centred
at 18.4649° N, 77.4204° E.

The heights are in metres above the Mars datum, the surface Mars's sea level
would have if it had one, so they're negative: from −2,527.6 m to −2,476.0 m,
51.6 m of relief. The west of the grid is the flat top of the delta. Towards the
east, the ground falls away down the front.

```ts
import { createGrid } from '@interstellar-tools/maps';

// Row 0 is the north edge; columns run west to east
const grid = createGrid({
  rows: 10,
  columns: 10,
  values: heights, // the 100 heights below
  cellSize: { x: 19.83, y: 20.19 } // m
});
```

The cells aren't quite square. The DTM is in an equirectangular projection that
is true to scale at 15° N, and Jezero lies at 18.5° N, where the same step in
longitude covers $\cos 18.5° / \cos 15° = 0.98$ times the distance: 19.83 m
instead of 20.19 m.

::: details The 100 heights, in m

```ts
// prettier-ignore
export const heights = [
  // Row 0
  -2477.50, -2478.09, -2478.33, -2478.20, -2478.24,
  -2478.44, -2478.70, -2480.87, -2494.15, -2501.61,
  // Row 1
  -2478.47, -2478.70, -2478.83, -2478.71, -2478.54,
  -2478.20, -2477.60, -2478.44, -2494.00, -2502.97,
  // Row 2
  -2479.67, -2479.34, -2479.29, -2479.05, -2478.68,
  -2477.84, -2476.03, -2476.21, -2494.60, -2504.65,
  // Row 3
  -2480.24, -2479.86, -2479.59, -2479.21, -2478.69,
  -2478.06, -2476.05, -2479.98, -2496.00, -2506.34,
  // Row 4
  -2480.64, -2480.07, -2479.66, -2478.92, -2478.97,
  -2478.35, -2476.32, -2485.39, -2496.67, -2507.77,
  // Row 5
  -2480.83, -2480.42, -2479.73, -2478.67, -2478.17,
  -2479.23, -2478.28, -2487.00, -2499.54, -2509.70,
  // Row 6
  -2481.16, -2480.50, -2480.08, -2478.82, -2482.52,
  -2487.63, -2489.92, -2495.22, -2504.59, -2514.41,
  // Row 7
  -2481.42, -2480.85, -2480.41, -2479.80, -2488.63,
  -2495.06, -2499.78, -2504.42, -2511.45, -2518.90,
  // Row 8
  -2481.72, -2480.98, -2480.75, -2483.56, -2492.38,
  -2500.13, -2505.91, -2511.43, -2517.44, -2524.05,
  // Row 9
  -2481.35, -2480.86, -2480.21, -2484.38, -2494.60,
  -2503.46, -2509.96, -2516.27, -2521.95, -2527.59
];
```

:::

<MarsLandingGrid layer="height" />

## 2. Slope and aspect

How steep is the ground, and which way does it face? `slopeGrid` and
`aspectGrid` answer both for every cell, from the heights of its eight
neighbours (Horn's method):

```ts
import { aspectGrid, slopeGrid } from '@interstellar-tools/maps';

const slope = slopeGrid(grid); // radians from level
const aspect = aspectGrid(grid); // radians clockwise from north, downhill
```

A cell on the edge of the grid doesn't have eight neighbours, so its slope is
`NaN`. That leaves the inner 8 × 8 = 64 cells. On the top of the delta, in the
two western columns, the slope is 1.1° to 3.1°. The front reaches **34.3°** in
row 2, column 8, facing east (aspect 94.6°), down towards the crater floor. A
steep face is where the delta's layers lie open, so make that cell your target.

<MarsLandingGrid layer="slope" />

## 3. Roughness

The Terrain Roughness Index (TRI) is the typical height difference between a
cell and its eight neighbours. Smooth ground scores near zero:

```ts
import { terrainRoughnessIndexGrid } from '@interstellar-tools/maps';

const roughness = terrainRoughnessIndexGrid(grid); // m
```

The two western columns score 0.4 m to 1.7 m. On the front the roughness climbs
to **11.9 m**.

<MarsLandingGrid layer="roughness" />

## 4. Shade it

Numbers are hard to see as terrain. `hillshadeGrid` lights the grid with a sun
in a given direction and returns each cell's brightness, from 0 (in shadow) to 1
(facing the sun):

```ts
import { hillshadeGrid } from '@interstellar-tools/maps';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const shade = hillshadeGrid(grid, rad(315), rad(30)); // sun in the north-west, 30° up
```

Maps are usually lit from the north-west, the side our eyes expect light to come
from. Level ground then has a brightness of $\sin 30° = 0.5$, and the two
western columns sit at 0.45 to 0.52. The front faces away from the sun, and the
target is nearly black, at 0.04. Move the sun to the east (azimuth 90°), as on a
Martian morning, and the target lights up to 0.90.

<MarsLandingGrid layer="shade" />

## 5. Will the lander stay upright?

A lander tips over when the ground tilts its centre of mass out past the edge of
its feet. Seen from the side, that happens at the angle
$\arctan(r_\text{footprint} / h_\text{CoM})$, where $r_\text{footprint}$ is how
far the edge of the feet is from the centre of mass and $h_\text{CoM}$ is how
high the centre of mass sits. Take a made-up lander with its feet 1.0 m out and
its centre of mass 1.5 m up:

```ts
import { tipOverAngle } from '@interstellar-tools/maps';

const limit = tipOverAngle(1.0, 1.5); // 33.7°
```

Touching down adds tilt of its own: a leg lands on a rock, or the lander is
still moving sideways. Allow 12° for that, and the ground can slope at most
21.7°. **42 of the 64 cells** pass.

<MarsLandingGrid layer="tipping" />

Uneven ground is a hazard too, even where it's level on average.
`safeLandingGrid` checks the slope and the roughness together. It returns 1 for
a safe cell, 0 for an unsafe one and `NaN` on the edge:

```ts
import { safeLandingGrid } from '@interstellar-tools/maps';

const safe = safeLandingGrid(grid, {
  rFootprint: 1.0,
  hCoM: 1.5,
  dynamicTilt: rad(12),
  maxRoughness: 1.0 // m
});
```

With a roughness limit of 1 m, **23 of the 64 cells** are safe. The limit rules
out 19 cells the lander wouldn't have tipped over in: a band where the flat top
bends down into the steep face.

<MarsLandingGrid layer="safe" />

::: info Why roughness rules out so much here

On a grid this coarse, roughness mostly measures slope again. On an even slope,
the TRI is $\sqrt{3/4}\,\Delta x \tan\theta$, so with 20 m cells a TRI of 1 m is
a slope of only 3.3°. The rocks a lander could catch a leg on are smaller than a
cell. Finding them takes heights every metre, like the full DTM this grid comes
from.

:::

## 6. How far is the target?

The nearest safe cell to the target is in row 1, column 5, on the delta top.
`greatCircleDistance` measures the distance between the two cell centres along
the surface of Mars:

```ts
import { PLANETS } from '@interstellar-tools/constants';
import { greatCircleDistance } from '@interstellar-tools/equations';

const mars = PLANETS.find((planet) => planet.id === 'mars')!;
const R = mars.radius.value * 1000; // mean radius, 3,389.5 km in m
const site = { lat: rad(18.464557), lon: rad(77.422182) }; // row 1, column 5
const target = { lat: rad(18.464217), lon: rad(77.423241) }; // row 2, column 8
const d = greatCircleDistance(site.lat, site.lon, target.lat, target.lon, R);
```

::: practice Landing site on Jezero's delta front

**62.7 m**

_From the nearest safe cell to the target_

The site is 16.4 m above the target. Perseverance landed on the crater floor
about 2.1 km to the south-east, at 18.44° N, 77.45° E.

:::

Across 63 m, the curve of Mars hardly matters: on the flat grid, the distance is
$\sqrt{(3 \times 19.83)^2 + 20.19^2} = 62.8$ m. The great-circle distance earns
its keep over longer distances, like the 2.1 km to Perseverance, or across the
planet.

## 7. Try it yourself

- In the last map, set the touchdown tilt to 0°. Why doesn't the number of safe
  cells change?
- Raise the roughness limit until it no longer matters. How many cells are safe
  then, and where is the nearest one?
- Light the grid from the east (azimuth 90°). Which cell ends up darkest, and
  which way does it face?
