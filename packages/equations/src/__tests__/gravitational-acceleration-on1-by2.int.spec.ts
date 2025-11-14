import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { gravitationalAccelerationOn1By2 } from '../categories/gravity/law-of-gravitation';
import { norm, relClose, scale, sub, vecRelClose } from './helpers';
import { G_SI } from '@interstellar-tools/constants';
import { Vector3DTupleType } from '@interstellar-tools/types';

describe('gravitationalAccelerationOn1By2', () => {
  test('1D sanity (+x): ||a|| = G*m2/r^2 and points +x', () => {
    const G = 1;
    const m2 = 3;
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [10, 0, 0];

    const a = gravitationalAccelerationOn1By2(m2, r1, r2, G);

    // Expected magnitude: 1*3/10^2 = 0.03, direction +x
    relClose(norm(a), 0.03, 1e-14);
    vecRelClose(a, [0.03, 0, 0], 1e-14);
  });

  test('1D sanity (-x): points toward body 2 at negative x', () => {
    const G = 1;
    const m2 = 3;
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [-10, 0, 0];

    const a = gravitationalAccelerationOn1By2(m2, r1, r2, G);

    relClose(norm(a), 0.03, 1e-14);
    vecRelClose(a, [-0.03, 0, 0], 1e-14);
  });

  test('direction equals r-hat for arbitrary 3D positions', () => {
    const G = 2.5;
    const m2 = 11;
    const r1: Vector3DTupleType = [0.2, -3, 5.5];
    const r2: Vector3DTupleType = [4.2, 1, -1];

    const a = gravitationalAccelerationOn1By2(m2, r1, r2, G);
    const dr = sub(r2, r1);
    const r = Math.hypot(...dr);
    const rhat: Vector3DTupleType = [dr[0] / r, dr[1] / r, dr[2] / r];

    const ahat = scale(a, 1 / norm(a)) as Vector3DTupleType;
    vecRelClose(ahat, rhat, 1e-12);
  });

  test('inverse-square scaling: doubling r → quarter acceleration', () => {
    const G = 10;
    const m2 = 5;
    const r1: Vector3DTupleType = [0, 0, 0];

    const r2a: Vector3DTupleType = [2, 0, 0]; // r = 2
    const r2b: Vector3DTupleType = [4, 0, 0]; // r = 4 (double → quarter a)

    const aA = gravitationalAccelerationOn1By2(m2, r1, r2a, G);
    const aB = gravitationalAccelerationOn1By2(m2, r1, r2b, G);

    relClose(norm(aB), norm(aA) / 4, 1e-14);
  });

  test('linearity: scaling m2 or G scales a accordingly', () => {
    const G = 3;
    const m2 = 5;
    const r1: Vector3DTupleType = [1, 2, 3];
    const r2: Vector3DTupleType = [4, -1, 0];

    const a = gravitationalAccelerationOn1By2(m2, r1, r2, G);
    const a_m2x2 = gravitationalAccelerationOn1By2(2 * m2, r1, r2, G);
    const a_Gx2 = gravitationalAccelerationOn1By2(m2, r1, r2, 2 * G);

    vecRelClose(a_m2x2, scale(a, 2));
    vecRelClose(a_Gx2, scale(a, 2));
  });

  test('real-world sanity: Earth due to Sun at 1 AU (~5.93e-3 m/s^2)', () => {
    const mSun = 1.9885e30; // kg
    const rEarth: Vector3DTupleType = [0, 0, 0];
    const rSun: Vector3DTupleType = [1.495978707e11, 0, 0]; // m

    const a = gravitationalAccelerationOn1By2(mSun, rEarth, rSun, G_SI);

    // Closed-form expectation GM_sun / r^2
    const dr = sub(rSun, rEarth);
    const r = Math.hypot(...dr);
    const expected = (G_SI * mSun) / (r * r);

    relClose(norm(a), expected, 1e-12);

    // Also within ~0.5% of commonly cited value
    const ref = 5.93e-3;
    assert.ok(
      Math.abs(norm(a) - ref) / ref < 5e-3,
      `|a| ${norm(a)} differs from ~${ref}`
    );
  });

  test('error propagation: invalid inputs cause throws', () => {
    const r1: Vector3DTupleType = [0, 0, 0];
    const r2: Vector3DTupleType = [1, 0, 0];

    // negative / non-finite m2
    assert.throws(
      () => gravitationalAccelerationOn1By2(-1, r1, r2, 1),
      /non-negative|finite/
    );
    assert.throws(
      () => gravitationalAccelerationOn1By2(Number.NaN, r1, r2, 1),
      /finite/
    );

    // coincident positions
    assert.throws(
      () => gravitationalAccelerationOn1By2(1, r1, r1, 1),
      /singular \(r = 0\)/
    );

    // invalid G
    assert.throws(
      () => gravitationalAccelerationOn1By2(1, r1, r2, 0),
      /positive/
    );
    assert.throws(
      () => gravitationalAccelerationOn1By2(1, r1, r2, Number.NaN),
      /finite/
    );
  });
});
