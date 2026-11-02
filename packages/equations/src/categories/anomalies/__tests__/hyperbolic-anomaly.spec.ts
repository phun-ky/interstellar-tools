import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { asymptoteTrueAnomaly } from '../asymptote-true-anomaly.js';
import { hyperbolicToTrueAnomaly } from '../hyperbolic-to-true-anomaly.js';
import { trueToHyperbolicAnomaly } from '../true-to-hyperbolic-anomaly.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (d: number) => ((d * Math.PI) / 180) as Radians;

describe('asymptoteTrueAnomaly', () => {
  test('is 120° for e = 2, and tends to 180° and 90° at the extremes', () => {
    relClose(asymptoteTrueAnomaly(2), (2 * Math.PI) / 3);
    assert.ok(asymptoteTrueAnomaly(1 + 1e-9) > rad(179.99));
    assert.ok(asymptoteTrueAnomaly(1e9) < rad(90.0001));
  });

  test('matches the turning angle 2 asin(1/e)', () => {
    const e = 1.44;

    relClose(
      2 * asymptoteTrueAnomaly(e) - Math.PI,
      2 * Math.asin(1 / e),
      1e-12
    );
  });

  test('throws for invalid e', () => {
    assert.throws(
      () => asymptoteTrueAnomaly(Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'e must be a finite number. Received: NaN'
    );
    assert.throws(
      () => asymptoteTrueAnomaly(0.5),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be > 1. Received: 0.5'
    );
  });
});

describe('trueToHyperbolicAnomaly and hyperbolicToTrueAnomaly', () => {
  test('are 0 at periapsis', () => {
    assert.equal(trueToHyperbolicAnomaly(rad(0), 1.5), 0);
    assert.equal(hyperbolicToTrueAnomaly(0, 1.5), 0);
  });

  test('give cosh F = e at ν = 90°', () => {
    for (const e of [1.1, 2, 5]) {
      relClose(Math.cosh(trueToHyperbolicAnomaly(rad(90), e)), e, 1e-12);
    }
  });

  test('agree with cosh F = (e + cos ν) / (1 + e cos ν)', () => {
    const e = 1.44;
    const nu = rad(100);

    relClose(
      Math.cosh(trueToHyperbolicAnomaly(nu, e)),
      (e + Math.cos(nu)) / (1 + e * Math.cos(nu)),
      1e-12
    );
  });

  test('round-trip, including the incoming branch given near 2π', () => {
    const e = 1.44;

    for (const deg of [-130, -45, 10, 90, 133]) {
      const F = trueToHyperbolicAnomaly(rad(deg), e);

      relClose(hyperbolicToTrueAnomaly(F, e), rad(deg), 1e-12);
    }

    relClose(
      trueToHyperbolicAnomaly(rad(360 - 130), e),
      trueToHyperbolicAnomaly(rad(-130), e),
      1e-12
    );
  });

  test('approach the asymptotes for large |F|', () => {
    const e = 1.44;

    assert.ok(hyperbolicToTrueAnomaly(30, e) < asymptoteTrueAnomaly(e));
    relClose(hyperbolicToTrueAnomaly(30, e), asymptoteTrueAnomaly(e), 1e-10);
  });

  test('throw at or beyond the asymptotes, and for invalid inputs', () => {
    assert.throws(
      () => trueToHyperbolicAnomaly(rad(140), 1.44),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('nu is at or beyond the asymptotes')
    );
    assert.throws(
      () => trueToHyperbolicAnomaly(rad(10), 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be > 1. Received: 1'
    );
    assert.throws(
      () => trueToHyperbolicAnomaly(Number.NaN as Radians, 2),
      (err) =>
        err instanceof TypeError &&
        err.message === 'nu must be a finite number. Received: NaN'
    );
    assert.throws(
      () => hyperbolicToTrueAnomaly(Number.NaN, 2),
      (err) =>
        err instanceof TypeError &&
        err.message === 'F must be a finite number. Received: NaN'
    );
    assert.throws(
      () => hyperbolicToTrueAnomaly(1, 0.9),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be > 1. Received: 0.9'
    );
  });
});
