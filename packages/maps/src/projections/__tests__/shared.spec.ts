import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import type { Radians } from '@interstellar-tools/types';

import { equirectangular } from '../equirectangular.js';
import { mercator } from '../mercator.js';
import { mollweide } from '../mollweide.js';
import { mapLongitude, wrapLongitude } from '../shared.js';
import { sinusoidal } from '../sinusoidal.js';

describe('wrapLongitude', () => {
  test('wraps to (-π, π], keeping the meridian', () => {
    fc.assert(
      fc.property(fc.double({ min: -1e6, max: 1e6, noNaN: true }), (lambda) => {
        const wrapped = wrapLongitude(lambda);

        assert.ok(wrapped > -Math.PI && wrapped <= Math.PI, `${wrapped}`);
        // Same meridian, up to the rounding of a whole turn
        assert.ok(
          Math.abs(Math.sin(wrapped) - Math.sin(lambda)) <= 1e-9 &&
            Math.abs(Math.cos(wrapped) - Math.cos(lambda)) <= 1e-9
        );
      })
    );
  });

  test('keeps longitudes already in range, and sends -π to π', () => {
    for (const lambda of [0, 1, -1, Math.PI, 3.1415926535897927])
      assert.equal(wrapLongitude(lambda), lambda);

    assert.equal(wrapLongitude(-Math.PI), Math.PI);
    assert.equal(wrapLongitude(3 * Math.PI), Math.PI);
  });

  test('stays in range one ulp above -π', () => {
    // λ − π rounds to −2π here, which once wrapped it past π
    assert.equal(wrapLongitude(-3.1415926535897927), -3.1415926535897927);
  });
});

describe('mapLongitude', () => {
  test('wraps like wrapLongitude, except that -π stays on the left edge', () => {
    fc.assert(
      fc.property(fc.double({ min: -1e6, max: 1e6, noNaN: true }), (lambda) => {
        if (lambda !== -Math.PI)
          assert.equal(mapLongitude(lambda), wrapLongitude(lambda));
      })
    );

    assert.equal(mapLongitude(-Math.PI), -Math.PI);
    assert.equal(mapLongitude(Math.PI), Math.PI);
    assert.equal(mapLongitude(3 * Math.PI), Math.PI);
  });

  test('keeps a line split at the antimeridian on its own side of every map', () => {
    const R = 1;
    // A ground track crossing the antimeridian eastward, split there: one
    // segment ends at π, the next starts at -π
    const east = [
      [0.1, 3.1],
      [0.12, Math.PI]
    ] as const;
    const west = [
      [0.12, -Math.PI],
      [0.14, -3.1]
    ] as const;
    const projections = { equirectangular, mercator, sinusoidal, mollweide };

    for (const [name, project] of Object.entries(projections)) {
      const x = (phi: number, lambda: number) =>
        project(phi as Radians, lambda as Radians, R).x;
      const [a, b] = east.map(([phi, lambda]) => x(phi, lambda));
      const [c, d] = west.map(([phi, lambda]) => x(phi, lambda));

      // Each segment runs a short way, toward its edge: right, then left
      assert.ok(a! < b! && b! > 0, name);
      assert.ok(c! < d! && c! < 0, name);
      assert.ok(Math.abs(b! - a!) < 0.1 && Math.abs(d! - c!) < 0.1, name);
      // Opposite edges of the map, at the same latitude
      assert.ok(Math.abs(b! + x(0.12, -Math.PI)) < 1e-12, name);
    }
  });
});
