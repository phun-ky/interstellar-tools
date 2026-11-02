import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { ballisticCoefficient } from '../ballistic-coefficient.js';
import { ballisticEntrySpeed } from '../ballistic-entry-speed.js';
import { ballisticPeakDecelerationAltitude } from '../ballistic-peak-deceleration-altitude.js';
import { ballisticPeakDeceleration } from '../ballistic-peak-deceleration.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const RHO0 = 1.225; // kg/m³
const H = 7200; // m
const VE = 11_000; // m/s
const GAMMA = (-6.5 * Math.PI) / 180;
const BETA = 322; // kg/m²

const deceleration = (h: number, beta = BETA) => {
  const v = ballisticEntrySpeed(h, VE, GAMMA, beta, RHO0, H);

  return (RHO0 * Math.exp(-h / H) * v * v) / (2 * beta);
};

describe('ballisticCoefficient', () => {
  test('is m / (Cd A)', () => {
    relClose(ballisticCoefficient(5000, 1.3, 12), 5000 / (1.3 * 12));
    assert.equal(
      Math.round(ballisticCoefficient(5000, 1.3, Math.PI * 1.95 ** 2)),
      322
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => ballisticCoefficient(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm must be a finite number. Received: NaN'
    );
    assert.throws(
      () => ballisticCoefficient(1, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Cd must be > 0. Received: 0'
    );
    assert.throws(
      () => ballisticCoefficient(1, 1, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'A must be > 0. Received: -1'
    );
  });
});

describe('Allen–Eggers ballistic entry', () => {
  test('starts at the entry speed high above the atmosphere', () => {
    relClose(ballisticEntrySpeed(200_000, VE, GAMMA, BETA, RHO0, H), VE, 1e-6);
  });

  test('slows down monotonically as it descends', () => {
    let previous = Infinity;

    for (let h = 120_000; h >= 0; h -= 5000) {
      const v = ballisticEntrySpeed(h, VE, GAMMA, BETA, RHO0, H);

      assert.ok(v < previous);
      previous = v;
    }
  });

  test('matches the documented example (≈ 6.9 km/s at 40 km)', () => {
    assert.equal(
      (ballisticEntrySpeed(40_000, VE, GAMMA, BETA, RHO0, H) / 1000).toFixed(1),
      '6.9'
    );
  });

  test('peaks in deceleration at h*, at a_max, with V = VE / √e', () => {
    const hStar = ballisticPeakDecelerationAltitude(GAMMA, BETA, RHO0, H);
    const aMax = ballisticPeakDeceleration(VE, GAMMA, H);

    // A coarse scan finds the same peak
    let best = { h: 0, a: 0 };

    for (let h = 0; h <= 120_000; h += 10) {
      const a = deceleration(h);

      if (a > best.a) best = { h, a };
    }

    assert.ok(Math.abs(best.h - hStar) <= 10, `${best.h} vs ${hStar}`);
    relClose(best.a, aMax, 1e-6);
    relClose(deceleration(hStar), aMax, 1e-12);
    relClose(
      ballisticEntrySpeed(hStar, VE, GAMMA, BETA, RHO0, H),
      VE / Math.sqrt(Math.E),
      1e-12
    );
  });

  test('has a peak that depends on the angle but not on the vehicle', () => {
    for (const beta of [50, 322, 5000]) {
      const hStar = ballisticPeakDecelerationAltitude(GAMMA, beta, RHO0, H);

      relClose(
        deceleration(hStar, beta),
        ballisticPeakDeceleration(VE, GAMMA, H),
        1e-12
      );
    }

    assert.ok(
      ballisticPeakDecelerationAltitude(GAMMA, 5000, RHO0, H) <
        ballisticPeakDecelerationAltitude(GAMMA, 50, RHO0, H)
    );
    assert.ok(
      ballisticPeakDeceleration(VE, (-12 * Math.PI) / 180, H) >
        ballisticPeakDeceleration(VE, GAMMA, H)
    );
  });

  test('uses only the size of the flight-path angle', () => {
    relClose(
      ballisticPeakDeceleration(VE, -GAMMA, H),
      ballisticPeakDeceleration(VE, GAMMA, H)
    );
  });

  test('matches the documented examples (5.5 g, 39.5 km)', () => {
    const a = ballisticPeakDeceleration(7800, (-2 * Math.PI) / 180, H);

    assert.equal(Math.round(a), 54);
    assert.equal((a / 9.80665).toFixed(1), '5.5');
    assert.equal(
      (ballisticPeakDecelerationAltitude(GAMMA, BETA, RHO0, H) / 1000).toFixed(
        1
      ),
      '39.5'
    );
  });

  test('gives a negative h* when the vehicle would hit the ground first', () => {
    assert.ok(
      ballisticPeakDecelerationAltitude(-Math.PI / 2, 1e6, RHO0, H) < 0
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => ballisticEntrySpeed(Number.NaN, VE, GAMMA, BETA, RHO0, H),
      (err) =>
        err instanceof TypeError &&
        err.message === 'h must be a finite number. Received: NaN'
    );
    assert.throws(
      () => ballisticEntrySpeed(0, VE, GAMMA, BETA, RHO0, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'H must be > 0. Received: 0'
    );

    for (const gamma of [0, 2, -2]) {
      assert.throws(
        () => ballisticPeakDeceleration(VE, gamma, H),
        (err) =>
          err instanceof RangeError &&
          err.message ===
            `gamma must be non-zero and within [-π/2, π/2]. Received: ${gamma}`
      );
    }

    assert.throws(
      () => ballisticPeakDecelerationAltitude(GAMMA, 0, RHO0, H),
      (err) =>
        err instanceof RangeError &&
        err.message === 'beta must be > 0. Received: 0'
    );
  });
});
