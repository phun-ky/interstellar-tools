import type { Radians } from '@interstellar-tools/types';

import { gradientAt } from './gradient-at.js';
import type { GridInterface } from './grid.js';
import { assertGrid, mapGrid } from './window.js';

/**
 * Compute the **slope** of an elevation grid at a cell: how steep the terrain is.
 *
 * $$
 * \text{slope} = \arctan\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}
 * $$
 *
 * with the gradient from Horn's method, {@link gradientAt}.
 *
 * **Units**
 * - Input: heights and the cell size in **m**.
 * - Output: slope in **radians**, in [0, π/2): 0 is flat.
 *
 * ::: info Notes
 *
 * - The slope over the cell's 3 × 3 neighbourhood, so over a patch three cells across: a 1 m grid sees boulders, a 100 m grid only hills. Landing hazards depend on the scale of the lander.
 * - `NaN` on the grid's edge and next to a missing cell.
 * - {@link isStableLanding} takes a slope in radians directly.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param row - Row index, 0 at the north edge (an integer in [0, `rows`)).
 * @param column - Column index, 0 at the west edge (an integer in [0, `columns`)).
 * @returns The slope in **radians**, or `NaN` where it can't be computed.
 * @throws {RangeError} If `row` or `column` is not an integer inside the grid.
 * @group Terrain
 *
 * @example
 * ```ts
 * // Rising 1 m every 10 m to the east
 * const grid = createGrid({
 *   rows: 3,
 *   columns: 3,
 *   values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
 *   cellSize: { x: 10, y: 10 }
 * });
 *
 * slopeAt(grid, 1, 1); // atan(0.1) ≈ 5.7°
 * ```
 *
 * @see {@link slopeGrid}
 * @see {@link aspectAt}
 * @see {@link gradientAt}
 */
export const slopeAt = (
  grid: GridInterface,
  row: number,
  column: number
): Radians => {
  const { dzdx, dzdy } = gradientAt(grid, row, column);

  return Math.atan(Math.hypot(dzdx, dzdy)) as Radians;
};

/**
 * Compute the **slope** of every cell of an elevation grid, as a new grid in radians.
 *
 * See {@link slopeAt}. Cells on the edge and next to a missing cell are `NaN`.
 *
 * @param grid - Elevation grid, heights in **m**.
 * @returns A grid of the same shape, slopes in **radians**.
 * @throws {TypeError} If a size or cell size is not finite.
 * @throws {RangeError} If the grid's parts don't fit together.
 * @group Terrain
 *
 * @example
 * ```ts
 * const slopes = slopeGrid(grid);
 * gridValueAt(slopes, 1, 1); // ≈ 0.0997 rad
 * ```
 *
 * @see {@link slopeAt}
 */
export const slopeGrid = (grid: GridInterface): GridInterface => {
  assertGrid(grid);

  return mapGrid(grid, (row, column) => slopeAt(grid, row, column));
};
