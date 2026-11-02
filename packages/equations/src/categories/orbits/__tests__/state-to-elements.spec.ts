import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { elementsToState } from '../elements-to-state.js';
import { specificAngularMomentum } from '../specific-angular-momentum.js';
import { specificMechanicalEnergy } from '../specific-mechanical-energy.js';
import { stateToElements } from '../state-to-elements.js';
import { angleClose, relClose } from '../../../__tests__/helpers/index.js';

const MU = 3.986004418e14;
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => ((d * Math.PI) / 180) as Radians;

describe('stateToElements', () => {
  test('matches the Curtis textbook example', () => {
    // Curtis, Orbital Mechanics for Engineering Students, μ = 398 600 km³/s²
    const { a, e, i, raan, argp, nu } = stateToElements(
      [-6045e3, -3490e3, 2500e3],
      [-3.457e3, 6.618e3, 2.533e3],
      398_600e9
    );

    assert.equal(Math.round(a / 1e3), 8788);
    assert.equal(e.toFixed(4), '0.1712');
    assert.equal(deg(i).toFixed(1), '153.2');
    assert.equal(deg(raan).toFixed(1), '255.3');
    assert.equal(deg(argp).toFixed(2), '20.07');
    assert.equal(deg(nu).toFixed(2), '28.45');
  });

  test('agrees with specificMechanicalEnergy and specificAngularMomentum', () => {
    const r: Vector3DTupleType = [7000e3, -1200e3, 3000e3];
    const v: Vector3DTupleType = [1.2e3, 7.1e3, -0.8e3];
    const { a, e } = stateToElements(r, v, MU);
    const energy = specificMechanicalEnergy(
      Math.hypot(...v),
      Math.hypot(...r),
      MU
    );
    const h = specificAngularMomentum(r, v);

    relClose(a, -MU / (2 * energy), 1e-12);
    relClose(h * h, MU * a * (1 - e * e), 1e-9);
  });

  test('gives a negative a and e > 1 for a hyperbola', () => {
    const r: Vector3DTupleType = [7000e3, 0, 0];
    const v: Vector3DTupleType = [0, 12e3, 0];
    const { a, e, nu } = stateToElements(r, v, MU);

    assert.ok(a < 0, `a=${a}`);
    assert.ok(e > 1, `e=${e}`);
    angleClose(nu, 0, 1e-12); // at periapsis
  });

  test('measures nu from the node for a circular inclined orbit', () => {
    const r0 = 7000e3;
    const vc = Math.sqrt(MU / r0);
    const inc = rad(30);
    // On the node line, then 60° further along the orbit
    const u = rad(60);
    const r: Vector3DTupleType = [
      r0 * Math.cos(u),
      r0 * Math.sin(u) * Math.cos(inc),
      r0 * Math.sin(u) * Math.sin(inc)
    ];
    const v: Vector3DTupleType = [
      -vc * Math.sin(u),
      vc * Math.cos(u) * Math.cos(inc),
      vc * Math.cos(u) * Math.sin(inc)
    ];
    const el = stateToElements(r, v, MU);

    assert.ok(el.e < 1e-10);
    assert.equal(el.argp, 0);
    angleClose(el.raan, 0, 1e-12);
    angleClose(el.i, inc, 1e-12);
    angleClose(el.nu, u, 1e-12);
  });

  test('measures argp from the x axis for an equatorial orbit', () => {
    // Periapsis at 40° from x, prograde, equatorial
    const el = elementsToState(
      {
        a: 9000e3,
        e: 0.2,
        i: rad(0),
        raan: rad(0),
        argp: rad(40),
        nu: rad(10)
      },
      MU
    );
    const back = stateToElements(el.r, el.v, MU);

    assert.equal(back.raan, 0);
    angleClose(back.argp, rad(40), 1e-12);
    angleClose(back.nu, rad(10), 1e-12);
  });

  test('round-trips a retrograde equatorial orbit', () => {
    const el = elementsToState(
      {
        a: 9000e3,
        e: 0.2,
        i: rad(180),
        raan: rad(0),
        argp: rad(40),
        nu: rad(10)
      },
      MU
    );
    const back = stateToElements(el.r, el.v, MU);

    angleClose(back.i, rad(180), 1e-12);
    angleClose(back.argp, rad(40), 1e-12);
    angleClose(back.nu, rad(10), 1e-12);
  });

  test('measures nu from the x axis for a circular equatorial orbit', () => {
    const r0 = 7000e3;
    const vc = Math.sqrt(MU / r0);
    const el = stateToElements([0, r0, 0], [-vc, 0, 0], MU);

    assert.equal(el.raan, 0);
    assert.equal(el.argp, 0);
    angleClose(el.nu, rad(90), 1e-12);
  });

  test('throws for invalid inputs', () => {
    assert.throws(
      () => stateToElements([Number.NaN, 0, 0], [0, 1, 0], MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'r must have finite components. Received: NaN'
    );
    assert.throws(
      () => stateToElements([1, 0, 0], [0, Number.POSITIVE_INFINITY, 0], MU),
      (err) =>
        err instanceof TypeError &&
        err.message === 'v must have finite components. Received: Infinity'
    );
    assert.throws(
      () => stateToElements([1, 0, 0], [0, 1, 0], Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'mu must be a finite number. Received: NaN'
    );
    assert.throws(
      () => stateToElements([1, 0, 0], [0, 1, 0], 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'mu must be > 0. Received: 0'
    );
    assert.throws(
      () => stateToElements([1, 0, 0], [0, 1, 0], MU, -1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'tolerance must be >= 0. Received: -1'
    );
    assert.throws(
      () => stateToElements([0, 0, 0], [0, 1, 0], MU),
      (err) =>
        err instanceof RangeError &&
        err.message === 'r must not be the zero vector.'
    );
  });

  test('throws for straight-up or straight-down motion', () => {
    for (const v of [
      [0, 0, 0],
      [5e3, 0, 0]
    ] as const) {
      assert.throws(
        () => stateToElements([7000e3, 0, 0], v, MU),
        (err) =>
          err instanceof RangeError &&
          err.message.startsWith('The motion is straight up or down')
      );
    }
  });
});
