import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { combineBurnsDeltaV } from '../combine-burns-delta-v';
import { absClose } from 'packages/equations/src/__tests__/helpers';
import { toRad } from '../../helpers/radians';

const PI = Math.PI;

const relClose = (
  a: number,
  b: number,
  rel = 1e-12,
  abs = 1e-12,
  msg?: string
) => {
  const denom = Math.max(1, Math.abs(a), Math.abs(b));
  assert.ok(Math.abs(a - b) <= Math.max(abs, rel * denom), msg);
};

describe('combineBurnsDeltaV', () => {
  test('collinear same direction (Δθ=0): Δv = |v1 - v2|', () => {
    const v1 = 3000;
    const v2 = 800;
    const dv = combineBurnsDeltaV(v1, v2, 0 as Radians);
    absClose(dv, Math.abs(v1 - v2));
  });

  test('collinear opposite (Δθ=π): Δv = v1 + v2', () => {
    const v1 = 2500;
    const v2 = 900;
    const dv = combineBurnsDeltaV(v1, v2, PI as Radians);
    absClose(dv, v1 + v2);
  });

  test('quadrature (Δθ=90°): Δv = sqrt(v1² + v2²)', () => {
    const v1 = 2100;
    const v2 = 1400;
    const dv = combineBurnsDeltaV(v1, v2, toRad(90));
    absClose(dv, Math.hypot(v1, v2));
  });

  test('general case matches law of cosines', () => {
    const cases: Array<{ v1: number; v2: number; deg: number }> = [
      { v1: 1000, v2: 500, deg: 35 },
      { v1: 2800, v2: 1200, deg: 60 },
      { v1: 750, v2: 750, deg: 123 }
    ];
    for (const { v1, v2, deg } of cases) {
      const th = toRad(deg);
      const expected = Math.sqrt(
        v1 * v1 + v2 * v2 - 2 * v1 * v2 * Math.cos(th as number)
      );
      const dv = combineBurnsDeltaV(v1, v2, th);
      relClose(
        dv,
        expected,
        1e-12,
        1e-12,
        `mismatch for v1=${v1}, v2=${v2}, Δθ=${deg}°`
      );
    }
  });

  test('symmetry: swapping v1 and v2 gives same Δv', () => {
    const v1 = 1900;
    const v2 = 1300;
    const th = toRad(47);
    const a = combineBurnsDeltaV(v1, v2, th);
    const b = combineBurnsDeltaV(v2, v1, th);
    absClose(a, b);
  });

  test('zero burn in either vector returns the other magnitude (Δθ arbitrary)', () => {
    const v = 1234;
    const angles = [0, 0.4, 1.2, Math.PI] as Radians[];
    for (const th of angles) {
      absClose(combineBurnsDeltaV(0, v, th), v);
      absClose(combineBurnsDeltaV(v, 0, th), v);
    }
  });

  // ---------------- monotonic / bounds ----------------

  test('for fixed v1 = v2 = v, Δv increases monotonically with Δθ on [0, π]', () => {
    const v = 1500;
    const seq = [0, 15, 30, 60, 90, 135, 180].map(toRad);
    let last = -1;
    for (const th of seq) {
      const dv = combineBurnsDeltaV(v, v, th);
      assert.ok(
        dv >= last - 1e-12,
        `not monotone at Δθ=${((th as number) * 180) / PI}°`
      );
      last = dv;
    }
  });

  test('bounds: result in [|v1-v2|, v1+v2]', () => {
    const v1 = 2600,
      v2 = 900;
    for (const deg of [0, 20, 45, 100, 150, 180]) {
      const dv = combineBurnsDeltaV(v1, v2, toRad(deg));
      assert.ok(dv >= Math.abs(v1 - v2) - 1e-12, 'below lower bound');
      assert.ok(dv <= v1 + v2 + 1e-12, 'above upper bound');
    }
  });

  // ---------------- numerical guard ----------------

  test('FP guard: tiny negative radicand clamps to 0 near Δθ=0 with equal burns', () => {
    const v = 2000;
    // angle so small that theoretical Δv ≈ 0; numerical should return ~0 (not throw)
    const th = 1e-12 as Radians;
    const dv = combineBurnsDeltaV(v, v, th);
    assert.ok(dv >= 0, 'Δv should be non-negative');
    assert.ok(dv < 1e-6, `Δv should be ~0, got ${dv}`);
  });

  // ---------------- validation ----------------

  test('TypeError on non-number inputs', () => {
    assert.throws(
      () => combineBurnsDeltaV('1000' as any, 200, 0 as Radians),
      TypeError
    );

    assert.throws(
      () => combineBurnsDeltaV(1000, '200' as any, 0 as Radians),
      TypeError
    );

    assert.throws(() => combineBurnsDeltaV(1000, 200, '0' as any), TypeError);
  });

  test('RangeError on non-finite or out-of-domain values', () => {
    assert.throws(() => combineBurnsDeltaV(NaN, 200, 0 as Radians), RangeError);
    assert.throws(
      () => combineBurnsDeltaV(1000, Infinity, 0 as Radians),
      RangeError
    );
    assert.throws(() => combineBurnsDeltaV(-1, 200, 0 as Radians), RangeError);
    assert.throws(() => combineBurnsDeltaV(1000, -1, 0 as Radians), RangeError);
    assert.throws(
      () => combineBurnsDeltaV(1000, 200, NaN as unknown as Radians),
      RangeError
    );
    assert.throws(
      () => combineBurnsDeltaV(1000, 200, -1e-6 as Radians),
      RangeError
    );
    assert.throws(
      () => combineBurnsDeltaV(1000, 200, (PI + 1e-6) as Radians),
      RangeError
    );
  });
});
