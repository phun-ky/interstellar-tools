import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import {
  hohmannSemiMajorAxis,
  hohmannTransfer,
  hohmannTransferTime
} from '../categories/manoeuvres/hohmann-transfer';
import { absClose, relClose } from './helpers';

type Dir = 'prograde' | 'retrograde' | 'none';

describe('hohmannTransfer', () => {
  test('semi-major axis: at = (r1 + r2) / 2', () => {
    const r1 = 7000e3;
    const r2 = 42164e3;
    const at = hohmannSemiMajorAxis(r1, r2);
    absClose(at, 0.5 * (r1 + r2));
  });

  test('transfer time: t = π sqrt(at^3 / μ)', () => {
    const mu = 3.986004418e14; // Earth μ (m³/s²)
    const r1 = 7000e3;
    const r2 = 42164e3;
    const at = 0.5 * (r1 + r2);
    const expected = Math.PI * Math.sqrt((at * at * at) / mu);
    const t = hohmannTransferTime(r1, r2, mu);
    relClose(t, expected, 1e-12);
  });

  test('raise orbit (r2 > r1): dv1,dv2 magnitudes & directions (prograde, prograde)', () => {
    const mu = 3.986004418e14; // Earth μ
    const r1 = 7000e3;
    const r2 = 12000e3;

    const res = hohmannTransfer(r1, r2, mu);

    // Expected magnitudes from textbook formulas
    const at = 0.5 * (r1 + r2);
    const dv1Exp = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
    const dv2Exp = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));

    assert.ok(
      res.dv1 >= 0 && res.dv2 >= 0,
      'Δv magnitudes must be non-negative'
    );
    relClose(res.at, at);
    relClose(res.dv1, dv1Exp, 1e-12);
    relClose(res.dv2, dv2Exp, 1e-12);
    relClose(res.dvTotal, res.dv1 + res.dv2, 1e-12);
    assert.equal(res.dir1 as Dir, 'prograde');
    assert.equal(res.dir2 as Dir, 'prograde');

    // Transfer time check
    const tExp = Math.PI * Math.sqrt((at * at * at) / mu);
    relClose(res.tTransfer, tExp, 1e-12);
  });

  test('lower orbit (r2 < r1): dv1,dv2 magnitudes & directions (retrograde, retrograde)', () => {
    const mu = 3.986004418e14;
    const r1 = 12000e3;
    const r2 = 7000e3;

    const res = hohmannTransfer(r1, r2, mu);

    const at = 0.5 * (r1 + r2);
    const dv1Exp = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
    const dv2Exp = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));

    // Magnitudes compare against absolute values of textbook (which are negative here)
    relClose(res.at, at);
    relClose(res.dv1, Math.abs(dv1Exp), 1e-12);
    relClose(res.dv2, Math.abs(dv2Exp), 1e-12);
    relClose(res.dvTotal, res.dv1 + res.dv2, 1e-12);
    assert.equal(res.dir1 as Dir, 'retrograde');
    assert.equal(res.dir2 as Dir, 'retrograde');

    const tExp = Math.PI * Math.sqrt((at * at * at) / mu);
    relClose(res.tTransfer, tExp, 1e-12);
  });

  test('symmetry: total Δv is same for r1→r2 and r2→r1', () => {
    const mu = 3.986004418e14;
    const r1 = 9000e3;
    const r2 = 14000e3;

    const up = hohmannTransfer(r1, r2, mu);
    const down = hohmannTransfer(r2, r1, mu);

    relClose(up.dvTotal, down.dvTotal, 1e-12);
  });

  test('degenerate: r1 == r2 → dv1=dv2=0, t = half circular period', () => {
    const mu = 3.986004418e14;
    const r = 7000e3;
    const res = hohmannTransfer(r, r, mu);

    absClose(res.dv1, 0, 1e-12);
    absClose(res.dv2, 0, 1e-12);
    absClose(res.dvTotal, 0, 1e-12);
    assert.equal(res.dir1 as Dir, 'none');
    assert.equal(res.dir2 as Dir, 'none');

    const T_circ = 2 * Math.PI * Math.sqrt((r * r * r) / mu);
    const half = 0.5 * T_circ;
    relClose(res.tTransfer, half, 1e-12);
  });

  test('input validation: type and range errors', () => {
    const mu = 3.986004418e14;

    // TypeError: non-number inputs

    assert.throws(() => hohmannTransfer('x' as any, 7000e3, mu), TypeError);

    assert.throws(() => hohmannTransfer(7000e3, 'y' as any, mu), TypeError);

    assert.throws(() => hohmannTransfer(7000e3, 8000e3, 'z' as any), TypeError);

    // RangeError: non-finite / non-positive
    assert.throws(() => hohmannTransfer(NaN, 8000e3, mu), RangeError);
    assert.throws(() => hohmannTransfer(7000e3, Infinity, mu), RangeError);
    assert.throws(() => hohmannTransfer(7000e3, 8000e3, 0), RangeError);
    assert.throws(() => hohmannTransfer(-1, 8000e3, mu), RangeError);
    assert.throws(() => hohmannTransfer(7000e3, -1, mu), RangeError);

    // Semi-major axis helper

    assert.throws(() => hohmannSemiMajorAxis('a' as any, 1), TypeError);
    assert.throws(() => hohmannSemiMajorAxis(1, NaN), RangeError);
    assert.throws(() => hohmannSemiMajorAxis(0, 1), RangeError);

    // Transfer time helper
    assert.throws(() => hohmannTransferTime(1, 1, 0), RangeError);

    assert.throws(() => hohmannTransferTime(1, 1, 'mu' as any), TypeError);
  });
});
