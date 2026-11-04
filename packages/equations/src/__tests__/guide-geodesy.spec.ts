import { PLANETS } from '@interstellar-tools/constants';
import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { bodyFixedToGeodetic } from '../categories/cartography/body-fixed-to-geodetic.js';
import { centralAngle } from '../categories/cartography/central-angle.js';
import { eccentricitySquaredOblateSpheroid } from '../categories/cartography/eccentricity-squared-oblate-spheroid.js';
import { flatteningOblateSpheroid } from '../categories/cartography/flattening-oblate-spheroid.js';
import { geodeticToBodyFixed } from '../categories/cartography/geodetic-to-body-fixed.js';
import { greatCircleDistance } from '../categories/cartography/great-circle-distance.js';
import { heightAboveEllipsoid } from '../categories/cartography/height-above-ellipsoid.js';
import { heightAboveSphere } from '../categories/cartography/height-above-sphere.js';
import { horizonDistance } from '../categories/cartography/horizon-distance.js';
import { horizonSurfaceDistance } from '../categories/cartography/horizon-surface-distance.js';
import { meridionalRadiusOfCurvature } from '../categories/cartography/meridional-radius-of-curvature.js';
import { planetocentricLatitude } from '../categories/cartography/planetocentric-latitude.js';
import { primeVerticalRadiusOfCurvature } from '../categories/cartography/prime-vertical-radius-of-curvature.js';
import { sphericalPolygonArea } from '../categories/cartography/spherical-polygon-area.js';

// Every number in the geodesy guide (docs/guide/usage/equations/geodesy.md),
// so the page can't drift from the code.

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const mars = PLANETS.find((planet) => planet.id === 'mars')!;
const a = mars.ellipsoid!.equatorialRadius.value * 1000;
const c = mars.ellipsoid!.polarRadius.value * 1000;
const R = mars.radius.value * 1000;
const eSquared = eccentricitySquaredOblateSpheroid(a, c);

describe('Geodesy guide', () => {
  test("Mars's reference surface", () => {
    const f = flatteningOblateSpheroid(a, c);

    assert.equal(group(a), '3 396 190');
    assert.equal(group(c), '3 376 200');
    assert.equal(group(R), '3 389 500');
    assert.equal(f.toFixed(6), '0.005886');
    assert.equal((1 / f).toFixed(1), '169.9');
    assert.equal(eSquared.toFixed(6), '0.011737');
    assert.equal(((a - c) / 1000).toFixed(2), '19.99');
    // The sphere is up to 13 km off in height: at the poles
    assert.equal(((R - c) / 1000).toFixed(0), '13');
    assert.ok(R - c > a - R);
  });

  test('two kinds of latitude differ by 0.34° at 45°, about 20 km', () => {
    const [x, y, z] = geodeticToBodyFixed(toRad(45), toRad(0), 0, a, eSquared);
    const psi = toDeg(planetocentricLatitude(x, y, z));
    const M = meridionalRadiusOfCurvature(toRad(45), a, eSquared);

    assert.equal(psi.toFixed(3), '44.662');
    assert.equal((45 - psi).toFixed(2), '0.34');
    assert.equal(((toRad(45 - psi) * M) / 1000).toFixed(0), '20');

    // And 45° is where they differ most
    for (const phi of [30, 40, 50, 60]) {
      const v = geodeticToBodyFixed(toRad(phi), toRad(0), 0, a, eSquared);

      assert.ok(phi - toDeg(planetocentricLatitude(...v)) < 45 - psi);
    }
  });

  test('Curiosity to Perseverance: 63.41°, 3 751 km', () => {
    const curiosity = [toRad(-4.5895), toRad(137.4417)] as const;
    const perseverance = [toRad(18.4447), toRad(77.4508)] as const;

    assert.equal(
      toDeg(centralAngle(...curiosity, ...perseverance)).toFixed(2),
      '63.41'
    );
    assert.equal(
      group(greatCircleDistance(...curiosity, ...perseverance, R) / 1000),
      '3 751'
    );
    // Good to about the flattening on the mean sphere
    assert.equal((flatteningOblateSpheroid(a, c) * 100).toFixed(1), '0.6');
  });

  test('radii of curvature at Jezero', () => {
    const phi = toRad(18.4447);
    const M = meridionalRadiusOfCurvature(phi, a, eSquared);
    const N = primeVerticalRadiusOfCurvature(phi, a, eSquared);

    assert.equal(group(M), '3 362 252');
    assert.equal(group(N), '3 398 187');
    assert.equal(((M * Math.PI) / 180 / 1000).toFixed(2), '58.68');
    assert.equal(
      ((N * Math.cos(phi) * Math.PI) / 180 / 1000).toFixed(2),
      '56.26'
    );
  });

  test('coordinates round-trip, and an orbiter 300 km above the north pole', () => {
    const r = geodeticToBodyFixed(
      toRad(18.4447),
      toRad(77.4508),
      0,
      a,
      eSquared
    );
    const { phi, lambda, h } = bodyFixedToGeodetic(...r, a, eSquared);

    assert.equal(toDeg(phi).toFixed(4), '18.4447');
    assert.equal(toDeg(lambda).toFixed(4), '77.4508');
    assert.ok(Math.abs(h) < 1e-6);

    const above = c + 300_000;

    assert.equal(
      group(heightAboveEllipsoid(0, 0, above, a, eSquared)),
      '300 000'
    );
    assert.equal(group(heightAboveSphere([0, 0, above], R)), '286 700');
    assert.equal(((R - c) / 1000).toFixed(1), '13.3');
    // Reads high at the equator
    assert.ok(heightAboveSphere([a, 0, 0], R) > 0);
  });

  test('horizons and a 1° box at Jezero', () => {
    assert.equal(group(horizonDistance(300_000, R) / 1000), '1 457');
    assert.equal(group(horizonSurfaceDistance(300_000, R) / 1000), '1 376');

    const box = [
      [18, 77],
      [18, 78],
      [19, 78],
      [19, 77]
    ].map(([lat, lon]) => ({ lat: toRad(lat!), lon: toRad(lon!) }));
    const flat = R * R * toRad(1) * toRad(1) * Math.cos(toRad(18.5));

    assert.equal((sphericalPolygonArea(box, R) / 1e6).toFixed(2), '3318.83');
    assert.equal((flat / 1e6).toFixed(2), '3318.81');
  });
});
