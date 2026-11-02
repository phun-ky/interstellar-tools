import { MOONS, PLANETS } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { asymptoteTrueAnomaly } from '../categories/anomalies/asymptote-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { norm2pi } from '../categories/helpers/misc.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { thrustToWeight } from '../categories/manoeuvres/thrust-to-weight.js';
import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { hyperbolicEccentricity } from '../categories/orbits/hyperbolic-eccentricity.js';
import { hyperbolicSemiMajorAxis } from '../categories/orbits/hyperbolic-semi-major-axis.js';
import { hyperbolicTimeOfFlight } from '../categories/orbits/hyperbolic-time-of-flight.js';
import { inclinationFromLaunchAzimuth } from '../categories/orbits/inclination-from-launch-azimuth.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { launchAzimuthForInclination } from '../categories/orbits/launch-azimuth-for-inclination.js';
import { meanMotion } from '../categories/orbits/mean-motion.js';
import { periApoapsisRadii } from '../categories/orbits/peri-apoapsis-radii.js';
import { rotatingLaunchAzimuth } from '../categories/orbits/rotating-launch-azimuth.js';
import { specificMechanicalEnergy } from '../categories/orbits/specific-mechanical-energy.js';
import { synodicPeriod } from '../categories/orbits/synodic-period.js';
import { stateToElements } from '../categories/orbits/state-to-elements.js';
import { sphereOfInfluenceRadius } from '../categories/orbits/sphere-of-influence-radius.js';
import { surfaceRotationSpeed } from '../categories/orbits/surface-rotation-speed.js';
import { visVivaSpeed } from '../categories/orbits/vis-viva-speed.js';

// Every number shown in an "In practice" box, so the docs can't drift from the
// code. Each expected string is the readout exactly as the box prints it.

const MU_EARTH = 3.986004418e14; // m³/s²
const MU_SUN = 1.32712440018e20; // m³/s²
const R_EARTH = 6.371e6; // m, mean radius
const ISS = R_EARTH + 420e3; // m
const AU = 1.495978707e11; // m

const km = (m: number) => m / 1e3;
const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');

describe('In practice values', () => {
  test('circularSpeed: the ISS at 7.66 km/s, about 27 600 km/h, every 93 minutes', () => {
    const v = circularSpeed(ISS, MU_EARTH);

    assert.equal(km(v).toFixed(2), '7.66');
    assert.equal(Math.round((v * 3.6) / 100) * 100, 27_600);
    assert.equal(Math.round(keplerPeriod(ISS, MU_EARTH) / 60), 93);
  });

  test('escapeSpeed: 11.19 km/s at the surface, √2 times 7.91 km/s', () => {
    assert.equal(km(escapeSpeed(R_EARTH, MU_EARTH)).toFixed(2), '11.19');
    assert.equal(km(circularSpeed(R_EARTH, MU_EARTH)).toFixed(2), '7.91');
  });

  test('visVivaSpeed: 32.73 km/s leaving for Mars, 2.95 km/s above Earth', () => {
    const v = visVivaSpeed(AU, ((1 + 1.524) / 2) * AU, MU_SUN);
    const earth = circularSpeed(AU, MU_SUN);

    assert.equal(km(v).toFixed(2), '32.73');
    assert.equal(km(earth).toFixed(2), '29.78');
    assert.equal(km(v - earth).toFixed(2), '2.95');
  });

  test('keplerPeriod: 23.93 h at geostationary radius', () => {
    assert.equal((keplerPeriod(42164e3, MU_EARTH) / 3600).toFixed(2), '23.93');
  });

  test('meanMotion: 0.001128 rad/s, 15.51 orbits/day for the ISS', () => {
    const n = meanMotion(ISS, MU_EARTH);

    assert.equal(n.toFixed(6), '0.001128');
    assert.equal(((n * 86_400) / (2 * Math.PI)).toFixed(2), '15.51');
  });

  test('periApoapsisRadii: Molniya at 545 km / 39 913 km altitude, a 12 hour orbit', () => {
    const { rp, ra } = periApoapsisRadii(26600e3, 0.74);

    assert.equal(group(km(rp - R_EARTH)), '545');
    assert.equal(group(km(ra! - R_EARTH)), '39 913');
    assert.equal(Math.round(keplerPeriod(26600e3, MU_EARTH) / 3600), 12);
  });

  test('specificMechanicalEnergy: -29.35 MJ/kg for the ISS orbit', () => {
    const energy = specificMechanicalEnergy(
      circularSpeed(ISS, MU_EARTH),
      ISS,
      MU_EARTH
    );

    assert.equal((energy / 1e6).toFixed(2), '-29.35');
  });

  test("sphereOfInfluenceRadius: Earth's at 925 000 km, with the Moon inside", () => {
    const soi = km(sphereOfInfluenceRadius(AU, 5.972e24, 1.989e30));

    assert.equal(Math.round(soi / 1000) * 1000, 925_000);
    assert.ok(384_400 < soi);
  });
});

// The formulas are spherical, so they take geocentric latitudes. Pad 39A is at
// 28.608422° N geodetic (Apollo by the Numbers); Apollo 11 entered orbit at
// 32.672° N geodetic, heading 88.848°, into an orbit inclined 32.521° (AS-506
// flight evaluation report, Table 4-5). Earth: WGS 84, sidereal rotation rate.
describe('In practice values: launch site geometry', () => {
  const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const OMEGA = 7.292115e-5; // rad/s
  const A = 6_378_137; // m, equatorial radius
  const F = 1 / 298.257223563;
  const B = A * (1 - F);
  const geocentric = (geodeticDeg: number) =>
    Math.atan((1 - F) ** 2 * Math.tan(toRad(geodeticDeg))) as Radians;
  const radiusAt = (lat: number) =>
    (A * B) / Math.hypot(B * Math.cos(lat), A * Math.sin(lat));
  const PAD_39A = geocentric(28.608422);
  const R_PAD = radiusAt(PAD_39A);

  test('converts Pad 39A to 28.447° N geocentric, 6 373.3 km from the centre', () => {
    assert.equal(toDeg(PAD_39A).toFixed(3), '28.447');
    assert.equal((R_PAD / 1000).toFixed(1), '6373.3');
  });

  test('surfaceRotationSpeed: 408.6 m/s at Pad 39A, 465.1 at the equator, 463 at Kourou', () => {
    assert.equal(
      surfaceRotationSpeed(PAD_39A, R_PAD, OMEGA).toFixed(1),
      '408.6'
    );
    assert.equal(
      surfaceRotationSpeed(toRad(28.447), 6_373_266, OMEGA).toFixed(1),
      '408.6'
    );
    assert.equal(surfaceRotationSpeed(toRad(0), A, OMEGA).toFixed(1), '465.1');

    const kourou = geocentric(5.236);

    assert.equal(
      Math.round(surfaceRotationSpeed(kourou, radiusAt(kourou), OMEGA)),
      463
    );
  });

  test('inclinationFromLaunchAzimuth: 32.52° at Apollo 11’s insertion, 32.69° with the geodetic latitude', () => {
    const insertion = geocentric(32.672);

    assert.equal(toDeg(insertion).toFixed(3), '32.497');
    assert.equal(
      toDeg(inclinationFromLaunchAzimuth(insertion, toRad(88.848))).toFixed(2),
      '32.52'
    );
    assert.equal(
      toDeg(inclinationFromLaunchAzimuth(toRad(32.497), toRad(88.848))).toFixed(
        2
      ),
      '32.52'
    );
    assert.equal(
      toDeg(inclinationFromLaunchAzimuth(toRad(32.672), toRad(88.848))).toFixed(
        2
      ),
      '32.69'
    );
  });

  test('launchAzimuthForInclination: 44.9° to the ISS, 42.7° over the ground', () => {
    const { northbound } = launchAzimuthForInclination(PAD_39A, toRad(51.64));
    const v = circularSpeed(A + 200e3, MU_EARTH);
    const vRot = surfaceRotationSpeed(PAD_39A, R_PAD, OMEGA);

    assert.equal(Math.round(vRot), 409);
    assert.equal(toDeg(northbound).toFixed(1), '44.9');
    assert.equal(
      toDeg(
        launchAzimuthForInclination(toRad(28.447), toRad(51.64)).northbound
      ).toFixed(1),
      '44.9'
    );
    assert.equal(
      toDeg(rotatingLaunchAzimuth(northbound, v, vRot)).toFixed(1),
      '42.7'
    );
  });
});

// Apollo 11 at trans-lunar injection: 180.581 n mi above a 6378.166 km
// spherical Earth, 35 545.6 ft/s, 7.367° flight-path angle; e 0.97696
// (Apollo by the Numbers; AS-506 flight evaluation report, Table 10-6)
describe('In practice values: state vectors and orbital elements', () => {
  test('stateToElements: e = 0.977 at trans-lunar injection', () => {
    const r = 6_378_166 + 180.581 * 1852;
    const v = 35_545.6 * 0.3048;
    const gamma = (7.367 * Math.PI) / 180;

    assert.equal(Math.round(r), 6_712_602);
    assert.equal(v.toFixed(1), '10834.3');

    const { e } = stateToElements(
      [6_712_602, 0, 0],
      [10_834.3 * Math.sin(gamma), 10_834.3 * Math.cos(gamma), 0],
      MU_EARTH
    );

    assert.equal(e.toFixed(3), '0.977');
    assert.equal(e.toFixed(5), '0.97715');
  });
});

// Apollo 11 entering the Moon's sphere of influence: 3775 ft/s relative to the
// Moon, 33 823 n mi out (Mission Director's Summary Report); closest approach
// 61.5 n mi up after the midcourse correction (Mission Report Table 7-III);
// from entry at 061:39:55 to LOI-1 ignition at 075:49:50 (Apollo by the Numbers)
describe('In practice values: hyperbolas', () => {
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;

  test('derives v∞ ≈ 1.08 km/s and the 62 640 km entry distance', () => {
    const v = 3775 * 0.3048;
    const r = 33_823 * 1852;

    assert.equal(Math.round(r / 1000), 62_640);
    assert.equal(
      (Math.sqrt(v * v - (2 * MU_MOON) / r) / 1000).toFixed(2),
      '1.08'
    );
    assert.equal(Math.round(61.5 * 1.852 * 10) / 10, 113.9);
  });

  test('hyperbolicSemiMajorAxis: -4 203 km', () => {
    assert.equal(
      group(hyperbolicSemiMajorAxis(1080, MU_MOON) / 1000),
      '-4 203'
    );
  });

  test('hyperbolicEccentricity: 1.44', () => {
    assert.equal(
      hyperbolicEccentricity(1080, R_MOON + 113_900, MU_MOON).toFixed(2),
      '1.44'
    );
  });

  test('asymptoteTrueAnomaly: 134.0°, a turn of 88°', () => {
    const nuInf = asymptoteTrueAnomaly(1.44);

    assert.equal(((nuInf * 180) / Math.PI).toFixed(1), '134.0');
    assert.equal(Math.round(((2 * nuInf - Math.PI) * 180) / Math.PI), 88);
  });

  test('hyperbolicTimeOfFlight: 13.8 h, against 14 h 10 min to LOI ignition', () => {
    const e = 1.44;
    const a = -4_203_000;
    const p = a * (1 - e * e);
    const nuSoi = -Math.acos((p / 62_640_000 - 1) / e) as Radians;
    const t = hyperbolicTimeOfFlight(nuSoi, 0 as Radians, e, a, MU_MOON);

    assert.equal((t / 3600).toFixed(1), '13.8');
    assert.equal(Math.round(t / 100) * 100, 49_600);

    const flown = 75 * 3600 + 49 * 60 + 50 - (61 * 3600 + 39 * 60 + 55);

    assert.equal(
      `${Math.floor(flown / 3600)} h ${Math.round((flown % 3600) / 60)} min`,
      '14 h 10 min'
    );
  });
});

// Apollo 11 after lunar liftoff: the LM in 9.4 × 48.0 n mi (Mission Report
// Table 7-V), the CSM in 62 × 56 n mi (Mission Report section 5); lunar liftoff
// at 124:22:00 and docking at 128:03:00 (Apollo by the Numbers)
describe('In practice values: rendezvous', () => {
  const MU_MOON = 4.902800118e12;
  const R_MOON = 1_737_400;
  const sma = (low: number, high: number) => R_MOON + ((low + high) / 2) * 1852;

  test('synodicPeriod: 41.8 h for the LM and the CSM, gaining about 16° an orbit', () => {
    const aLM = sma(9.4, 48.0);
    const aCSM = sma(56, 62);

    assert.equal(Math.round(aLM), 1_790_552);
    assert.equal(Math.round(aCSM), 1_846_668);

    const nLM = meanMotion(aLM, MU_MOON);
    const nCSM = meanMotion(aCSM, MU_MOON);

    assert.equal((synodicPeriod(nLM, nCSM) / 3600).toFixed(1), '41.8');
    assert.equal(Math.round(360 * (1 - nCSM / nLM)), 16);

    const flown = 128 * 3600 + 3 * 60 - (124 * 3600 + 22 * 60);

    assert.equal(
      `${Math.floor(flown / 3600)} h ${Math.round((flown % 3600) / 60)} min`,
      '3 h 41 min'
    );
  });
});

// Apollo 11's lunar module ascent stage: 10 776.6 lb at liftoff and 6070.1 ft/s
// (Mission Report Tables A-I and 7-V), 3464 lbf at 309 s (pre-flight
// prediction, Mission Report Table 9.9-I)
describe('In practice values: rocket performance', () => {
  const F = 15_409; // N, 3464 lbf
  const Isp = 309; // s
  const m0 = 4888; // kg

  test('massFlowRate: 5.09 kg/s for the ascent engine', () => {
    assert.equal(massFlowRate(F, Isp).toFixed(2), '5.09');
  });

  test('burnTime: 439 s against 434.9 s flown, 1% more', () => {
    const t = burnTime(m0, 1850.2, F, Isp);

    assert.equal(Math.round(t), 439);
    assert.equal(Math.round((100 * (t - 434.9)) / 434.9), 1);
  });

  test('initialMassForDeltaV: 9 905 kg before landing', () => {
    assert.equal(group(initialMassForDeltaV(m0, 2112.3, 305)), '9 905');
  });

  test('thrustToWeight: 1.94 on the Moon (1.62 m/s²), 0.32 on Earth', () => {
    const moon = MOONS.find((body) => body.id === 'moon')!;
    const g = moon.mu! / (moon.radius.value * 1e3) ** 2;

    assert.equal(g.toFixed(2), '1.62');
    assert.equal(g.toFixed(3), '1.624');
    assert.equal(thrustToWeight(F, m0, 1.624).toFixed(2), '1.94');
    assert.equal(thrustToWeight(F, m0, 9.80665).toFixed(2), '0.32');
  });
});

// The numbers in docs/learn/where-is-earth-today.md, computed the same way
describe('Where is Earth today? (tutorial)', () => {
  const deg = (r: number) => ((((r * 180) / Math.PI) % 360) + 360) % 360;
  const { e, angle, period } = PLANETS.find((p) => p.id === 'earth')!.orbit!;
  const P = Math.abs(period.value);
  const M0 = trueToMeanAnomaly(angle, e);
  const M = norm2pi(M0 + ((2 * Math.PI) / P) * 9786) as Radians;
  const E = solveKepler(M, e);
  const nu = eccentricToTrueAnomaly(E, e);

  test('starts 2.47° before perihelion at J2000', () => {
    assert.equal(((M0 * 180) / Math.PI).toFixed(2), '-2.47');
  });

  test('reaches M 282.7°, E 281.8° and ν 280.8° on 17 October 2026', () => {
    assert.equal(deg(M).toFixed(1), '282.7');
    assert.equal(deg(E).toFixed(1), '281.8');
    assert.equal(deg(nu).toFixed(1), '280.8');
  });

  test('puts Earth 0.9966 au from the Sun, 287 days past perihelion', () => {
    assert.equal((1 - e * Math.cos(E)).toFixed(4), '0.9966');
    assert.equal(Math.round((deg(M) / 360) * P), 287);
  });
});
