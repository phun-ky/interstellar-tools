import type { GridInterface } from './grid.js';
import { assertCell, assertGrid, mapGrid, windowAt } from './window.js';

/**
 * Compute the **Terrain Roughness Index** of an elevation grid at a cell: the root-mean-square height difference between the cell and its eight neighbours.
 *
 * $$
 * \text{TRI} = \sqrt{\frac{1}{8}\sum_{i=1}^{8}\left(z_i - z_0\right)^2}
 * $$
 *
 * Where:
 * - $ z_0 $ is the cell's height (m)
 * - $ z_i $ are the heights of its eight neighbours (m)
 *
 * **Units**
 * - Input: heights in **m**.
 * - Output: TRI in **m**, ≥ 0: 0 is level.
 *
 * ::: info Notes
 *
 * - How uneven the ground is around a cell: boulders, crags and small craters, the things that tip a lander, rather than how steep it is. A cell 1 m above level surroundings has a TRI of 1 m. A smooth slope has a TRI too, about its rise over one cell, so read it together with {@link slopeAt}.
 * - Other definitions are in use. Riley et al. (1999), who named the **Terrain Ruggedness Index**, leave out the $ \tfrac18 $, which makes theirs $ \sqrt8 \approx 2.83 $ times this one; it's the default in `gdaldem` since GDAL 3.3. Wilson et al. (2007) take the mean absolute difference instead. Check which one before comparing values.
 * - It compares heights only, so it depends on the cell size: a 1 m grid sees boulders, a 100 m grid only hills.
 * - `NaN` on the grid's edge and next to a missing cell.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param row - Row index, 0 at the north edge (an integer in [0, `rows`)).
 * @param column - Column index, 0 at the west edge (an integer in [0, `columns`)).
 * @returns The TRI in **m**, or `NaN` where it can't be computed.
 * @throws {RangeError} If `row` or `column` is not an integer inside the grid.
 * @group Terrain
 *
 * @example
 * ```ts
 * // A 2 m boulder on level ground
 * const grid = createGrid({
 *   rows: 3,
 *   columns: 3,
 *   values: [0, 0, 0, 0, 2, 0, 0, 0, 0],
 *   cellSize: { x: 1, y: 1 }
 * });
 *
 * terrainRoughnessIndexAt(grid, 1, 1); // 2
 * ```
 *
 * @see {@link terrainRoughnessIndexGrid}
 * @see {@link slopeAt}
 * @see https://download.osgeo.org/qgis/doc/reference-docs/Terrain_Ruggedness_Index.pdf Riley, DeGloria & Elliot (1999), A Terrain Ruggedness Index that quantifies topographic heterogeneity
 * @see https://gdal.org/en/stable/programs/gdaldem.html gdaldem: the Riley and Wilson definitions
 */
export const terrainRoughnessIndexAt = (
  grid: GridInterface,
  row: number,
  column: number
): number => {
  assertCell(grid, row, column);

  const z = windowAt(grid, row, column);

  if (!z) return NaN;

  const z0 = z[4]!;

  let sum = 0;

  for (const zi of z) sum += (zi - z0) ** 2;

  return Math.sqrt(sum / 8);
};

/**
 * Compute the **Terrain Roughness Index** of every cell of an elevation grid, as a new grid in metres.
 *
 * See {@link terrainRoughnessIndexAt}. Cells on the edge and next to a missing cell are `NaN`.
 *
 * @param grid - Elevation grid, heights in **m**.
 * @returns A grid of the same shape, TRI in **m**.
 * @throws {TypeError} If a size or cell size is not finite.
 * @throws {RangeError} If the grid's parts don't fit together.
 * @group Terrain
 *
 * @example
 * ```ts
 * const roughness = terrainRoughnessIndexGrid(grid);
 * gridValueAt(roughness, 1, 1); // 2
 * ```
 *
 * @see {@link terrainRoughnessIndexAt}
 */
export const terrainRoughnessIndexGrid = (
  grid: GridInterface
): GridInterface => {
  assertGrid(grid);

  return mapGrid(grid, (row, column) =>
    terrainRoughnessIndexAt(grid, row, column)
  );
};
