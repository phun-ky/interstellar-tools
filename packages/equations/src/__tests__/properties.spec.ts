import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { eccentricToTrueAnomaly } from '../categories/anomalies/eccentric-to-true-anomaly.js';
import { trueToMeanAnomaly } from '../categories/anomalies/true-to-mean-anomaly.js';
import { solveKepler } from '../categories/kepler/solve-kepler.js';
import { burnTime } from '../categories/manoeuvres/burn-time.js';
import { hohmannTransfer } from '../categories/manoeuvres/hohmann-transfer.js';
import { initialMassForDeltaV } from '../categories/manoeuvres/initial-mass-for-delta-v.js';
import { massFlowRate } from '../categories/manoeuvres/mass-flow-rate.js';
import { planeChangeDeltaV } from '../categories/manoeuvres/plane-change-delta-v.js';
import { rocketDeltaVFromIsp } from '../categories/manoeuvres/rocket-delta-v-from-isp.js';
import { circularSpeed } from '../categories/orbits/circular-speed.js';
import { elementsToState } from '../categories/orbits/elements-to-state.js';
import { escapeSpeed } from '../categories/orbits/escape-speed.js';
import { inclinationFromLaunchAzimuth } from '../categories/orbits/inclination-from-launch-azimuth.js';
import { keplerPeriod } from '../categories/orbits/kepler-period.js';
import { launchAzimuthForInclination } from '../categories/orbits/launch-azimuth-for-inclination.js';
import { periApoapsisRadii } from '../categories/orbits/peri-apoapsis-radii.js';
import { stateToElements } from '../categories/orbits/state-to-elements.js';
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

describe('state vectors and orbital elements', () => {
  // Away from the circular, equatorial and parabolic special cases
  const angle = fc.double({
    min: 0,
    max: TWO_PI,
    maxExcluded: true,
    noNaN: true
  });
  const inclination = fc.double({
    min: 0.01,
    max: Math.PI - 0.01,
    noNaN: true
  });
  const ellipticE = fc.double({ min: 0.001, max: 0.95, noNaN: true });
  const hyperbolicE = fc.double({ min: 1.05, max: 5, noNaN: true });
  const a = fc.double({ min: 7e6, max: 1e9, noNaN: true }); // [m]
  const MU = 3.986004418e14;

  test('elliptic elements → state → elements round-trips', () => {
    fc.assert(
      fc.property(
        a,
        ellipticE,
        inclination,
        angle,
        angle,
        angle,
        (sma, e, i, raan, argp, nu) => {
          const el = {
            a: sma,
            e,
            i: i as Radians,
            raan: raan as Radians,
            argp: argp as Radians,
            nu: nu as Radians
          };
          const { r, v } = elementsToState(el, MU);
          const back = stateToElements(r, v, MU);

          relClose(back.a, sma, 1e-8);
          relClose(back.e, e, 1e-7);
          angleClose(back.i, i, 1e-9);
          angleClose(back.raan, raan, 1e-8);
          angleClose(back.argp, argp, 1e-6);
          angleClose(back.nu, nu, 1e-6);
        }
      )
    );
  });

  test('hyperbolic elements → state → elements round-trips', () => {
    fc.assert(
      fc.property(
        a,
        hyperbolicE,
        inclination,
        angle,
        angle,
        fc.double({ min: -0.95, max: 0.95, noNaN: true }),
        (sma, e, i, raan, argp, f) => {
          // A true anomaly inside the asymptotes: |ν| < ν∞
          const nu = f * Math.acos(-1 / e);
          const el = {
            a: -sma,
            e,
            i: i as Radians,
            raan: raan as Radians,
            argp: argp as Radians,
            nu: nu as Radians
          };
          const { r, v } = elementsToState(el, MU);
          const back = stateToElements(r, v, MU);

          relClose(back.a, -sma, 1e-8);
          relClose(back.e, e, 1e-8);
          angleClose(back.i, i, 1e-9);
          angleClose(back.raan, raan, 1e-8);
          angleClose(back.argp, argp, 1e-7);
          angleClose(back.nu, nu, 1e-7);
        }
      )
    );
  });
});

describe('launch geometry', () => {
  test('the azimuths for an inclination give that inclination back', () => {
    // Away from the poles and from the singular i = |lat| edge
    const lat = fc.double({ min: -1.4, max: 1.4, noNaN: true }); // [rad]
    const azimuth = fc.double({ min: 0, max: TWO_PI, noNaN: true }); // [rad]

    fc.assert(
      fc.property(lat, azimuth, (phi, beta) => {
        const i = inclinationFromLaunchAzimuth(phi as Radians, beta as Radians);

        fc.pre(Math.abs(Math.sin(beta)) < 0.999);

        const { northbound, southbound } = launchAzimuthForInclination(
          phi as Radians,
          i
        );

        // beta is one of the two solutions
        const dNorth = Math.abs(Math.sin((northbound - beta) / 2));
        const dSouth = Math.abs(Math.sin((southbound - beta) / 2));

        assert.ok(Math.min(dNorth, dSouth) < 1e-9, `β=${beta} not recovered`);
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

  test('initialMassForDeltaV inverts the rocket equation', () => {
    const isp = fc.double({ min: 50, max: 10_000, noNaN: true }); // [s]
    const mass = fc.double({ min: 1, max: 1e7, noNaN: true }); // [kg]
    const ratio = fc.double({ min: 1.001, max: 20, noNaN: true });

    fc.assert(
      fc.property(isp, mass, ratio, (Isp, mf, k) => {
        const dv = rocketDeltaVFromIsp(Isp, mf * k, mf);

        relClose(initialMassForDeltaV(mf, dv, Isp), mf * k, 1e-9);
      })
    );
  });

  test('a burn takes as long as its propellant lasts at the mass flow rate', () => {
    const isp = fc.double({ min: 50, max: 10_000, noNaN: true }); // [s]
    const mass = fc.double({ min: 1, max: 1e7, noNaN: true }); // [kg]
    const thrust = fc.double({ min: 1e-3, max: 1e8, noNaN: true }); // [N]
    // From 1 m/s: below that, m0 - mf cancels in floating point, while
    // burnTime stays accurate (see its unit tests)
    const dv = fc.double({ min: 1, max: 20_000, noNaN: true }); // [m/s]

    fc.assert(
      fc.property(mass, dv, thrust, isp, (mf, d, F, Isp) => {
        const m0 = initialMassForDeltaV(mf, d, Isp);

        relClose(
          burnTime(m0, d, F, Isp),
          (m0 - mf) / massFlowRate(F, Isp),
          1e-9
        );
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
