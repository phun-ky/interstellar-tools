[Documentation](../../index.md) /
[**@interstellar-tools/maps**](https://github.com/interstellar-tools/maps)

# [**@interstellar-tools/maps**](https://github.com/interstellar-tools/maps)

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

| Name                                                                     | Description                                                                                                                             |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| [SafeLandingOptionsInterface](interfaces/SafeLandingOptionsInterface.md) | The lander, for [safeLandingGrid](functions/safeLandingGrid.md).                                                                        |
| [isStableLanding](functions/isStableLanding.md)                          | Check whether a lander **stays upright** on a slope: whether its total tilt stays below its tip-over angle.                             |
| [safeLandingGrid](functions/safeLandingGrid.md)                          | Map where a lander can **touch down safely** on an elevation grid: where it stays upright on the slope and the ground is smooth enough. |
| [tipOverAngle](functions/tipOverAngle.md)                                | Compute the **tip-over angle** of a lander: the tilt at which its centre of mass passes over the edge of its footprint.                 |

## Projections

| Name                                                                              | Description                                                                                                                                                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [AzimuthalOptionsInterface](interfaces/AzimuthalOptionsInterface.md)              | Where an azimuthal map is centred, for [lambertAzimuthalEqualArea](functions/lambertAzimuthalEqualArea.md), [stereographic](functions/stereographic.md) and [orthographic](functions/orthographic.md). |
| [EquirectangularOptionsInterface](interfaces/EquirectangularOptionsInterface.md)  | Options for [equirectangular](functions/equirectangular.md) and [inverseEquirectangular](functions/inverseEquirectangular.md).                                                                         |
| [GeographicCoordinatesInterface](interfaces/GeographicCoordinatesInterface.md)    | A point on a sphere: latitude and longitude.                                                                                                                                                           |
| [ProjectedPointInterface](interfaces/ProjectedPointInterface.md)                  | A point on a map, in metres from the projection's origin: `x` east, `y` north.                                                                                                                         |
| [ProjectionOptionsInterface](interfaces/ProjectionOptionsInterface.md)            | Where a map is centred east–west, for the projections.                                                                                                                                                 |
| [equirectangular](functions/equirectangular.md)                                   | Project a point on a sphere with the **equirectangular projection**: the simple cylindrical map, with latitude and longitude spaced evenly.                                                            |
| [inverseEquirectangular](functions/inverseEquirectangular.md)                     | Find the point on a sphere for a point on an **equirectangular** map: the inverse of [equirectangular](functions/equirectangular.md).                                                                  |
| [inverseLambertAzimuthalEqualArea](functions/inverseLambertAzimuthalEqualArea.md) | Find the point on a sphere for a point on a **Lambert azimuthal equal-area** map: the inverse of [lambertAzimuthalEqualArea](functions/lambertAzimuthalEqualArea.md).                                  |
| [inverseMercator](functions/inverseMercator.md)                                   | Find the point on a sphere for a point on a **Mercator** map: the inverse of [mercator](functions/mercator.md).                                                                                        |
| [inverseMollweide](functions/inverseMollweide.md)                                 | Find the point on a sphere for a point on a **Mollweide** map: the inverse of [mollweide](functions/mollweide.md).                                                                                     |
| [inverseOrthographic](functions/inverseOrthographic.md)                           | Find the point on a sphere for a point on an **orthographic** map: the inverse of [orthographic](functions/orthographic.md).                                                                           |
| [inverseSinusoidal](functions/inverseSinusoidal.md)                               | Find the point on a sphere for a point on a **sinusoidal** map: the inverse of [sinusoidal](functions/sinusoidal.md).                                                                                  |
| [inverseStereographic](functions/inverseStereographic.md)                         | Find the point on a sphere for a point on a **stereographic** map: the inverse of [stereographic](functions/stereographic.md).                                                                         |
| [lambertAzimuthalEqualArea](functions/lambertAzimuthalEqualArea.md)               | Project a point on a sphere with the **Lambert azimuthal equal-area projection**: an equal-area map centred on any point, with true directions from the centre.                                        |
| [mercator](functions/mercator.md)                                                 | Project a point on a sphere with the **Mercator projection**: the conformal cylindrical map, which keeps angles and shapes locally true.                                                               |
| [mollweide](functions/mollweide.md)                                               | Project a point on a sphere with the **Mollweide projection**: an equal-area map of the whole sphere inside an ellipse twice as wide as tall.                                                          |
| [orthographic](functions/orthographic.md)                                         | Project a point on a sphere with the **orthographic projection**: the globe as it looks from infinitely far away, above the map's centre.                                                              |
| [sinusoidal](functions/sinusoidal.md)                                             | Project a point on a sphere with the **sinusoidal projection**: an equal-area map, with every parallel at its true length.                                                                             |
| [stereographic](functions/stereographic.md)                                       | Project a point on a sphere with the **stereographic projection**: a conformal map centred on any point, the usual choice for polar maps.                                                              |

## Terrain

| Name                                                                                             | Description                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GridInterface](interfaces/GridInterface.md)                                                     | A **raster grid** of values over a map, such as a digital elevation model (DEM): `rows × columns` cells of equal size, stored row by row.                                          |
| [TerrainCurvatureInterface](interfaces/TerrainCurvatureInterface.md)                             | How the terrain bends at a cell, along the slope and across it.                                                                                                                    |
| [TerrainGradientInterface](interfaces/TerrainGradientInterface.md)                               | The rate at which the terrain rises, east and north, at a cell.                                                                                                                    |
| [TopographicWetnessIndexOptionsInterface](interfaces/TopographicWetnessIndexOptionsInterface.md) | Options for [topographicWetnessIndex](functions/topographicWetnessIndex.md).                                                                                                       |
| [ElevationGridInterface](type-aliases/ElevationGridInterface.md)                                 | A **digital elevation model**: a [GridInterface](interfaces/GridInterface.md) of heights in **m**.                                                                                 |
| [aspectAt](functions/aspectAt.md)                                                                | Compute the **aspect** of an elevation grid at a cell: the direction the terrain faces.                                                                                            |
| [aspectGrid](functions/aspectGrid.md)                                                            | Compute the **aspect** of every cell of an elevation grid, as a new grid in radians clockwise from north.                                                                          |
| [createGrid](functions/createGrid.md)                                                            | Create a **raster grid**, such as an elevation model, checking that its parts fit together.                                                                                        |
| [curvatureAt](functions/curvatureAt.md)                                                          | Compute the **profile and planform curvature** of an elevation grid at a cell: how the terrain bends along the steepest slope and across it.                                       |
| [curvatureGrid](functions/curvatureGrid.md)                                                      | Compute the **profile and planform curvature** of every cell of an elevation grid, as two new grids in 1/m.                                                                        |
| [flowAccumulation](functions/flowAccumulation.md)                                                | Compute the **flow accumulation** of every cell of an elevation grid: the area that drains through it, its own included.                                                           |
| [flowDirections](functions/flowDirections.md)                                                    | Compute the **D8 flow direction** of every cell of an elevation grid: which of its eight neighbours water would run to.                                                            |
| [gradientAt](functions/gradientAt.md)                                                            | Compute the **gradient** of an elevation grid at a cell, from its 3 × 3 neighbourhood with **Horn's method**.                                                                      |
| [gridValueAt](functions/gridValueAt.md)                                                          | Read the value of one **cell** of a grid.                                                                                                                                          |
| [hillshadeAt](functions/hillshadeAt.md)                                                          | Compute the **hillshade** of a patch of terrain: how brightly the Sun lights it, from its slope and aspect.                                                                        |
| [hillshadeGrid](functions/hillshadeGrid.md)                                                      | Compute the **hillshade** of every cell of an elevation grid, as a new grid of brightness in \[0, 1].                                                                              |
| [slopeAt](functions/slopeAt.md)                                                                  | Compute the **slope** of an elevation grid at a cell: how steep the terrain is.                                                                                                    |
| [slopeGrid](functions/slopeGrid.md)                                                              | Compute the **slope** of every cell of an elevation grid, as a new grid in radians.                                                                                                |
| [terrainRoughnessIndexAt](functions/terrainRoughnessIndexAt.md)                                  | Compute the **Terrain Roughness Index** of an elevation grid at a cell: the root-mean-square height difference between the cell and its eight neighbours.                          |
| [terrainRoughnessIndexGrid](functions/terrainRoughnessIndexGrid.md)                              | Compute the **Terrain Roughness Index** of every cell of an elevation grid, as a new grid in metres.                                                                               |
| [topographicWetnessIndex](functions/topographicWetnessIndex.md)                                  | Compute the **Topographic Wetness Index** of every cell of an elevation grid: where water would collect, from how much ground drains through a cell and how slowly it drains away. |

## Tiles

| Name                                                     | Description                                                                                                                                                                   |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TileBoundsInterface](interfaces/TileBoundsInterface.md) | The edges of a web map tile: the latitudes of its north and south edges and the longitudes of its west and east edges.                                                        |
| [TileInterface](interfaces/TileInterface.md)             | A **web map tile**, in the scheme web maps use ("slippy maps", XYZ): at zoom `z` the spherical Web Mercator map is cut into $2^z \times 2^z$ square tiles.                    |
| [fromQuadkey](functions/fromQuadkey.md)                  | Find the web map tile named by a **quadkey**: the inverse of [quadkey](functions/quadkey.md).                                                                                 |
| [quadkey](functions/quadkey.md)                          | Find the **quadkey** of a web map tile: one base-4 digit per zoom level, naming which quarter of its parent the tile is, from zoom 1 down.                                    |
| [tileAt](functions/tileAt.md)                            | Find the **web map tile** that holds a point, at a zoom level: the tile scheme web maps use ("slippy maps", XYZ) on the spherical Web Mercator map.                           |
| [tileBounds](functions/tileBounds.md)                    | Find the edges of a **web map tile**: the latitudes of its north and south edges and the longitudes of its west and east edges. The inverse of [tileAt](functions/tileAt.md). |
