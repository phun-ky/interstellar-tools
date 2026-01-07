import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';
import { rad, toRad } from '../radians';
import type { Radians } from '@interstellar-tools/types';

describe('radians', () => {
  /* ---------------------------------- toRad --------------------------------- */

  test('toRad converts 180° to π', () => {
    const x = toRad(180);
    absClose(x, Math.PI, 1e-12);
  });

  test('toRad converts 90° to π/2', () => {
    const x = toRad(90);
    absClose(x, Math.PI / 2, 1e-12);
  });

  test('toRad converts -90° to -π/2', () => {
    const x = toRad(-90);
    absClose(x, -Math.PI / 2, 1e-12);
  });

  test('toRad is linear: toRad(a + b) = toRad(a) + toRad(b)', () => {
    const a = 12.34;
    const b = -56.78;

    const left = toRad(a + b);
    const right = (toRad(a) + toRad(b)) as number;

    relClose(left, right);
  });

  /* ----------------------------------- rad ---------------------------------- */

  test('rad is an identity at runtime (returns the same numeric value)', () => {
    const x = 1.2345;
    const y = rad(x);

    assert.equal(y, x);
  });

  test('rad works with Math constants (π branded as Radians)', () => {
    const x: Radians = rad(Math.PI);
    absClose(x, Math.PI, 0);
  });
});
