import type { CwState, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { asymptoteTrueAnomaly } from '../categories/anomalies/asymptote-true-anomaly.js';
import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { geodeticToBodyFixed } from '../categories/cartography/geodetic-to-body-fixed.js';
import { greatCircleDistance } from '../categories/cartography/great-circle-distance.js';
import { horizonSurfaceDistance } from '../categories/cartography/horizon-surface-distance.js';
import { ballisticCoefficient } from '../categories/entry/ballistic-coefficient.js';
import { ballisticEntrySpeed } from '../categories/entry/ballistic-entry-speed.js';
import { ballisticPeakDecelerationAltitude } from '../categories/entry/ballistic-peak-deceleration-altitude.js';
import { ballisticPeakDeceleration } from '../categories/entry/ballistic-peak-deceleration.js';
import { terminalVelocity } from '../categories/entry/terminal-velocity.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { cwTwoImpulseTransfer } from '../categories/manoeuvres/cw-two-impulse-transfer.js';
import { hohmannTransfer } from '../categories/manoeuvres/hohmann-transfer.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { rocketDeltaVFromIsp } from '../categories/manoeuvres/rocket-delta-v-from-isp.js';
import { thrustToWeight } from '../categories/manoeuvres/thrust-to-weight.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { hyperbolicEccentricity } from '../categories/orbits/hyperbolic-eccentricity.js';
import { hyperbolicPeriapsisSpeed } from '../categories/orbits/hyperbolic-periapsis-speed.js';
import { hyperbolicSemiMajorAxis } from '../categories/orbits/hyperbolic-semi-major-axis.js';
import { hyperbolicTimeOfFlight } from '../categories/orbits/hyperbolic-time-of-flight.js';
import { inclinationFromLaunchAzimuth } from '../categories/orbits/inclination-from-launch-azimuth.js';
import { launchAzimuthForInclination } from '../categories/orbits/launch-azimuth-for-inclination.js';
import { meanMotion } from '../categories/orbits/mean-motion.js';
import { rotatingLaunchAzimuth } from '../categories/orbits/rotating-launch-azimuth.js';
import { sphereOfInfluenceRadius } from '../categories/orbits/sphere-of-influence-radius.js';
import { stateToElements } from '../categories/orbits/state-to-elements.js';
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

describe('I. Leaving Earth (tutorial)', () => {
  const A = 6_378_137;
  const E2 = 0.00669437999014;
  const MU_EARTH = 3.986004418e14;
  const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  // Pad 39A (Apollo by the Numbers); insertion (LVFE Table 4-5)
  const [x, y, z] = geodeticToBodyFixed(
    toRad(28.608422),
    toRad(-80.604133),
    0,
    A,
    E2
  );
  const R = Math.hypot(x, y, z);
  const lat = Math.atan2(z, Math.hypot(x, y)) as Radians;
  const [xi, yi, zi] = geodeticToBodyFixed(
    toRad(32.672),
    toRad(-52.694),
    191_100,
    A,
    E2
  );
  const r = Math.hypot(xi, yi, zi);
  const insertion = Math.atan2(zi, Math.hypot(xi, yi)) as Radians;
  // Vehicle masses, kg (LVFE Table 20-9)
  const sIC = rocketDeltaVFromIsp(264, 2_899_008, 827_292);
  const sII = rocketDeltaVFromIsp(423.2, 658_363, 213_888);
  const sIVB = rocketDeltaVFromIsp(428.7, 166_571, 135_182);

  test('converts the sources', () => {
    assert.equal(group(6_391_218 * LB), '2 899 008');
    assert.equal(group(1_823_866 * LB), '827 292');
    assert.equal(group(1_451_441 * LB), '658 363');
    assert.equal(group(471_542 * LB), '213 888');
    assert.equal(group(367_227 * LB), '166 571');
    assert.equal(group(298_026 * LB), '135 182');
    assert.equal(group(295_521 * LB), '134 046');
    assert.equal(group(139_309 * LB), '63 189');
    assert.equal(((735.2 * 47.880259) / 1000).toFixed(1), '35.2');
    assert.equal(Math.round((201_061 * 4.448222) / 100) * 100, 894_400);
    assert.equal((25_567.9 * FT).toFixed(1), '7793.1');
    assert.equal(Math.round(10_441 * FT), 3182);
  });

  test('says less than 5% reached orbit, 2 938 t at ignition, 135 t in orbit', () => {
    assert.equal(Math.round((6_477_875 * LB) / 1000), 2938);
    assert.ok(135_182 / 2_938_315 < 0.05);
    assert.equal(Math.round(135_182 / 1000), 135);
    assert.equal(Math.round(2_899_008 / 1000), 2899);
  });

  test('1. puts Pad 39A 6 373 266 m out at 28.447° geocentric, moving east at 408.6 m/s, 5% of orbital speed', () => {
    assert.equal(Math.round(R), 6_373_266);
    assert.equal(toDeg(lat).toFixed(3), '28.447');

    const east = surfaceRotationSpeed(lat, R, 7.292115e-5);

    assert.equal(east.toFixed(1), '408.6');
    assert.equal(Math.round((100 * east) / 7793.1), 5);
  });

  test('2. lifts off at T/W 1.19', () => {
    assert.equal(
      thrustToWeight(7_610_000 * 4.448222, 2_899_008, g0).toFixed(2),
      '1.19'
    );
  });

  test('3. gets 3 246, 4 666 and 878 m/s from the stages, 8 790 in all, against 7 383 gained', () => {
    assert.equal(group(sIC), '3 246');
    assert.equal(group(sII), '4 666');
    assert.equal(Math.round(sIVB), 878);
    assert.equal(group(sIC + sII + sIVB), '8 790');

    const gains = [2764.1 - 408.6, 6916.1 - 2764.1, 7791.2 - 6916.1];

    assert.deepEqual(
      gains.map((g) => Math.round(g)),
      [2356, 4152, 875]
    );
    assert.equal(Math.round(gains[0] / 5) * 5, 2355);
    assert.equal(group(gains.reduce((sum, g) => sum + g, 0)), '7 383');
  });

  test('3. loses about 1.4 km/s, nearly all in the first two stages', () => {
    const lost = sIC + sII + sIVB - (7791.2 - 408.6);

    assert.equal((lost / 1000).toFixed(1), '1.4');
    assert.ok(sIVB - (7791.2 - 6916.1) < 0.01 * lost);
    assert.equal(Math.round(90 - 72.058), 18);
  });

  test('4. enters orbit 6 563 041 m out at 32.502°, 184.9 km above a 6 378.165 km sphere', () => {
    assert.equal(Math.round(r), 6_563_041);
    assert.equal(toDeg(insertion).toFixed(3), '32.502');
    assert.equal(((r - 6_378_165) / 1000).toFixed(1), '184.9');
    assert.ok(r - 6_378_165 > 183_200 && r - 6_378_165 < 186_000);
  });

  test('4. orbits at 7 793.2 m/s circular, 88.18 min', () => {
    assert.equal(circularSpeed(r, MU_EARTH).toFixed(1), '7793.2');
    assert.equal(
      (keplerPeriod(6_378_165 + 184_600, MU_EARTH) / 60).toFixed(2),
      '88.18'
    );
    assert.equal((186.0 + 183.2) / 2, 184.6);
  });

  test('4. inclines the orbit 32.521°; 32.69° geodetic, 32.516° from the surface point', () => {
    assert.equal(
      toDeg(inclinationFromLaunchAzimuth(insertion, toRad(88.848))).toFixed(3),
      '32.521'
    );
    assert.equal(
      toDeg(inclinationFromLaunchAzimuth(toRad(32.672), toRad(88.848))).toFixed(
        2
      ),
      '32.69'
    );

    const [xs, ys, zs] = geodeticToBodyFixed(
      toRad(32.672),
      0 as Radians,
      0,
      A,
      E2
    );
    const below = Math.atan2(zs, Math.hypot(xs, ys));

    assert.equal(toDeg(below).toFixed(3), '32.497');
    assert.equal(
      toDeg(
        inclinationFromLaunchAzimuth(below as Radians, toRad(88.848))
      ).toFixed(3),
      '32.516'
    );
  });

  test('4. aims 73.53° inertial from the pad, 72.6° over the ground, within 0.6° of 72.058°', () => {
    const { northbound } = launchAzimuthForInclination(lat, toRad(32.521));

    assert.equal(toDeg(northbound).toFixed(2), '73.53');

    const ground = toDeg(rotatingLaunchAzimuth(northbound, 7793.1, 408.6));

    assert.equal(ground.toFixed(1), '72.6');
    assert.ok(Math.abs(ground - 72.058) < 0.6);
  });

  test('5. lights TLI after 1¾ orbits; 3 162 m/s in 333 s, against 3 182 m/s in 347.3 s', () => {
    const orbits = (9856.2 - 709.34) / (88.18 * 60);

    assert.equal(Math.round(orbits * 4) / 4, 1.75);

    const tli = rocketDeltaVFromIsp(428.7, 134_046, 63_189);

    assert.equal(group(tli), '3 162');
    assert.ok((10_441 * FT - tli) / (10_441 * FT) < 0.01);

    const t = burnTime(134_046, tli, 894_400, 428.7);

    assert.equal(Math.round(t), 333);
    assert.equal(Math.round((100 * (347.3 - t)) / 347.3), 4);
  });
});

describe('II. Coasting to the Moon (tutorial)', () => {
  const MU_EARTH = 3.986004418e14;
  const R_EARTH = 6_378_166;
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;
  const deg = Math.PI / 180;
  const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
  // Translunar injection, cutoff + 10 s (Apollo by the Numbers; LVFE Table 10-6)
  const r = 6_712_602;
  const v = 10_834.3;
  const fpa = 7.367 * deg;
  const tli = stateToElements(
    [r, 0, 0],
    [v * Math.sin(fpa), v * Math.cos(fpa), 0],
    MU_EARTH
  );
  const n = meanMotion(tli.a, MU_EARTH);
  const M0 = trueToMeanAnomaly(tli.nu, tli.e);
  const p = tli.a * (1 - tli.e ** 2);
  const t0 = hms(2, 50, 13.03);
  const radiusAt = (t: number) => {
    const M = (M0 + n * (t - t0)) as Radians;
    const nu = eccentricToTrueAnomaly(solveKepler(M, tli.e), tli.e);

    return p / (1 + tli.e * Math.cos(nu));
  };
  const speedAt = (radius: number) =>
    Math.sqrt(v ** 2 + 2 * MU_EARTH * (1 / radius - 1 / r));
  const vInf = 1080;
  const a = hyperbolicSemiMajorAxis(vInf, MU_MOON);
  const aim = (rp: number) => {
    const e = hyperbolicEccentricity(vInf, rp, MU_MOON);

    return -a * Math.sqrt(e ** 2 - 1);
  };

  test('converts the sources', () => {
    assert.equal(Math.round(180.581 * 1.852 * 10) / 10, 334.4);
    assert.equal(Math.round(186_436 * 1852), 345_279_472);
    assert.equal(Math.round(61.5 * 1.852 * 10) / 10, 113.9);
    assert.equal(Math.round(180.8 * 1.852), 335);
    assert.equal((20.9 * FT).toFixed(2), '6.37');
    assert.equal((2990 * FT).toFixed(1), '911.4');
    assert.equal((3775 * FT).toFixed(1), '1150.6');
    assert.equal(Math.round(10_441 * FT), 3182);
  });

  test('1. leaves on an ellipse: a 288 889 km, e 0.977, out to 571 177 km, 17.9 days round', () => {
    assert.equal(group(tli.a / 1000), '288 889');
    assert.equal(tli.e.toFixed(3), '0.977');
    assert.equal(group((tli.a * (1 + tli.e)) / 1000), '571 177');
    assert.ok(tli.a * (1 + tli.e) > 1.4 * 384_400_000);
    assert.equal((keplerPeriod(tli.a, MU_EARTH) / 86_400).toFixed(1), '17.9');
  });

  test('2. docks 8 min 41 s after separating, 9 850 km up at 6.91 km/s', () => {
    const gap = hms(3, 24, 3.7) - hms(3, 15, 23);

    assert.equal(
      `${Math.floor(gap / 60)} min ${Math.round(gap % 60)} s`,
      '8 min 41 s'
    );

    const docking = radiusAt(hms(3, 24, 3.7));

    assert.equal(group(docking / 1000), '16 231');
    assert.equal(Math.round((docking - R_EARTH) / 50_000) * 50, 9850);
    assert.equal((speedAt(docking) / 1000).toFixed(2), '6.91');
  });

  test('3. is 210 000 km out at 1.55 km/s at the MCC; reaches the sphere in 55.6 h at 964 m/s, against 58.8 h', () => {
    const atMcc = radiusAt(hms(26, 44, 58.64));

    assert.equal(Math.round(atMcc / 1e7) * 10_000, 210_000);
    assert.equal((speedAt(atMcc) / 1000).toFixed(2), '1.55');

    const rSoi = 345_279_000;
    const nuSoi = Math.acos((p / rSoi - 1) / tli.e) as Radians;
    const toSoi = (trueToMeanAnomaly(nuSoi, tli.e) - M0) / n;

    assert.equal((toSoi / 3600).toFixed(1), '55.6');
    assert.equal(Math.round(speedAt(rSoi)), 964);
    assert.equal(((hms(61, 39, 55) - t0) / 3600).toFixed(1), '58.8');
  });

  test('4. aims 4 358 km out for 114 km, 4 198 km to hit, a 160 km corridor', () => {
    assert.equal(group(a / 1000), '-4 203');
    assert.equal(group(aim(R_MOON + 113_900) / 1000), '4 358');
    assert.equal(group(aim(R_MOON) / 1000), '4 198');
    assert.equal(Math.round((aim(R_MOON + 113_900) - aim(R_MOON)) / 1000), 160);
    assert.equal((aim(R_MOON) / R_MOON).toFixed(1), '2.4');
  });

  test('4. moves the aim 302 km, from 4 660 km, 49 hours before LOI', () => {
    const before = aim(R_MOON + 180.8 * 1852);

    assert.equal(group(before / 1000), '4 660');
    assert.equal(Math.round((before - aim(R_MOON + 61.5 * 1852)) / 1000), 302);
    assert.equal(
      Math.round((hms(75, 49, 50.37) - hms(26, 44, 58.64)) / 3600),
      49
    );
    assert.ok(radiusAt(hms(26, 44, 58.64)) > 200_000_000);
  });

  test('4. the aim plot turns the flown path 88° and passes at 2.54 km/s', () => {
    const rp = R_MOON + 113_900;
    const e = Math.sqrt(1 + (aim(rp) / a) ** 2);

    assert.equal(e.toFixed(2), '1.44');
    assert.equal(
      Math.round(((2 * asymptoteTrueAnomaly(e) - Math.PI) * 180) / Math.PI),
      88
    );
    assert.equal(
      (hyperbolicPeriapsisSpeed(vInf, rp, MU_MOON) / 1000).toFixed(2),
      '2.54'
    );
  });

  test('5. puts the sphere at 66 169 km; fits 911 and 1 151 m/s at 73°', () => {
    assert.equal(
      group(sphereOfInfluenceRadius(384_400_000, 7.342e22, 5.9722e24) / 1000),
      '66 169'
    );

    const vMoon = circularSpeed(384_400_000, MU_EARTH);

    assert.equal(Math.round(vMoon), 1018);
    assert.equal((vMoon / 1000).toFixed(2), '1.02');

    const vEarth = 911.4;
    const vRel = 1150.6;
    const angle =
      (Math.acos(
        (vEarth ** 2 + vMoon ** 2 - vRel ** 2) / (2 * vEarth * vMoon)
      ) *
        180) /
      Math.PI;

    assert.equal(Math.round(angle), 73);
  });
});

describe('III. Down to the surface (tutorial)', () => {
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;
  const NM = 1852;
  const rp = R_MOON + 61.5 * NM;
  const vp = 8334 * FT;
  const vEsc = escapeSpeed(rp, MU_MOON);
  const vInf = Math.sqrt(vp ** 2 - vEsc ** 2);
  const low = R_MOON + 60.0 * NM;
  const high = R_MOON + 169.7 * NM;
  const a = (low + high) / 2;
  const columbia = R_MOON + 60 * NM;
  const doi = hohmannTransfer(columbia, R_MOON + 50_000 * FT, MU_MOON);
  const gMoon = MU_MOON / R_MOON ** 2;
  const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
  const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

  test('converts the sources', () => {
    assert.equal((61.5 * 1.852).toFixed(1), '113.9');
    assert.equal(group(vp), '2 540');
    assert.equal(Math.round(2917.5 * FT), 889);
    assert.equal((2917.5 * FT).toFixed(1), '889.3');
    assert.equal(group(96_061.6 * LB), '43 573');
    assert.equal(group(20_500 * 4.4482216152605), '91 189');
    assert.equal((158.8 * FT).toFixed(1), '48.4');
    assert.equal((76.4 * FT).toFixed(1), '23.3');
    assert.equal(((50_000 * FT) / 1000).toFixed(1), '15.2');
    assert.equal(((49_376 * FT) / 1000).toFixed(2), '15.05');
    assert.equal(group(33_401.6 * LB), '15 151');
    assert.equal(group(10_500 * 4.4482216152605), '46 706');
    assert.equal(group(6930 * FT), '2 112');
    assert.equal(group(16_153.2 * LB), '7 327');
    assert.equal(((22_500 * FT) / 1000).toFixed(1), '6.9');
    assert.equal((167.57 * 0.0254).toFixed(3), '4.256');
    assert.equal((213.5 - 72.84).toFixed(1), '140.7');
    assert.equal(((213.5 - 72.84) * 0.0254).toFixed(3), '3.573');
  });

  test('burns for six minutes, and descends for twelve and a half', () => {
    assert.equal(Math.round(357.5 / 60), 6);

    const descent = hms(102, 45, 39.9) - hms(102, 33, 5);

    assert.equal(Math.round(descent / 30) / 2, 12.5);
  });

  test('1. arrives at 2 540 m/s, 239 m/s over the 2 301 m/s escape speed: v∞ 1 075 m/s, e 1.44', () => {
    assert.equal(group(vEsc), '2 301');
    assert.equal(Math.round(vp - vEsc), 239);
    assert.equal(group(vInf), '1 075');
    assert.equal(hyperbolicEccentricity(vInf, rp, MU_MOON).toFixed(2), '1.44');
  });

  test('2. brakes by 871 m/s into a 128.8 min orbit, 2% under the flown 889 m/s', () => {
    const loi1 =
      hyperbolicPeriapsisSpeed(vInf, low, MU_MOON) -
      visVivaSpeed(low, a, MU_MOON);

    assert.equal(Math.round(loi1), 871);
    assert.equal(Math.round((100 * (2917.5 * FT - loi1)) / loi1), 2);
    assert.equal((keplerPeriod(a, MU_MOON) / 60).toFixed(1), '128.8');
  });

  test('2. predicts a 370 s burn, and loses 10 897 kg, a quarter of the mass', () => {
    assert.equal(Math.round(burnTime(43_573, 889.3, 91_189, 316.7)), 370);

    const used = (96_061.6 - 72_037.6) * LB;

    assert.equal(group(used), '10 897');
    assert.equal((used / (96_061.6 * LB)).toFixed(2), '0.25');
  });

  test('3. rounds the orbit off to 100 × 122 km, 118.8 min a revolution', () => {
    assert.equal(Math.round(53.8), 54);
    assert.equal(Math.round(65.7), 66);
    assert.equal(Math.round(53.8 * 1.852), 100);
    assert.equal(Math.round(65.7 * 1.852), 122);

    const rev = keplerPeriod(R_MOON + ((53.8 + 65.7) / 2) * NM, MU_MOON) / 60;

    assert.equal(rev.toFixed(1), '118.8');
    assert.equal(Math.round(rev / 60), 2);
  });

  test('4. lowers the orbit with 21.8 m/s, and reaches the low point in 57.1 min, 17 s after PDI', () => {
    assert.equal(doi.dv1.toFixed(1), '21.8');
    assert.equal((doi.tTransfer / 60).toFixed(1), '57.1');

    const coast = hms(102, 33, 5) - hms(101, 36, 14);

    assert.equal(
      `${Math.floor(coast / 60)} min ${coast % 60} s`,
      '56 min 51 s'
    );
    assert.equal(Math.round(doi.tTransfer - coast), 17);
  });

  test('5. cancels 1 695 m/s at T/W 1.76 (0.29 on Earth), 417 m/s under the flown 2 112 m/s', () => {
    const vPdi = visVivaSpeed(R_MOON + 49_376 * FT, doi.at, MU_MOON);
    const full = 0.925 * 46_706;

    assert.equal(group(vPdi), '1 695');
    assert.equal(gMoon.toFixed(2), '1.62');
    assert.equal(thrustToWeight(full, 15_151, gMoon).toFixed(2), '1.76');
    assert.equal(thrustToWeight(full, 15_151, 9.80665).toFixed(2), '0.29');
    assert.equal(Math.round(6930 * FT - vPdi), 417);
  });

  test('5. lands at 11.9 kN, a quarter of the rated thrust, with about 46 s left', () => {
    const weight = 16_153.2 * LB * gMoon;

    assert.equal((weight / 1000).toFixed(1), '11.9');
    assert.equal((weight / 46_706).toFixed(2), '0.25');

    const sinceLight = hms(102, 45, 39.9) - hms(102, 44, 30.4);

    assert.equal(sinceLight.toFixed(1), '69.5');
    assert.equal(Math.floor(116 - sinceLight), 46);
    assert.ok(116 - sinceLight < 60);
  });

  test('6. lands 6.65 km from the target', () => {
    const miss = greatCircleDistance(
      toRad(0.691),
      toRad(23.72),
      toRad(0.647),
      toRad(23.505),
      R_MOON
    );

    assert.equal((miss / 1000).toFixed(2), '6.65');
    assert.equal(Math.round(39.371), 39);
    assert.equal((23.505).toFixed(1), '23.5');
  });

  test('6. keeps Eagle in Columbia’s view for 13.2 of 118.9 min', () => {
    const s = horizonSurfaceDistance(60 * NM, R_MOON);
    const T = keplerPeriod(columbia, MU_MOON);
    const inView = ((2 * s) / R_MOON / (2 * Math.PI)) * T;

    assert.equal(Math.round(s / 1000), 605);
    assert.equal((T / 60).toFixed(1), '118.9');
    assert.equal((inView / 60).toFixed(1), '13.2');
  });

  test('7. opens a 5–14° landing window for less than a day a month', () => {
    const climb = 360 / (29.53 * 24); // ° an hour, one lunar day a synodic month

    assert.equal(climb.toFixed(1), '0.5');
    assert.ok((14 - 5) / climb < 24);
  });

  test('try it: one burn into a 60 n mi circle costs 913 m/s, against 938 m/s flown in two', () => {
    const once =
      hyperbolicPeriapsisSpeed(vInf, low, MU_MOON) -
      circularSpeed(low, MU_MOON);

    assert.equal(Math.round(once), 913);
    assert.equal(Math.round((2917.5 + 158.8) * FT), 938);
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

describe('V. Coming home (tutorial)', () => {
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;
  const MU_EARTH = 3.986004418e14;
  const R_EARTH = 6_378_166;
  const NM = 1852;
  const deg = Math.PI / 180;
  const hms = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
  // TEI cutoff (Mission Report Table 7-II)
  const r = R_MOON + 58.1 * NM;
  const v = 8589 * FT;
  const fpa = 5.13 * deg;
  const tei = stateToElements(
    [r, 0, 0],
    [v * Math.sin(fpa), v * Math.cos(fpa), 0],
    MU_MOON
  );
  // Entry interface (Mission Report Table 7-VII)
  const rEI = R_EARTH + 400_000 * FT;
  const vEI = 11_032;
  const gamma = -6.48 * deg;
  const home = stateToElements(
    [rEI, 0, 0],
    [vEI * Math.sin(gamma), vEI * Math.cos(gamma), 0],
    MU_EARTH
  );
  const H = 7200;
  const rho0 = 1.225;
  const beta = ballisticCoefficient(5486.4, 1.2891, 12.017);

  test('converts the sources', () => {
    assert.equal(group(36_965.7 * LB), '16 767');
    assert.equal(group(26_792.7 * LB), '12 153');
    assert.equal((3279 * FT).toFixed(1), '999.4');
    assert.equal(Math.round(20_500 * 4.448222), 91_189);
    assert.equal((58.1 * 1.852).toFixed(1), '107.6');
    assert.equal(v.toFixed(1), '2617.9');
    assert.equal(Math.round(36_194.4 * FT), vEI);
    assert.equal((4.8 * FT).toFixed(2), '1.46');
    assert.equal((12_095.5 * LB).toFixed(1), '5486.4');
    assert.equal((129.35 * FT * FT).toFixed(3), '12.017');
    assert.equal((183.5 * 0.0254).toFixed(3), '4.661');
    assert.equal((10_873 * LB).toFixed(1), '4931.9');
    assert.equal(Math.round(1497 * 1.852), 2772);
    assert.equal(Math.round(1.69 * 1.852 * 10) / 10, 3.1);
    assert.equal((32 * FT).toFixed(2), '9.75');
  });

  test('takes about sixty hours home, 15½ minutes from entry to splashdown', () => {
    assert.equal(
      Math.round((hms(195, 3, 5.7) - hms(135, 23, 42.3)) / 3600),
      60
    );
    assert.equal(
      Math.round((hms(195, 18, 35) - hms(195, 3, 5.7)) / 30) / 2,
      15.5
    );
    assert.equal(hms(195, 18, 35), ((8 * 24 + 3) * 60 + 18) * 60 + 35);
  });

  test('1. backs out a 316.7 s specific impulse; burns 157 s against 151.4 s', () => {
    const m0 = 16_767;
    const dv = 999.4;
    const Isp = dv / (g0 * Math.log(m0 / 12_153));

    assert.equal(Isp.toFixed(1), '316.7');

    const t = burnTime(m0, dv, 91_189, Isp);

    assert.equal(Math.round(t), 157);
    assert.equal(Math.round((100 * (t - 151.4)) / t), 4);
  });

  test('2. leaves on a hyperbola: a -3 186 km, e 1.58, 1.24 km/s, 8.4° past a 95.5 km low point', () => {
    assert.equal(group(tei.a / 1000), '-3 186');
    assert.equal(tei.e.toFixed(2), '1.58');
    assert.equal((Math.sqrt(-MU_MOON / tei.a) / 1000).toFixed(2), '1.24');
    assert.equal((tei.nu / deg).toFixed(1), '8.4');
    assert.equal(((tei.a * (1 - tei.e) - R_MOON) / 1000).toFixed(1), '95.5');
  });

  test('2. reaches the edge of the Moon’s sphere in 12.3 h, against 12.7 h flown', () => {
    assert.equal(Math.round((33_800 * 1.852) / 100) * 100, 62_600);

    const p = tei.a * (1 - tei.e ** 2);
    const soi = 62_600_000;
    const nuSoi = Math.acos((p / soi - 1) / tei.e) as Radians;
    const t = hyperbolicTimeOfFlight(tei.nu, nuSoi, tei.e, tei.a, MU_MOON);

    assert.equal((t / 3600).toFixed(1), '12.3');
    assert.equal(
      ((hms(148, 7, 23) - (hms(135, 23, 42.3) + 151.4)) / 3600).toFixed(1),
      '12.7'
    );
  });

  test('3. enters at 99.6% of escape speed on an orbit with a 38.5 km low point', () => {
    assert.equal((rEI / 1000 - R_EARTH / 1000).toFixed(1), '121.9');
    assert.equal(
      ((100 * vEI) / Math.sqrt((2 * MU_EARTH) / rEI)).toFixed(1),
      '99.6'
    );
    assert.equal(group(home.a / 1000), '424 204');
    assert.equal(home.e.toFixed(4), '0.9849');
    assert.equal(((home.a * (1 - home.e) - R_EARTH) / 1000).toFixed(1), '38.5');
  });

  test('3. falls from 322 000 km in 44.8 h, against 46.9 h flown, at 1.24 km/s', () => {
    assert.equal(Math.round((174_000 * 1.852) / 1000) * 1000, 322_000);

    const pHome = home.a * (1 - home.e ** 2);
    const rEdge = 322_000_000;
    const nuEdge = (2 * Math.PI -
      Math.acos((pHome / rEdge - 1) / home.e)) as Radians;
    const fall =
      (trueToMeanAnomaly(home.nu, home.e) - trueToMeanAnomaly(nuEdge, home.e)) /
      meanMotion(home.a, MU_EARTH);

    assert.equal((fall / 3600).toFixed(1), '44.8');
    assert.equal(
      ((hms(195, 3, 5.7) - hms(148, 7, 23)) / 3600).toFixed(1),
      '46.9'
    );

    const atEdge = Math.sqrt(vEI ** 2 + 2 * MU_EARTH * (1 / rEdge - 1 / rEI));

    assert.equal((atEdge / 1000).toFixed(2), '1.24');
    assert.equal(((3994 * FT) / 1000).toFixed(2), '1.22');
    assert.equal(Math.round((hms(148, 21, 0) - hms(148, 7, 23)) / 60), 14);
  });

  test('4. peaks at 35.8 g ballistic, 38.9 km up at 354 kg/m², against 6.56 g flown', () => {
    const peak = ballisticPeakDeceleration(vEI, gamma, H) / g0;

    assert.equal(peak.toFixed(1), '35.8');
    assert.ok(peak > 5 * 6.56);
    assert.equal(Math.round(beta), 354);

    const where = ballisticPeakDecelerationAltitude(gamma, beta, rho0, H);

    assert.equal((where / 1000).toFixed(1), '38.9');
    assert.equal(
      (ballisticEntrySpeed(where, vEI, gamma, beta, rho0, H) / 1000).toFixed(2),
      '6.69'
    );
  });

  test('4. converts the flown peak heating: 286 BTU/ft²/s is 3.25 MW/m²', () => {
    assert.equal(((286 * 1055.05585) / (FT * FT) / 1e6).toFixed(2), '3.25');
  });

  test('5. splashes down at 8.2 m/s (30 km/h) on three mains, 10.1 m/s on two', () => {
    const canopy = (Math.PI / 4) * (83.5 * FT) ** 2;
    const Cd = (4200 * FT * FT) / canopy;
    const three = terminalVelocity(4931.9, g0, 1.225, Cd, 3 * canopy);

    assert.equal(Math.round(canopy), 509);
    assert.equal(Cd.toFixed(2), '0.77');
    assert.equal(three.toFixed(1), '8.2');
    assert.equal(Math.round(three * 3.6), 30);
    assert.ok(three < 32 * FT);
    assert.equal(
      terminalVelocity(4931.9, g0, 1.225, Cd, 2 * canopy).toFixed(1),
      '10.1'
    );
  });
});
