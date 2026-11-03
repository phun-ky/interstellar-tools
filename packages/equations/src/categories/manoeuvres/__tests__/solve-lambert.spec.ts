import type { Vector3DTupleType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose, relClose } from '../../../__tests__/helpers/index.js';
import { circularSpeed } from '../../orbits/circular-speed.js';
import { hohmannTransfer } from '../hohmann-transfer.js';
import { solveLambert } from '../solve-lambert.js';

const MU = 3.986004418e14;

// Reflect y: turns a counterclockwise transfer into a clockwise one
const mirror = ([x, y, z]: Vector3DTupleType): Vector3DTupleType => [x, -y, z];

describe('solveLambert', () => {
  test('matches Curtis, Example 5.2', () => {
    // Orbital Mechanics for Engineering Students: μ = 398 600 km³/s²
    const { v1, v2 } = solveLambert(
      [5_000_000, 10_000_000, 2_100_000],
      [-14_600_000, 2_500_000, 7_000_000],
      3600,
      3.986e14
    );
    const book1 = [-5992.5, 1925.4, 3245.6];
    const book2 = [-3312.5, -4196.6, -385.29];

    for (let i = 0; i < 3; i++) {
      absClose(v1[i], book1[i], 0.05);
      absClose(v2[i], book2[i], 0.05);
    }
  });

  test('works in any units, as long as they agree', () => {
    const km = solveLambert(
      [5000, 10_000, 2100],
      [-14_600, 2500, 7000],
      3600,
      398_600
    );
    const m = solveLambert(
      [5e6, 1e7, 2.1e6],
      [-14.6e6, 2.5e6, 7e6],
      3600,
      3.986e14
    );

    for (let i = 0; i < 3; i++) {
      relClose(m.v1[i], km.v1[i] * 1000, 1e-10);
      relClose(m.v2[i], km.v2[i] * 1000, 1e-10);
    }
  });

  test('finds the circular orbit through two points on it', () => {
    const r = 7_000_000;
    const v = circularSpeed(r, MU);
    const angle = 1.2;
    const dt = angle / (v / r);
    const { v1, v2 } = solveLambert(
      [r, 0, 0],
      [r * Math.cos(angle), r * Math.sin(angle), 0],
      dt,
      MU
    );

    absClose(v1[0], 0, 1e-6);
    relClose(v1[1], v, 1e-10);
    relClose(Math.hypot(...v2), v, 1e-10);
  });

  test('approaches the Hohmann transfer near 180°', () => {
    const r1 = 7_000_000;
    const r2 = 42_164_000;
    const { dv1, dv2, tTransfer } = hohmannTransfer(r1, r2, MU);
    const eps = 1e-4;
    const { v1, v2 } = solveLambert(
      [r1, 0, 0],
      [-r2 * Math.cos(eps), r2 * Math.sin(eps), 0],
      tTransfer,
      MU
    );

    relClose(Math.hypot(...v1), circularSpeed(r1, MU) + dv1, 1e-3);
    relClose(Math.hypot(...v2), circularSpeed(r2, MU) - dv2, 1e-3);
  });

  test('flies the other way round with prograde: false, the mirror image', () => {
    const r1: Vector3DTupleType = [7e6, 1e6, 5e5];
    const r2: Vector3DTupleType = [-2e6, 9e6, -1e6];
    const dt = 5000;
    const retro = solveLambert(r1, r2, dt, MU, { prograde: false });
    const mirrored = solveLambert(mirror(r1), mirror(r2), dt, MU);

    for (let i = 0; i < 3; i++) {
      relClose(retro.v1[i], mirror(mirrored.v1)[i], 1e-9);
      relClose(retro.v2[i], mirror(mirrored.v2)[i], 1e-9);
    }

    // Seen from +z, prograde goes counterclockwise and retrograde clockwise
    const pro = solveLambert(r1, r2, dt, MU);

    assert.ok(r1[0] * pro.v1[1] - r1[1] * pro.v1[0] > 0);
    assert.ok(r1[0] * retro.v1[1] - r1[1] * retro.v1[0] < 0);
  });

  test('takes a hyperbola for a fast transfer, and an ellipse for a slow one', () => {
    const r1: Vector3DTupleType = [7e6, 0, 0];
    const r2: Vector3DTupleType = [0, 9e6, 0];
    const energy = (dt: number) => {
      const { v1 } = solveLambert(r1, r2, dt, MU);

      return Math.hypot(...v1) ** 2 / 2 - MU / 7e6;
    };

    assert.ok(energy(300) > 0);
    assert.ok(energy(3000) < 0);
  });

  test('throws when the positions are 0° or 180° apart', () => {
    assert.throws(
      () => solveLambert([7e6, 0, 0], [9e6, 0, 0], 3000, MU),
      RangeError
    );
    assert.throws(
      () => solveLambert([7e6, 0, 0], [-9e6, 0, 0], 3000, MU),
      RangeError
    );
  });

  test('throws on invalid inputs', () => {
    const r1: Vector3DTupleType = [7e6, 0, 0];
    const r2: Vector3DTupleType = [0, 9e6, 0];

    assert.throws(() => solveLambert(r1, r2, 0, MU), RangeError);
    assert.throws(() => solveLambert(r1, r2, -1, MU), RangeError);
    assert.throws(() => solveLambert(r1, r2, 3000, 0), RangeError);
    assert.throws(() => solveLambert([0, 0, 0], r2, 3000, MU), RangeError);
    assert.throws(() => solveLambert(r1, r2, Number.NaN, MU), TypeError);
    assert.throws(
      () => solveLambert([Infinity, 0, 0], r2, 3000, MU),
      TypeError
    );
  });
});
