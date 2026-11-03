import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { createGrid, gridValueAt } from '../grid.js';
import { mapGrid, windowAt } from '../window.js';

const cellSize = { x: 10, y: 20 };
// 4 × 5, value = 10·row + column
const ramp = createGrid({
  rows: 4,
  columns: 5,
  values: Array.from(
    { length: 20 },
    (_, k) => 10 * Math.floor(k / 5) + (k % 5)
  ),
  cellSize
});

describe('createGrid', () => {
  test('keeps the values as given, without copying them', () => {
    const values = new Float64Array(6);
    const grid = createGrid({ rows: 2, columns: 3, values, cellSize });

    assert.equal(grid.values, values);
    assert.deepEqual(grid.cellSize, cellSize);
    assert.equal('noData' in grid, false);
  });

  test('keeps noData when given', () => {
    const grid = createGrid({
      rows: 1,
      columns: 2,
      values: [1, -9999],
      cellSize,
      noData: -9999
    });

    assert.equal(grid.noData, -9999);
  });

  test('accepts NaN for a missing cell', () => {
    assert.doesNotThrow(() =>
      createGrid({ rows: 1, columns: 2, values: [1, NaN], cellSize })
    );
  });

  test('rejects a size that doesn’t fit the values', () => {
    assert.throws(
      () => createGrid({ rows: 2, columns: 3, values: [1, 2, 3], cellSize }),
      RangeError
    );
  });

  test('rejects sizes that are not positive integers', () => {
    for (const [rows, columns] of [
      [0, 1],
      [1, -1],
      [1.5, 2]
    ])
      assert.throws(
        () => createGrid({ rows, columns, values: [], cellSize }),
        RangeError
      );

    assert.throws(
      () => createGrid({ rows: NaN, columns: 1, values: [], cellSize }),
      TypeError
    );
  });

  test('rejects a cell size that is not finite and positive', () => {
    for (const bad of [
      { x: 0, y: 1 },
      { x: 1, y: -2 }
    ])
      assert.throws(
        () => createGrid({ rows: 1, columns: 1, values: [0], cellSize: bad }),
        RangeError
      );

    assert.throws(
      () =>
        createGrid({
          rows: 1,
          columns: 1,
          values: [0],
          cellSize: { x: Infinity, y: 1 }
        }),
      TypeError
    );
  });

  test('rejects infinite values and a non-finite noData', () => {
    assert.throws(
      () => createGrid({ rows: 1, columns: 1, values: [Infinity], cellSize }),
      TypeError
    );
    assert.throws(
      () =>
        createGrid({ rows: 1, columns: 1, values: [0], cellSize, noData: NaN }),
      TypeError
    );
  });
});

describe('gridValueAt', () => {
  test('reads row by row from the north-west corner', () => {
    assert.equal(gridValueAt(ramp, 0, 0), 0);
    assert.equal(gridValueAt(ramp, 0, 4), 4);
    assert.equal(gridValueAt(ramp, 3, 0), 30);
    assert.equal(gridValueAt(ramp, 2, 3), 23);
  });

  test('gives NaN for a missing cell', () => {
    const grid = createGrid({
      rows: 1,
      columns: 3,
      values: [1, -9999, NaN],
      cellSize,
      noData: -9999
    });

    assert.equal(gridValueAt(grid, 0, 0), 1);
    assert.ok(Number.isNaN(gridValueAt(grid, 0, 1)));
    assert.ok(Number.isNaN(gridValueAt(grid, 0, 2)));
  });

  test('throws outside the grid or for a non-integer index', () => {
    for (const [row, column] of [
      [-1, 0],
      [4, 0],
      [0, 5],
      [0.5, 1]
    ])
      assert.throws(() => gridValueAt(ramp, row!, column!), RangeError);
  });
});

describe('windowAt (internal)', () => {
  test('returns the 3 × 3 neighbourhood from the north-west', () => {
    assert.deepEqual(windowAt(ramp, 1, 1), [0, 1, 2, 10, 11, 12, 20, 21, 22]);
    assert.deepEqual(
      windowAt(ramp, 2, 3),
      [12, 13, 14, 22, 23, 24, 32, 33, 34]
    );
  });

  test('is null on the edges', () => {
    for (const [row, column] of [
      [0, 2],
      [3, 2],
      [1, 0],
      [1, 4]
    ])
      assert.equal(windowAt(ramp, row!, column!), null);
  });

  test('is null when the neighbourhood holds a missing cell', () => {
    const values = Array.from({ length: 9 }, () => 1);

    values[8] = -1;
    assert.equal(
      windowAt(
        createGrid({ rows: 3, columns: 3, values, cellSize, noData: -1 }),
        1,
        1
      ),
      null
    );

    values[8] = NaN;
    assert.equal(
      windowAt(createGrid({ rows: 3, columns: 3, values, cellSize }), 1, 1),
      null
    );
  });
});

describe('mapGrid (internal)', () => {
  test('makes a new grid of the same shape, without noData', () => {
    const grid = createGrid({
      rows: 2,
      columns: 3,
      values: [1, 2, 3, 4, 5, -1],
      cellSize,
      noData: -1
    });
    const doubled = mapGrid(grid, (r, c) => 2 * gridValueAt(grid, r, c));

    assert.equal(doubled.rows, 2);
    assert.equal(doubled.columns, 3);
    assert.deepEqual(doubled.cellSize, cellSize);
    assert.notEqual(doubled.cellSize, grid.cellSize);
    assert.equal(doubled.noData, undefined);
    assert.deepEqual([...doubled.values.slice(0, 5)], [2, 4, 6, 8, 10]);
    assert.ok(Number.isNaN(doubled.values[5]));
  });
});
