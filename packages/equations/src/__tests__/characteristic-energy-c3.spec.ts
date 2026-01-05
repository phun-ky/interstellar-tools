import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { characteristicEnergyC3 } from '../categories/orbits/characteristic-energy-c3';
import { relClose } from './helpers';

describe('characteristicEnergyC3', () => {
  test('returns vInfinity² for a positive number', () => {
    const vInf = 3.2;
    const c3 = characteristicEnergyC3(vInf);

    // avoid strict equality for floats
    relClose(c3, 10.24);
  });

  test('returns vInfinity² for zero', () => {
    assert.equal(characteristicEnergyC3(0), 0);
  });

  test('returns vInfinity² for a negative number (squares it)', () => {
    assert.equal(characteristicEnergyC3(-4), 16);
  });

  test('works with decimal inputs', () => {
    const vInf = 1.2345;
    const c3 = characteristicEnergyC3(vInf);

    relClose(c3, vInf * vInf);
  });

  test('throws TypeError for NaN', () => {
    assert.throws(
      () => characteristicEnergyC3(Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: NaN'
    );
  });

  test('throws TypeError for +Infinity', () => {
    assert.throws(
      () => characteristicEnergyC3(Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: Infinity'
    );
  });

  test('throws TypeError for -Infinity', () => {
    assert.throws(
      () => characteristicEnergyC3(Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'vInfinity must be a finite number. Received: -Infinity'
    );
  });
});
