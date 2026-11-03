// Shared by the terrain functions; not part of the public API.
import type { GridInterface } from './grid.js';

/** Throw unless the grid's size, values and cell size fit together. */
export const assertGrid = ({
  rows,
  columns,
  values,
  cellSize,
  noData
}: GridInterface) => {
  for (const [name, x] of [
    ['rows', rows],
    ['columns', columns],
    ['cellSize.x', cellSize.x],
    ['cellSize.y', cellSize.y]
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  for (const [name, x] of [
    ['rows', rows],
    ['columns', columns]
  ] as const)
    if (!Number.isInteger(x) || x <= 0)
      throw new RangeError(
        `${name} must be a positive integer. Received: ${x}`
      );

  for (const [name, x] of [
    ['cellSize.x', cellSize.x],
    ['cellSize.y', cellSize.y]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  if (values.length !== rows * columns)
    throw new RangeError(
      `values must hold rows × columns = ${rows * columns} values. Received: ${values.length}`
    );

  if (noData !== undefined && !Number.isFinite(noData))
    throw new TypeError(
      `noData must be a finite number; NaN always marks a missing cell. Received: ${noData}`
    );
};

/**
 * The 3 × 3 neighbourhood of a cell, row by row from the north-west:
 * `[z11, z12, z13, z21, z22, z23, z31, z32, z33]`, with `z22` the cell itself.
 * `null` if it leaves the grid or holds a missing cell.
 */
export const windowAt = (
  { rows, columns, values, noData }: GridInterface,
  row: number,
  column: number
): number[] | null => {
  if (row < 1 || column < 1 || row > rows - 2 || column > columns - 2)
    return null;

  const window: number[] = [];

  for (let r = row - 1; r <= row + 1; r++)
    for (let c = column - 1; c <= column + 1; c++) {
      const z = values[r * columns + c]!;

      if (Number.isNaN(z) || z === noData) return null;

      window.push(z);
    }

  return window;
};

/** A new grid the same shape as `grid`, with `f(row, column)` in each cell. */
export const mapGrid = (
  { rows, columns, cellSize }: GridInterface,
  f: (row: number, column: number) => number
): GridInterface => {
  const values = new Float64Array(rows * columns);

  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++)
      values[row * columns + column] = f(row, column);

  return { rows, columns, values, cellSize: { x: cellSize.x, y: cellSize.y } };
};
