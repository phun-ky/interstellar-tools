import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { ballisticCoefficient } from '../../entry/ballistic-coefficient.js';
import { decayRate } from '../decay-rate.js';
import { exponentialAtmosphereDensity } from '../exponential-atmosphere-density.js';

const R = 6_378_137;
const ONE_U = ballisticCoefficient(1.33, 2.2, 0.01);

describe('decayRate', () => {
  test('lowers a 1U CubeSat 400 km up by about 18 m an orbit', () => {
    const rate = decayRate(
      R + 400_000,
      ONE_U,
      exponentialAtmosphereDensity(400_000)
    );

    assert.equal(rate.toFixed(1), '-17.8');
  });

  test('is -2π ρ a² / β, and grows as the orbit falls', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 150_000, max: 1_000_000, noNaN: true }),
        fc.double({ min: 1, max: 500, noNaN: true }),
        (height, beta) => {
          const rho = exponentialAtmosphereDensity(height);
          const a = R + height;

          assert.equal(
            decayRate(a, beta, rho),
            (-2 * Math.PI * rho * a * a) / beta
          );
          // Lower down, the air is denser: it sinks faster
          assert.ok(
            decayRate(
              a - 10_000,
              beta,
              exponentialAtmosphereDensity(height - 10_000)
            ) < decayRate(a, beta, rho)
          );
        }
      )
    );
    assert.equal(decayRate(R, 1, 0), -0);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => decayRate(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be a finite number. Received: NaN'
    );
    assert.throws(
      () => decayRate(R, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'beta must be > 0. Received: 0'
    );
    assert.throws(
      () => decayRate(R, 1, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rho must be >= 0. Received: -1'
    );
  });
});
