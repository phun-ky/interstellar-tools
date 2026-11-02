import type { Cr3bpState } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { cr3bpDerivatives } from '../cr3bp-derivatives.js';
import { jacobiConstant } from '../jacobi-constant.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const MU = 0.012150584205210296; // Earth–Moon

// The x of L1, where the x acceleration vanishes between the bodies
const l1 = () => {
  let [lo, hi] = [0.5, 1 - MU - 1e-6];

  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    const [, , , ax] = cr3bpDerivatives([mid, 0, 0, 0, 0, 0], MU);

    if (ax < 0) lo = mid;
    else hi = mid;
  }

  return (lo + hi) / 2;
};

describe('jacobiConstant', () => {
  test('is 3 − μ(1 − μ) at rest at L4', () => {
    relClose(
      jacobiConstant([0.5 - MU, Math.sqrt(3) / 2, 0, 0, 0, 0], MU),
      3 - MU * (1 - MU),
      1e-14
    );
  });

  test('is about 3.188 at Earth–Moon L1, 326 000 km from Earth', () => {
    const x = l1();

    assert.equal(Math.round(((x + MU) * 384_400) / 1000) * 1000, 326_000);
    assert.equal(jacobiConstant([x, 0, 0, 0, 0, 0], MU).toFixed(3), '3.188');
  });

  test('falls with speed: 2U − v²', () => {
    const at = [0.5, 0.3, 0.1, 0, 0, 0] as const;
    const moving = [0.5, 0.3, 0.1, 0.1, 0.2, 0.2] as const;

    relClose(
      jacobiConstant(at, MU) - jacobiConstant(moving, MU),
      0.01 + 0.04 + 0.04
    );
  });

  test('throws like cr3bpDerivatives', () => {
    assert.throws(
      () => jacobiConstant([0.5, 0, 0, 0, 0, 0], 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be in (0, 0.5]. Received: 0'
    );
    assert.throws(
      () => jacobiConstant([0.5, Number.NaN, 0, 0, 0, 0], MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'y must be a finite number. Received: NaN'
    );
    assert.throws(
      () => jacobiConstant([-MU, 0, 0, 0, 0, 0] as Cr3bpState, MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'The state must not be at the centre of either body.'
    );
    assert.throws(
      () => jacobiConstant([0.5, 0, 0, 0, 0, 0], Number.NaN),
      TypeError
    );
  });
});
