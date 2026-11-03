import { assertGrid } from './window.js';

/**
 * A **raster grid** of values over a map, such as a digital elevation model (DEM): `rows × columns` cells of equal size, stored row by row.
 *
 * - **Row 0 is the northernmost row**, as in most GeoTIFFs, and rows run south. Columns run west to east. So `x` points east and `y` north, and the value at `row`, `column` is `values[row * columns + column]`.
 * - **Cells are a constant size** in metres, `cellSize.x` east–west and `cellSize.y` north–south: a projected grid. A grid in latitude and longitude has cells that narrow towards the poles, $ \Delta x = R\cos\varphi\,\Delta\lambda $; project it first, or use it only where that change is small.
 * - **Missing cells** hold `noData`, or `NaN`. Terrain functions return `NaN` wherever they would need one, and wherever a cell's 3 × 3 neighbourhood leaves the grid.
 *
 * Grids returned by the terrain functions mark missing cells with `NaN` and have no `noData`.
 *
 * @group Terrain
 */
export interface GridInterface {
  /** Number of rows, north to south (an integer, > 0). */
  rows: number;
  /** Number of columns, west to east (an integer, > 0). */
  columns: number;
  /** The values, row by row from the north-west corner: `rows × columns` of them. */
  values: Float64Array | readonly number[];
  /** Size of a cell in **m**, east–west (`x`) and north–south (`y`). */
  cellSize: { x: number; y: number };
  /** The value that marks a missing cell, if any. `NaN` always does. */
  noData?: number;
}

/**
 * A **digital elevation model**: a {@link GridInterface} of heights in **m**.
 *
 * @group Terrain
 */
export type ElevationGridInterface = GridInterface;

/**
 * Create a **raster grid**, such as an elevation model, checking that its parts fit together.
 *
 * The values are kept as given, not copied: a `Float64Array` stays one, and changing it later changes the grid.
 *
 * ::: info Notes
 *
 * - Row 0 is the northernmost row, and columns run west to east: see {@link GridInterface}.
 * - Missing cells hold `noData` or `NaN`. Any other value must be finite.
 *
 * :::
 *
 * @param grid - The grid's size, values, cell size in **m** and optional `noData` marker.
 * @returns The grid.
 * @throws {TypeError} If a size or `noData` is not a finite number, or a value is infinite.
 * @throws {RangeError} If `rows` or `columns` is not a positive integer, the number of values isn't `rows × columns`, or a cell size is `<= 0`.
 * @group Terrain
 *
 * @example
 * ```ts
 * // 3 × 3 cells of 10 m, rising 1 m a cell to the east
 * const grid = createGrid({
 *   rows: 3,
 *   columns: 3,
 *   values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
 *   cellSize: { x: 10, y: 10 }
 * });
 * ```
 *
 * @see {@link gridValueAt}
 */
export const createGrid = ({
  rows,
  columns,
  values,
  cellSize,
  noData
}: GridInterface): GridInterface => {
  const grid: GridInterface = {
    rows,
    columns,
    values,
    cellSize: { x: cellSize.x, y: cellSize.y },
    ...(noData !== undefined && { noData })
  };

  assertGrid(grid);

  for (const z of values)
    if (z === Infinity || z === -Infinity)
      throw new TypeError(
        `values must be finite, or noData or NaN for a missing cell. Received: ${z}`
      );

  return grid;
};

/**
 * Read the value of one **cell** of a grid.
 *
 * @param grid - The grid.
 * @param row - Row index, 0 at the north edge (an integer in [0, `rows`)).
 * @param column - Column index, 0 at the west edge (an integer in [0, `columns`)).
 * @returns The value, or `NaN` for a missing cell (`noData` or `NaN`).
 * @throws {RangeError} If `row` or `column` is not an integer inside the grid.
 * @group Terrain
 *
 * @example
 * ```ts
 * const grid = createGrid({
 *   rows: 2,
 *   columns: 2,
 *   values: [10, 11, -9999, 13],
 *   cellSize: { x: 30, y: 30 },
 *   noData: -9999
 * });
 *
 * gridValueAt(grid, 0, 1); // 11
 * gridValueAt(grid, 1, 0); // NaN
 * ```
 *
 * @see {@link createGrid}
 */
export const gridValueAt = (
  grid: GridInterface,
  row: number,
  column: number
): number => {
  for (const [name, index, size] of [
    ['row', row, grid.rows],
    ['column', column, grid.columns]
  ] as const)
    if (!Number.isInteger(index) || index < 0 || index >= size)
      throw new RangeError(
        `${name} must be an integer in [0, ${size}). Received: ${index}`
      );

  const z = grid.values[row * grid.columns + column]!;

  return z === grid.noData ? NaN : z;
};
