import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { periApoapsisRadii } from '../peri-apoapsis-radii';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('periApoapsisRadii', () => {
  test('ellipse: matches rp = a(1-e), ra = a(1+e)', () => {
    const a = 7000e3; // m
    const e = 0.01;
    const { rp, ra } = periApoapsisRadii(a, e);
    relClose(rp, a * (1 - e), 1e-15);
    relClose(ra, a * (1 + e), 1e-15);
    assert.ok(rp > 0 && ra! > 0);
    assert.ok((ra as number) > rp);
  });

  test('circular: e = 0 → rp = ra = a', () => {
    const a = 6778e3;
    const e = 0;
    const { rp, ra } = periApoapsisRadii(a, e);
    relClose(rp, a, 1e-15);
    relClose(ra as number, a, 1e-15);
  });

  test('ellipse with e close to 1 still yields positive rp and ra', () => {
    const a = 10_000e3;
    const e = 0.999999;
    const { rp, ra } = periApoapsisRadii(a, e);
    assert.ok(rp > 0 && (ra as number) > 0);
    relClose(rp, a * (1 - e), 1e-12);
    relClose(ra as number, a * (1 + e), 1e-12);
  });

  test('hyperbola: a < 0 and e > 1 → rp = |a|(e-1), ra = null', () => {
    const a = -50_000e3; // m
    const e = 1.2;
    const { rp, ra } = periApoapsisRadii(a, e);
    relClose(rp, Math.abs(a) * (e - 1), 1e-15);
    assert.equal(ra, null);
    assert.ok(rp > 0);
  });

  test('invalid combos: parabolic e=1 with a>0; and e>=1 for ellipse', () => {
    const a = 7000e3;
    assert.throws(
      () => periApoapsisRadii(a, 1),
      /Parabolic \(e=1\) is not defined with finite a/
    );
    assert.throws(
      () => periApoapsisRadii(a, 1.1),
      /For a>0 \(elliptic\/circular\), eccentricity must satisfy 0 ≤ e < 1/
    );
  });

  test('invalid hyperbola: a < 0 with e ≤ 1 throws', () => {
    const a = -20_000e3;
    assert.throws(
      () => periApoapsisRadii(a, 1),
      /For a<0 \(hyperbolic\), eccentricity must satisfy e > 1/
    );
    assert.throws(
      () => periApoapsisRadii(a, 0.5),
      /For a<0 \(hyperbolic\), eccentricity must satisfy e > 1/
    );
  });

  test('monotonicity (ellipse): increasing e decreases rp and increases ra', () => {
    const a = 9000e3;
    const e1 = 0.1;
    const e2 = 0.3;

    const r1 = periApoapsisRadii(a, e1);
    const r2 = periApoapsisRadii(a, e2);

    assert.ok(r2.rp < r1.rp); // rp decreases with e
    assert.ok((r2.ra as number) > (r1.ra as number)); // ra increases with e
  });

  test('input validation: a=0, non-finite a/e; negative e', () => {
    const a = 7000e3;
    const e = 0.1;

    // a invalid
    assert.throws(() => periApoapsisRadii(0, e), /non-zero/);
    assert.throws(() => periApoapsisRadii(Number.NaN, e), /finite/);

    // e invalid
    assert.throws(() => periApoapsisRadii(a, -1e-3), /≥ 0/);
    assert.throws(() => periApoapsisRadii(a, Number.NaN), /finite/);
  });

  test('numerical stability: very large magnitudes still finite', () => {
    const { rp: rp1, ra: ra1 } = periApoapsisRadii(1e12, 0.2);
    assert.ok(Number.isFinite(rp1) && Number.isFinite(ra1 as number));

    const { rp: rp2, ra: ra2 } = periApoapsisRadii(-1e12, 1.5);
    assert.ok(Number.isFinite(rp2) && ra2 === null);
  });
});
