import { orthographic } from '@interstellar-tools/maps';
import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { SATELLITES } from '../dataset.js';
import { temeToEarthFixed } from '../earth-fixed.js';
import { globeView, orbitPath3D } from '../globe.js';
import { groundTrack } from '../ground-track.js';
import { parseOmm } from '../omm.js';
import { propagate } from '../propagate.js';
import { A } from '../wgs84.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const distance = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const after = (date: Date, ms: number) => new Date(date.getTime() + ms);
const DAY = 86_400_000;

describe('orbitPath3D', () => {
  test('keeps a geostationary satellite still in the Earth-fixed frame', () => {
    const goes19 = satellite('goes-19');
    const path = orbitPath3D(goes19, goes19.epoch, after(goes19.epoch, DAY), {
      step: 600
    });

    for (const position of path)
      assert.ok(distance(position, path[0]!) < 50_000);

    // In the inertial frame, it goes round with Earth: half a day on, it's
    // on the other side
    const inertial = orbitPath3D(
      goes19,
      goes19.epoch,
      after(goes19.epoch, DAY / 2),
      { step: 43_200, frame: 'inertial' }
    );

    close(distance(inertial[0]!, inertial[1]!), 2 * 42_164_000, 50_000);
  });

  test('repeats inertial positions after one orbital period', () => {
    for (const id of ['iss', 'gps-iii-sv01', 'goes-19', 'molniya-1-29']) {
      const elements = satellite(id);
      const period = (2 * Math.PI) / elements.meanMotion;
      const [start, end] = orbitPath3D(
        elements,
        elements.epoch,
        after(elements.epoch, period * 1000),
        { frame: 'inertial', step: period }
      );

      // Within half a percent: what's left is J2 turning the orbit slowly
      assert.ok(distance(start!, end!) < 0.005 * Math.hypot(...start!), id);
    }
  });

  test('gives the SGP4 positions in either frame, in the unit asked for', () => {
    const iss = satellite('iss');
    const to = after(iss.epoch, 150_000);
    const fixed = orbitPath3D(iss, iss.epoch, to, { unit: A });
    const inertial = orbitPath3D(iss, iss.epoch, to, { frame: 'inertial' });
    const state = propagate(iss, to);

    // 0, 60, 120 and 150 s
    assert.equal(fixed.length, 4);
    assert.deepEqual(inertial[3], state.r);
    temeToEarthFixed(state, to).r.forEach((value, axis) =>
      close(fixed[3]![axis]!, value / A, 1e-12)
    );
    // The ISS, 420 km up: about 1.066 Earth radii from the centre
    close(Math.hypot(...fixed[0]!), 1.066, 0.005);
  });

  test('rejects invalid input', () => {
    const iss = satellite('iss');
    const { epoch } = iss;
    const later = after(epoch, DAY);
    const rejects = (fn: () => unknown, type: typeof Error, message: string) =>
      assert.throws(
        fn,
        (err) => err instanceof type && err.message === message
      );

    rejects(
      () => orbitPath3D(iss, epoch, new Date(Number.NaN)),
      TypeError,
      'to must be a valid Date. Received: Invalid Date'
    );
    assert.throws(() => orbitPath3D(iss, later, epoch), RangeError);
    rejects(
      () => orbitPath3D(iss, epoch, later, { step: Number.NaN }),
      TypeError,
      'step must be a finite number. Received: NaN'
    );
    rejects(
      () => orbitPath3D(iss, epoch, later, { unit: 0 }),
      RangeError,
      'unit must be > 0. Received: 0'
    );
    rejects(
      () =>
        orbitPath3D(iss, epoch, later, {
          frame: 'galactic' as 'inertial'
        }),
      RangeError,
      "frame must be 'earth-fixed' or 'inertial'. Received: galactic"
    );
    rejects(
      () => orbitPath3D(iss, epoch, after(epoch, 365 * DAY), { step: 1 }),
      RangeError,
      'The path would have more than 1000000 points: take a longer step. Received: 1 s'
    );
  });
});

describe('globeView', () => {
  const oslo = { phi0: rad(59.91), lambda0: rad(10.75) };

  test('puts the centre in the middle and flags the far side', () => {
    const [centre, antipode, edge] = globeView(
      [
        { phi: oslo.phi0, lambda: oslo.lambda0 },
        { phi: -oslo.phi0 as Radians, lambda: rad(10.75 - 180) },
        // 90° from Oslo, on the horizon of the view
        { phi: rad(59.91 - 90), lambda: oslo.lambda0 }
      ],
      200,
      oslo
    );

    assert.deepEqual(centre, { x: 0, y: 0, visible: true });
    assert.equal(antipode!.visible, false);
    assert.equal(edge!.visible, true);
    close(Math.hypot(edge!.x, edge!.y), 200, 1e-9);
  });

  test("matches maps' orthographic projection on the near side", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -90, max: 90, noNaN: true }),
        fc.double({ min: -180, max: 180, noNaN: true }),
        fc.double({ min: -90, max: 90, noNaN: true }),
        fc.double({ min: -180, max: 180, noNaN: true }),
        (lat, lon, lat0, lon0) => {
          const options = { phi0: rad(lat0), lambda0: rad(lon0) };
          const [point] = globeView(
            [{ phi: rad(lat), lambda: rad(lon) }],
            3,
            options
          );

          // Every point lies on the disc, the far side mirrored onto it
          assert.ok(Math.hypot(point!.x, point!.y) <= 3 + 1e-9);

          if (!point!.visible) return;

          const flat = orthographic(rad(lat), rad(lon), 3, options);

          close(point!.x, flat.x, 1e-9);
          close(point!.y, flat.y, 1e-9);
        }
      )
    );
  });

  test('hides about half of a day of ground track, the part behind the globe', () => {
    const iss = satellite('iss');
    const track = groundTrack(iss, iss.epoch, after(iss.epoch, DAY), 60).flat();
    const view = globeView(track, 1, oslo);
    const visible = view.filter((point) => point.visible).length / view.length;

    assert.equal(view.length, track.length);
    assert.ok(visible > 0.3 && visible < 0.7, `${visible}`);
  });

  test('rejects invalid input', () => {
    const point = { phi: 0 as Radians, lambda: 0 as Radians };
    const rejects = (fn: () => unknown, type: typeof Error, message: string) =>
      assert.throws(
        fn,
        (err) => err instanceof type && err.message === message
      );

    rejects(
      () => globeView([point], 0),
      RangeError,
      'R must be > 0. Received: 0'
    );
    rejects(
      () => globeView([point], Number.NaN),
      TypeError,
      'R must be a finite number. Received: NaN'
    );
    rejects(
      () => globeView([point], 1, { phi0: 2 as Radians }),
      RangeError,
      'phi0 must be in [-π/2, π/2]. Received: 2'
    );
    rejects(
      () => globeView([point], 1, { lambda0: Number.NaN as Radians }),
      TypeError,
      'lambda0 must be a finite number. Received: NaN'
    );
    rejects(
      () => globeView([{ ...point, phi: Number.NaN as Radians }]),
      TypeError,
      'phi must be a finite number. Received: NaN'
    );
    rejects(
      () => globeView([{ ...point, lambda: Infinity as Radians }]),
      TypeError,
      'lambda must be a finite number. Received: Infinity'
    );
  });
});
