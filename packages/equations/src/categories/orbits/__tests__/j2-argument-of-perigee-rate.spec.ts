import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { relClose } from 'packages/equations/src/__tests__/helpers';
import { j2ArgumentOfPerigeeRate } from '../j2-argument-of-perigee-rate';
import { rad } from '../../helpers/radians';

describe('j2ArgumentOfPerigeeRate', () => {
  test('computes ωdot from the reference formula (typical Earth-ish LEO inputs)', () => {
    const J2 = 1.08262668e-3;
    const n = 0.001078; // rad/s
    const Re = 6378.137; // km
    const a = 7000; // km
    const i = rad((63.4 * Math.PI) / 180);
    const e = 0.001;

    const omegaDot = j2ArgumentOfPerigeeRate(J2, n, Re, a, i, e);

    const oneMinusESq = 1 - e * e;
    const expected =
      (0.75 *
        J2 *
        n *
        Math.pow(Re / a, 2) *
        (5 * Math.pow(Math.cos(i), 2) - 1)) /
      Math.pow(oneMinusESq, 2);

    relClose(omegaDot, expected);
  });

  test('critical inclination: ωdot ~ 0 when 5cos^2(i) - 1 = 0', () => {
    // 5 cos^2(i) - 1 = 0 => cos^2(i)=1/5 => i = arccos(sqrt(1/5)) ≈ 63.4349°
    const icrit = rad(Math.acos(Math.sqrt(1 / 5)));

    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const e = 0;

    const omegaDot = j2ArgumentOfPerigeeRate(J2, n, Re, a, icrit, e);

    relClose(omegaDot, 0, 1e-12);
  });

  test('equatorial orbit (i = 0) yields positive ωdot for J2 > 0', () => {
    const omegaDot = j2ArgumentOfPerigeeRate(
      1e-3,
      0.001,
      6000,
      7000,
      rad(0),
      0
    );

    assert.ok(omegaDot > 0, `expected ωdot > 0, got ${omegaDot}`);
  });

  test('polar orbit (i = 90°) yields negative ωdot for J2 > 0', () => {
    // cos(i)=0 => (5cos^2 - 1) = -1 => ωdot negative
    const omegaDot = j2ArgumentOfPerigeeRate(
      1e-3,
      0.001,
      6000,
      7000,
      rad(Math.PI / 2),
      0
    );

    assert.ok(omegaDot < 0, `expected ωdot < 0, got ${omegaDot}`);
  });

  test('with e = 0, denominator is 1 (matches simplified circular-orbit form)', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const i = rad((40 * Math.PI) / 180);
    const e = 0;

    const omegaDot = j2ArgumentOfPerigeeRate(J2, n, Re, a, i, e);
    const expected =
      0.75 * J2 * n * Math.pow(Re / a, 2) * (5 * Math.pow(Math.cos(i), 2) - 1);

    relClose(omegaDot, expected);
  });

  test('as e increases, |ωdot| increases due to (1 - e^2)^-2', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const i = rad((30 * Math.PI) / 180);

    const omegaDot0 = j2ArgumentOfPerigeeRate(J2, n, Re, a, i, 0);
    const omegaDot5 = j2ArgumentOfPerigeeRate(J2, n, Re, a, i, 0.5);

    assert.ok(
      Math.abs(omegaDot5) > Math.abs(omegaDot0),
      `expected |ωdot| to increase with e: ${omegaDot0} -> ${omegaDot5}`
    );
  });

  test('throws TypeError when any input is not finite', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const i = rad(0);
    const e = 0;

    assert.throws(
      () => j2ArgumentOfPerigeeRate(Number.NaN, n, Re, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'J2 must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(J2, Number.POSITIVE_INFINITY, Re, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'n must be a finite number. Received: Infinity'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(J2, n, Number.NEGATIVE_INFINITY, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Re must be a finite number. Received: -Infinity'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(J2, n, Re, Number.NaN, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(J2, n, Re, a, rad(Number.NaN), e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'i must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(J2, n, Re, a, i, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'e must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError when n < 0', () => {
    assert.throws(
      () => j2ArgumentOfPerigeeRate(1e-3, -1e-9, 6000, 7000, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'n must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when Re <= 0', () => {
    assert.throws(
      () => j2ArgumentOfPerigeeRate(1e-3, 1e-3, 0, 7000, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Re must be > 0. Received: 0'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => j2ArgumentOfPerigeeRate(1e-3, 1e-3, 6000, 0, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when e is outside [0, 1)', () => {
    assert.throws(
      () => j2ArgumentOfPerigeeRate(1e-3, 1e-3, 6000, 7000, rad(0), -1e-9),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be in [0, 1]. Received: -1e-9'
    );

    assert.throws(
      () => j2ArgumentOfPerigeeRate(1e-3, 1e-3, 6000, 7000, rad(0), 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be in [0, 1]. Received: 1'
    );
  });
});
