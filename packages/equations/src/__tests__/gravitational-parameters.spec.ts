import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { relClose } from './helpers';
import { gravitationalParameter } from '../categories/dynamics/gravitational-parameter';

describe('gravitationalParameter', () => {
  test('computes μ = G(M + m) for simple numbers', () => {
    const G = 10;
    const M = 2;
    const m = 3;
    const mu = gravitationalParameter(M, m, G);
    assert.equal(mu, 10 * (2 + 3)); // 50
  });

  test('matches canonical GM_Earth when M = GM/G', () => {
    const GM_canonical = 3.986004418e14; // m^3/s^2
    const M_from_GM = GM_canonical / 6.6743e-11;
    const mu = gravitationalParameter(M_from_GM); // m=0, G=G_SI
    relClose(mu, GM_canonical, 1e-12);
  });

  test('M = 0 returns μ = G * m', () => {
    const G = 6.7;
    const M = 0;
    const m = 123;
    assert.equal(gravitationalParameter(M, m, G), G * m);
  });

  test('commutative in masses: μ(M,m) = μ(m,M)', () => {
    const G = 3.21;
    const M = 7;
    const m = 11;
    const mu1 = gravitationalParameter(M, m, G);
    const mu2 = gravitationalParameter(m, M, G);
    assert.equal(mu1, mu2);
  });

  test('approximation: when m ≪ M, μ ≈ G M within ~m/M relative error', () => {
    const G = 2;
    const M = 1e8;
    const m = 1e2; // m/M = 1e-6
    const exact = gravitationalParameter(M, m, G);
    const approx = G * M;
    // Relative error should be about m/M
    const relErr = Math.abs(exact - approx) / approx;
    assert.ok(relErr < 2e-6, `relative error ${relErr} not < 2e-6`);
  });

  test('scales linearly with G and with (M + m)', () => {
    const G = 5;
    const M = 10;
    const m = 4;

    const mu = gravitationalParameter(M, m, G);
    const mu_doubleG = gravitationalParameter(M, m, 2 * G);
    const mu_doubleMasses = gravitationalParameter(2 * M, 2 * m, G);

    // Doubling G doubles μ
    relClose(mu_doubleG, 2 * mu, 1e-15, 'doubling G should double μ');
    // Doubling both masses doubles (M + m) and thus doubles μ
    relClose(mu_doubleMasses, 2 * mu, 1e-15, 'doubling masses should double μ');
  });

  test('throws on invalid M (negative or non-finite)', () => {
    const G = 6.7;
    const m = 1;
    assert.throws(() => gravitationalParameter(-1, m, G), /finite|positive/);
    assert.throws(() => gravitationalParameter(Number.NaN, m, G), /finite/);
  });

  test('throws on invalid m (negative or non-finite)', () => {
    const G = 6.7;
    const M = 1;
    assert.throws(() => gravitationalParameter(M, -1, G), /finite|positive/);
    assert.throws(() => gravitationalParameter(M, Number.NaN, G), /finite/);
  });

  test('throws on invalid G (non-finite or ≤ 0)', () => {
    const M = 1;
    const m = 1;
    assert.throws(() => gravitationalParameter(M, m, 0), /positive/);
    assert.throws(() => gravitationalParameter(M, m, -1), /positive/);
    assert.throws(() => gravitationalParameter(M, m, Number.NaN), /finite/);
  });
});
