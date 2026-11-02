import type { CwState, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { cwTwoImpulseTransfer } from '../categories/manoeuvres/cw-two-impulse-transfer.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { rocketDeltaVFromIsp } from '../categories/manoeuvres/rocket-delta-v-from-isp.js';
import { thrustToWeight } from '../categories/manoeuvres/thrust-to-weight.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { meanMotion } from '../categories/orbits/mean-motion.js';
import { surfaceRotationSpeed } from '../categories/orbits/surface-rotation-speed.js';
import { synodicPeriod } from '../categories/orbits/synodic-period.js';
import { visVivaSpeed } from '../categories/orbits/vis-viva-speed.js';

// Every number in the Apollo 11 tutorial's text (docs/learn/apollo-11), so the
// pages can't drift from the code. The mission figures come from the Apollo 11
// Mission Report (MSC-00171) and Apollo by the Numbers (SP-2000-4029); the
// widgets read theirs from docs/.vitepress/theme/components/apollo/mission.ts.

const g0 = 9.80665;
const FT = 0.3048; // m per foot
const LB = 0.45359237; // kg per pound

const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');

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
  const atLiftoff = initialMassForDeltaV(csm, ASCENT.dv, ASCENT.Isp);
  const direct = initialMassForDeltaV(atLiftoff, DESCENT.dv, DESCENT.Isp);
  const lm = initialMassForDeltaV(ascentStage, DESCENT.dv, DESCENT.Isp);
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

describe('IV. Lunar orbit rendezvous (tutorial)', () => {
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;
  const NM = 1852;
  const m0 = 4888;
  const F = 15_409;
  const Isp = 309;
  const gMoon = MU_MOON / R_MOON ** 2;
  const low = R_MOON + 9.4 * NM;
  const high = R_MOON + 48.0 * NM;
  const a = (low + high) / 2;
  const aCSM = R_MOON + 59 * NM;
  const n = meanMotion(aCSM, MU_MOON);
  const dh = (59 - (47.4 + 42.1) / 2) * NM;
  const drift = 1.5 * n * dh;
  const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

  test('converts the sources: 4 888 kg, 15 409 N, 6.07 and 15.7 m/s', () => {
    assert.equal(group(10_776.6 * LB), '4 888');
    assert.equal(Math.round(3464 * 4.448222), 15_409);
    assert.equal((19.9 * FT).toFixed(1), '6.1');
    assert.equal((51.5 * FT).toFixed(1), '15.7');
    assert.equal((25.3 * FT).toFixed(2), '7.71');
    assert.equal((31.4 * FT).toFixed(2), '9.57');
  });

  test('stays 21 h 36 min on the Moon, docks within four hours, after 17 min of station keeping', () => {
    const stay = hms(124, 22, 0) - hms(102, 45, 40);
    const chase = hms(128, 3, 0) - hms(124, 22, 0);

    assert.equal(
      `${Math.floor(stay / 3600)} h ${Math.floor((stay % 3600) / 60)} min`,
      '21 h 36 min'
    );
    assert.ok(chase < 4 * 3600);
    assert.equal(Math.round((hms(128, 3, 0) - hms(127, 46, 9.8)) / 60), 17);
  });

  test('1. lifts off at T/W 1.94 (0.32 on Earth), 5.09 kg/s, 439 s against 434.9 s', () => {
    assert.equal(gMoon.toFixed(2), '1.62');
    assert.equal(thrustToWeight(F, m0, gMoon).toFixed(2), '1.94');
    assert.equal(thrustToWeight(F, m0, 9.80665).toFixed(2), '0.32');
    assert.equal(massFlowRate(F, Isp).toFixed(2), '5.09');

    const t = burnTime(m0, 1850.2, F, Isp);

    assert.equal(Math.round(t), 439);
    assert.equal(Math.round((100 * (t - 434.9)) / t), 1);
  });

  test('1. gets 4.6 m/s from the Moon’s rotation', () => {
    const omega = (2 * Math.PI) / (27.322 * 86_400);
    const tranquility = ((0.674 * Math.PI) / 180) as Radians;

    assert.equal(
      surfaceRotationSpeed(tranquility, R_MOON, omega).toFixed(1),
      '4.6'
    );
  });

  test('2. reaches a 17 × 89 km orbit at 1 688 m/s, 162 m/s short of the burn', () => {
    assert.equal(Math.round(9.4 * 1.852), 17);
    assert.equal(Math.round(48.0 * 1.852), 89);
    assert.equal(Math.round(434.9 / 60), 7);

    const v = visVivaSpeed(low, a, MU_MOON);

    assert.equal(group(v), '1 688');
    assert.equal(Math.round(6070.1 * FT - v), 162);
  });

  test('3. orbits in 113.3 and 118.7 min, 41.8 h to lap, 16° an orbit', () => {
    assert.equal(Math.round(56 * 1.852), 104);
    assert.equal(Math.round(62 * 1.852), 115);
    assert.equal((keplerPeriod(a, MU_MOON) / 60).toFixed(1), '113.3');
    assert.equal((keplerPeriod(aCSM, MU_MOON) / 60).toFixed(1), '118.7');

    const syn = synodicPeriod(meanMotion(a, MU_MOON), n);

    assert.equal((syn / 3600).toFixed(1), '41.8');
    assert.equal(Math.round(syn / 3600), 42);
    assert.equal(Math.round(360 * (1 - n / meanMotion(a, MU_MOON))), 16);
  });

  test('4. raises the low point to 85 km (85 × 91 km) for 16.0 m/s, about half an orbit in', () => {
    assert.equal(Math.round(45.7 * 1.852), 85);
    assert.equal(Math.round(49.3 * 1.852), 91);

    const after = R_MOON + ((49.3 + 45.7) / 2) * NM;
    const dv =
      visVivaSpeed(high, after, MU_MOON) - visVivaSpeed(high, a, MU_MOON);

    assert.equal(dv.toFixed(1), '16.0');

    const insertionToCsi = hms(125, 19, 35) - (hms(124, 22, 0.8) + 434.9);
    const halfOrbit = keplerPeriod(a, MU_MOON) / 2;

    assert.ok(Math.abs(insertionToCsi - halfOrbit) / halfOrbit < 0.15);
  });

  test('5. sits 26.4 km below, drifting 34.9 m/s, 96 km closer in 46 min', () => {
    assert.equal((dh / 1000).toFixed(1), '26.4');
    assert.equal(drift.toFixed(1), '34.9');

    const t = hms(127, 3, 51.8) - hms(126, 17, 49.6);

    assert.equal(Math.round(t / 60), 46);
    assert.equal(Math.round((drift * t) / 1000), 96);
  });

  test('6. needs 7.72 and 8.56 m/s from 46.5 km behind, in 42 min', () => {
    const t = hms(127, 46, 9.8) - hms(127, 3, 51.8);

    assert.equal(t, 2538);
    assert.equal(Math.round(t / 60), 42);

    const atTpi: CwState = [-dh, -46_500, 0, 0, drift, 0];
    const { dv1, dv2 } = cwTwoImpulseTransfer(atTpi, [0, 0, 0, 0, 0, 0], n, t);

    assert.equal(Math.hypot(...dv1).toFixed(2), '7.72');
    assert.equal(Math.hypot(...dv2).toFixed(2), '8.56');
  });

  test('6. has the cheapest TPI, 6.99 m/s, at 55 km, and 13 m/s braking further back', () => {
    const burns = (behind: number) =>
      cwTwoImpulseTransfer(
        [-dh, -behind, 0, 0, drift, 0],
        [0, 0, 0, 0, 0, 0],
        n,
        2538
      );
    let best = { behind: 0, dv: Infinity };

    for (let behind = 30_000; behind <= 75_000; behind += 10) {
      const dv = Math.hypot(...burns(behind).dv1);

      if (dv < best.dv) best = { behind, dv };
    }

    assert.equal(best.dv.toFixed(2), '6.99');
    assert.equal(Math.round(best.behind / 1000), 55);

    // The other separation where TPI costs the flown 7.71 m/s
    let other = 0;

    for (let behind = best.behind; behind <= 75_000; behind += 10) {
      if (Math.hypot(...burns(behind).dv1) >= 25.3 * FT) {
        other = behind;
        break;
      }
    }

    assert.equal(Math.round(Math.hypot(...burns(other).dv2)), 13);
  });
});
