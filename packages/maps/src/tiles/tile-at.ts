import type { Radians } from '@interstellar-tools/types';

import { assertLatitude } from '../projections/shared.js';
import { assertFinite } from '../validate.js';

import { assertZoom } from './shared.js';
import type { TileInterface } from './tile.js';

/**
 * Find the **web map tile** that holds a point, at a zoom level: the tile scheme web maps use ("slippy maps", XYZ) on the spherical Web Mercator map.
 *
 * $$
 * x = \left\lfloor \frac{\lambda + \pi}{2\pi}\,2^z \right\rfloor,
 * \qquad
 * y = \left\lfloor \frac{1 - \ln(\tan\varphi + \sec\varphi)/\pi}{2}\,2^z \right\rfloor
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ z $ is the zoom level: $ 2^z \times 2^z $ tiles cover the map
 * - $ \ln(\tan\varphi + \sec\varphi) $ is the Mercator $ y $ on a unit sphere (see {@link mercator})
 *
 * **Units**
 * - Inputs: angles in **radians**, `zoom` an integer.
 * - Output: `{ x, y, z }`, integer tile indices.
 *
 * ::: info Notes
 *
 * - Columns run east from 180° W, and rows run **south** from the top edge of the map (see {@link TileInterface}).
 * - The map stops at $ \arctan\sinh\pi \approx \pm 85.0511° $, where it is square. Latitudes beyond that, up to the poles, are clamped into the top or bottom row.
 * - The longitude is taken modulo a whole turn, so 180° E is 180° W, the west edge of column 0.
 * - A point exactly on an edge between tiles belongs to the tile east or south of it.
 * - The scheme depends only on angles, so it tiles a spherical Mercator map of Mars or the Moon as it does Earth's. A tile is $ 2\pi R / 2^z $ wide at the equator.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param zoom - Zoom level $ z $ (an integer in [0, 30]).
 * @returns The tile, `{ x, y, z }`.
 * @throws {TypeError} If `phi` or `lambda` is not a finite number.
 * @throws {RangeError} If `phi` is outside [−π/2, π/2], or `zoom` is not an integer in [0, 30].
 * @group Tiles
 *
 * @example
 * ```ts
 * // Oslo, at zoom 10
 * tileAt(toRad(59.9139), toRad(10.7522), 10); // { x: 542, y: 297, z: 10 }
 * ```
 *
 * @see {@link tileBounds}
 * @see {@link quadkey}
 * @see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames OpenStreetMap: Slippy map tilenames
 */
export const tileAt = (
  phi: Radians,
  lambda: Radians,
  zoom: number
): TileInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertZoom(zoom);

  const n = 2 ** zoom;
  // Fractions of the way across, from the west edge, and down, from the top
  const across = (lambda + Math.PI) / (2 * Math.PI);
  const down = (1 - Math.asinh(Math.tan(phi)) / Math.PI) / 2;

  return {
    x: Math.min(n - 1, Math.floor((across - Math.floor(across)) * n)),
    y: Math.min(n - 1, Math.max(0, Math.floor(down * n))),
    z: zoom
  };
};
