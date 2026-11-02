import { MOONS, PLANETS } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { norm2pi } from '../categories/helpers/misc.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { thrustToWeight } from '../categories/manoeuvres/thrust-to-weight.js';
import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { inclinationFromLaunchAzimuth } from '../categories/orbits/inclination-from-launch-azimuth.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { launchAzimuthForInclination } from '../categories/orbits/launch-azimuth-for-inclination.js';
import { meanMotion } from '../categories/orbits/mean-motion.js';
import { periApoapsisRadii } from '../categories/orbits/peri-apoapsis-radii.js';
import { rotatingLaunchAzimuth } from '../categories/orbits/rotating-launch-azimuth.js';
import { specificMechanicalEnergy } from '../categories/orbits/specific-mechanical-energy.js';
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
