import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { gravityAssistTurningAngle } from '../../manoeuvres/gravity-assist-turning-angle.js';
import { hyperbolicEccentricity } from '../hyperbolic-eccentricity.js';
import { hyperbolicPeriapsisSpeed } from '../hyperbolic-periapsis-speed.js';
import { hyperbolicSemiMajorAxis } from '../hyperbolic-semi-major-axis.js';
import { visVivaSpeed } from '../vis-viva-speed.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const MU = 4.902800118e12;

describe('hyperbolicSemiMajorAxis', () => {
  test('is -μ / v∞², negative', () => {
    const a = hyperbolicSemiMajorAxis(1080, MU);

    assert.ok(a < 0);
    relClose(a, -MU / 1080 ** 2);
  });

  test('makes vis-viva give hyperbolicPeriapsisSpeed', () => {
    const rp = 1_851_300;
    const a = hyperbolicSemiMajorAxis(1080, MU);

    relClose(
      visVivaSpeed(rp, a, MU),
      hyperbolicPeriapsisSpeed(1080, rp, MU),
      1e-12
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => hyperbolicSemiMajorAxis(Number.NaN, MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: NaN'
    );
    assert.throws(
      () => hyperbolicSemiMajorAxis(0, MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'vInfinity must be > 0. Received: 0'
    );
    assert.throws(
      () => hyperbolicSemiMajorAxis(1000, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: 0'
    );
  });
});

describe('hyperbolicEccentricity', () => {
  test('is consistent with rp = a(1 - e)', () => {
    const rp = 1_851_300;
    const a = hyperbolicSemiMajorAxis(1080, MU);

    relClose(a * (1 - hyperbolicEccentricity(1080, rp, MU)), rp, 1e-12);
  });

  test('gives the same turning angle as gravityAssistTurningAngle', () => {
    const rp = 1_851_300;
    const e = hyperbolicEccentricity(1080, rp, MU);

    relClose(
      2 * Math.asin(1 / e),
      gravityAssistTurningAngle(rp, 1080, MU),
      1e-12
    );
  });

  test('matches the documented Jupiter example (≈ 1.102)', () => {
    assert.equal(
      hyperbolicEccentricity(6000, 5 * 71_492e3, 1.26686534e17).toFixed(3),
      '1.102'
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => hyperbolicEccentricity(1000, Number.NaN, MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rp must be a finite number. Received: NaN'
    );
    assert.throws(
      () => hyperbolicEccentricity(-1, 1, MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'vInfinity must be > 0. Received: -1'
    );
    assert.throws(
      () => hyperbolicEccentricity(1, 0, MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rp must be > 0. Received: 0'
    );
    assert.throws(
      () => hyperbolicEccentricity(1, 1, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: -1'
    );
  });
});
