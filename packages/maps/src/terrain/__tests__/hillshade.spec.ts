import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { createGrid, gridValueAt } from '../grid.js';
import { hillshadeAt, hillshadeGrid } from '../hillshade.js';
import { slopeAt } from '../slope.js';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const EAST = toRad(90);
const WEST = toRad(270);

describe('hillshadeAt', () => {
  test('gives sin α on level ground, whatever the aspect', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: Math.PI / 2, noNaN: true }),
        fc.double({ min: -10, max: 10, noNaN: true }),
        (alpha, azimuth) => {
          close(
            hillshadeAt(
              0 as Radians,
              NaN as Radians,
              azimuth as Radians,
              alpha as Radians
            ),
            Math.sin(alpha)
          );
        }
      )
    );
  });

  test('is brighter facing the Sun than facing away', () => {
    const sun = toRad(30);
    const slope = toRad(20);

    assert.ok(
      hillshadeAt(slope, EAST, EAST, sun) > hillshadeAt(slope, WEST, EAST, sun)
    );
    close(hillshadeAt(slope, EAST, EAST, sun), Math.sin(toRad(50)));
    close(hillshadeAt(slope, WEST, EAST, sun), Math.sin(toRad(10)));
  });

  test('is 1 for a slope facing the Sun squarely', () => {
    close(hillshadeAt(toRad(60), EAST, EAST, toRad(30)), 1);
  });

  test('only depends on the angle between the Sun and the aspect', () => {
    const a = hillshadeAt(toRad(25), toRad(10), toRad(70), toRad(40));
    const b = hillshadeAt(toRad(25), toRad(200), toRad(260), toRad(40));

    close(a, b);
  });

  test('is 0 with the Sun below the horizon, on level ground', () => {
    assert.equal(hillshadeAt(0 as Radians, NaN as Radians, EAST, toRad(-5)), 0);
  });

  test('lights a steep slope facing a Sun just below the horizon', () => {
    // No cast shadows: only the patch's own orientation counts
    assert.ok(hillshadeAt(toRad(40), EAST, EAST, toRad(-5)) > 0);
    assert.equal(hillshadeAt(toRad(40), WEST, EAST, toRad(-5)), 0);
  });

  test('matches the Apollo 11 practice box', () => {
    const sun = toRad(10.8);

    assert.equal(
      hillshadeAt(0 as Radians, NaN as Radians, EAST, sun).toFixed(2),
      '0.19'
    );
    assert.equal(hillshadeAt(toRad(10), EAST, EAST, sun).toFixed(2), '0.36');
    assert.equal(hillshadeAt(toRad(10), WEST, EAST, sun).toFixed(2), '0.01');
  });

  test('passes a NaN slope through', () => {
    assert.ok(Number.isNaN(hillshadeAt(NaN as Radians, EAST, EAST, toRad(30))));
  });

  test('throws on invalid angles', () => {
    assert.throws(
      () => hillshadeAt(toRad(-1), EAST, EAST, toRad(30)),
      RangeError
    );
    assert.throws(
      () => hillshadeAt(toRad(91), EAST, EAST, toRad(30)),
      RangeError
    );
    assert.throws(
      () => hillshadeAt(toRad(10), EAST, EAST, toRad(91)),
      RangeError
    );
    assert.throws(
      () => hillshadeAt(toRad(10), NaN as Radians, EAST, toRad(30)),
      TypeError
    );
    assert.throws(
      () => hillshadeAt(toRad(10), EAST, NaN as Radians, toRad(30)),
      TypeError
    );
    assert.throws(
      () => hillshadeAt(Infinity as Radians, EAST, EAST, toRad(30)),
      TypeError
    );
  });
});

describe('hillshadeGrid', () => {
  // Descending to the east, 1 m every 2 m: faces east, slope atan(0.5)
  const grid = createGrid({
    rows: 4,
    columns: 4,
    values: Array.from({ length: 16 }, (_, k) => -0.5 * 2 * (k % 4)),
    cellSize: { x: 2, y: 2 }
  });

  test('matches hillshadeAt with the cell’s slope and aspect', () => {
    const shaded = hillshadeGrid(grid, EAST, toRad(30));
    const slope = slopeAt(grid, 1, 1);

    close(slope, Math.atan(0.5));
    close(gridValueAt(shaded, 1, 1), Math.sin(toRad(30) + slope));
    close(gridValueAt(shaded, 2, 2), Math.sin(toRad(30) + slope));
  });

  test('is NaN around the edge', () => {
    const shaded = hillshadeGrid(grid, EAST, toRad(30));

    for (const [row, column] of [
      [0, 1],
      [3, 2],
      [1, 0],
      [2, 3]
    ])
      assert.ok(Number.isNaN(gridValueAt(shaded, row!, column!)));
  });

  test('throws on an invalid Sun before shading any cell', () => {
    assert.throws(() => hillshadeGrid(grid, EAST, toRad(100)), RangeError);
  });
});
