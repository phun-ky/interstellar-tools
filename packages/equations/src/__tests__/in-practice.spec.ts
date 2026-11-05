import { MOONS, PLANETS, WGS84 } from '@interstellar-tools/constants';
import type {
  Cr3bpState,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { asymptoteTrueAnomaly } from '../categories/anomalies/asymptote-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { norm2pi } from '../categories/helpers/misc.js';
import { bodyFixedToGeodetic } from '../categories/cartography/body-fixed-to-geodetic.js';
import { eccentricitySquaredOblateSpheroid } from '../categories/cartography/eccentricity-squared-oblate-spheroid.js';
import { flatteningOblateSpheroid } from '../categories/cartography/flattening-oblate-spheroid.js';
import { geodeticToBodyFixed } from '../categories/cartography/geodetic-to-body-fixed.js';
import { greatCircleDistance } from '../categories/cartography/great-circle-distance.js';
import { horizonDistance } from '../categories/cartography/horizon-distance.js';
import { meridionalRadiusOfCurvature } from '../categories/cartography/meridional-radius-of-curvature.js';
import { primeVerticalRadiusOfCurvature } from '../categories/cartography/prime-vertical-radius-of-curvature.js';
import { ballisticPeakDeceleration } from '../categories/entry/ballistic-peak-deceleration.js';
import { rk4Integrate } from '../categories/helpers/rk4.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { solveLambert } from '../categories/manoeuvres/solve-lambert.js';
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
import { hillSphereRadius } from '../categories/orbits/hill-sphere-radius.js';
import { sphereOfInfluenceRadius } from '../categories/orbits/sphere-of-influence-radius.js';
import { surfaceRotationSpeed } from '../categories/orbits/surface-rotation-speed.js';
import { visVivaSpeed } from '../categories/orbits/vis-viva-speed.js';
import { cr3bpDerivatives } from '../categories/three-body/cr3bp-derivatives.js';
import { cr3bpUnits } from '../categories/three-body/cr3bp-units.js';
import { jacobiConstant } from '../categories/three-body/jacobi-constant.js';
import { lagrangePoints } from '../categories/three-body/lagrange-points.js';

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

  test("hillSphereRadius: Earth's at 1.5 million km, the Moon a quarter of the way out", () => {
    const hill = km(hillSphereRadius(AU, 0.0167, MU_EARTH, 1.32712440041e20));

    assert.equal((hill / 1e6).toFixed(1), '1.5');
    assert.equal(Math.round((4 * 384_400) / hill), 1);
  });

  test('lagrangePoints: Sun-Earth L2, 1.5 million km beyond Earth', () => {
    const { L2 } = lagrangePoints(1.32712440041e20, 4.0350323e14, AU);
    const beyond = km(L2[0] - (1 - 3.04e-6) * AU);

    assert.equal((beyond / 1e6).toFixed(1), '1.5');
    // Four times the Moon's distance
    assert.equal(Math.round(beyond / 384_400), 4);
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
  const E2 = F * (2 - F);
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

  test('meridionalRadiusOfCurvature: a degree of latitude is 110.83 km at Pad 39A, M = 6 350.1 km', () => {
    const M = meridionalRadiusOfCurvature(toRad(28.608422), A, E2);

    assert.equal((M / 1000).toFixed(1), '6350.1');
    assert.equal(((M * Math.PI) / 180 / 1000).toFixed(2), '110.83');
    assert.equal(Math.round((M * Math.PI) / 180), 110_829);
  });

  test('primeVerticalRadiusOfCurvature: a degree of longitude is 97.80 km at Pad 39A, N = 6 383.0 km', () => {
    const phi = toRad(28.608422);
    const N = primeVerticalRadiusOfCurvature(phi, A, E2);
    const degree = (N * Math.cos(phi) * Math.PI) / 180;

    assert.equal((N / 1000).toFixed(1), '6383.0');
    assert.equal((degree / 1000).toFixed(2), '97.80');
    assert.equal(Math.round(degree), 97_804);
  });

  test('geodeticToBodyFixed: Pad 39A 6 373.3 km from the centre, at 28.447° geocentric', () => {
    const [x, y, z] = geodeticToBodyFixed(
      toRad(28.608422),
      toRad(-80.604133),
      0,
      A,
      E2
    );

    assert.equal(Math.round(Math.hypot(x, y, z)), 6_373_266);
    assert.equal(toDeg(Math.atan2(z, Math.hypot(x, y))).toFixed(3), '28.447');
    assert.equal((28.608422 - 28.447).toFixed(3), '0.161');
  });

  test('bodyFixedToGeodetic: 32.672° N, 191.1 km up at orbit insertion, 0.170° north of 32.502°', () => {
    const lat = toRad(32.502);
    const r = 6_563_041;
    const { phi, h } = bodyFixedToGeodetic(
      r * Math.cos(lat),
      0,
      r * Math.sin(lat),
      A,
      E2
    );

    assert.equal(toDeg(phi).toFixed(3), '32.672');
    assert.equal((h / 1000).toFixed(1), '191.1');
    assert.equal((r / 1000).toFixed(1), '6563.0');
    assert.equal((32.672 - 32.502).toFixed(3), '0.170');
  });

  test('inclinationFromLaunchAzimuth: 32.521° at Apollo 11’s insertion, 32.69° with the geodetic latitude', () => {
    const [x, y, z] = geodeticToBodyFixed(
      toRad(32.672),
      toRad(-52.694),
      191_100,
      A,
      E2
    );
    const insertion = Math.atan2(z, Math.hypot(x, y)) as Radians;

    assert.equal(toDeg(insertion).toFixed(3), '32.502');
    assert.equal(Math.round(Math.hypot(x, y, z)), 6_563_041);
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

// Apollo 11 at entry interface: 36 194.4 ft/s, flight-path angle -6.48°;
// peak 6.56 g as flown (Mission Report Table 7-VII and section 7.5). Earth's
// atmosphere as one exponential with a 7.2 km scale height.
describe('In practice values: atmospheric entry', () => {
  test('ballisticPeakDeceleration: 35.8 g ballistic, against 6.56 g flown with lift', () => {
    const VE = 36_194.4 * 0.3048;

    assert.equal(Math.round(VE), 11_032);

    const a = ballisticPeakDeceleration(11_032, (-6.48 * Math.PI) / 180, 7200);

    assert.equal((a / 9.80665).toFixed(1), '35.8');
    assert.ok(a / 9.80665 > 5 * 6.56);
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

// A free return from Apollo 11's TLI point, 334.4 km up at 7.367° above the
// horizontal (Apollo by the Numbers), in the Earth–Moon plane with the Moon at
// its mean distance. The angle and speed were solved for a 114 km pericynthion
// and a 38.5 km return perigee, the vacuum perigee of the flown entry.
describe('In practice values: three-body', () => {
  const { mu, time, speed, length } = cr3bpUnits(
    3.986004418e14,
    4.902800118e12,
    384_400_000
  );
  const R_EARTH = 6_378_137 / length;
  const R_MOON = 1_737_400 / length;
  const tliState = (angleDeg: number, v: number, fpaDeg: number) => {
    const th = (angleDeg * Math.PI) / 180;
    const fpa = (fpaDeg * Math.PI) / 180;
    const r = (6_378_137 + 334_400) / length;
    const [ux, uy] = [Math.cos(th), Math.sin(th)];
    const vin = v / speed;
    const vx = vin * (Math.sin(fpa) * ux - Math.cos(fpa) * uy);
    const vy = vin * (Math.sin(fpa) * uy + Math.cos(fpa) * ux);
    const x = -mu + r * ux;
    const y = r * uy;

    // Inertial to rotating: subtract ω × r, with ω = 1
    return [x, y, 0, vx + y, vy - x, 0];
  };
  const start = tliState(242.26601, 10_837.9617, 7.367);
  const f = (_t: number, s: readonly number[]) =>
    cr3bpDerivatives(s as unknown as Cr3bpState, mu);
  const { t, y } = rk4Integrate(f, start, 0, 1.45, 145_000);
  const r1 = y.map((s) => Math.hypot(s[0] + mu, s[1]));
  const r2 = y.map((s) => Math.hypot(s[0] - 1 + mu, s[1]));
  const argMin = (values: number[], from = 0) => {
    let best = from;

    for (let k = from; k < values.length; k++)
      if (values[k] < values[best]) best = k;

    return best;
  };
  const atMoon = argMin(r2);
  const atEarth = argMin(r1, atMoon);

  test('cr3bpUnits: 4.342 days, 27.28 days a revolution, 1 024.5 m/s', () => {
    assert.equal((time / 86_400).toFixed(3), '4.342');
    assert.equal(((2 * Math.PI * time) / 86_400).toFixed(2), '27.28');
    assert.equal(speed.toFixed(1), '1024.5');
    assert.equal(mu.toFixed(6), '0.012151');
  });

  test('cr3bpDerivatives: a free return for 3.7 m/s more, 114 km behind the Moon, back to 38.5 km', () => {
    assert.equal((10_837.9617 - 10_834.3).toFixed(1), '3.7');
    assert.equal((242.26601).toFixed(2), '242.27');
    assert.equal(Math.round(((r2[atMoon] - R_MOON) * length) / 1000), 114);
    assert.equal(((t[atMoon] * time) / 3600).toFixed(1), '68.6');
    // Behind the Moon, as seen from Earth
    assert.ok(y[atMoon][0] > 1 - mu);
    assert.ok(Math.abs(((r1[atEarth] - R_EARTH) * length) / 1000 - 38.5) < 0.5);
    assert.equal(((t[atEarth] * time) / 3600).toFixed(1), '137.4');
  });

  test('jacobiConstant: 1.778 for the free return, well below 3.188 at L1', () => {
    const c = jacobiConstant(start as unknown as Cr3bpState, mu);

    assert.equal(c.toFixed(3), '1.778');
    assert.ok(c < 3.188);
    assert.ok(
      Math.abs(jacobiConstant(y[atEarth] as unknown as Cr3bpState, mu) - c) <
        1e-6
    );
  });
});

// Landing sites in IAU Mean Earth/Polar Axis coordinates (Apollo by the
// Numbers, landing site table); the Moon as a sphere of 1 737.4 km
describe('In practice values: lunar distances', () => {
  const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
  const R_MOON = 1_737_400;
  const APOLLO_11 = [toRad(0.67408), toRad(23.47297)] as const;
  const APOLLO_12 = [toRad(-3.01239), toRad(-23.42157)] as const;
  const APOLLO_17 = [toRad(20.1908), toRad(30.77168)] as const;

  test('greatCircleDistance: 1 426 km from Tranquility Base to Apollo 12, 47° of arc; 630 km to Apollo 17', () => {
    const d = greatCircleDistance(...APOLLO_11, ...APOLLO_12, R_MOON);

    assert.equal(group(d / 1000), '1 426');
    assert.equal(Math.round(d), 1_425_826);
    assert.equal(Math.round(((d / R_MOON) * 180) / Math.PI), 47);
    assert.equal(
      Math.round(
        greatCircleDistance(...APOLLO_11, ...APOLLO_17, R_MOON) / 1000
      ),
      630
    );
  });

  // The low point of the descent orbit, 7.8 n mi (Apollo by the Numbers)
  test('horizonDistance: 224.5 km ahead at PDI, 2.5 km standing on the Moon, 4.8 km on Earth', () => {
    assert.equal(Math.round((7.8 * 1852) / 100) / 10, 14.4);
    assert.equal(
      (horizonDistance(7.8 * 1852, R_MOON) / 1000).toFixed(1),
      '224.5'
    );
    assert.equal(Math.round(horizonDistance(7.8 * 1852, R_MOON)), 224_509);
    assert.equal((horizonDistance(1.8, R_MOON) / 1000).toFixed(1), '2.5');
    assert.equal((horizonDistance(1.8, 6_371_000) / 1000).toFixed(1), '4.8');
  });
});

// The datasets' reference ellipsoids (IAU WGCCRE 2015) and WGS 84 with the
// cartography functions
describe('Reference ellipsoids with the cartography functions', () => {
  test('flatteningOblateSpheroid gives WGS 84 its defined 1/298.257223563', () => {
    const f = flatteningOblateSpheroid(
      WGS84.equatorialRadius.value,
      WGS84.polarRadius.value
    );

    assert.equal((1 / f).toFixed(9), '298.257223563');
    assert.equal(
      eccentricitySquaredOblateSpheroid(
        WGS84.equatorialRadius.value,
        WGS84.polarRadius.value
      ).toFixed(14),
      '0.00669437999014'
    );
  });

  test('flatteningOblateSpheroid: Saturn 0.098, Jupiter 0.065, Earth 0.0034, Mars 0.0059', () => {
    const f = (id: string) => {
      const { ellipsoid } = PLANETS.find((planet) => planet.id === id)!;

      return flatteningOblateSpheroid(
        ellipsoid!.equatorialRadius.value,
        ellipsoid!.polarRadius.value
      );
    };

    assert.equal(f('saturn').toFixed(3), '0.098');
    assert.equal(f('jupiter').toFixed(3), '0.065');
    assert.equal(f('earth').toFixed(4), '0.0034');
    assert.equal(f('mars').toFixed(4), '0.0059');
    assert.equal(f('venus'), 0);
  });

  test('the Moon is a sphere of 1 737.4 km, as the tutorial assumes', () => {
    const { ellipsoid, radius } = MOONS.find((moon) => moon.id === 'moon')!;

    assert.equal(ellipsoid!.equatorialRadius.value, 1737.4);
    assert.equal(ellipsoid!.polarRadius.value, 1737.4);
    assert.equal(radius.value, 1737.4);
  });
});

describe('In practice values: Lambert', () => {
  test('solveLambert: 11 032 m/s at −6.48° on entry, 44.8 h and 154.15° from the edge of the Moon’s sphere, leaving it at 1 239 m/s', () => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    // Chapter V's orbit home, from the flown entry state
    const rEI = 6_378_166 + 121_920;
    const gamma = toRad(-6.48);
    const home = stateToElements(
      [rEI, 0, 0],
      [11_032 * Math.sin(gamma), 11_032 * Math.cos(gamma), 0],
      MU_EARTH
    );
    const p = home.a * (1 - home.e ** 2);
    const nuEdge = (2 * Math.PI -
      Math.acos((p / 322e6 - 1) / home.e)) as Radians;
    const fall =
      (trueToMeanAnomaly(home.nu, home.e) - trueToMeanAnomaly(nuEdge, home.e)) /
      meanMotion(home.a, MU_EARTH);

    assert.equal(Math.round(rEI), 6_500_086);
    assert.equal((((home.nu - nuEdge) * 180) / Math.PI).toFixed(2), '154.15');
    assert.equal(Math.round(fall), 161_219);
    assert.equal((fall / 3600).toFixed(1), '44.8');

    // The box's inputs, rounded as printed
    const swept = toRad(154.15);
    const edge: Vector3DTupleType = [
      322e6 * Math.cos(swept),
      -322e6 * Math.sin(swept),
      0
    ];
    const { v1, v2 } = solveLambert(edge, [6_500_086, 0, 0], 161_219, MU_EARTH);
    const speed = Math.hypot(...v2);

    assert.equal(group(speed), '11 032');
    assert.equal(
      ((Math.asin(v2[0] / speed) * 180) / Math.PI).toFixed(2),
      '-6.48'
    );
    assert.equal(group(Math.hypot(...v1)), '1 239');
  });
});
