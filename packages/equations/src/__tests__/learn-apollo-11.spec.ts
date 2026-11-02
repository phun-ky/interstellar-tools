import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { rocketDeltaVFromIsp } from '../categories/manoeuvres/rocket-delta-v-from-isp.js';

// Every number in the Apollo 11 tutorial's text (docs/learn/apollo-11), so the
// pages can't drift from the code. The mission figures come from the Apollo 11
// Mission Report (MSC-00171) and Apollo by the Numbers (SP-2000-4029); the
// widgets read theirs from docs/.vitepress/theme/components/apollo/mission.ts.

const g0 = 9.80665;
const FT = 0.3048; // m per foot
const LB = 0.45359237; // kg per pound

const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const massBefore = (mAfter: number, dv: number, Isp: number) =>
  mAfter * Math.exp(dv / (Isp * g0));

describe('Apollo 11: sources', () => {
  test('converts the Mission Report figures used in the text', () => {
    assert.equal((6930 * FT).toFixed(1), '2112.3'); // powered descent, ft/s
    assert.equal((6070.1 * FT).toFixed(1), '1850.2'); // lunar ascent, ft/s
    assert.equal(group(36_965.7 * LB), '16 767'); // CSM at TEI ignition, lb
    assert.equal(group(10_776.6 * LB), '4 888'); // ascent stage at liftoff, lb
    assert.equal(group(33_683.5 * LB), '15 279'); // LM at undocking, lb
  });
});

describe('Apollo 11: the Δv budget (hub page)', () => {
  // Mission Report Tables 7-III, 7-V and 7-VI, ft/s
  const burns = {
    tli: 10_441,
    mcc: 20.9,
    loi1: 2917.5,
    loi2: 158.8,
    tei: 3279,
    mcc5: 4.8,
    doi: 76.4,
    pdi: 6930,
    ascent: 6070.1,
    csi: 51.5,
    cdh: 19.9,
    tpi: 25.3,
    tpf: 31.4
  };
  const total = Object.values(burns).reduce((sum, dv) => sum + dv * FT, 0);

  test('adds up to 9.15 km/s after Earth orbit', () => {
    assert.equal((total / 1000).toFixed(2), '9.15');
  });

  test('puts more than three-quarters of it in TLI, landing and ascent', () => {
    const big = (burns.tli + burns.pdi + burns.ascent) * FT;

    assert.ok(big / total > 0.75);
  });
});

describe('Why lunar orbit rendezvous? (tutorial)', () => {
  const DESCENT = { dv: 2112.3, Isp: 305 };
  const ASCENT = { dv: 1850.2, Isp: 309 };
  const csm = 16_767;
  const ascentStage = 4888;

  const priceDescent = Math.exp(DESCENT.dv / (DESCENT.Isp * g0));
  const priceAscent = Math.exp(ASCENT.dv / (ASCENT.Isp * g0));
  const atLiftoff = massBefore(csm, ASCENT.dv, ASCENT.Isp);
  const direct = massBefore(atLiftoff, DESCENT.dv, DESCENT.Isp);
  const lm = massBefore(ascentStage, DESCENT.dv, DESCENT.Isp);
  const lor = csm + lm;

  test('prices descent at 2.026 and ascent at 1.841 kg per kg, 3.73 together', () => {
    assert.equal(priceDescent.toFixed(3), '2.026');
    assert.equal(priceAscent.toFixed(3), '1.841');
    assert.equal((priceDescent * priceAscent).toFixed(2), '3.73');
  });

  test('needs 30 876 kg at liftoff and 62 565 kg in orbit for direct ascent', () => {
    assert.equal(group(atLiftoff), '30 876');
    assert.equal(group(direct), '62 565');
  });

  test('gets the descent Δv back from the rocket equation', () => {
    assert.equal(
      rocketDeltaVFromIsp(DESCENT.Isp, direct, atLiftoff).toFixed(1),
      '2112.3'
    );
  });

  test('needs a 9 905 kg lunar module and 26 672 kg in orbit for LOR', () => {
    assert.equal(group(lm), '9 905');
    assert.equal(group(lor), '26 672');
  });

  test('makes direct ascent 2.35 times heavier', () => {
    assert.equal((direct / lor).toFixed(2), '2.35');
  });
});
