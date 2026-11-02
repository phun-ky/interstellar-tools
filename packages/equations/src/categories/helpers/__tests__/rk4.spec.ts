import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { rk4Integrate, rk4Step } from '../rk4.js';
import { absClose, relClose } from '../../../__tests__/helpers/index.js';

describe('rk4Step', () => {
  test('matches e^h to fifth order for dy/dt = y', () => {
    const [y] = rk4Step((_t, [v]) => [v], 0, [1], 0.1);
    const h = 0.1;

    relClose(y, 1 + h + h ** 2 / 2 + h ** 3 / 6 + h ** 4 / 24, 1e-15);
    assert.ok(Math.abs(y - Math.exp(h)) < 1e-7);
  });

  test('is exact for a polynomial of degree 4 in t', () => {
    // dy/dt = 5t⁴ → y = t⁵ is not exact, but dy/dt = 4t³ → y = t⁴ is
    const [y] = rk4Step((t) => [4 * t ** 3], 1, [1], 0.5);

    relClose(y, 1.5 ** 4, 1e-14);
  });

  test('steps backwards with a negative h', () => {
    const [y] = rk4Step((_t, [v]) => [v], 0, [1], -0.1);

    assert.ok(Math.abs(y - Math.exp(-0.1)) < 1e-7);
  });

  test('throws for non-finite inputs, h = 0 or a right-hand side of the wrong length', () => {
    const f = (_t: number, y: readonly number[]) => y;

    assert.throws(
      () => rk4Step(f, Number.NaN, [1], 0.1),
      (err) =>
        err instanceof TypeError &&
        err.message === 't must be a finite number. Received: NaN'
    );
    assert.throws(
      () => rk4Step(f, 0, [1], Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'h must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => rk4Step(f, 0, [1, Number.NaN], 0.1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'y must have finite components. Received: NaN'
    );
    assert.throws(
      () => rk4Step(f, 0, [1], 0),
      (err) =>
        err instanceof RangeError && err.message === 'h must not be zero.'
    );
    assert.throws(
      () => rk4Step(() => [1, 2], 0, [1], 0.1),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'f must return 1 components, one per state component. Received: 2'
    );
  });
});

describe('rk4Integrate', () => {
  const oscillator = (_t: number, [x, v]: readonly number[]) => [v, -x];

  test('brings a harmonic oscillator back after one period', () => {
    const { t, y } = rk4Integrate(oscillator, [1, 0], 0, 2 * Math.PI, 1000);

    assert.equal(t.length, 1001);
    assert.equal(t[t.length - 1], 2 * Math.PI);
    absClose(y[y.length - 1][0], 1, 1e-10);
    absClose(y[y.length - 1][1], 0, 1e-10);
  });

  test('converges at fourth order: half the step, a sixteenth of the error', () => {
    const error = (steps: number) => {
      const { y } = rk4Integrate(oscillator, [1, 0], 0, 10, steps);

      return Math.abs(y[y.length - 1][0] - Math.cos(10));
    };
    const ratio = error(200) / error(400);

    assert.ok(ratio > 14 && ratio < 18, `ratio ${ratio}`);
  });

  test('starts with y0 at t0, and does not change y0', () => {
    const y0 = [1, 0];
    const { t, y } = rk4Integrate(oscillator, y0, 0, 1, 10);

    assert.equal(t[0], 0);
    assert.deepEqual(y[0], [1, 0]);
    assert.deepEqual(y0, [1, 0]);
    assert.notEqual(y[0], y0);
  });

  test('keeps every n-th sample, and always the last', () => {
    const { t } = rk4Integrate(oscillator, [1, 0], 0, 1, 10, { every: 4 });

    assert.equal(t.length, 4); // t0, steps 4 and 8, and step 10
    relClose(t[1], 0.4);
    assert.equal(t[t.length - 1], 1);
  });

  test('stops where stop() says, keeping that sample', () => {
    const { t, y } = rk4Integrate(oscillator, [1, 0], 0, 10, 1000, {
      every: 100,
      stop: (_t, [x]) => x < 0
    });

    assert.ok(y[y.length - 1][0] < 0);
    assert.ok(Math.abs(t[t.length - 1] - Math.PI / 2) < 0.01);
  });

  test('integrates backwards when t1 < t0', () => {
    const { y } = rk4Integrate((_t, [v]) => [v], [1], 0, -1, 100);

    relClose(y[y.length - 1][0], Math.exp(-1), 1e-9);
  });

  test('throws for bad times, steps or sampling', () => {
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 0, Number.NaN, 10),
      (err) =>
        err instanceof TypeError &&
        err.message === 't1 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 0, 1, 2.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'steps must be an integer. Received: 2.5'
    );
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 0, 1, 10, { every: 1.5 }),
      (err) =>
        err instanceof TypeError &&
        err.message === 'every must be an integer. Received: 1.5'
    );
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 1, 1, 10),
      (err) =>
        err instanceof RangeError && err.message === 't1 must differ from t0.'
    );
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 0, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'steps must be >= 1. Received: 0'
    );
    assert.throws(
      () => rk4Integrate(oscillator, [1, 0], 0, 1, 10, { every: 0 }),
      (err) =>
        err instanceof RangeError &&
        err.message === 'every must be >= 1. Received: 0'
    );
  });
});
