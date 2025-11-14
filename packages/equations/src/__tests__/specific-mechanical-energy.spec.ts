import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { specificMechanicalEnergy } from '../categories/orbits/specific-mechanical-energy';
import { absClose, relClose } from './helpers';

describe('specificMechanicalEnergy', () => {
  test('circular orbit: ε = -μ/(2r) when v = sqrt(μ/r)', () => {
    const mu = 3.986004418e14; // m^3/s^2 (Earth GM)
    const r = 6378e3 + 400e3; // m (LEO-ish)
    const v = Math.sqrt(mu / r); // m/s

    const eps = specificMechanicalEnergy(v, r, mu);
    const expected = -mu / (2 * r);

    relClose(eps, expected, 1e-12);
  });

  test('parabolic case: v = sqrt(2μ/r) → ε ≈ 0', () => {
    const mu = 3.986004418e14; // m^3/s^2
    const r = 7000e3; // m
    const v = Math.sqrt((2 * mu) / r);

    const eps = specificMechanicalEnergy(v, r, mu);

    // Use absolute tolerance because the expected value is 0
    absClose(eps, 0, 1e-9);
  });

  test('hyperbolic case: v slightly above escape → ε > 0', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const v_escape = Math.sqrt((2 * mu) / r);
    const v = 1.01 * v_escape;

    const eps = specificMechanicalEnergy(v, r, mu);
    assert.ok(eps > 0, 'ε should be positive for hyperbolic cases');
  });

  test('elliptic case: v below circular → ε < 0', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const v_circ = Math.sqrt(mu / r);
    const v = 0.95 * v_circ;

    const eps = specificMechanicalEnergy(v, r, mu);
    assert.ok(eps < 0, 'ε should be negative for bound (elliptic) cases');
  });

  test('semi-major axis identity: ε = -μ/(2a) (using vis-viva for v)', () => {
    const mu = 3.986004418e14;
    const a = 10000e3; // m (semi-major axis)
    const r = 8000e3; // m (some point on the ellipse)
    const v = Math.sqrt(mu * (2 / r - 1 / a)); // vis-viva

    const eps = specificMechanicalEnergy(v, r, mu);
    const expected = -mu / (2 * a);

    relClose(eps, expected, 1e-12);
  });

  test('monotonic in speed: increasing v increases ε (same r, μ)', () => {
    const mu = 3.986004418e14;
    const r = 8000e3;
    const v1 = 7000;
    const v2 = 7500;

    const eps1 = specificMechanicalEnergy(v1, r, mu);
    const eps2 = specificMechanicalEnergy(v2, r, mu);

    assert.ok(eps2 > eps1);
  });

  test('increases with radius for fixed v: larger r → larger ε (less negative)', () => {
    const mu = 3.986004418e14;
    const v = 7500;
    const r1 = 7000e3;
    const r2 = 8000e3;

    const eps1 = specificMechanicalEnergy(v, r1, mu);
    const eps2 = specificMechanicalEnergy(v, r2, mu);

    assert.ok(eps2 > eps1);
  });

  test('throws on invalid inputs', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const v = 7500;

    // v invalid
    assert.throws(
      () => specificMechanicalEnergy(Number.NaN, r, mu),
      /non-negative/
    );
    assert.throws(() => specificMechanicalEnergy(-1, r, mu), /non-negative/);

    // r invalid
    assert.throws(
      () => specificMechanicalEnergy(v, Number.NaN, mu),
      /positive/
    );
    assert.throws(() => specificMechanicalEnergy(v, 0, mu), /positive/);
    assert.throws(() => specificMechanicalEnergy(v, -1, mu), /positive/);

    // mu invalid
    assert.throws(
      () => specificMechanicalEnergy(v, r, Number.NaN),
      /non-negative/
    );
    assert.throws(() => specificMechanicalEnergy(v, r, -1), /non-negative/);
  });
});
