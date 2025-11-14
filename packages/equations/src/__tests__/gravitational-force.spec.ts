import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { G_SI } from '@interstellar-tools/constants';
import { norm, relClose, vecRelClose } from './helpers';
import { gravitationalForce } from '../categories/gravity/gravitational-force';

describe('gravitationalForce', () => {
  test('computes simple 1D case (+x) with custom G', () => {
    const G = 1; // simple numbers to check algebra
    const m1 = 2;
    const m2 = 3;
    const r1: [number, number, number] = [0, 0, 0];
    const r2: [number, number, number] = [10, 0, 0];

    const res = gravitationalForce(m1, m2, r1, r2, G);

    // Expected: |F| = G m1 m2 / r^2 = 6 / 100 = 0.06; direction = +x
    relClose(res.magnitude, 0.06);
    vecRelClose(res.vector, [0.06, 0, 0]);
    // invariants
    relClose(norm(res.vector), res.magnitude);
    relClose(norm(res.direction), 1);
    vecRelClose(res.vector, [
      res.magnitude * res.direction[0],
      res.magnitude * res.direction[1],
      res.magnitude * res.direction[2]
    ]);
  });

  test('direction points from body 1 toward body 2 (arbitrary 3D)', () => {
    const G = 1.23;
    const m1 = 1;
    const m2 = 4;
    const r1: [number, number, number] = [1, 2, 3];
    const r2: [number, number, number] = [-2, 6, 3]; // displacement = (-3, 4, 0)
    const res = gravitationalForce(m1, m2, r1, r2, G);

    // direction should align with normalized (r2 - r1)
    const dr: [number, number, number] = [
      r2[0] - r1[0],
      r2[1] - r1[1],
      r2[2] - r1[2]
    ];
    const r = Math.hypot(...dr);
    const rhat: [number, number, number] = [dr[0] / r, dr[1] / r, dr[2] / r];

    vecRelClose(res.direction, rhat, 1e-12);
    // vector == magnitude * rhat
    vecRelClose(res.vector, [
      res.magnitude * rhat[0],
      res.magnitude * rhat[1],
      res.magnitude * rhat[2]
    ]);
  });

  test("Newton's 3rd law: F_1<-2 = - F_2<-1", () => {
    const G = 9.87;
    const m1 = 7;
    const m2 = 11;
    const r1: [number, number, number] = [0, -2, 5];
    const r2: [number, number, number] = [3, 1, -1];

    const F12 = gravitationalForce(m1, m2, r1, r2, G).vector;
    const F21 = gravitationalForce(m2, m1, r2, r1, G).vector;

    vecRelClose(F12, [-F21[0], -F21[1], -F21[2]]);
  });

  test('real-world sanity: Earth-Sun at ~1 AU (matches known ~3.54e22 N)', () => {
    const mEarth = 5.972e24; // kg
    const mSun = 1.9885e30; // kg
    const r1: [number, number, number] = [0, 0, 0];
    const r2: [number, number, number] = [1.495978707e11, 0, 0]; // m

    const res = gravitationalForce(mEarth, mSun, r1, r2, G_SI);

    // Compare to closed-form expectation (not using the function's internal dir)
    const r = Math.hypot(r2[0] - r1[0], r2[1] - r1[1], r2[2] - r1[2]);
    const expectedMag = (G_SI * mEarth * mSun) / (r * r);

    // exact equivalence (up to FP)
    relClose(res.magnitude, expectedMag, 1e-15);

    // also compare to the commonly quoted magnitude ~3.542e22 N within 0.5%
    const ref = 3.542e22;
    assert.ok(
      Math.abs(res.magnitude - ref) / ref < 5e-3,
      `|F| ${res.magnitude} differs from ~${ref}`
    );
  });

  test('error: negative or non-finite masses', () => {
    const r1: [number, number, number] = [0, 0, 0];
    const r2: [number, number, number] = [1, 0, 0];

    assert.throws(() => gravitationalForce(-1, 1, r1, r2, 1), /non-negative/);
    assert.throws(() => gravitationalForce(1, -1, r1, r2, 1), /non-negative/);
    assert.throws(() => gravitationalForce(Number.NaN, 1, r1, r2, 1), /finite/);
    assert.throws(
      () => gravitationalForce(1, Number.POSITIVE_INFINITY, r1, r2, 1),
      /finite/
    );
  });

  test('error: coincident positions (r = 0)', () => {
    const r: [number, number, number] = [3, -4, 5];
    assert.throws(
      () => gravitationalForce(1, 1, r, r, 1),
      /singular \(r = 0\)/
    );
  });

  test('error: invalid G (non-finite or <= 0)', () => {
    const r1: [number, number, number] = [0, 0, 0];
    const r2: [number, number, number] = [1, 0, 0];

    assert.throws(() => gravitationalForce(1, 1, r1, r2, 0), /positive/);
    assert.throws(() => gravitationalForce(1, 1, r1, r2, Number.NaN), /finite/);
    assert.throws(() => gravitationalForce(1, 1, r1, r2, -1), /positive/);
  });

  test('scales with 1/r^2', () => {
    const G = 10;
    const m1 = 2;
    const m2 = 5;
    const r1: [number, number, number] = [0, 0, 0];

    const r2a: [number, number, number] = [2, 0, 0]; // r = 2
    const r2b: [number, number, number] = [4, 0, 0]; // r = 4 (double -> quarter force)

    const Fa = gravitationalForce(m1, m2, r1, r2a, G).magnitude;
    const Fb = gravitationalForce(m1, m2, r1, r2b, G).magnitude;

    relClose(Fb, Fa / 4);
  });
});
