import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { hohmannTransfer } from '../categories/manoeuvres/hohmann-transfer.js';
import { planeChangeDeltaV } from '../categories/manoeuvres/plane-change-delta-v.js';
import { rocketDeltaVFromIsp } from '../categories/manoeuvres/rocket-delta-v-from-isp.js';
import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { periApoapsisRadii } from '../categories/orbits/peri-apoapsis-radii.js';
import { visVivaSpeed } from '../categories/orbits/vis-viva-speed.js';

import { angleClose, relClose } from './helpers/index.js';

/**
 * Property-based tests: each one checks a physical law or identity over many
 * random inputs instead of a few hand-picked ones. On failure, fast-check
 * shrinks to the smallest counterexample and prints a seed to replay it.
 */

const TWO_PI = 2 * Math.PI;
// Physically meaningful ranges, wide enough to span LEO to the outer planets
const radius = fc.double({ min: 1e5, max: 1e13, noNaN: true }); // [m]
const mu = fc.double({ min: 1e5, max: 1e21, noNaN: true }); // [m³/s²]
const anomaly = fc.double({
  min: 0,
  max: TWO_PI,
  maxExcluded: true,
  noNaN: true
}); // [rad]
const ellipticE = fc.double({ min: 0, max: 0.99, noNaN: true });

describe('Kepler’s equation', () => {
  test('solveKepler returns E in [0, 2π) satisfying M = E − e·sin(E)', () => {
    fc.assert(
      fc.property(anomaly, ellipticE, (M, e) => {
        const E = solveKepler(M as Radians, e);

        assert.ok(E >= 0 && E < TWO_PI, `E=${E} outside [0, 2π)`);
        angleClose(E - e * Math.sin(E), M, 1e-8);
      })
    );
  });

  test('mean → eccentric → true → mean anomaly round-trips', () => {
    fc.assert(
      fc.property(anomaly, ellipticE, (M, e) => {
        const E = solveKepler(M as Radians, e);
        const nu = eccentricToTrueAnomaly(E, e);

        angleClose(trueToMeanAnomaly(nu, e), M, 1e-7);
      })
    );
  });

  test('a circular orbit has equal mean and eccentric anomaly', () => {
    fc.assert(
      fc.property(anomaly, (M) => {
        angleClose(solveKepler(M as Radians, 0), M, 1e-9);
      })
    );
  });
});

describe('orbital speeds', () => {
  test('vis-viva at r = a equals the circular speed', () => {
    fc.assert(
      fc.property(radius, mu, (r, m) => {
        relClose(visVivaSpeed(r, r, m), circularSpeed(r, m), 1e-12);
      })
    );
  });

  test('escape speed is √2 times the circular speed', () => {
    fc.assert(
      fc.property(radius, mu, (r, m) => {
        relClose(escapeSpeed(r, m), Math.SQRT2 * circularSpeed(r, m), 1e-12);
      })
    );
  });

  test('vis-viva on a parabola (a → ∞) equals the escape speed', () => {
    fc.assert(
      fc.property(radius, mu, (r, m) => {
        relClose(visVivaSpeed(r, Infinity, m), escapeSpeed(r, m), 1e-12);
      })
    );
  });
});

describe('orbit geometry', () => {
  test('Kepler’s third law: quadrupling a multiplies the period by 8', () => {
    fc.assert(
      fc.property(radius, mu, (a, m) => {
        relClose(keplerPeriod(4 * a, m), 8 * keplerPeriod(a, m), 1e-12);
      })
    );
  });

  test('periapsis and apoapsis sum to the major axis, with rp ≤ ra', () => {
    fc.assert(
      fc.property(radius, ellipticE, (a, e) => {
        const { rp, ra } = periApoapsisRadii(a, e);

        assert.ok(ra !== null, 'elliptic orbits have an apoapsis');
        assert.ok(rp > 0 && rp <= ra, `rp=${rp}, ra=${ra}`);
        relClose(rp + ra, 2 * a, 1e-12);
      })
    );
  });
});

describe('manoeuvres', () => {
  test('a Hohmann transfer costs the same Δv and time in both directions', () => {
    fc.assert(
      fc.property(radius, radius, mu, (r1, r2, m) => {
        const up = hohmannTransfer(r1, r2, m);
        const down = hohmannTransfer(r2, r1, m);

        relClose(up.at, (r1 + r2) / 2, 1e-12);
        relClose(up.dvTotal, down.dvTotal, 1e-9);
        relClose(up.tTransfer, down.tTransfer, 1e-12);
        assert.ok(
          up.dv1 >= 0 && up.dv2 >= 0,
          'burn magnitudes are non-negative'
        );
      })
    );
  });

  test('the rocket equation is additive over consecutive burns', () => {
    const isp = fc.double({ min: 50, max: 10_000, noNaN: true }); // [s]
    const mass = fc.double({ min: 1, max: 1e7, noNaN: true }); // [kg]
    const ratio = fc.double({ min: 1.001, max: 20, noNaN: true });

    fc.assert(
      fc.property(isp, mass, ratio, ratio, (Isp, mf, k1, k2) => {
        const m1 = mf * k1;
        const m0 = m1 * k2;
        const staged =
          rocketDeltaVFromIsp(Isp, m0, m1) + rocketDeltaVFromIsp(Isp, m1, mf);

        relClose(staged, rocketDeltaVFromIsp(Isp, m0, mf), 1e-9);
      })
    );
  });

  test('a plane change costs between 0 and 2v, rising with the angle', () => {
    const speed = fc.double({ min: 0, max: 50_000, noNaN: true }); // [m/s]
    const angle = fc.double({ min: 0, max: Math.PI, noNaN: true }); // [rad]

    fc.assert(
      fc.property(speed, angle, angle, (v, a, b) => {
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        const dvLo = planeChangeDeltaV(v, lo as Radians);
        const dvHi = planeChangeDeltaV(v, hi as Radians);

        assert.ok(
          dvLo >= 0 && dvHi <= 2 * v * (1 + 1e-12),
          'Δv outside [0, 2v]'
        );
        assert.ok(dvLo <= dvHi + 1e-9 * Math.max(1, v), 'Δv not monotonic');
      })
    );
  });
});
