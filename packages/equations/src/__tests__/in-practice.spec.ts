import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { meanMotion } from '../categories/orbits/mean-motion.js';
import { periApoapsisRadii } from '../categories/orbits/peri-apoapsis-radii.js';
import { specificMechanicalEnergy } from '../categories/orbits/specific-mechanical-energy.js';
import { sphereOfInfluenceRadius } from '../categories/orbits/sphere-of-influence-radius.js';
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
    const n = meanMotion(MU_EARTH, ISS);

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
