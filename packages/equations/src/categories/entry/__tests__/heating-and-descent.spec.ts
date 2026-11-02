import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { stagnationHeatFlux } from '../stagnation-heat-flux.js';
import { terminalVelocity } from '../terminal-velocity.js';
import { atmosphericDragAcceleration } from '../../orbits/atmospheric-drag-acceleration.js';
import { relClose } from '../../../__tests__/helpers/index.js';

describe('stagnationHeatFlux', () => {
  test('is k √(ρ / Rn) V³ with Earth’s k by default', () => {
    relClose(
      stagnationHeatFlux(3e-4, 11_000, 4.69),
      1.7415e-4 * Math.sqrt(3e-4 / 4.69) * 11_000 ** 3
    );
    assert.equal(
      (stagnationHeatFlux(3e-4, 11_000, 4.69) / 1e6).toFixed(2),
      '1.85'
    );
  });

  test('scales with V³, √ρ and 1 / √Rn', () => {
    const q = stagnationHeatFlux(1e-4, 7800, 2);

    relClose(stagnationHeatFlux(1e-4, 2 * 7800, 2) / q, 8);
    relClose(stagnationHeatFlux(4e-4, 7800, 2) / q, 2);
    relClose(stagnationHeatFlux(1e-4, 7800, 8) / q, 0.5);
  });

  test('takes another atmosphere’s k', () => {
    relClose(
      stagnationHeatFlux(1e-4, 6000, 1, 1.9027e-4) /
        stagnationHeatFlux(1e-4, 6000, 1),
      1.9027 / 1.7415
    );
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => stagnationHeatFlux(Number.NaN, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'rho must be a finite number. Received: NaN'
    );
    assert.throws(
      () => stagnationHeatFlux(1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'Rn must be > 0. Received: 0'
    );
  });
});

describe('terminalVelocity', () => {
  test('balances drag and weight', () => {
    const [m, g, rho, Cd, A] = [
      4932,
      9.80665,
      1.225,
      0.8,
      3 * Math.PI * 12.75 ** 2
    ];
    const v = terminalVelocity(m, g, rho, Cd, A);

    relClose(atmosphericDragAcceleration(Cd, A, m, rho, v), g, 1e-12);
    assert.equal(v.toFixed(1), '8.0');
  });

  test('grows with √m and falls with √ρ', () => {
    const v = terminalVelocity(100, 9.8, 1.2, 1, 10);

    relClose(terminalVelocity(200, 9.8, 1.2, 1, 10) / v, Math.SQRT2);
    relClose(terminalVelocity(100, 9.8, 4.8, 1, 10) / v, 0.5);
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => terminalVelocity(1, Number.NaN, 1, 1, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'g must be a finite number. Received: NaN'
    );
    assert.throws(
      () => terminalVelocity(1, 1, 1, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'A must be > 0. Received: 0'
    );
  });
});
