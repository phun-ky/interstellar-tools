import type { Radians } from '@interstellar-tools/types';

import { gradientAt } from './gradient-at.js';
import type { GridInterface } from './grid.js';
import { assertGrid, mapGrid } from './window.js';

/**
 * Compute the **aspect** of an elevation grid at a cell: the direction the terrain faces.
 *
 * $$
 * \text{aspect} = \operatorname{atan2}\!\left(-\frac{\partial z}{\partial x},\, -\frac{\partial z}{\partial y}\right) \bmod 2\pi
 * $$
 *
 * with the gradient from Horn's method, {@link gradientAt}.
 *
 * **Units**
 * - Input: heights and the cell size in **m**.
 * - Output: aspect in **radians**, in [0, 2π): the compass direction downhill, clockwise from north.
 *
 * ::: info Notes
 *
 * - The GIS convention: the direction a slope faces, which is the way water runs off it. A slope that descends to the east faces east, $ \pi/2 $; one that descends to the south faces south, $ \pi $.
 * - Clockwise from north, since `x` points east and `y` north (see {@link GridInterface}). Sources differ on this, so check the convention before comparing with other software.
 * - Flat ground faces nowhere: the aspect is `NaN` where the gradient is zero, as well as on the grid's edge and next to a missing cell.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param row - Row index, 0 at the north edge (an integer in [0, `rows`)).
 * @param column - Column index, 0 at the west edge (an integer in [0, `columns`)).
 * @returns The aspect in **radians**, clockwise from north, or `NaN` where there is none.
 * @throws {RangeError} If `row` or `column` is not an integer inside the grid.
 * @group Terrain
 *
 * @example
 * ```ts
 * // Rising to the east, so facing west
 * const grid = createGrid({
 *   rows: 3,
 *   columns: 3,
 *   values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
 *   cellSize: { x: 10, y: 10 }
 * });
 *
 * aspectAt(grid, 1, 1); // 3π/2, west
 * ```
 *
 * @see {@link aspectGrid}
 * @see {@link slopeAt}
 * @see {@link gradientAt}
 */
export const aspectAt = (
  grid: GridInterface,
  row: number,
  column: number
): Radians => {
  const { dzdx, dzdy } = gradientAt(grid, row, column);

  if (dzdx === 0 && dzdy === 0) return NaN as Radians;

  const aspect = Math.atan2(-dzdx, -dzdy);

  return (aspect < 0 ? aspect + 2 * Math.PI : aspect) as Radians;
};

/**
 * Compute the **aspect** of every cell of an elevation grid, as a new grid in radians clockwise from north.
 *
 * See {@link aspectAt}. Flat cells, cells on the edge and cells next to a missing cell are `NaN`.
 *
 * @param grid - Elevation grid, heights in **m**.
 * @returns A grid of the same shape, aspects in **radians**.
 * @throws {TypeError} If a size or cell size is not finite.
 * @throws {RangeError} If the grid's parts don't fit together.
 * @group Terrain
 *
 * @example
 * ```ts
 * const aspects = aspectGrid(grid);
 * gridValueAt(aspects, 1, 1); // 3π/2
 * ```
 *
 * @see {@link aspectAt}
 */
export const aspectGrid = (grid: GridInterface): GridInterface => {
  assertGrid(grid);

  return mapGrid(grid, (row, column) => aspectAt(grid, row, column));
};
