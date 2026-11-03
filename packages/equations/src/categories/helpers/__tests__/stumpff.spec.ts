import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { relClose } from '../../../__tests__/helpers/index.js';
import { stumpffC, stumpffS } from '../stumpff.js';

describe('stumpffC', () => {
  test('is 1/2 at z = 0', () => {
    assert.equal(stumpffC(0), 0.5);
  });

  test('matches the closed forms away from 0', () => {
    relClose(stumpffC(Math.PI ** 2), 2 / Math.PI ** 2);
    relClose(stumpffC(4), (1 - Math.cos(2)) / 4);
    relClose(stumpffC(-4), (Math.cosh(2) - 1) / 4);
  });

  test('is zero after one whole revolution, z = 4π²', () => {
    assert.ok(Math.abs(stumpffC(4 * Math.PI ** 2)) < 1e-16);
  });

  test('joins the series and the closed forms smoothly at |z| = 0.1', () => {
    for (const z of [0.1, -0.1]) {
      relClose(stumpffC(z * (1 - 1e-12)), stumpffC(z), 1e-12);
      relClose(
        stumpffC(z),
        z > 0
          ? (1 - Math.cos(Math.sqrt(z))) / z
          : (Math.cosh(Math.sqrt(-z)) - 1) / -z,
        1e-13
      );
    }
  });

  test('keeps full precision near 0, where the closed form cancels', () => {
    relClose(stumpffC(1e-8), 0.5 - 1e-8 / 24, 1e-15);
  });

  test('throws on a non-finite z', () => {
    assert.throws(() => stumpffC(Number.NaN), TypeError);
    assert.throws(() => stumpffC(Infinity), TypeError);
  });
});

describe('stumpffS', () => {
  test('is 1/6 at z = 0', () => {
    assert.equal(stumpffS(0), 1 / 6);
  });

  test('matches the closed forms away from 0', () => {
    relClose(stumpffS(Math.PI ** 2), 1 / Math.PI ** 2);
    relClose(stumpffS(4), (2 - Math.sin(2)) / 8);
    relClose(stumpffS(-4), (Math.sinh(2) - 2) / 8);
  });

  test('joins the series and the closed forms smoothly at |z| = 0.1', () => {
    for (const z of [0.1, -0.1]) {
      const s = Math.sqrt(Math.abs(z));

      relClose(stumpffS(z * (1 - 1e-12)), stumpffS(z), 1e-12);
      relClose(
        stumpffS(z),
        z > 0 ? (s - Math.sin(s)) / s ** 3 : (Math.sinh(s) - s) / s ** 3,
        1e-12
      );
    }
  });

  test('keeps full precision near 0, where the closed form cancels', () => {
    relClose(stumpffS(1e-8), 1 / 6 - 1e-8 / 120, 1e-15);
  });

  test('decreases as z grows, and stays positive', () => {
    let previous = Infinity;

    for (let z = -50; z <= 80; z += 0.25) {
      const s = stumpffS(z);

      assert.ok(s > 0 && s < previous, `S(${z}) = ${s}`);
      previous = s;
    }
  });

  test('throws on a non-finite z', () => {
    assert.throws(() => stumpffS(Number.NaN), TypeError);
  });
});
