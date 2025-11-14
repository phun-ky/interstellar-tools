import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { gravitationalForceOn1By2 } from '../categories/dynamics/law-of-gravitation';
import { norm, relClose, scale, sub, vecRelClose } from './helpers';
import { G_SI } from '@interstellar-tools/constants';
import { Vector3DTupleType } from '@interstellar-tools/types';

describe('gravitationalForceOn1By2', () => {
  test('1D sanity (+x): |F| = G*m1*m2/r^2 and points +x', () => {
    const G = 1;
    const m1 = 2;
    const m2 = 3;
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [10, 0, 0];

    const F = gravitationalForceOn1By2(m1, m2, r1, r2, G);

    // Expected magnitude and direction
    const expectedMag = (G * m1 * m2) / 10 ** 2; // 0.06
    relClose(norm(F), expectedMag, 1e-14);
    vecRelClose(F, [expectedMag, 0, 0], 1e-14);
  });

  test('1D sanity (-x): points toward body 2 (at -x)', () => {
    const G = 1;
    const m1 = 2;
    const m2 = 3;
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [-10, 0, 0];

    const F = gravitationalForceOn1By2(m1, m2, r1, r2, G);
    relClose(norm(F), 0.06, 1e-14);
    vecRelClose(F, [-0.06, 0, 0], 1e-14);
  });

  test('direction equals r-hat for arbitrary 3D positions', () => {
    const G = 2.5;
    const m1 = 7;
    const m2 = 11;
    const r1: Vector3DTupleType = [0.2, -3, 5.5];
    const r2: Vector3DTupleType = [4.2, 1, -1];

    const F = gravitationalForceOn1By2(m1, m2, r1, r2, G);
    const dr = sub(r2, r1);
    const r = Math.hypot(...dr);
    const rhat: Vector3DTupleType = [dr[0] / r, dr[1] / r, dr[2] / r];

    // Normalize F and compare to rhat
    const Fhat = scale(F, 1 / norm(F)) as Vector3DTupleType;
    vecRelClose(Fhat, rhat, 1e-12);
  });

  test('Newton’s 3rd law: F_1<-2 = - F_2<-1', () => {
    const G = 9.87;
    const m1 = 7;
    const m2 = 11;
    const r1: Vector3DTupleType = [0, -2, 5];
    const r2: Vector3DTupleType = [3, 1, -1];

    const F12 = gravitationalForceOn1By2(m1, m2, r1, r2, G);
    const F21 = gravitationalForceOn1By2(m2, m1, r2, r1, G);

    vecRelClose(F12, [-F21[0], -F21[1], -F21[2]]);
  });

  test('inverse-square scaling: doubling r → quarter force', () => {
    const G = 10;
    const m1 = 2;
    const m2 = 5;
    const r1: Vector3DTupleType = [0, 0, 0];

    const r2a: Vector3DTupleType = [2, 0, 0]; // r = 2
    const r2b: Vector3DTupleType = [4, 0, 0]; // r = 4 (double → quarter force)

    const Fa = gravitationalForceOn1By2(m1, m2, r1, r2a, G);
    const Fb = gravitationalForceOn1By2(m1, m2, r1, r2b, G);

    relClose(norm(Fb), norm(Fa) / 4, 1e-14);
  });

  test('linearity: scaling m1, m2, or G scales F accordingly', () => {
    const G = 3;
    const m1 = 2;
    const m2 = 5;
    const r1: Vector3DTupleType = [1, 2, 3];
    const r2: Vector3DTupleType = [4, -1, 0];

    const F = gravitationalForceOn1By2(m1, m2, r1, r2, G);
    const F_m1x2 = gravitationalForceOn1By2(2 * m1, m2, r1, r2, G);
    const F_m2x2 = gravitationalForceOn1By2(m1, 2 * m2, r1, r2, G);
    const F_Gx2 = gravitationalForceOn1By2(m1, m2, r1, r2, 2 * G);

    // Doubling any of m1, m2, or G doubles the force vector
    vecRelClose(F_m1x2, scale(F, 2));
    vecRelClose(F_m2x2, scale(F, 2));
    vecRelClose(F_Gx2, scale(F, 2));
  });

  test('real-world sanity: Earth–Sun at ~1 AU (~3.54e22 N)', () => {
    const mEarth = 5.972e24; // kg
    const mSun = 1.9885e30; // kg
    const rEarth: Vector3DTupleType = [0, 0, 0];
    const rSun: Vector3DTupleType = [1.495978707e11, 0, 0]; // m

    const F = gravitationalForceOn1By2(mEarth, mSun, rEarth, rSun, G_SI);
    const r = Math.hypot(
      rSun[0] - rEarth[0],
      rSun[1] - rEarth[1],
      rSun[2] - rEarth[2]
    );
    const expectedMag = (G_SI * mEarth * mSun) / (r * r);

    relClose(norm(F), expectedMag, 1e-12);

    // also within ~0.5% of the commonly quoted magnitude
    const ref = 3.542e22;
    assert.ok(
      Math.abs(norm(F) - ref) / ref < 5e-3,
      `|F| ${norm(F)} differs from ~${ref}`
    );
  });

  test('error propagation: invalid inputs cause throws', () => {
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [1, 0, 0];

    // negative / non-finite masses
    assert.throws(
      () => gravitationalForceOn1By2(-1, 1, r1, r2, 1),
      /non-negative|finite/
    );
    assert.throws(
      () => gravitationalForceOn1By2(1, -1, r1, r2, 1),
      /non-negative|finite/
    );
    assert.throws(
      () => gravitationalForceOn1By2(Number.NaN, 1, r1, r2, 1),
      /finite/
    );

    // coincident positions
    assert.throws(
      () => gravitationalForceOn1By2(1, 1, r1, r1, 1),
      /singular \(r = 0\)/
    );

    // invalid G
    assert.throws(() => gravitationalForceOn1By2(1, 1, r1, r2, 0), /positive/);
    assert.throws(
      () => gravitationalForceOn1By2(1, 1, r1, r2, Number.NaN),
      /finite/
    );
  });
});
