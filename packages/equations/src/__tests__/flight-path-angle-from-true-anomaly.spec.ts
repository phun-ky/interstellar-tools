import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { flightPathAngleFromTrueAnomaly } from '../categories/orbits/flight-path-angle-from-true-anomaly';
import { Radians } from '@interstellar-tools/types';
import { absClose } from './helpers';

const EPS = 1e-12;
const PI = Math.PI;

describe('flightPathAngleFromTrueAnomaly', () => {
  test('e = 0 (circular): gamma = 0 for any ν', () => {
    const e = 0;
    const nus: Radians[] = [
      0 as Radians,
      (PI / 6) as Radians,
      (PI / 2) as Radians,
      PI as Radians,
      -1.1 as Radians
    ];
    for (const nu of nus) {
      const g = flightPathAngleFromTrueAnomaly(nu, e);
      absClose(g, 0, EPS, `gamma(ν=${nu}, e=0) should be 0`);
    }
  });

  test('elliptic examples: tan(γ) ≈ (e sin ν) / (1 + e cos ν)', () => {
    const cases: Array<{ nu: Radians; e: number }> = [
      { nu: 0.7 as Radians, e: 0.2 },
      { nu: 1.2 as Radians, e: 0.7 },
      { nu: 2.0 as Radians, e: 0.5 }
    ];
    for (const { nu, e } of cases) {
      const gamma = flightPathAngleFromTrueAnomaly(nu, e) as number;
      const ratio =
        (e * Math.sin(nu as number)) / (1 + e * Math.cos(nu as number));
      // Avoiding points too close to denom=0 by choice of cases above
      absClose(
        Math.tan(gamma),
        ratio,
        1e-11,
        `tan(gamma) mismatch for ν=${nu}, e=${e}`
      );
      // For 0 ≤ e < 1, |γ| < π/2
      assert.ok(
        Math.abs(gamma) < PI / 2 - 1e-15,
        'elliptic γ must be in (-π/2, π/2)'
      );
    }
  });

  test('sign symmetry: γ(-ν) = -γ(ν) for elliptic case', () => {
    const e = 0.4;
    const nu = 0.8 as Radians;
    const g1 = flightPathAngleFromTrueAnomaly(nu, e);
    const g2 = flightPathAngleFromTrueAnomaly(-nu as number as Radians, e);
    absClose(g1, -g2, 1e-12);
  });

  test('limits: ν = 0 and ν = π both yield γ = 0 for 0 ≤ e < 1', () => {
    const es = [0, 0.1, 0.5, 0.9];
    for (const e of es) {
      const g0 = flightPathAngleFromTrueAnomaly(0 as Radians, e);
      absClose(g0, 0);

      const gpi = flightPathAngleFromTrueAnomaly(PI as Radians, e);
      absClose(gpi, 0);
    }
  });

  test('parabolic special-case: e = 1 and ν = π returns 0 by design', () => {
    const e = 1;
    const nu = PI as Radians;
    const g = flightPathAngleFromTrueAnomaly(nu, e);
    absClose(g, 0);
  });

  test('parabolic (e=1): for general ν, γ ≈ ν/2 (principal value), away from ν=π', () => {
    const e = 1;
    const nus: Radians[] = [0.6 as Radians, 1.0 as Radians, -1.2 as Radians];
    for (const nu of nus) {
      const g = flightPathAngleFromTrueAnomaly(nu, e);
      // Using identity tan γ = sin ν / (1 + cos ν) = tan(ν/2)
      // γ = atan2(sin(ν/2), cos(ν/2)) → principal value ≈ ν/2 for |ν| < π
      absClose(
        g,
        (nu as number) / 2,
        1e-12,
        `parabolic γ ≈ ν/2 failed for ν=${nu}`
      );
    }
  });

  test('hyperbolic asymptote: e > 1 and ν = arccos(-1/e) ⇒ γ → +π/2', () => {
    const e = 1.5;
    const nu0 = Math.acos(-1 / e) as Radians; // 1 + e cos ν0 = 0
    const g = flightPathAngleFromTrueAnomaly(nu0, e);
    absClose(g, PI / 2, 1e-12);
  });

  test('hyperbolic asymptote (negative): e > 1 and ν = -arccos(-1/e) ⇒ γ → -π/2', () => {
    const e = 1.5;
    const nu0 = -Math.acos(-1 / e) as Radians;
    const g = flightPathAngleFromTrueAnomaly(nu0, e);
    absClose(g, -PI / 2, 1e-12);
  });

  test('input validation: throws on non-finite ν or negative e', () => {
    // non-finite nu
    assert.throws(
      () => flightPathAngleFromTrueAnomaly(NaN as Radians, 0.3),
      /finite/
    );
    assert.throws(
      () => flightPathAngleFromTrueAnomaly(Infinity as Radians, 0.3),
      /finite/
    );

    // negative e
    assert.throws(
      () => flightPathAngleFromTrueAnomaly(1 as Radians, -0.01),
      /≥ 0/
    );

    // non-finite e
    assert.throws(
      () => flightPathAngleFromTrueAnomaly(1 as Radians, NaN),
      /finite/
    );
    assert.throws(
      () => flightPathAngleFromTrueAnomaly(1 as Radians, Infinity),
      /finite/
    );
  });
});
