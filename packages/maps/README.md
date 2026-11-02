# @interstellar-tools/maps

Map projections, web map tiles, terrain from elevation grids, imaging geometry
and landing site analysis, for Earth and any other planet or moon.

> [!NOTE]
>
> **0.x: the API can still change.** This package is new and versioned 0.x until
> its API settles; a minor release may change it. Geodesy on body shapes
> (ellipsoids, distances, geodetic coordinates, the horizon) lives in
> [`@interstellar-tools/equations`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/equations/),
> which this package builds on.

## What's planned

The
[Maps and topography milestone](https://github.com/phun-ky/interstellar-tools/milestone/2)
tracks the work:

- map projections: Mercator and equirectangular, sinusoidal and Mollweide, and
  azimuthal projections
- web map tiles and quadkeys
- terrain from elevation grids: slope, aspect, hillshade, roughness
- imaging geometry: ground sample distance, field of view and illumination
  angles
- landing site analysis: whether a lander tips over on a slope

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/maps`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/maps/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

```shell [npm]
npm i --save @interstellar-tools/maps
```
