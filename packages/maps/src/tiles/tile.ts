import type { Radians } from '@interstellar-tools/types';

/**
 * A **web map tile**, in the scheme web maps use ("slippy maps", XYZ): at zoom `z` the spherical Web Mercator map is cut into $ 2^z \times 2^z $ square tiles.
 *
 * - `x` counts columns east from 180° W, and `y` counts rows **south from the top edge**, at about 85.0511° N. Both are integers in $ [0, 2^z) $.
 * - This is the XYZ order of OpenStreetMap and most web maps. TMS counts rows north from the bottom instead: $ y_{\text{TMS}} = 2^z - 1 - y $.
 *
 * @group Tiles
 */
export interface TileInterface {
  /** Column, east from 180° W (an integer in [0, 2^z)). */
  x: number;
  /** Row, south from the top edge of the map (an integer in [0, 2^z)). */
  y: number;
  /** Zoom level (an integer in [0, 30]). */
  z: number;
}

/**
 * The edges of a web map tile: the latitudes of its north and south edges and the longitudes of its west and east edges.
 *
 * @group Tiles
 */
export interface TileBoundsInterface {
  /** Latitude of the north edge, in **radians**. */
  north: Radians;
  /** Latitude of the south edge, in **radians**. */
  south: Radians;
  /** Longitude of the west edge, in **radians**, in [−π, π). */
  west: Radians;
  /** Longitude of the east edge, in **radians**, in (−π, π]. */
  east: Radians;
}
