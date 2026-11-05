import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { exponentialAtmosphereDensity } from '../exponential-atmosphere-density.js';

// The band bases in km, from Vallado's table 8-4
const BASES = [
  0, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 180, 200,
  250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000
];

describe('exponentialAtmosphereDensity', () => {
  test("matches Vallado's example 8-4, at 747.2119 km", () => {
    const rho = exponentialAtmosphereDensity(747_211.9);

    assert.ok(Math.abs(rho / 2.1219854e-14 - 1) < 1e-7, `${rho}`);
  });

  test('gives the table density at the base of each band', () => {
    assert.equal(exponentialAtmosphereDensity(0), 1.225);
    assert.equal(exponentialAtmosphereDensity(400_000), 3.725e-12);
    assert.equal(exponentialAtmosphereDensity(1_000_000), 3.019e-15);
  });

  test('falls with height, and nearly joins up between bands', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 2_000_000, noNaN: true }),
        fc.double({ min: 1, max: 50_000, noNaN: true }),
        (h, dh) =>
          assert.ok(
            exponentialAtmosphereDensity(h + dh) <
              exponentialAtmosphereDensity(h)
          )
      )
    );

    // Each band's top is within 10% of the next band's base: the table's
    // scale heights are fitted, not exact
    for (const base of BASES.slice(1)) {
      const below = exponentialAtmosphereDensity(base * 1000 - 1e-6);
      const at = exponentialAtmosphereDensity(base * 1000);

      assert.ok(Math.abs(below / at - 1) < 0.1, `${base} km: ${below / at}`);
    }
  });

  test('carries the last scale height on above 1 000 km', () => {
    const ratio =
      exponentialAtmosphereDensity(1_268_000) /
      exponentialAtmosphereDensity(1_000_000);

    assert.ok(Math.abs(ratio - Math.exp(-1)) < 1e-12);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => exponentialAtmosphereDensity(Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'h must be a finite number. Received: NaN'
    );
    assert.throws(
      () => exponentialAtmosphereDensity(-1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'h must be >= 0. Received: -1'
    );
  });
});
