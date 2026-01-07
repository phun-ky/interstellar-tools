import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { relClose } from 'packages/equations/src/__tests__/helpers';
import { j2NodalPrecessionRate } from '../j2-nodal-precession-rate';
import { rad } from '../../helpers/radians';

describe('j2NodalPrecessionRate', () => {
  test('computes Ωdot from the reference formula (typical Earth-ish LEO inputs)', () => {
    const J2 = 1.08262668e-3;
    const n = 0.001078; // rad/s
    const Re = 6378.137; // km
    const a = 7000; // km
    const i = rad((98 * Math.PI) / 180);
    const e = 0.001;

    const omegaDot = j2NodalPrecessionRate(J2, n, Re, a, i, e);

    const expected =
      (-1.5 * J2 * n * Math.pow(Re / a, 2) * Math.cos(i)) /
      Math.pow(1 - e * e, 2);

    relClose(omegaDot, expected);
  });

  test('sign check: prograde (i < 90°) gives negative Ωdot; retrograde (i > 90°) gives positive Ωdot', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const e = 0;

    const prograde = j2NodalPrecessionRate(
      J2,
      n,
      Re,
      a,
      rad((30 * Math.PI) / 180),
      e
    );
    const retrograde = j2NodalPrecessionRate(
      J2,
      n,
      Re,
      a,
      rad((120 * Math.PI) / 180),
      e
    );

    assert.ok(prograde < 0, `expected prograde Ωdot < 0, got ${prograde}`);
    assert.ok(
      retrograde > 0,
      `expected retrograde Ωdot > 0, got ${retrograde}`
    );
  });

  test('polar orbit (i = 90°) gives ~0 Ωdot', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const e = 0;

    const omegaDot = j2NodalPrecessionRate(J2, n, Re, a, rad(Math.PI / 2), e);

    relClose(omegaDot, 0, 1e-12);
  });

  test('with e = 0, denominator is 1 (matches simplified circular-orbit form)', () => {
    const J2 = 1.08262668e-3;
    const n = 0.001;
    const Re = 6378.137;
    const a = 7000;
    const i = rad((45 * Math.PI) / 180);
    const e = 0;

    const omegaDot = j2NodalPrecessionRate(J2, n, Re, a, i, e);
    const expected = -1.5 * J2 * n * Math.pow(Re / a, 2) * Math.cos(i);

    relClose(omegaDot, expected);
  });

  test('throws TypeError when any input is not finite', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const i = rad(0);
    const e = 0;

    assert.throws(
      () => j2NodalPrecessionRate(Number.NaN, n, Re, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'J2 must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2NodalPrecessionRate(J2, Number.POSITIVE_INFINITY, Re, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'n must be a finite number. Received: Infinity'
    );

    assert.throws(
      () => j2NodalPrecessionRate(J2, n, Number.NEGATIVE_INFINITY, a, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Re must be a finite number. Received: -Infinity'
    );

    assert.throws(
      () => j2NodalPrecessionRate(J2, n, Re, Number.NaN, i, e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2NodalPrecessionRate(J2, n, Re, a, rad(Number.NaN), e),
      (err) =>
        err instanceof TypeError &&
        err.message === 'i must be a finite number. Received: NaN'
    );

    assert.throws(
      () => j2NodalPrecessionRate(J2, n, Re, a, i, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'e must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError when n < 0', () => {
    assert.throws(
      () => j2NodalPrecessionRate(1e-3, -1e-9, 6000, 7000, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'n must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when Re <= 0', () => {
    assert.throws(
      () => j2NodalPrecessionRate(1e-3, 1e-3, 0, 7000, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Re must be > 0. Received: 0'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => j2NodalPrecessionRate(1e-3, 1e-3, 6000, 0, rad(0), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when e is outside [0, 1]', () => {
    assert.throws(
      () => j2NodalPrecessionRate(1e-3, 1e-3, 6000, 7000, rad(0), -1e-9),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be in [0, 1]. Received: -1e-9'
    );

    assert.throws(
      () => j2NodalPrecessionRate(1e-3, 1e-3, 6000, 7000, rad(0), 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'e must be in [0, 1]. Received: 1'
    );
  });

  test('as e increases, |Ωdot| increases due to (1 - e²)⁻²', () => {
    const J2 = 1e-3;
    const n = 0.001;
    const Re = 6000;
    const a = 7000;
    const i = rad((60 * Math.PI) / 180);

    const omegaDot0 = j2NodalPrecessionRate(J2, n, Re, a, i, 0);
    const omegaDot5 = j2NodalPrecessionRate(J2, n, Re, a, i, 0.5);

    assert.ok(
      Math.abs(omegaDot5) > Math.abs(omegaDot0),
      `expected |Ωdot| to increase with e: ${omegaDot0} -> ${omegaDot5}`
    );
  });
});
