import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { fromQuadkey, quadkey } from '../quadkey.js';
import { tileAt } from '../tile-at.js';
import { tileBounds } from '../tile-bounds.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// The map's top edge, where it is square
const LIMIT = Math.atan(Math.sinh(Math.PI));
const tile = fc.integer({ min: 0, max: 30 }).chain((z) =>
  fc.record({
    x: fc.integer({ min: 0, max: 2 ** z - 1 }),
    y: fc.integer({ min: 0, max: 2 ** z - 1 }),
    z: fc.constant(z)
  })
);

describe('tileAt', () => {
  test('puts the whole map in one tile at zoom 0', () => {
    for (const [phi, lambda] of [
      [0, 0],
      [80, -179],
      [-90, 180],
      [45, 90]
    ])
      assert.deepEqual(tileAt(rad(phi!), rad(lambda!), 0), {
        x: 0,
        y: 0,
        z: 0
      });
  });

  test('finds known tiles', () => {
    // Worked out with the OpenStreetMap wiki's formula
    for (const [phi, lambda, z, x, y] of [
      [59.9139, 10.7522, 10, 542, 297], // Oslo
      [59.9139, 10.7522, 15, 17362, 9531],
      [-33.8568, 151.2153, 12, 3768, 2457], // Sydney
      [18.65, -133.8, 6, 8, 28], // Olympus Mons, Mars
      [0, 0, 1, 1, 1] // The corner where four tiles meet
    ] as const)
      assert.deepEqual(tileAt(rad(phi), rad(lambda), z), { x, y, z });
  });

  test('clamps the poles into the top and bottom rows', () => {
    for (const phi of [85.06, 89, 90])
      assert.equal(tileAt(rad(phi), 0 as Radians, 4).y, 0);

    for (const phi of [-85.06, -89, -90])
      assert.equal(tileAt(rad(phi), 0 as Radians, 4).y, 15);
  });

  test('takes the longitude modulo a whole turn: 180° E is column 0', () => {
    assert.equal(tileAt(0 as Radians, Math.PI as Radians, 3).x, 0);
    assert.equal(tileAt(0 as Radians, -Math.PI as Radians, 3).x, 0);
    assert.deepEqual(
      tileAt(rad(18.65), rad(226.2), 6),
      tileAt(rad(18.65), rad(-133.8), 6)
    );
  });

  test('finds a tile whose bounds hold the point', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -LIMIT, max: LIMIT, noNaN: true }),
        fc.double({ min: -Math.PI, max: Math.PI, noNaN: true }),
        fc.integer({ min: 0, max: 30 }),
        (phi, lambda, z) => {
          const { x, y } = tileAt(phi as Radians, lambda as Radians, z);
          const { north, south, west, east } = tileBounds(x, y, z);

          assert.ok(south - 1e-12 <= phi && phi <= north + 1e-12);
          assert.ok(
            (west - 1e-12 <= lambda && lambda <= east + 1e-12) ||
              // 180° E is the west edge of column 0
              (x === 0 && lambda === Math.PI)
          );
        }
      )
    );
  });

  test('throws on bad inputs', () => {
    assert.throws(() => tileAt(0 as Radians, NaN as Radians, 1), TypeError);
    assert.throws(() => tileAt(2 as Radians, 0 as Radians, 1), RangeError);

    for (const z of [-1, 31, 1.5, NaN])
      assert.throws(() => tileAt(0 as Radians, 0 as Radians, z), RangeError);
  });
});

describe('tileBounds', () => {
  test('covers the whole map at zoom 0', () => {
    const { north, south, west, east } = tileBounds(0, 0, 0);

    close(north, LIMIT);
    close(south, -LIMIT);
    assert.equal(west, -Math.PI);
    assert.equal(east, Math.PI);
    close(LIMIT, rad(85.0511287798));
  });

  test('round-trips the centre of a tile through tileAt', () => {
    fc.assert(
      fc.property(tile, ({ x, y, z }) => {
        const { north, south, west, east } = tileBounds(x, y, z);

        assert.deepEqual(
          tileAt(
            ((north + south) / 2) as Radians,
            ((west + east) / 2) as Radians,
            z
          ),
          { x, y, z }
        );
      })
    );
  });

  test('shares edges exactly with neighbouring tiles', () => {
    fc.assert(
      fc.property(tile, ({ x, y, z }) => {
        fc.pre(z > 0);

        const n = 2 ** z;
        const here = tileBounds(x, y, z);

        if (x + 1 < n) assert.equal(here.east, tileBounds(x + 1, y, z).west);

        if (y + 1 < n) assert.equal(here.south, tileBounds(x, y + 1, z).north);
      })
    );
  });

  test('splits into four children with the same outer edges', () => {
    fc.assert(
      fc.property(tile, ({ x, y, z }) => {
        fc.pre(z < 30);

        const parent = tileBounds(x, y, z);
        const northWest = tileBounds(2 * x, 2 * y, z + 1);
        const southEast = tileBounds(2 * x + 1, 2 * y + 1, z + 1);

        assert.equal(northWest.north, parent.north);
        assert.equal(northWest.west, parent.west);
        assert.equal(southEast.south, parent.south);
        assert.equal(southEast.east, parent.east);
        assert.equal(northWest.east, southEast.west);
        assert.equal(northWest.south, southEast.north);
      })
    );
  });

  test('throws on tiles that do not exist', () => {
    for (const [x, y, z] of [
      [0, 0, -1],
      [0, 0, 31],
      [0, 0, 0.5],
      [2, 0, 1],
      [0, -1, 1],
      [0.5, 0, 1],
      [NaN, 0, 1]
    ])
      assert.throws(() => tileBounds(x!, y!, z!), RangeError);
  });
});

describe('quadkey', () => {
  test('matches the Bing Maps example and a known tile', () => {
    assert.equal(quadkey(3, 5, 3), '213');
    assert.equal(quadkey(542, 297, 10), '1200213112');
    assert.equal(quadkey(0, 0, 0), '');
    assert.equal(quadkey(2 ** 30 - 1, 0, 30), '1'.repeat(30));
  });

  test('round-trips through fromQuadkey', () => {
    fc.assert(
      fc.property(tile, (t) => {
        const key = quadkey(t.x, t.y, t.z);

        assert.equal(key.length, t.z);
        assert.deepEqual(fromQuadkey(key), { x: t.x, y: t.y, z: t.z });
      })
    );
  });

  test("starts with its parent's key", () => {
    fc.assert(
      fc.property(tile, ({ x, y, z }) => {
        fc.pre(z > 0);

        const key = quadkey(x, y, z);

        assert.equal(key.slice(0, -1), quadkey(x >> 1, y >> 1, z - 1));
        // The last digit is the quarter of the parent
        assert.equal(Number(key[key.length - 1]), (x & 1) + 2 * (y & 1));
      })
    );
  });

  test('throws on bad tiles and bad keys', () => {
    assert.throws(() => quadkey(8, 0, 3), RangeError);
    assert.throws(() => quadkey(0, 0, 31), RangeError);

    for (const key of ['124', 'a', ' 1', '0'.repeat(31)])
      assert.throws(() => fromQuadkey(key), RangeError);

    assert.deepEqual(fromQuadkey(''), { x: 0, y: 0, z: 0 });
  });
});
