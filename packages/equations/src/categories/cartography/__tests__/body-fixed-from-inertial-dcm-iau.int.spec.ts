import { Matrix3x3Type, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import {
  absClose,
  matAbsClose
} from 'packages/equations/src/__tests__/helpers';
import { bodyFixedFromInertialDcmIAU } from '../body-fixed-from-inertial-dcm-iau';
import { transpose3 } from '../../helpers/transpose-3';
import { matMul3 } from '../../helpers/mat-mul3';
import { det3 } from '../../helpers/det-3';

const I3: Matrix3x3Type = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
] as const;

describe('bodyFixedFromInertialDcmIAU', () => {
  test('returns identity for a configuration that collapses to I (alphaP=-π/2, deltaP=π/2, W=0)', () => {
    const alphaP = (-Math.PI / 2) as Radians;
    const deltaP = (Math.PI / 2) as Radians;
    const W = 0 as Radians;

    const R = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);
    matAbsClose(R, I3, 1e-12);
  });

  test('produces an orthonormal DCM: RᵀR ≈ I', () => {
    const alphaP = 1.234 as Radians;
    const deltaP = 0.456 as Radians;
    const W = 2.789 as Radians;

    const R = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);

    const Rt = transpose3(R);
    const RtR = matMul3(Rt, R);

    matAbsClose(RtR, I3, 1e-12);
  });

  test('has determinant +1 (proper rotation)', () => {
    const alphaP = 0.12 as Radians;
    const deltaP = -0.34 as Radians;
    const W = 0.56 as Radians;

    const R = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);
    const d = det3(R);

    absClose(d, 1, 1e-12, `det(R) expected ~1, got ${d}`);
  });

  test('is 2π-periodic in W: R(W + 2π) ≈ R(W)', () => {
    const alphaP = 0.9 as Radians;
    const deltaP = 0.3 as Radians;
    const W = 1.1 as Radians;

    const R1 = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);
    const R2 = bodyFixedFromInertialDcmIAU(
      alphaP,
      deltaP,
      (W + 2 * Math.PI) as Radians
    );

    matAbsClose(R1, R2, 1e-12);
  });

  test('throws TypeError for non-finite inputs', () => {
    const ok = 0 as Radians;

    assert.throws(
      () => bodyFixedFromInertialDcmIAU(Number.NaN as Radians, ok, ok),
      (err) =>
        err instanceof TypeError &&
        err.message === 'alphaP must be finite. Received: NaN'
    );

    assert.throws(
      () =>
        bodyFixedFromInertialDcmIAU(
          ok,
          Number.POSITIVE_INFINITY as Radians,
          ok
        ),
      (err) =>
        err instanceof TypeError &&
        err.message === 'deltaP must be finite. Received: Infinity'
    );

    assert.throws(
      () =>
        bodyFixedFromInertialDcmIAU(
          ok,
          ok,
          Number.NEGATIVE_INFINITY as Radians
        ),
      (err) =>
        err instanceof TypeError &&
        err.message === 'W must be finite. Received: -Infinity'
    );
  });
});
