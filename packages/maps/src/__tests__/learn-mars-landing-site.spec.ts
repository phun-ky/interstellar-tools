import { PLANETS } from '@interstellar-tools/constants';
import { greatCircleDistance } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { isStableLanding } from '../landing/is-stable-landing.js';
import { safeLandingGrid } from '../landing/safe-landing-grid.js';
import { tipOverAngle } from '../landing/tip-over-angle.js';
import { aspectGrid } from '../terrain/aspect.js';
import { createGrid, type GridInterface } from '../terrain/grid.js';
import { hillshadeGrid } from '../terrain/hillshade.js';
import { slopeGrid } from '../terrain/slope.js';
import { terrainRoughnessIndexGrid } from '../terrain/terrain-roughness-index.js';

// The numbers in docs/learn/choose-a-landing-site-on-mars.md, from the grid
// its <MarsLandingGrid> widget draws

const DOCS = new URL('../../../../docs/', import.meta.url);
const JEZERO = JSON.parse(
  readFileSync(
    new URL('.vitepress/theme/components/mars/jezero-delta-front.json', DOCS),
    'utf8'
  )
) as {
  rows: number;
  columns: number;
  cellSize: { x: number; y: number };
  latitudes: number[];
  longitudes: number[];
  heights: number[];
};
const PAGE = readFileSync(
  new URL('learn/choose-a-landing-site-on-mars.md', DOCS),
  'utf8'
);
const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const at = ({ values }: GridInterface, row: number, column: number) =>
  values[row * 10 + column]!;
const range = (values: number[], digits: number) => [
  Math.min(...values).toFixed(digits),
  Math.max(...values).toFixed(digits)
];
const grid = createGrid({
  rows: JEZERO.rows,
  columns: JEZERO.columns,
  values: JEZERO.heights,
  cellSize: JEZERO.cellSize
});
const slope = slopeGrid(grid);
const roughness = terrainRoughnessIndexGrid(grid);
const shade = hillshadeGrid(grid, toRad(315), toRad(30));
const lander = {
  rFootprint: 1.0,
  hCoM: 1.5,
  dynamicTilt: toRad(12),
  maxRoughness: 1.0
};
const safe = safeLandingGrid(grid, lander);
const cells = Array.from({ length: 100 }, (_, i) => ({
  row: Math.floor(i / 10),
  column: i % 10
}));
const inner = cells.filter(
  ({ row, column }) => !Number.isNaN(at(slope, row, column))
);
// The top of the delta, as the page puts it: the two western columns
const west = inner.filter(({ column }) => column <= 2);
const count = (g: GridInterface) =>
  Array.from(g.values).filter((v) => v === 1).length;

describe('Choose a landing site on Mars (tutorial)', () => {
  test('prints the same 100 heights as the widget draws', () => {
    const block = PAGE.match(/export const heights = \[([^\]]+)\]/)![1]!;
    const printed = block
      .split('\n')
      .filter((line) => !line.trim().startsWith('//'))
      .join('')
      .split(',')
      .map(Number);

    assert.deepEqual(printed, JEZERO.heights);
  });

  test('1. covers 51.6 m of relief, from −2,527.6 m to −2,476.0 m', () => {
    assert.deepEqual(range(JEZERO.heights, 1), ['-2527.6', '-2476.0']);
    assert.equal(
      (Math.max(...JEZERO.heights) - Math.min(...JEZERO.heights)).toFixed(1),
      '51.6'
    );
    assert.equal(JEZERO.latitudes[0]!.toFixed(4), '18.4649');
    assert.equal(JEZERO.longitudes[0]!.toFixed(4), '77.4204');
  });

  test('1. has cells of 19.83 m by 20.19 m, 0.98 of the step at 15° N', () => {
    const ratio = Math.cos(toRad(18.5)) / Math.cos(toRad(15));

    assert.equal(ratio.toFixed(2), '0.98');
    assert.deepEqual(JEZERO.cellSize, { x: 19.83, y: 20.19 });
    // At the grid's own latitude, between rows 4 and 5
    assert.equal(
      ((20.19 * Math.cos(toRad(18.4634))) / Math.cos(toRad(15))).toFixed(2),
      '19.83'
    );
    assert.equal(
      ((JEZERO.latitudes[4]! + JEZERO.latitudes[5]!) / 2).toFixed(4),
      '18.4634'
    );
  });

  test('2. slopes 1.1° to 3.1° on the delta top and 34.3° at the target', () => {
    const aspect = aspectGrid(grid);
    const steepest = inner.reduce((a, b) =>
      at(slope, b.row, b.column) > at(slope, a.row, a.column) ? b : a
    );

    assert.equal(inner.length, 64);
    assert.deepEqual(
      range(
        west.map(({ row, column }) => toDeg(at(slope, row, column))),
        1
      ),
      ['1.1', '3.1']
    );
    assert.deepEqual(steepest, { row: 2, column: 8 });
    assert.equal(toDeg(at(slope, 2, 8)).toFixed(1), '34.3');
    assert.equal(toDeg(at(aspect, 2, 8)).toFixed(1), '94.6');
  });

  test('3. is 0.4 m to 1.7 m rough on the delta top and 11.9 m at most', () => {
    assert.deepEqual(
      range(
        west.map(({ row, column }) => at(roughness, row, column)),
        1
      ),
      ['0.4', '1.7']
    );
    assert.equal(
      Math.max(
        ...inner.map(({ row, column }) => at(roughness, row, column))
      ).toFixed(1),
      '11.9'
    );
  });

  test('4. shades the delta top 0.45 to 0.52 and the target 0.04, or 0.90 with an eastern sun', () => {
    assert.equal(Math.sin(toRad(30)).toFixed(1), '0.5');
    assert.deepEqual(
      range(
        west.map(({ row, column }) => at(shade, row, column)),
        2
      ),
      ['0.45', '0.52']
    );
    assert.equal(at(shade, 2, 8).toFixed(2), '0.04');
    assert.equal(
      at(hillshadeGrid(grid, toRad(90), toRad(30)), 2, 8).toFixed(2),
      '0.90'
    );
  });

  test('5. tips over at 33.7°, so 42 cells pass and 23 with roughness', () => {
    const limit = toDeg(tipOverAngle(1.0, 1.5));
    const upright = inner.filter(({ row, column }) =>
      isStableLanding(at(slope, row, column) as Radians, toRad(12), 1.0, 1.5)
    );
    const ruledOut = upright.filter(
      ({ row, column }) => !at(safe, row, column)
    );

    assert.equal(limit.toFixed(1), '33.7');
    assert.equal((limit - 12).toFixed(1), '21.7');
    assert.equal(upright.length, 42);
    assert.equal(count(safe), 23);
    assert.equal(ruledOut.length, 19);
    // Without the touchdown tilt, the same cells are safe
    assert.equal(
      count(safeLandingGrid(grid, { ...lander, dynamicTilt: toRad(0) })),
      23
    );
  });

  test('5. reads a TRI of 1 m as 3.3° of slope on 20 m cells', () => {
    assert.equal(
      toDeg(Math.atan(1 / (Math.sqrt(3 / 4) * 20))).toFixed(1),
      '3.3'
    );
  });

  test('6. lands 62.7 m from the target and about 2.1 km from Perseverance', () => {
    const R =
      PLANETS.find((planet) => planet.id === 'mars')!.radius.value * 1000;
    const distance = (row: number, column: number, lat: number, lon: number) =>
      greatCircleDistance(
        toRad(JEZERO.latitudes[row]!),
        toRad(JEZERO.longitudes[column]!),
        toRad(lat),
        toRad(lon),
        R
      );
    const target = [JEZERO.latitudes[2]!, JEZERO.longitudes[8]!] as const;
    const nearest = cells
      .filter(({ row, column }) => at(safe, row, column) === 1)
      .map(({ row, column }) => ({
        row,
        column,
        d: distance(row, column, ...target)
      }))
      .reduce((a, b) => (b.d < a.d ? b : a));

    assert.equal(R, 3389.5e3);
    assert.deepEqual([nearest.row, nearest.column], [1, 5]);
    // The coordinates the page prints for the two cells
    assert.ok(
      PAGE.includes(
        `rad(${JEZERO.latitudes[1]}), lon: rad(${JEZERO.longitudes[5]})`
      )
    );
    assert.ok(
      PAGE.includes(
        `rad(${JEZERO.latitudes[2]}), lon: rad(${JEZERO.longitudes[8]})`
      )
    );
    assert.equal(nearest.d.toFixed(1), '62.7');
    assert.equal((at(grid, 1, 5) - at(grid, 2, 8)).toFixed(1), '16.4');
    assert.equal((distance(1, 5, 18.44, 77.45) / 1000).toFixed(1), '2.1');
    // South-east of the site
    assert.ok(18.44 < JEZERO.latitudes[1]! && 77.45 > JEZERO.longitudes[5]!);
    assert.equal(
      Math.hypot(3 * JEZERO.cellSize.x, JEZERO.cellSize.y).toFixed(1),
      '62.8'
    );
  });
});
