import type { Radians } from '@interstellar-tools/types';

import { assertTile } from './shared.js';
import type { TileBoundsInterface } from './tile.js';

/**
 * Find the edges of a **web map tile**: the latitudes of its north and south edges and the longitudes of its west and east edges. The inverse of {@link tileAt}.
 *
 * $$
 * \lambda = \frac{x}{2^z}\,2\pi - \pi,
 * \qquad
 * \varphi = \arctan\sinh\!\Big(\pi\Big(1 - \frac{2y}{2^z}\Big)\Big)
 * $$
 *
 * Where:
 * - $ x $ and $ y $ are the tile's column and row; $ x + 1 $ and $ y + 1 $ give its east and south edges
 * - $ z $ is the zoom level
 *
 * **Units**
 * - Inputs: integer tile indices.
 * - Output: `{ north, south, west, east }` in **radians**.
 *
 * ::: info Notes
 *
 * - Neighbouring tiles share their edges exactly: the east edge of one tile is the west edge of the next.
 * - The top row's north edge, and the bottom row's south edge, are the map's limit, $ \pm\arctan\sinh\pi \approx \pm 85.0511° $.
 * - Tiles are square on the map, but on the sphere they are as wide as they are tall only near the equator.
 *
 * :::
 *
 * @param x - Column, east from 180° W (an integer in [0, 2^z)).
 * @param y - Row, south from the top edge of the map (an integer in [0, 2^z)).
 * @param z - Zoom level (an integer in [0, 30]).
 * @returns The tile's edges, `{ north, south, west, east }` in **radians**.
 * @throws {RangeError} If `z` is not an integer in [0, 30], or `x` or `y` is not an integer in [0, 2^z).
 * @group Tiles
 *
 * @example
 * ```ts
 * // The single tile at zoom 0 is the whole map
 * tileBounds(0, 0, 0);
 * // { north: 85.0511°, south: −85.0511°, west: −180°, east: 180° }, in radians
 * ```
 *
 * @see {@link tileAt}
 * @see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames OpenStreetMap: Slippy map tilenames
 */
export const tileBounds = (
  x: number,
  y: number,
  z: number
): TileBoundsInterface => {
  assertTile(x, y, z);

  const n = 2 ** z;
  const longitude = (column: number) =>
    ((column / n) * 2 * Math.PI - Math.PI) as Radians;
  const latitude = (row: number) =>
    Math.atan(Math.sinh(Math.PI * (1 - (2 * row) / n))) as Radians;

  return {
    north: latitude(y),
    south: latitude(y + 1),
    west: longitude(x),
    east: longitude(x + 1)
  };
};
