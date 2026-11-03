import type { GridInterface } from './grid.js';
import { assertCell, windowAt } from './window.js';

/**
 * The rate at which the terrain rises, east and north, at a cell.
 *
 * @group Terrain
 */
export interface TerrainGradientInterface {
  /** Rise per metre towards the east, $ \partial z/\partial x $ (m/m). */
  dzdx: number;
  /** Rise per metre towards the north, $ \partial z/\partial y $ (m/m). */
  dzdy: number;
}

/**
 * Compute the **gradient** of an elevation grid at a cell, from its 3 × 3 neighbourhood with **Horn's method**.
 *
 * $$
 * \frac{\partial z}{\partial x} = \frac{(z_{13} + 2z_{23} + z_{33}) - (z_{11} + 2z_{21} + z_{31})}{8\,\Delta x},
 * \qquad
 * \frac{\partial z}{\partial y} = \frac{(z_{11} + 2z_{12} + z_{13}) - (z_{31} + 2z_{32} + z_{33})}{8\,\Delta y}
 * $$
 *
 * Where:
 * - $ z_{rc} $ is the height in row $ r $ and column $ c $ of the neighbourhood, from the north-west: $ z_{22} $ is the cell itself (m)
 * - $ \Delta x $ and $ \Delta y $ are the cell size east–west and north–south (m)
 *
 * **Units**
 * - Inputs: heights and the cell size in **m**.
 * - Output: `dzdx` and `dzdy` in **m/m**: the rise per metre towards the east and towards the north.
 *
 * ::: info Notes
 *
 * - Each difference is taken across two cells, weighting the middle row or column twice, which smooths out noise in the heights. It's the method most GIS software uses for slope and aspect.
 * - Row 0 is the northern edge of the grid (see {@link GridInterface}), so $ \partial z/\partial y $ is the northern row minus the southern one.
 * - On the grid's edge, or next to a missing cell, the neighbourhood is incomplete and both components are `NaN`.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param row - Row index, 0 at the north edge (an integer in [0, `rows`)).
 * @param column - Column index, 0 at the west edge (an integer in [0, `columns`)).
 * @returns The gradient `{ dzdx, dzdy }` in **m/m**, `NaN` where it can't be computed.
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
 * gradientAt(grid, 1, 1); // { dzdx: 0.1, dzdy: 0 }
 * ```
 *
 * @see {@link slopeAt}
 * @see {@link aspectAt}
 * @see https://doi.org/10.1109/PROC.1981.11918 Horn (1981), Hill shading and the reflectance map
 */
export const gradientAt = (
  grid: GridInterface,
  row: number,
  column: number
): TerrainGradientInterface => {
  assertCell(grid, row, column);

  const z = windowAt(grid, row, column);

  if (!z) return { dzdx: NaN, dzdy: NaN };

  const [z11, z12, z13, z21, , z23, z31, z32, z33] = z as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];

  return {
    dzdx: (z13 + 2 * z23 + z33 - (z11 + 2 * z21 + z31)) / (8 * grid.cellSize.x),
    dzdy: (z11 + 2 * z12 + z13 - (z31 + 2 * z32 + z33)) / (8 * grid.cellSize.y)
  };
};
