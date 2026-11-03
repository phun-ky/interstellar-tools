[Documentation](../../index.md) /
[**@interstellar-tools/maps**](https://github.com/interstellar-tools/maps)

# [**@interstellar-tools/maps**](https://github.com/interstellar-tools/maps)

Map projections, web map tiles, terrain from elevation grids, imaging geometry
and landing site analysis, for Earth and any other planet or moon.

> \[!NOTE]
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

## Imaging

| Function                                                            | Description                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [groundSampleDistance](functions/groundSampleDistance.md)           | Compute the **ground sample distance**: how much ground one pixel covers, looking straight down.                   |
| [illuminationAngles](functions/illuminationAngles.md)               | Compute the **illumination angles** at a point on a surface: incidence, emission and phase.                        |
| [instantaneousFieldOfView](functions/instantaneousFieldOfView.md)   | Compute the **instantaneous field of view** of one detector pixel: the angle it sees.                              |
| [lambertReflectance](functions/lambertReflectance.md)               | Compute the relative brightness of a **Lambertian** surface: one that scatters light equally in all directions.    |
| [lommelSeeligerReflectance](functions/lommelSeeligerReflectance.md) | Compute the relative brightness of a **Lommel–Seeliger** surface: a dark, dusty one, like the Moon or an asteroid. |
| [swathWidth](functions/swathWidth.md)                               | Compute the **swath width**: the strip of ground a camera covers across its track, looking straight down.          |

## Landing sites

| Function                                        | Description                                                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [isStableLanding](functions/isStableLanding.md) | Check whether a lander **stays upright** on a slope: whether its total tilt stays below its tip-over angle.             |
| [tipOverAngle](functions/tipOverAngle.md)       | Compute the **tip-over angle** of a lander: the tilt at which its centre of mass passes over the edge of its footprint. |

## Terrain

| Name                                                                | Description                                                                                                                                               |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GridInterface](interfaces/GridInterface.md)                        | A **raster grid** of values over a map, such as a digital elevation model (DEM): `rows × columns` cells of equal size, stored row by row.                 |
| [TerrainGradientInterface](interfaces/TerrainGradientInterface.md)  | The rate at which the terrain rises, east and north, at a cell.                                                                                           |
| [ElevationGridInterface](type-aliases/ElevationGridInterface.md)    | A **digital elevation model**: a [GridInterface](interfaces/GridInterface.md) of heights in **m**.                                                        |
| [aspectAt](functions/aspectAt.md)                                   | Compute the **aspect** of an elevation grid at a cell: the direction the terrain faces.                                                                   |
| [aspectGrid](functions/aspectGrid.md)                               | Compute the **aspect** of every cell of an elevation grid, as a new grid in radians clockwise from north.                                                 |
| [createGrid](functions/createGrid.md)                               | Create a **raster grid**, such as an elevation model, checking that its parts fit together.                                                               |
| [gradientAt](functions/gradientAt.md)                               | Compute the **gradient** of an elevation grid at a cell, from its 3 × 3 neighbourhood with **Horn's method**.                                             |
| [gridValueAt](functions/gridValueAt.md)                             | Read the value of one **cell** of a grid.                                                                                                                 |
| [slopeAt](functions/slopeAt.md)                                     | Compute the **slope** of an elevation grid at a cell: how steep the terrain is.                                                                           |
| [slopeGrid](functions/slopeGrid.md)                                 | Compute the **slope** of every cell of an elevation grid, as a new grid in radians.                                                                       |
| [terrainRoughnessIndexAt](functions/terrainRoughnessIndexAt.md)     | Compute the **Terrain Roughness Index** of an elevation grid at a cell: the root-mean-square height difference between the cell and its eight neighbours. |
| [terrainRoughnessIndexGrid](functions/terrainRoughnessIndexGrid.md) | Compute the **Terrain Roughness Index** of every cell of an elevation grid, as a new grid in metres.                                                      |
