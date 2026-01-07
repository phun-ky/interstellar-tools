import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { atmosphericDragAcceleration } from '../atmospheric-drag-acceleration';
import { relClose } from 'packages/equations/src/__tests__/helpers';

describe('atmosphericDragAcceleration', () => {
  test('computes aD = 0.5 * (Cd*A/m) * rho * v² for typical inputs', () => {
    const Cd = 2.2;
    const A = 2.0; // m²
    const m = 500; // kg
    const rho = 1e-12; // kg/m^3
    const v = 7700; // m/s

    const aD = atmosphericDragAcceleration(Cd, A, m, rho, v);

    const expected = 0.5 * ((Cd * A) / m) * rho * v * v;
    relClose(aD, expected);
    assert.ok(aD >= 0);
  });

  test('returns 0 when rho = 0', () => {
    const aD = atmosphericDragAcceleration(2.2, 2.0, 500, 0, 7700);
    assert.equal(aD, 0);
  });

  test('returns 0 when v = 0', () => {
    const aD = atmosphericDragAcceleration(2.2, 2.0, 500, 1e-12, 0);
    assert.equal(aD, 0);
  });

  test('returns 0 when A = 0 (no reference area)', () => {
    const aD = atmosphericDragAcceleration(2.2, 0, 500, 1e-12, 7700);
    assert.equal(aD, 0);
  });

  test('scales with v² (doubling v quadruples aD)', () => {
    const Cd = 2.2;
    const A = 2.0;
    const m = 500;
    const rho = 1e-12;

    const a1 = atmosphericDragAcceleration(Cd, A, m, rho, 1000);
    const a2 = atmosphericDragAcceleration(Cd, A, m, rho, 2000);

    relClose(a2 / a1, 4);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => atmosphericDragAcceleration(Number.NaN, 1, 1, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'Cd must be a finite number. Received: NaN'
    );

    assert.throws(
      () => atmosphericDragAcceleration(1, Number.POSITIVE_INFINITY, 1, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'A must be a finite number. Received: Infinity'
    );

    assert.throws(
      () => atmosphericDragAcceleration(1, 1, Number.NEGATIVE_INFINITY, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'm must be a finite number. Received: -Infinity'
    );

    assert.throws(
      () => atmosphericDragAcceleration(1, 1, 1, Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rho must be a finite number. Received: NaN'
    );

    assert.throws(
      () => atmosphericDragAcceleration(1, 1, 1, 1, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'v must be a finite number. Received: NaN'
    );
  });

  test('throws RangeError when Cd < 0', () => {
    assert.throws(
      () => atmosphericDragAcceleration(-1e-9, 1, 1, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Cd must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when A < 0', () => {
    assert.throws(
      () => atmosphericDragAcceleration(1, -1e-9, 1, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'A must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when m <= 0', () => {
    assert.throws(
      () => atmosphericDragAcceleration(1, 1, 0, 1, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'm must be > 0. Received: 0'
    );
  });

  test('throws RangeError when rho < 0', () => {
    assert.throws(
      () => atmosphericDragAcceleration(1, 1, 1, -1e-9, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'rho must be >= 0. Received: -1e-9'
    );
  });

  test('throws RangeError when v < 0', () => {
    assert.throws(
      () => atmosphericDragAcceleration(1, 1, 1, 1, -1e-9),
      (err) =>
        err instanceof RangeError &&
        err.message === 'v must be >= 0. Received: -1e-9'
    );
  });
});
