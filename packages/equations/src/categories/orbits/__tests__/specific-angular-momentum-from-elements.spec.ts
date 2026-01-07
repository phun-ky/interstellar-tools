import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';

import { specificAngularMomentumFromElements } from '../specific-angular-momentum-from-elements';

describe('specificAngularMomentumFromElements', () => {
  test('definition (elliptic): h = sqrt(μ a (1-e²))', () => {
    const mu = 3.986004418e14; // m³/s² (Earth GM)
    const a = 7000e3; // m
    const e = 0.1; // -
    const h = specificAngularMomentumFromElements(a, e, mu);
    const expected = Math.sqrt(mu * a * (1 - e * e));
    relClose(h, expected, 1e-15);
  });

  test('circular limit (e=0): h = sqrt(μ a)', () => {
    const mu = 3.986004418e14;
    const a = 6778e3;
    const e = 0;
    const h = specificAngularMomentumFromElements(a, e, mu);
    const expected = Math.sqrt(mu * a);
    relClose(h, expected, 1e-15);
  });

  test('hyperbolic case (a<0, e>1): radicand positive → valid h', () => {
    const mu = 3.986004418e14;
    const a = -50_000e3; // m
    const e = 1.2; // -
    const h = specificAngularMomentumFromElements(a, e, mu);
    const expected = Math.sqrt(mu * a * (1 - e * e)); // positive since a<0 and (1-e²)<0
    relClose(h, expected, 1e-15);
  });

  test('tolerance clamp: tiny negative radicand → returns ~0', () => {
    const mu = 3.986004418e14;
    const a = 7000e3; // m (positive)
    // Function tolerance: tol = |1e-14 * mu * |a||
    const tol = Math.abs(1e-14 * mu * Math.abs(a));
    // Target radicand = -tol/2: μ*a*(1-e²) = -tol/2  =>  1-e² = -(tol/2)/(μ*a)
    const oneMinusE2 = -(tol / 2) / (mu * a);
    const e = Math.sqrt(1 - oneMinusE2); // slightly > 1 (physically inconsistent with a>0), used only to hit tolerance path

    const h = specificAngularMomentumFromElements(a, e, mu);
    absClose(h, 0, 1e-12);
  });

  test('invalid: clearly negative radicand throws (a>0, e>1 far from 1)', () => {
    const mu = 3.986004418e14;
    const a = 7000e3; // m
    const e = 1.1; // makes 1 - e² < 0 with a>0 → negative radicand
    assert.throws(
      () => specificAngularMomentumFromElements(a, e, mu),
      /Invalid \(a,e\).*μ·a·\(1-e²\) < 0/
    );
  });

  test('μ = 0 → h = 0 (degenerate but mathematically consistent)', () => {
    const mu = 0;
    const a = 7000e3;
    const e = 0.3;
    const h = specificAngularMomentumFromElements(a, e, mu);
    absClose(h, 0, 0);
  });

  test('scaling: for fixed e, h ∝ sqrt(|a|)', () => {
    const mu = 3.986004418e14;
    const e = 0.2;
    const a1 = 8000e3;
    const a2 = 2 * a1;

    const h1 = specificAngularMomentumFromElements(a1, e, mu);
    const h2 = specificAngularMomentumFromElements(a2, e, mu);

    const expectedRatio = Math.sqrt(Math.abs(a2) / Math.abs(a1));
    relClose(h2 / h1, expectedRatio, 1e-12);
  });

  test('input validation: a=0, non-finite a/e/μ, negative e, negative μ', () => {
    const a = 7000e3;
    const e = 0.1;
    const mu = 3.986004418e14;

    // a invalid
    assert.throws(
      () => specificAngularMomentumFromElements(0, e, mu),
      /non-zero/
    );
    assert.throws(
      () => specificAngularMomentumFromElements(Number.NaN, e, mu),
      /finite/
    );

    // e invalid
    assert.throws(
      () => specificAngularMomentumFromElements(a, -1e-3, mu),
      /≥ 0/
    );
    assert.throws(
      () => specificAngularMomentumFromElements(a, Number.NaN, mu),
      /finite/
    );

    // μ invalid
    assert.throws(() => specificAngularMomentumFromElements(a, e, -1), /≥ 0/);
    assert.throws(
      () => specificAngularMomentumFromElements(a, e, Number.NaN),
      /finite/
    );
  });

  test('numerical sanity: very large magnitudes still finite', () => {
    const mu = 1e20;
    const a = 1e9;
    const e = 0.5;
    const h = specificAngularMomentumFromElements(a, e, mu);
    assert.ok(Number.isFinite(h) && h > 0);
  });
});
