import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { createGrid, gridValueAt } from '../../terrain/grid.js';
import { safeLandingGrid } from '../safe-landing-grid.js';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// A 5 × 5 grid of 1 m cells, z(x, y) with x east and y north
const gridOf = (z: (x: number, y: number) => number, noData?: number) =>
  createGrid({
    rows: 5,
    columns: 5,
    values: Array.from({ length: 25 }, (_, k) => z(k % 5, -Math.floor(k / 5))),
    cellSize: { x: 1, y: 1 },
    ...(noData !== undefined && { noData })
  });
// Tips at 45°, takes up to 0.5 m of roughness
const lander = { rFootprint: 2, hCoM: 2, maxRoughness: 0.5 };
const inner = (safe: ReturnType<typeof safeLandingGrid>) => {
  const cells: number[] = [];

  for (let row = 1; row < 4; row++)
    for (let column = 1; column < 4; column++)
      cells.push(gridValueAt(safe, row, column));

  return cells;
};

describe('safeLandingGrid', () => {
  test('marks level ground safe, and the edge unknown', () => {
    const safe = safeLandingGrid(
      gridOf(() => 100),
      lander
    );

    assert.deepEqual(inner(safe), Array(9).fill(1));

    for (const [row, column] of [
      [0, 0],
      [0, 2],
      [4, 3],
      [2, 4]
    ])
      assert.ok(Number.isNaN(gridValueAt(safe, row!, column!)));
  });

  test('marks a slope just under the tip-over angle safe, and one just over unsafe', () => {
    // A plane has a roughness of about its rise per cell: allow for it
    const smooth = { ...lander, maxRoughness: 2 };

    assert.deepEqual(
      inner(
        safeLandingGrid(
          gridOf((x) => 0.95 * x),
          smooth
        )
      ),
      Array(9).fill(1)
    );
    assert.deepEqual(
      inner(
        safeLandingGrid(
          gridOf((x) => 1.05 * x),
          smooth
        )
      ),
      Array(9).fill(0)
    );
  });

  test('fails sooner with rock-up, or a higher centre of mass', () => {
    const smooth = { ...lander, maxRoughness: 2 };
    const steep = gridOf((_x, y) => Math.tan(toRad(40)) * y);

    assert.equal(gridValueAt(safeLandingGrid(steep, smooth), 2, 2), 1);
    assert.equal(
      gridValueAt(
        safeLandingGrid(steep, { ...smooth, dynamicTilt: toRad(6) }),
        2,
        2
      ),
      0
    );
    assert.equal(
      gridValueAt(safeLandingGrid(steep, { ...smooth, hCoM: 3 }), 2, 2),
      0
    );
  });

  test('rules out a boulder, but not the smoother ground around it', () => {
    // 1 m high in the middle: TRI 1 m there, 1/√8 ≈ 0.35 m next to it
    const safe = safeLandingGrid(
      gridOf((x, y) => (x === 2 && y === -2 ? 1 : 0)),
      lander
    );

    assert.deepEqual(inner(safe), [1, 1, 1, 1, 0, 1, 1, 1, 1]);
  });

  test('marks cells next to a missing one unknown', () => {
    const safe = safeLandingGrid(
      gridOf((x, y) => (x === 3 && y === -3 ? -9999 : 0), -9999),
      lander
    );

    assert.equal(gridValueAt(safe, 1, 1), 1);
    assert.ok(Number.isNaN(gridValueAt(safe, 2, 2)));
    assert.ok(Number.isNaN(gridValueAt(safe, 3, 3)));
  });

  test('throws on an invalid lander', () => {
    const grid = gridOf(() => 0);

    assert.throws(
      () => safeLandingGrid(grid, { ...lander, rFootprint: 0 }),
      RangeError
    );
    assert.throws(
      () => safeLandingGrid(grid, { ...lander, maxRoughness: -1 }),
      RangeError
    );
    assert.throws(
      () => safeLandingGrid(grid, { ...lander, dynamicTilt: toRad(-1) }),
      RangeError
    );
    assert.throws(
      () => safeLandingGrid(grid, { ...lander, maxRoughness: NaN }),
      TypeError
    );
  });
});
