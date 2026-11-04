---
title: Geodesy
description:
  Positions, distances, heights and areas on planets and moons with
  @interstellar-tools/equations, worked through on Mars.
---

# Geodesy

Where things are on a planet or moon: how far apart, how high, how much ground a
footprint covers. These functions are in `@interstellar-tools/equations`, in the
Cartography group. They take angles in **radians** and lengths in **metres**.

The examples are on Mars, between the two rovers' landing sites, and every
number on this page is checked by a test.

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
```

[[toc]]

## Choose a reference surface

Planets spin, so most are flattened at the poles: an **oblate spheroid**, with
an equatorial radius $a$ and a shorter polar radius $c$. A sphere of the mean
radius is simpler, and good enough for distances and areas. For latitudes and
heights, use the ellipsoid.

`PLANETS` and `MOONS` in `@interstellar-tools/constants` carry each body's
reference ellipsoid, from the IAU. Get the flattening $f$ and the eccentricity
squared $e^2$, which the ellipsoid functions take, from its radii:

```ts
import { PLANETS } from '@interstellar-tools/constants';
import {
  eccentricitySquaredOblateSpheroid,
  flatteningOblateSpheroid
} from '@interstellar-tools/equations';

const mars = PLANETS.find((planet) => planet.id === 'mars')!;
const a = mars.ellipsoid!.equatorialRadius.value * 1000; // 3 396 190 m
const c = mars.ellipsoid!.polarRadius.value * 1000; // 3 376 200 m
const R = mars.radius.value * 1000; // mean radius, 3 389 500 m
const f = flatteningOblateSpheroid(a, c); // ≈ 0.005886, 1/169.9
const eSquared = eccentricitySquaredOblateSpheroid(a, c); // ≈ 0.011737
```

Mars's poles are 19.99 km closer to its centre than its equator.

| Body  | Use                                                    | Why                                                                                   |
| ----- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Earth | `WGS84` from `@interstellar-tools/constants`           | GPS latitudes and heights are on WGS 84. The IAU's ellipsoid agrees to under a metre. |
| Mars  | The ellipsoid in `PLANETS`, or the mean radius         | Flattened by 1/170: a sphere is up to 13 km off in height.                            |
| Moon  | A sphere, 1 737.4 km                                   | The IAU's lunar ellipsoid is a sphere.                                                |
| Other | `ellipsoid` in `PLANETS` and `MOONS`, where it's given | Small, irregular bodies have only a mean radius.                                      |

### Two kinds of latitude

On an ellipsoid, latitude can be measured two ways, and they differ by a
fraction of a degree:

- **Planetocentric** latitude $\psi$: the angle up from the equator, seen from
  the centre. Most current Mars maps and datasets use it, with longitude east.
- **Planetographic** latitude $\varphi$: the angle of the normal to the surface,
  where a plumb line would hang. Earth's maps and GPS use it, as geodetic
  latitude, and so do `geodeticToBodyFixed` and `bodyFixedToGeodetic`.

<figure class="guide-figure">
<svg viewBox="0 0 640 310" role="img" aria-labelledby="lat-title lat-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="lat-title">Planetocentric and planetographic latitude</title>
  <desc id="lat-desc">A flattened ellipse with a point above its surface. The line from the centre to the point makes the planetocentric latitude psi with the equator. The normal to the surface through the point makes the larger planetographic latitude phi; the height above the ellipsoid is measured along it.</desc>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="250" cy="190" rx="170" ry="110" />
    <circle cx="250" cy="190" r="140" stroke-opacity="0.35" stroke-dasharray="4 4" />
    <path d="M80 190 H440" stroke-opacity="0.45" />
  </g>
  <g fill="none" stroke-width="1.5">
    <path class="accent" d="M250 190 L387.9 53" />
    <path class="accent-2" d="M313.5 190 L387.9 53" />
    <path class="accent" d="M280 190 A30 30 0 0 0 271.3 168.9" />
    <path class="accent-2" d="M343.5 190 A30 30 0 0 0 327.8 163.6" />
  </g>
  <circle class="accent-fill" cx="387.9" cy="53" r="4" />
  <circle cx="359.3" cy="105.7" r="3" fill="currentColor" />
  <g font-family="var(--vp-font-family-mono)" font-size="13" fill="currentColor">
    <text x="398" y="50">point</text>
    <text x="381" y="88">h</text>
    <text x="284" y="182" class="accent-text">ψ</text>
    <text x="348" y="180" class="accent-2-text">φ</text>
    <text x="76" y="214" text-anchor="end">ellipsoid</text>
    <text x="104" y="84" fill-opacity="0.6">sphere</text>
    <text x="250" y="210" text-anchor="middle">centre</text>
  </g>
  <g font-family="var(--vp-font-family-base)" font-size="13" fill="currentColor">
    <text x="460" y="90" class="accent-text">ψ planetocentric:</text>
    <text x="460" y="108">from the centre</text>
    <text x="460" y="140" class="accent-2-text">φ planetographic:</text>
    <text x="460" y="158">along the normal, which</text>
    <text x="460" y="176">misses the centre</text>
  </g>
</svg>
<figcaption>The flattening is exaggerated. The height above the ellipsoid, <code>h</code>, is measured along the normal; the height above a sphere along the line from the centre.</figcaption>
</figure>

On Mars the two latitudes differ most at 45°, by 0.34°: about 20 km on the
ground. Convert through a position vector:

```ts
import {
  geodeticToBodyFixed,
  planetocentricLatitude
} from '@interstellar-tools/equations';

// 45° planetographic, on the surface
const [x, y, z] = geodeticToBodyFixed(toRad(45), toRad(0), 0, a, eSquared);

toDeg(planetocentricLatitude(x, y, z)); // ≈ 44.662°
```

`planetographicLatitudeOblate(x, y, z, a, c)` goes the other way, for a point on
the surface. On a sphere the two latitudes are the same.

## Distances on a sphere

The **great-circle distance** is the shortest way between two points along the
surface. `centralAngle` gives the angle between them at the centre, with the
haversine formula, and `greatCircleDistance` multiplies it by the radius.

Curiosity landed in Gale crater, at 4.5895° S, 137.4417° E. Perseverance landed
in Jezero crater, at 18.4447° N, 77.4508° E:

```ts
import {
  centralAngle,
  greatCircleDistance
} from '@interstellar-tools/equations';

const curiosity = [toRad(-4.5895), toRad(137.4417)] as const;
const perseverance = [toRad(18.4447), toRad(77.4508)] as const;

toDeg(centralAngle(...curiosity, ...perseverance)); // ≈ 63.41°
greatCircleDistance(...curiosity, ...perseverance, R); // ≈ 3 751 km
```

On the mean sphere this is good to about the flattening, 0.6%. If you have
position vectors instead, `centralAngleFromVectors(r1, r2)` gives the same angle
without converting to latitude and longitude.

## Radii of curvature

On an ellipsoid the surface curves differently north–south and east–west, and
both change with latitude. The two **radii of curvature** turn angles into
distances on the ground:

- $M$, along the meridian: one degree of latitude is $M \cdot \pi/180$.
- $N$, in the prime vertical, east–west: one degree of longitude is
  $N\cos\varphi \cdot \pi/180$.

```ts
import {
  meridionalRadiusOfCurvature,
  primeVerticalRadiusOfCurvature
} from '@interstellar-tools/equations';

const phi = toRad(18.4447);
const M = meridionalRadiusOfCurvature(phi, a, eSquared); // ≈ 3 362 252 m
const N = primeVerticalRadiusOfCurvature(phi, a, eSquared); // ≈ 3 398 187 m
const degreeOfLatitude = (M * Math.PI) / 180; // ≈ 58.68 km
const degreeOfLongitude = (N * Math.cos(phi) * Math.PI) / 180; // ≈ 56.26 km
```

Use them to size a grid cell in metres, or to turn a small offset in metres into
degrees.

## Coordinates and heights

`geodeticToBodyFixed` turns a planetographic latitude, longitude and height into
a body-fixed position vector: $x$ through the prime meridian, $z$ along the
rotation axis. `bodyFixedToGeodetic` goes back, with Bowring's method.

```ts
import {
  bodyFixedToGeodetic,
  geodeticToBodyFixed
} from '@interstellar-tools/equations';

const r = geodeticToBodyFixed(toRad(18.4447), toRad(77.4508), 0, a, eSquared);
const { phi, lambda, h } = bodyFixedToGeodetic(...r, a, eSquared);
// phi ≈ 18.4447°, lambda ≈ 77.4508°, h ≈ 0 m
```

For an altitude readout from a position vector, there are two heights:

- `heightAboveSphere(r, R)`: the distance from the centre less the radius.
- `heightAboveEllipsoid(x, y, z, a, eSquared)`: the exact height along the
  normal, the one maps give.

An orbiter 300 km above Mars's north pole:

```ts
import {
  heightAboveEllipsoid,
  heightAboveSphere
} from '@interstellar-tools/equations';

const above = c + 300_000;

heightAboveEllipsoid(0, 0, above, a, eSquared); // 300 000 m
heightAboveSphere([0, 0, above], R); // 286 700 m
```

The mean sphere is 13.3 km above the ellipsoid at the poles, so its height reads
low there, and high at the equator.

::: tip Heights on maps

Heights on the ellipsoid are geometric. Elevations on maps are usually measured
from an equipotential surface instead: the geoid on Earth, within about 100 m of
the ellipsoid, or the areoid on Mars.

:::

<DocPhoto
  src="geodesy/geoid.webp"
  alt="A globe coloured by geoid height, lumpy and exaggerated, with highs in red and lows in blue"
  :width="1600"
  :height="1600"
  credit="NASA Scientific Visualization Studio"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:The_Geoid_(SVS5660).png">

The geoid, Earth's equipotential surface, from satellite gravity data. Its
height above the ellipsoid is exaggerated thousands of times here; in reality it
stays within about 100 m.

</DocPhoto>

## Horizons and footprints

How far can that orbiter see? `horizonDistance(h, R)` is the straight line of
sight to the horizon, and `horizonSurfaceDistance(h, R)` the distance along the
ground to it.

<DocPhoto
  src="geodesy/earth-limb-iss.webp"
  alt="Earth's curved horizon from orbit, with the thin blue band of the atmosphere above clouds and ocean"
  :width="1600"
  :height="1067"
  credit="NASA Johnson Space Center"
  licence="Public domain"
  source="https://commons.wikimedia.org/wiki/File:Iss064e006316_(Nov_21,_2020)_---_Earth%27s_limb,_or_horizon,_is_pictured_from_the_International_Space_Station_as_it_orbited_above_the_Pacific_Ocean_off_the_coast_of_Chile.jpg">

The horizon from the International Space Station, about 420 km up, over the
Pacific off Chile.

</DocPhoto>

<figure class="guide-figure">
<svg viewBox="0 0 640 200" role="img" aria-labelledby="hor-title hor-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="hor-title">Distance to the horizon</title>
  <desc id="hor-desc">An observer at height h above a planet. The line of sight d touches the surface at the horizon; the distance s runs along the surface from below the observer to the horizon.</desc>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M20 200 A220 220 0 0 1 380 200" />
    <path d="M200 110 V60" stroke-dasharray="4 4" />
  </g>
  <g fill="none" stroke-width="2">
    <path class="accent" d="M200 60 L327.4 150.7" />
    <path class="accent-2" d="M200 110 A220 220 0 0 1 327.4 150.7" />
  </g>
  <circle class="accent-fill" cx="200" cy="60" r="4" />
  <circle cx="327.4" cy="150.7" r="3" fill="currentColor" />
  <g font-family="var(--vp-font-family-mono)" font-size="13" fill="currentColor">
    <text x="184" y="90">h</text>
    <text x="270" y="96" class="accent-text">d</text>
    <text x="252" y="134" class="accent-2-text">s</text>
    <text x="336" y="146">horizon</text>
  </g>
  <g font-family="var(--vp-font-family-base)" font-size="13" fill="currentColor">
    <text x="420" y="80" class="accent-text">d = √(2Rh + h²)</text>
    <text x="420" y="98">line of sight</text>
    <text x="420" y="130" class="accent-2-text">s = R arccos(R / (R + h))</text>
    <text x="420" y="148">along the surface</text>
  </g>
</svg>
<figcaption>The horizon is where the line of sight just touches the surface.</figcaption>
</figure>

```ts
import {
  horizonDistance,
  horizonSurfaceDistance
} from '@interstellar-tools/equations';

horizonDistance(300_000, R); // ≈ 1 457 km
horizonSurfaceDistance(300_000, R); // ≈ 1 376 km
```

The area of a footprint, a map quadrangle or a region comes from its corner
points with `sphericalPolygonArea`. Its edges are great-circle arcs, and the
winding doesn't matter. A box of one degree by one degree north-east of Jezero:

```ts
import { sphericalPolygonArea } from '@interstellar-tools/equations';

const box = [
  [18, 77],
  [18, 78],
  [19, 78],
  [19, 77]
].map(([lat, lon]) => ({ lat: toRad(lat), lon: toRad(lon) }));

sphericalPolygonArea(box, R); // ≈ 3 318.83 km²
```

A box this small is nearly flat: $R^2 \Delta\varphi\,\Delta\lambda \cos 18.5°$
gives 3 318.81 km². The difference grows with the box, and the spherical area
stays exact for any polygon that fits in a hemisphere, around a pole or across
the antimeridian.

## Next

- [Maps](/guide/usage/maps): project these coordinates onto a flat map, cut it
  into tiles, and read the terrain from an elevation grid.
- The [Cartography reference](/api/@interstellar-tools/equations/) has every
  function, with its formula and limits.

<style>
.guide-figure { margin: 24px 0; }
.guide-figure svg { width: 100%; height: auto; color: var(--vp-c-text-1); }
.guide-figure .accent { stroke: var(--vp-c-brand-1); }
.guide-figure .accent-2 { stroke: var(--vp-c-warning-1); }
.guide-figure .accent-fill { fill: var(--vp-c-brand-1); }
.guide-figure .accent-text { fill: var(--vp-c-brand-1); }
.guide-figure .accent-2-text { fill: var(--vp-c-warning-1); }
.guide-figure figcaption { font-size: 14px; color: var(--vp-c-text-2); margin-top: 8px; }
</style>
