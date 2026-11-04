import { MAX_ZOOM, assertTile } from './shared.js';
import type { TileInterface } from './tile.js';

/**
 * Find the **quadkey** of a web map tile: one base-4 digit per zoom level, naming which quarter of its parent the tile is, from zoom 1 down.
 *
 * $$
 * d_i = b_i(x) + 2\,b_i(y), \qquad i = z, z - 1, \dots, 1
 * $$
 *
 * Where:
 * - $ b_i(x) $ and $ b_i(y) $ are the $ i $-th bits of the column and row, counted from 1 at the least significant
 * - $ d_i $ is a digit: 0 north-west, 1 north-east, 2 south-west, 3 south-east
 *
 * **Units**
 * - Inputs: integer tile indices.
 * - Output: a string of `z` digits 0–3.
 *
 * ::: info Notes
 *
 * - Bing Maps and many tile caches name tiles this way. A tile's key starts with its parent's key, so tiles that are close together usually share a prefix, which suits sorting and spatial indexes.
 * - The single tile at zoom 0 has the empty key `''`.
 *
 * :::
 *
 * @param x - Column, east from 180° W (an integer in [0, 2^z)).
 * @param y - Row, south from the top edge of the map (an integer in [0, 2^z)).
 * @param z - Zoom level (an integer in [0, 30]).
 * @returns The quadkey: `z` digits 0–3.
 * @throws {RangeError} If `z` is not an integer in [0, 30], or `x` or `y` is not an integer in [0, 2^z).
 * @group Tiles
 *
 * @example
 * ```ts
 * quadkey(3, 5, 3); // '213'
 * ```
 *
 * @see {@link fromQuadkey}
 * @see {@link tileAt}
 * @see https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system Microsoft: Bing Maps tile system
 */
export const quadkey = (x: number, y: number, z: number): string => {
  assertTile(x, y, z);

  let key = '';

  // From the most significant bit, zoom 1, down to zoom z
  for (let i = z - 1; i >= 0; i--) key += ((x >> i) & 1) + 2 * ((y >> i) & 1);

  return key;
};

/**
 * Find the web map tile named by a **quadkey**: the inverse of {@link quadkey}.
 *
 * **Units**
 * - Input: a string of digits 0–3, one per zoom level.
 * - Output: `{ x, y, z }`, integer tile indices, with `z` the key's length.
 *
 * ::: info Notes
 *
 * - Each digit adds one bit to the column (1 or 3) and the row (2 or 3).
 * - The empty key `''` is the single tile at zoom 0.
 *
 * :::
 *
 * @param key - The quadkey: at most 30 digits 0–3.
 * @returns The tile, `{ x, y, z }`.
 * @throws {RangeError} If `key` holds anything but the digits 0–3, or more than 30 of them.
 * @group Tiles
 *
 * @example
 * ```ts
 * fromQuadkey('213'); // { x: 3, y: 5, z: 3 }
 * ```
 *
 * @see {@link quadkey}
 * @see {@link tileBounds}
 * @see https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system Microsoft: Bing Maps tile system
 */
export const fromQuadkey = (key: string): TileInterface => {
  if (typeof key !== 'string' || key.length > MAX_ZOOM || !/^[0-3]*$/.test(key))
    throw new RangeError(
      `key must be a quadkey: at most ${MAX_ZOOM} digits 0–3. Received: ${key}`
    );

  let x = 0;
  let y = 0;

  for (const digit of key) {
    const d = Number(digit);

    x = 2 * x + (d & 1);
    y = 2 * y + (d >> 1);
  }

  return { x, y, z: key.length };
};
