import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { safeLandingGrid } from '../landing/safe-landing-grid.js';
import {
  equirectangular,
  inverseEquirectangular
} from '../projections/equirectangular.js';
import { mercator } from '../projections/mercator.js';
import { orthographic } from '../projections/orthographic.js';
import { stereographic } from '../projections/stereographic.js';
import { aspectAt } from '../terrain/aspect.js';
import { curvatureAt } from '../terrain/curvature.js';
import { createGrid } from '../terrain/grid.js';
import { hillshadeAt } from '../terrain/hillshade.js';
import { slopeAt } from '../terrain/slope.js';
import { terrainRoughnessIndexAt } from '../terrain/terrain-roughness-index.js';
import { quadkey } from '../tiles/quadkey.js';
import { tileAt } from '../tiles/tile-at.js';
import { tileBounds } from '../tiles/tile-bounds.js';

// Every number in the maps guide (docs/guide/usage/maps.md), so the page
// can't drift from the code.

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const R = 3_396_190;
const site = [toRad(18.4447), toRad(77.4508)] as const;

describe('Maps guide: projections', () => {
  test("Perseverance's landing site, equirectangular and Mercator", () => {
    const flat = equirectangular(...site, R);
    const back = inverseEquirectangular(4_590_873, 1_093_304, R);
    const web = mercator(...site, R);

    assert.equal(group(flat.x), '4 590 873');
    assert.equal(group(flat.y), '1 093 304');
    assert.equal(toDeg(back.phi).toFixed(4), '18.4447');
    assert.equal(toDeg(back.lambda).toFixed(4), '77.4508');
    assert.equal(group(web.x), '4 590 873');
    assert.equal(group(web.y), '1 112 692');
    assert.equal(((web.y - flat.y) / 1000).toFixed(1), '19.4');
  });

  test('a polar stereographic map, and a globe centred on Jezero', () => {
    const polar = stereographic(toRad(85), toRad(0), R, { phi0: toRad(90) });

    assert.equal(polar.x, 0);
    assert.equal(group(polar.y), '-296 562');
    assert.equal((Math.hypot(polar.x, polar.y) / 1000).toFixed(1), '296.6');
    // Scale k = 2 / (1 + cos c), 5° from the centre
    assert.equal(((2 / (1 + Math.cos(toRad(5))) - 1) * 100).toFixed(1), '0.2');

    const curiosity = orthographic(toRad(-4.5895), toRad(137.4417), R, {
      phi0: site[0],
      lambda0: site[1]
    });

    assert.equal(group(curiosity.x), '2 931 487');
    assert.equal(group(curiosity.y), '-793 474');
  });
});

describe('Maps guide: tiles', () => {
  test("Jezero's tiles and quadkeys", () => {
    const tile = tileAt(...site, 6);
    const bounds = tileBounds(tile.x, tile.y, tile.z);

    assert.deepEqual(tile, { x: 45, y: 28, z: 6 });
    assert.equal(quadkey(tile.x, tile.y, tile.z), '123301');
    assert.equal(toDeg(bounds.south).toFixed(2), '16.64');
    assert.equal(toDeg(bounds.north).toFixed(2), '21.94');
    assert.equal(toDeg(bounds.west).toFixed(3), '73.125');
    assert.equal(toDeg(bounds.east).toFixed(2), '78.75');

    // The diagram: tile 1 at zoom 1, tile 12 at zoom 2
    for (const [z, key] of [
      [1, '1'],
      [2, '12']
    ] as const) {
      const { x, y } = tileAt(...site, z);

      assert.equal(quadkey(x, y, z), key);
    }

    assert.equal(group((2 * Math.PI * R) / 2 ** 6 / 1000), '333');
    assert.equal(((2 * Math.PI * R) / 2 ** 10 / 1000).toFixed(1), '20.8');
    assert.equal(toDeg(Math.atan(Math.sinh(Math.PI))).toFixed(2), '85.05');
  });
});

describe('Maps guide: terrain', () => {
  const values: number[] = [];

  for (let row = 0; row < 5; row++)
    for (let column = 0; column < 5; column++)
      values.push(0.1 * column + (row === 1 && column === 3 ? 0.4 : 0));

  const grid = createGrid({
    rows: 5,
    columns: 5,
    values,
    cellSize: { x: 1, y: 1 }
  });

  test('slope, aspect and shading', () => {
    const slope = slopeAt(grid, 3, 2);
    const aspect = aspectAt(grid, 3, 2);

    assert.equal(toDeg(slope).toFixed(2), '5.71');
    assert.equal(toDeg(aspect), 270);
    assert.equal(
      hillshadeAt(slope, aspect, toRad(270), toRad(30)).toFixed(2),
      '0.58'
    );
    assert.equal(
      hillshadeAt(slope, aspect, toRad(90), toRad(30)).toFixed(2),
      '0.41'
    );
    // Flat ground, for comparison
    assert.equal(
      hillshadeAt(0 as Radians, 0 as Radians, toRad(270), toRad(30)).toFixed(2),
      '0.50'
    );
  });

  test('roughness and curvature', () => {
    const boulder = curvatureAt(grid, 1, 3);
    const plane = curvatureAt(grid, 3, 2);

    assert.equal(terrainRoughnessIndexAt(grid, 3, 2).toFixed(3), '0.087');
    assert.equal(terrainRoughnessIndexAt(grid, 1, 3).toFixed(2), '0.41');
    assert.equal(boulder.profile.toFixed(2), '0.79');
    assert.equal(boulder.planform.toFixed(2), '0.80');
    assert.equal(Math.abs(plane.profile), 0);
    assert.equal(Math.abs(plane.planform), 0);
  });

  test('where to land', () => {
    const safe = safeLandingGrid(grid, {
      rFootprint: 1.0,
      hCoM: 0.8,
      maxRoughness: 0.3
    });
    const rows = Array.from({ length: 5 }, (_, row) =>
      Array.from(safe.values.slice(row * 5, row * 5 + 5))
        .map((v) => (Number.isNaN(v) ? '·' : String(v)))
        .join('  ')
    );

    assert.equal(toDeg(Math.atan(1.0 / 0.8)).toFixed(1), '51.3');
    assert.deepEqual(rows, [
      '·  ·  ·  ·  ·',
      '·  1  1  0  ·',
      '·  1  1  1  ·',
      '·  1  1  1  ·',
      '·  ·  ·  ·  ·'
    ]);
  });
});
