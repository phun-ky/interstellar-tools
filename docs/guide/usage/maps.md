---
title: Maps
description:
  Map projections, web map tiles and terrain from elevation grids with
  @interstellar-tools/maps, worked through on Mars.
---

# Maps <Badge type="warning" text="0.x" />

Flat maps of round bodies, the tiles web maps serve them in, and what an
elevation grid says about the ground. These functions are in
`@interstellar-tools/maps`, which is still 0.x: its API may change in a minor
release.

```shell
npm i @interstellar-tools/maps
```

The examples are on Mars, and every number on this page is checked by a test.
Like the rest of Interstellar Tools, the functions take angles in **radians**
and lengths in **metres**.

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const R = 3_396_190; // Mars's equatorial radius, m
```

[[toc]]

## Choose a projection

No flat map keeps everything a globe shows. A **conformal** projection keeps
angles, so small shapes look right, but stretches areas. An **equal-area**
projection keeps areas, but shears shapes. Pick the property the map is for:

| Projection                   | Keeps                                  | Good for                                       |
| ---------------------------- | -------------------------------------- | ---------------------------------------------- |
| Mercator                     | Angles                                 | Web maps and tiles, navigation                 |
| Equirectangular              | Distances along meridians              | Global mosaics and elevation models            |
| Sinusoidal                   | Areas                                  | Global mosaics where area counts               |
| Mollweide                    | Areas                                  | Whole-sphere maps, sky surveys                 |
| Lambert azimuthal equal-area | Areas, and directions from the centre  | Hemispheres and polar regions                  |
| Stereographic                | Angles, and directions from the centre | Polar caps                                     |
| Orthographic                 | Directions from the centre             | Globe views: a planet as it looks from far off |

Each is a function of the same name: `mercator`, `equirectangular`,
`sinusoidal`, `mollweide`, `lambertAzimuthalEqualArea`, `stereographic` and
`orthographic`.

Below, every map has a graticule every 30° and **Tissot's circles**: circles of
the same size on the sphere, 12° across. Where a projection stretches, they
grow; where it shears, they turn into ellipses. On a conformal map they stay
round; on an equal-area map they keep their area.

<div class="projection-grid">
<ProjectionMap projection="mercator" :max-latitude="80"><strong>Mercator</strong>, conformal. The circles stay round but grow towards the poles, which never reach the map. Shown to 80°.</ProjectionMap>
<ProjectionMap projection="equirectangular"><strong>Equirectangular</strong>, neither. Latitude and longitude are spaced evenly, so a grid in degrees is a grid on the map.</ProjectionMap>
<ProjectionMap projection="sinusoidal"><strong>Sinusoidal</strong>, equal-area. Every parallel is its true length; shapes shear away from the central meridian.</ProjectionMap>
<ProjectionMap projection="mollweide"><strong>Mollweide</strong>, equal-area. The whole sphere in an ellipse, with less shear at the edges than the sinusoidal.</ProjectionMap>
<ProjectionMap projection="lambertAzimuthalEqualArea" :reach="179"><strong>Lambert azimuthal equal-area</strong>, centred on 0° N, 0° E. The whole sphere fits in a circle; the far side squashes into its rim.</ProjectionMap>
<ProjectionMap projection="stereographic" :phi0="90" :reach="110"><strong>Stereographic</strong>, conformal, centred on the north pole. The circles stay round and grow away from the centre. Shown to 20° S.</ProjectionMap>
<ProjectionMap projection="orthographic" :phi0="30" :lambda0="20"><strong>Orthographic</strong>, centred on 30° N, 20° E. One hemisphere, as a globe looks from far away.</ProjectionMap>
</div>

<DocPhoto
  src="maps/tissot-mercator.webp"
  alt="A Mercator world map with red Tissot circles that grow larger towards the poles"
  :width="1600"
  :height="1592"
  credit="Eric Gaba (Sting)"
  licence="CC BY-SA 4.0"
  source="https://commons.wikimedia.org/wiki/File:Tissot_indicatrix_world_map_Mercator_proj.svg"
  paper>

Tissot's circles on a Mercator map of Earth. They grow towards the poles, which
is why Greenland looks as large as Africa, 14 times its area.

</DocPhoto>

Each projection has an inverse, `inverseMercator`, `inverseEquirectangular` and
so on, from a point on the map back to latitude and longitude. Here is
Perseverance's landing site, at 18.4447° N, 77.4508° E, on the equirectangular
map most Mars mosaics use, and on Mercator:

```ts
import {
  equirectangular,
  inverseEquirectangular,
  mercator
} from '@interstellar-tools/maps';

const site = [toRad(18.4447), toRad(77.4508)] as const;

equirectangular(...site, R); // ≈ { x: 4 590 873, y: 1 093 304 } m
inverseEquirectangular(4_590_873, 1_093_304, R); // ≈ 18.4447° N, 77.4508° E
mercator(...site, R); // ≈ { x: 4 590 873, y: 1 112 692 } m
```

The same `x`, but Mercator puts the site 19.4 km further north: it stretches
north–south as much as east–west, to keep angles.

The azimuthal projections are centred on a point, `phi0` and `lambda0`, and show
directions from it truly. A polar stereographic map of Mars's north polar cap,
and Curiosity's landing site as seen on a globe centred on Jezero:

```ts
import { orthographic, stereographic } from '@interstellar-tools/maps';

// 5° from the pole: 296.6 km away, 0.2% larger than on the globe
stereographic(toRad(85), toRad(0), R, { phi0: toRad(90) });
// ≈ { x: 0, y: −296 562 } m

orthographic(toRad(-4.5895), toRad(137.4417), R, {
  phi0: toRad(18.4447),
  lambda0: toRad(77.4508)
});
// ≈ { x: 2 931 487, y: −793 474 } m: east, and a little south
```

::: info Points a map can't show

Mercator can't show the poles, which are infinitely far away. Stereographic
can't show the point opposite its centre, Lambert gives that point no single
place, and orthographic hides the far side. These throw a `RangeError`, as does
an inverse given a point off the map. Longitudes come back in (−180°, 180°].

:::

## Serve tiles

Web maps load a map as square **tiles** in spherical Web Mercator. At zoom $z$
the map is $2^z$ tiles across, so each zoom splits every tile into four. Columns
`x` count east from 180° W, and rows `y` count south from the top of the map, at
85.05° N. This is the XYZ scheme of OpenStreetMap; the same tiles work for any
body, since they depend only on angles.

<DocPhoto
  src="maps/blue-marble-next-generation.webp"
  alt="A colour map of Earth in equirectangular projection, with land relief and ocean depths"
  :width="1600"
  :height="800"
  credit="Reto Stöckli, NASA Earth Observatory"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Blue_Marble_Next_Generation_%2B_topography_%2B_bathymetry.jpg">

Earth in equirectangular projection, the usual layout for a whole-planet image.
Tiles are cut from images like this after they're reprojected to Web Mercator.

</DocPhoto>

A **quadkey** names a tile with one digit 0–3 per zoom level, for the quarter of
its parent it is in, so a tile's key starts with its parent's:

<figure class="guide-figure">
<svg viewBox="0 0 640 230" role="img" aria-labelledby="tile-title tile-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="tile-title">Tiles and quadkeys at zooms 0, 1 and 2</title>
  <desc id="tile-desc">At zoom 0 one tile covers the map. At zoom 1 four tiles, with quadkeys 0 and 1 on top and 2 and 3 below. At zoom 2 sixteen tiles, each named by its parent's digit followed by its own. Jezero is in tile 1 at zoom 1 and tile 12 at zoom 2.</desc>
  <g class="tiles" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5">
    <rect x="20" y="20" width="160" height="160" />
    <rect x="230" y="20" width="160" height="160" />
    <path d="M310 20 V180 M230 100 H390" />
    <rect x="440" y="20" width="160" height="160" />
    <path d="M480 20 V180 M520 20 V180 M560 20 V180 M440 60 H600 M440 100 H600 M440 140 H600" />
  </g>
  <rect class="tile-on" x="310" y="20" width="80" height="80" />
  <rect class="tile-on" x="520" y="60" width="40" height="40" />
  <g font-family="var(--vp-font-family-mono)" font-size="13" fill="currentColor" text-anchor="middle">
    <text x="100" y="105">''</text>
    <text x="270" y="65">0</text><text x="350" y="65">1</text>
    <text x="270" y="145">2</text><text x="350" y="145">3</text>
  </g>
  <g font-family="var(--vp-font-family-mono)" font-size="11" fill="currentColor" text-anchor="middle">
    <text x="460" y="44">00</text><text x="500" y="44">01</text><text x="540" y="44">10</text><text x="580" y="44">11</text>
    <text x="460" y="84">02</text><text x="500" y="84">03</text><text x="540" y="84">12</text><text x="580" y="84">13</text>
    <text x="460" y="124">20</text><text x="500" y="124">21</text><text x="540" y="124">30</text><text x="580" y="124">31</text>
    <text x="460" y="164">22</text><text x="500" y="164">23</text><text x="540" y="164">32</text><text x="580" y="164">33</text>
  </g>
  <g font-family="var(--vp-font-family-base)" font-size="13" fill="currentColor" text-anchor="middle">
    <text x="100" y="206">zoom 0: 1 tile</text>
    <text x="310" y="206">zoom 1: 2 × 2</text>
    <text x="520" y="206">zoom 2: 4 × 4</text>
  </g>
</svg>
<figcaption>Highlighted: the tiles that hold Jezero, <code>1</code> and then <code>12</code>. Digits 0 and 2 are the western half, 0 and 1 the northern.</figcaption>
</figure>

```ts
import { quadkey, tileAt, tileBounds } from '@interstellar-tools/maps';

const tile = tileAt(toRad(18.4447), toRad(77.4508), 6);
// { x: 45, y: 28, z: 6 }

quadkey(tile.x, tile.y, tile.z); // '123301'
tileBounds(tile.x, tile.y, tile.z);
// ≈ 16.64° N to 21.94° N, 73.125° E to 78.75° E, in radians
```

At zoom 6 a tile is $2\pi R / 2^6$, 333 km, across at the equator; at zoom 10,
20.8 km. `fromQuadkey` goes from a key back to the tile, and latitudes beyond
85.05° land in the top or bottom row.

## Terrain from an elevation grid

<DocPhoto
  src="maps/mars-mola.webp"
  alt="A colour-coded elevation map of the whole of Mars, with the Tharsis volcanoes in red and Hellas basin in blue"
  :width="1600"
  :height="915"
  credit="NASA"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Mars_topography_(MOLA_dataset)_HiRes.jpg">

Mars from the MOLA laser altimeter: a global elevation grid, from the floor of
Hellas basin, about 8 km below the datum, to Olympus Mons, about 22 km above it.

</DocPhoto>

A **digital elevation model** is a grid of heights. `createGrid` checks one and
holds it: row 0 is the northernmost, columns run west to east, and every cell is
the same size in metres. Here is a patch of ground 5 m by 5 m, at 1 m a cell: a
slope rising 0.1 m per metre to the east, with a 0.4 m boulder on it.

```ts
import { createGrid } from '@interstellar-tools/maps';

const values: number[] = [];

for (let row = 0; row < 5; row++)
  for (let column = 0; column < 5; column++)
    values.push(0.1 * column + (row === 1 && column === 3 ? 0.4 : 0));

const grid = createGrid({
  rows: 5,
  columns: 5,
  values,
  cellSize: { x: 1, y: 1 }
});
```

Most terrain functions read a cell's 3 × 3 neighbourhood, and come as an `…At`
version for one cell and a `…Grid` version for the whole grid. Cells on the edge
have no full neighbourhood, so they come back as `NaN`.

### Slope, aspect and shading

```ts
import { aspectAt, hillshadeAt, slopeAt } from '@interstellar-tools/maps';

const slope = slopeAt(grid, 3, 2); // ≈ 5.71°, the steepest way down
const aspect = aspectAt(grid, 3, 2); // 270°: it faces west, downhill

hillshadeAt(slope, aspect, toRad(270), toRad(30)); // ≈ 0.58, Sun in the west
hillshadeAt(slope, aspect, toRad(90), toRad(30)); // ≈ 0.41, Sun in the east
```

Aspect is a compass bearing, clockwise from north. The hillshade is the
brightness of the ground under a Sun at that azimuth and elevation, from 0 to 1:
the slope faces a western Sun, so it's lit better than flat ground, at $\sin 30°
= 0.5$.

### Roughness and curvature

The **Terrain Roughness Index** is how much a cell's neighbours differ from it,
in metres. The **curvature** is how the slope bends, in 1/m: positive where the
ground is convex, a crest or a boulder, and negative in a hollow.

```ts
import { curvatureAt, terrainRoughnessIndexAt } from '@interstellar-tools/maps';

terrainRoughnessIndexAt(grid, 3, 2); // ≈ 0.087 m, the slope itself
terrainRoughnessIndexAt(grid, 1, 3); // ≈ 0.41 m, on the boulder

curvatureAt(grid, 1, 3); // ≈ { profile: 0.79, planform: 0.80 } per m, convex
curvatureAt(grid, 3, 2); // { profile: 0, planform: 0 }: a plane doesn't bend
```

### Where to land

`safeLandingGrid` puts these together for a lander: a cell is safe where the
lander stays upright on its slope and the ground is no rougher than its
clearance. This lander tips over at $\arctan(1.0 / 0.8) = 51.3°$, and clears 0.3
m:

```ts
import { safeLandingGrid } from '@interstellar-tools/maps';

const safe = safeLandingGrid(grid, {
  rFootprint: 1.0, // m, from the centre of mass to the tipping edge
  hCoM: 0.8, // m, height of the centre of mass
  maxRoughness: 0.3 // m
});
// ·  ·  ·  ·  ·
// ·  1  1  0  ·    the boulder: too rough
// ·  1  1  1  ·
// ·  1  1  1  ·
// ·  ·  ·  ·  ·    · is NaN: no full neighbourhood
```

A mask like this is a first screen, not a landing decision: pick a cell about
the size of the lander's footprint, since boulders smaller than a cell don't
show.

### Water

On bodies with running water, now or in the past, the same grid shows where it
would flow. `flowDirections` sends each cell to its steepest lower neighbour,
`flowAccumulation` adds up the area that drains through each cell, and
`topographicWetnessIndex` combines that area with the slope: high where water
collects, in valley floors and hollows.

## Next

- [Geodesy](/guide/usage/equations/geodesy): distances, heights and areas on the
  sphere and the ellipsoid, before you project them.
- The [maps reference](/api/@interstellar-tools/maps/) has every function, with
  its formula, units and limits, and the imaging and landing functions this page
  doesn't cover.

<style>
.projection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin: 24px 0; }
.guide-figure { margin: 24px 0; }
.guide-figure svg { width: 100%; height: auto; color: var(--vp-c-text-1); }
.guide-figure .tile-on { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-1); stroke-width: 2; }
.guide-figure figcaption { font-size: 14px; color: var(--vp-c-text-2); margin-top: 8px; }
</style>
