import { Matrix3x3Type, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, matAbsClose } from '../../../__tests__/helpers/index.js';
import { applyMatrix3 } from '../../helpers/apply-matrix-3.js';
import { bodyFixedFromInertialDcmIAU } from '../body-fixed-from-inertial-dcm-iau.js';
import { transpose3 } from '../../helpers/transpose-3.js';
import { matMul3 } from '../../helpers/mat-mul3.js';
import { det3 } from '../../helpers/det-3.js';

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

  // A unit vector toward a right ascension and declination, in radians
  const toward = (ra: number, dec: number) =>
    [
      Math.cos(dec) * Math.cos(ra),
      Math.cos(dec) * Math.sin(ra),
      Math.sin(dec)
    ] as const;
  const DEG = Math.PI / 180;

  test('turns the pole into the body’s z axis', () => {
    // Saturn's pole (Archinal et al. 2018), and others around the sky
    for (const [ra, dec] of [
      [40.589, 83.537],
      [317.68, 52.89],
      [257.3, -15.1],
      [0, -60]
    ] as const) {
      const R = bodyFixedFromInertialDcmIAU(
        (ra * DEG) as Radians,
        (dec * DEG) as Radians,
        (123 * DEG) as Radians
      );
      const pole = applyMatrix3(R, toward(ra * DEG, dec * DEG));

      [0, 0, 1].forEach((value, k) =>
        absClose(pole[k]!, value, 1e-12, `${ra}, ${dec}: ${pole}`)
      );
    }
  });

  test('puts the prime meridian W east of the node, at α + 90° on the equator', () => {
    const alphaP = (40.589 * DEG) as Radians;
    const deltaP = (83.537 * DEG) as Radians;
    const node = toward(alphaP + Math.PI / 2, 0);

    for (const w of [0, 30, 90, 200]) {
      const R = bodyFixedFromInertialDcmIAU(
        alphaP,
        deltaP,
        (w * DEG) as Radians
      );
      const inBody = applyMatrix3(R, node);

      // The node is W west of the prime meridian, in the body's equator
      [Math.cos(w * DEG), -Math.sin(w * DEG), 0].forEach((value, k) =>
        absClose(inBody[k]!, value, 1e-12, `W ${w}: ${inBody}`)
      );
    }
  });

  test('lines up with the ICRF for its pole and W = 270°', () => {
    // With the pole at the ICRF's, the node is at α = 90°: W = 270° puts the
    // prime meridian on the equinox, at α = 360°, and the body frame on the
    // ICRF
    const R = bodyFixedFromInertialDcmIAU(
      0 as Radians,
      (Math.PI / 2) as Radians,
      ((3 * Math.PI) / 2) as Radians
    );

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
