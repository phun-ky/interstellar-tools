import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { ballisticCoefficient } from '../../entry/ballistic-coefficient.js';
import { estimateLifetime } from '../estimate-lifetime.js';
import { exponentialAtmosphereDensity } from '../exponential-atmosphere-density.js';

const MU = 3.986004418e14;
const R = 6_378_137;
const DAY = 86_400;
const YEAR = 365.25 * DAY;
const ONE_U = ballisticCoefficient(1.33, 2.2, 0.01);
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

describe('estimateLifetime', () => {
  test('keeps a 1U CubeSat up for half a year from 400 km, three from 500', () => {
    const from400 = estimateLifetime(R + 400_000, ONE_U, MU, R);
    const from500 = estimateLifetime(R + 500_000, ONE_U, MU, R);

    // The average atmosphere: about half a year, within the year or so
    // a 1U CubeSat lasts at moderate solar activity
    assert.equal(Math.round(from400 / DAY), 187);
    assert.ok(from400 > 0.3 * YEAR && from400 < 1.5 * YEAR);
    assert.equal(Math.round(from500 / YEAR), 3);
  });

  test('matches the exact time through air of constant density', () => {
    const rho = 1e-12;
    const a = R + 400_000;
    const bottom = R + 120_000;
    // The integral of β / (ρ √(μ a)) da
    const exact =
      ((2 * ONE_U) / (rho * Math.sqrt(MU))) *
      (Math.sqrt(a) - Math.sqrt(bottom));

    close(
      estimateLifetime(a, ONE_U, MU, R, { density: () => rho }),
      exact,
      1e-9 * exact
    );
  });

  test('matches a fine step-by-step integration of the decay', () => {
    const a = R + 400_000;

    let reference = 0;

    for (let h = 400_000; h > 120_000; h -= 10) {
      const mid = h - 5;

      reference +=
        (10 * ONE_U) /
        (exponentialAtmosphereDensity(mid) * Math.sqrt(MU * (R + mid)));
    }

    close(estimateLifetime(a, ONE_U, MU, R), reference, 1e-6 * reference);
  });

  test('lasts longer for a heavier or more compact satellite, in proportion', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200_000, max: 600_000, noNaN: true }),
        fc.double({ min: 1, max: 200, noNaN: true }),
        fc.double({ min: 1.1, max: 10, noNaN: true }),
        (height, beta, factor) => {
          const light = estimateLifetime(R + height, beta, MU, R);
          const heavy = estimateLifetime(R + height, beta * factor, MU, R);

          close(heavy / light, factor, 1e-9 * factor);
          // And longer from higher up
          assert.ok(estimateLifetime(R + height + 20_000, beta, MU, R) > light);
        }
      ),
      { numRuns: 30 }
    );
  });

  test('stops at the re-entry height asked for', () => {
    const to120 = estimateLifetime(R + 400_000, ONE_U, MU, R);
    const to200 = estimateLifetime(R + 400_000, ONE_U, MU, R, {
      reentryHeight: 200_000
    });

    assert.ok(to200 < to120);
    // The last 80 km go by in a few days
    assert.ok(to120 - to200 < 10 * DAY);
  });

  test('rejects invalid input', () => {
    const rejects = (fn: () => unknown, type: typeof Error, message: string) =>
      assert.throws(
        fn,
        (err) => err instanceof type && err.message === message
      );

    rejects(
      () => estimateLifetime(Number.NaN, ONE_U, MU, R),
      TypeError,
      'a must be a finite number. Received: NaN'
    );
    rejects(
      () =>
        estimateLifetime(R + 400_000, ONE_U, MU, R, {
          density: 1 as unknown as (h: number) => number
        }),
      TypeError,
      'density must be a function of the height.'
    );
    rejects(
      () => estimateLifetime(R + 400_000, 0, MU, R),
      RangeError,
      'beta must be > 0. Received: 0'
    );
    rejects(
      () => estimateLifetime(R + 400_000, ONE_U, MU, R, { reentryHeight: -1 }),
      RangeError,
      'reentryHeight must be >= 0. Received: -1'
    );
    rejects(
      () => estimateLifetime(R + 100_000, ONE_U, MU, R),
      RangeError,
      'a must be above the re-entry height, 6498137 m. Received: 6478137'
    );

    for (const bad of [0, -1, Number.NaN, Infinity])
      assert.throws(
        () =>
          estimateLifetime(R + 400_000, ONE_U, MU, R, { density: () => bad }),
        (err) =>
          err instanceof RangeError &&
          err.message.startsWith(
            `density must give a finite number > 0. Received: ${bad}`
          )
      );
  });
});
