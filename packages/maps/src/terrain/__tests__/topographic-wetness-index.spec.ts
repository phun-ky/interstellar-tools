import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { createGrid, gridValueAt } from '../grid.js';
import { topographicWetnessIndex } from '../topographic-wetness-index.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
// A rows × columns grid with z(x, y), x east and y north from the north-west
// cell's centre, so y = −row · dy
const gridOf = (
  rows: number,
  columns: number,
  dx: number,
  dy: number,
  z: (x: number, y: number) => number
) =>
  createGrid({
    rows,
    columns,
    values: Array.from({ length: rows * columns }, (_, k) =>
      z((k % columns) * dx, -Math.floor(k / columns) * dy)
    ),
    cellSize: { x: dx, y: dy }
  });

describe('topographicWetnessIndex', () => {
  test('is ln(a / tan β), and gets wetter down a plane', () => {
    // Falling 1 m every 10 m to the east
    const twi = topographicWetnessIndex(gridOf(3, 4, 10, 10, (x) => -0.1 * x));

    close(gridValueAt(twi, 1, 1), Math.log(200 / 10 / 0.1));
    close(gridValueAt(twi, 1, 2), Math.log(300 / 10 / 0.1));
  });

  test('takes the width as √(Δx Δy) on rectangular cells', () => {
    const twi = topographicWetnessIndex(gridOf(3, 4, 8, 2, (x) => -0.1 * x));

    close(gridValueAt(twi, 1, 2), Math.log((3 * 16) / 4 / 0.1));
  });

  test('is higher in the middle of a V-shaped valley', () => {
    const columns = 7;
    const twi = topographicWetnessIndex(
      gridOf(6, columns, 1, 1, (x, y) => 0.5 * Math.abs(x - 3) - 0.1 * y)
    );

    for (let row = 1; row < 5; row++) {
      const middle = gridValueAt(twi, row, 3);

      for (const column of [1, 2, 4, 5])
        assert.ok(gridValueAt(twi, row, column) < middle);
    }
  });

  test('uses the minimum slope on level ground', () => {
    const level = gridOf(4, 4, 5, 5, () => 10);

    close(
      gridValueAt(topographicWetnessIndex(level), 1, 2),
      Math.log(25 / 5 / Math.tan(0.001))
    );
    close(
      gridValueAt(
        topographicWetnessIndex(level, { minSlope: 0.01 as Radians }),
        2,
        1
      ),
      Math.log(25 / 5 / Math.tan(0.01))
    );
  });

  test('is NaN on the edge and next to a missing cell', () => {
    const grid = gridOf(5, 5, 1, 1, (x, y) => x - y);
    const values = [...grid.values];

    values[18] = NaN;

    const twi = topographicWetnessIndex({ ...grid, values });

    for (const [row, column] of [
      [0, 2],
      [4, 1],
      [2, 0],
      [2, 2],
      [3, 3]
    ])
      assert.ok(Number.isNaN(gridValueAt(twi, row!, column!)));

    assert.ok(Number.isFinite(gridValueAt(twi, 1, 1)));
  });

  test('throws on a bad minimum slope', () => {
    const grid = gridOf(3, 3, 1, 1, () => 0);

    for (const minSlope of [0, -0.1, Math.PI / 2])
      assert.throws(
        () => topographicWetnessIndex(grid, { minSlope: minSlope as Radians }),
        RangeError
      );

    assert.throws(
      () => topographicWetnessIndex(grid, { minSlope: NaN as Radians }),
      TypeError
    );
  });
});
