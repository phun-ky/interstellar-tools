import {
  centralAngle,
  horizonSurfaceDistance,
  sphericalPolygonArea
} from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  Radians
} from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { SATELLITES } from '../dataset.js';
import { subSatellitePoint } from '../earth-fixed.js';
import {
  coverageFootprint,
  footprintRadius,
  groundTrack
} from '../ground-track.js';
import { parseOmm } from '../omm.js';
import { A } from '../wgs84.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (radians: number) => (radians * 180) / Math.PI;
const close = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );
const satellite = (id: string) =>
  parseOmm(SATELLITES.find((entry) => entry.id === id)!.omm);
const iss = satellite('iss');
const goes19 = satellite('goes-19');
const DAY = 86_400_000;
const after = (date: Date, ms: number) => new Date(date.getTime() + ms);
// Wrap an angle to (-180°, 180°]
const wrapDeg = (degrees: number) =>
  degrees - 360 * Math.ceil((degrees - 180) / 360);

describe('groundTrack', () => {
  test('moves the ISS about 23.6° west in an orbit', () => {
    const period = (2 * Math.PI) / iss.meanMotion;
    const segments = groundTrack(
      iss,
      iss.epoch,
      after(iss.epoch, period * 1000),
      10
    );
    const first = segments[0]![0]!;
    const lastSegment = segments[segments.length - 1]!;
    const last = lastSegment[lastSegment.length - 1]!;

    // Earth turns 23.3° in 92.9 minutes, and the orbit's node drifts 0.3°
    // west
    close(wrapDeg(deg(last.lambda - first.lambda)), -23.6, 0.2);
    close(deg(last.phi), deg(first.phi), 0.2);
    // Once round the world, so across the antimeridian once
    assert.equal(segments.length, 2);
  });

  test('keeps a geostationary track to a point', () => {
    const [segment, ...rest] = groundTrack(
      goes19,
      goes19.epoch,
      after(goes19.epoch, DAY),
      600
    );
    const { phi, lambda } = segment![0]!;

    assert.equal(rest.length, 0);

    for (const point of segment!) {
      close(deg(point.phi), deg(phi), 0.05);
      close(deg(point.lambda), deg(lambda), 0.05);
      close(point.h, 35_786_000, 20_000);
    }

    // GOES-19 holds 75.2° W
    close(deg(lambda), -75.2, 0.1);
  });

  test('splits the track at the antimeridian, never jumping across the map', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SATELLITES.map(({ id }) => id)),
        fc.integer({ min: 0, max: 2 * DAY }),
        (id, offset) => {
          const elements = satellite(id);
          const from = after(elements.epoch, offset);
          const segments = groundTrack(
            elements,
            from,
            after(from, DAY / 4),
            120
          );

          segments.forEach((segment, k) => {
            for (let i = 1; i < segment.length; i++)
              assert.ok(
                Math.abs(segment[i]!.lambda - segment[i - 1]!.lambda) < Math.PI,
                id
              );

            if (k === 0) return;

            // Each segment after the first starts where the last one ended,
            // on the other edge of the map
            const previous = segments[k - 1]!;
            const end = previous[previous.length - 1]!;
            const start = segment[0]!;

            close(Math.abs(end.lambda), Math.PI, 1e-12);
            assert.equal(start.lambda, -end.lambda);
            assert.equal(start.phi, end.phi);
          });
        }
      ),
      { numRuns: 30 }
    );
  });

  test('crosses the antimeridian at the latitude between the points', () => {
    const segments = groundTrack(iss, iss.epoch, after(iss.epoch, DAY), 60);

    for (let k = 1; k < segments.length; k++) {
      const previous = segments[k - 1]!;
      const before = previous[previous.length - 2]!;
      const edge = previous[previous.length - 1]!;
      const next = segments[k]![1]!;

      assert.ok(
        Math.min(before.phi, next.phi) <= edge.phi &&
          edge.phi <= Math.max(before.phi, next.phi)
      );
    }

    // 15.5 orbits a day: once across the antimeridian per orbit
    assert.ok(segments.length >= 15 && segments.length <= 17);
  });

  test('ends exactly at to, and samples every step', () => {
    const to = after(iss.epoch, 150_000);
    const [segment] = groundTrack(iss, iss.epoch, to, 60);
    const last = subSatellitePoint(iss, to);

    // 0, 60, 120 and 150 s
    assert.equal(segment!.length, 4);
    assert.deepEqual(segment![3], last);
  });

  test('rejects invalid input', () => {
    const { epoch } = iss;

    assert.throws(
      () => groundTrack(iss, new Date(Number.NaN), epoch),
      (err) =>
        err instanceof TypeError &&
        err.message === 'from must be a valid Date. Received: Invalid Date'
    );
    assert.throws(
      () => groundTrack(iss, epoch, epoch),
      (err) =>
        err instanceof RangeError &&
        err.message.startsWith('to must be after from.')
    );
    assert.throws(
      () => groundTrack(iss, epoch, after(epoch, DAY), Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'step must be a finite number. Received: NaN'
    );
    assert.throws(
      () => groundTrack(iss, epoch, after(epoch, DAY), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'step must be > 0. Received: 0'
    );
    assert.throws(
      () => groundTrack(iss, epoch, after(epoch, 365 * DAY), 1),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'The track would have more than 1000000 points: take a longer step. Received: 1 s'
    );
  });
});

describe('footprintRadius', () => {
  test('is the distance to the horizon at zero elevation', () => {
    for (const height of [420_000, 20_200_000, 35_786_000])
      close(
        footprintRadius(height),
        horizonSurfaceDistance(height, A) / A,
        1e-12
      );

    // The ISS: 20.2°, 2 252 km along the ground
    close(deg(footprintRadius(420_000)), 20.2, 0.05);
  });

  test('puts the edge at the minimum elevation', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 200_000, max: 4e7, noNaN: true }),
        fc.double({ min: 0, max: 1.5, noNaN: true }),
        (height, elevation) => {
          const radius = footprintRadius(height, elevation as Radians);
          // The satellite overhead, and a point on the edge, in a plane
          const ground = [A * Math.sin(radius), A * Math.cos(radius)];
          const look = [-ground[0]!, A + height - ground[1]!];
          // Up at the edge is along the ground point itself
          const up =
            (look[0]! * ground[0]! + look[1]! * ground[1]!) /
            (Math.hypot(look[0]!, look[1]!) * A);

          close(Math.asin(up), elevation, 1e-9);
        }
      )
    );
  });

  test('gives a higher satellite a larger footprint, never half of Earth', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100_000, max: 1e9, noNaN: true }),
        fc.double({ min: 1.01, max: 10, noNaN: true }),
        fc.double({ min: 0, max: 1.5, noNaN: true }),
        (height, factor, elevation) => {
          const low = footprintRadius(height, elevation as Radians);
          const high = footprintRadius(height * factor, elevation as Radians);

          assert.ok(high > low);
          assert.ok(high < Math.PI / 2 - elevation);
        }
      )
    );
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => footprintRadius(Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'height must be a finite number. Received: NaN'
    );
    assert.throws(
      () => footprintRadius(-1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'height must be > 0. Received: -1'
    );

    for (const elevation of [-0.1, Math.PI / 2])
      assert.throws(
        () => footprintRadius(420_000, elevation as Radians),
        (err) =>
          err instanceof RangeError &&
          err.message ===
            `minElevation must be in [0, π/2). Received: ${elevation}`
      );
  });
});

describe('coverageFootprint', () => {
  const below = subSatellitePoint(iss, iss.epoch);

  test('puts every point at the footprint radius from the point below', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -89, max: 89, noNaN: true }),
        fc.double({ min: -180, max: 180, noNaN: true }),
        fc.double({ min: 300_000, max: 4e7, noNaN: true }),
        fc.double({ min: 0, max: 60, noNaN: true }),
        (lat, lon, h, elevation) => {
          const position = { phi: rad(lat), lambda: rad(lon), h };
          const radius = footprintRadius(h, rad(elevation));

          for (const point of coverageFootprint(position, rad(elevation), 12)) {
            close(
              centralAngle(
                position.phi,
                position.lambda,
                point.phi,
                point.lambda
              ),
              radius,
              1e-9
            );
            assert.ok(point.lambda > -Math.PI && point.lambda <= Math.PI);
            assert.equal(point.h, 0);
          }
        }
      )
    );
  });

  test('starts due north and goes round clockwise', () => {
    const [north, east] = coverageFootprint(below, 0 as Radians, 4);
    const radius = footprintRadius(below.h);

    close(north!.phi, below.phi + radius, 1e-12);
    close(north!.lambda, below.lambda, 1e-12);
    assert.ok(east!.lambda > below.lambda);
  });

  test('keeps longitudes in (-π, π] beside the antimeridian', () => {
    // A hair west of 180°, where adding π rounds up to 2π
    for (const lambda of [Math.PI - 4e-16, Math.PI, -Math.PI + 4e-16])
      for (const point of coverageFootprint(
        { phi: 0 as Radians, lambda: lambda as Radians, h: 300_000 },
        0 as Radians,
        8
      ))
        assert.ok(point.lambda > -Math.PI && point.lambda <= Math.PI);
  });

  test('has the area of a spherical cap', () => {
    const footprint = coverageFootprint(below, rad(10), 720);
    const radius = footprintRadius(below.h, rad(10));
    const area = sphericalPolygonArea(
      footprint.map(({ phi, lambda }) => ({ lat: phi, lon: lambda })),
      A
    );

    close(area, 2 * Math.PI * A * A * (1 - Math.cos(radius)), 1e-4 * area);
  });

  test('covers more ground from higher up', () => {
    const area = (h: number) =>
      sphericalPolygonArea(
        coverageFootprint({ ...below, h }, rad(10), 180).map(
          ({ phi, lambda }) => ({ lat: phi, lon: lambda })
        ),
        A
      );

    assert.ok(area(420_000) < area(800_000));
    assert.ok(area(800_000) < area(20_200_000));
  });

  test('rejects invalid input', () => {
    const invalid = (position: GeodeticCoordinatesInterface) =>
      coverageFootprint(position);

    assert.throws(
      () => invalid({ ...below, phi: Number.NaN as Radians }),
      (err) =>
        err instanceof TypeError &&
        err.message === 'phi must be a finite number. Received: NaN'
    );
    assert.throws(
      () => invalid({ ...below, phi: 2 as Radians }),
      (err) =>
        err instanceof RangeError &&
        err.message === 'phi must be in [-π/2, π/2]. Received: 2'
    );
    assert.throws(
      () => invalid({ ...below, h: 0 }),
      (err) =>
        err instanceof RangeError &&
        err.message === 'height must be > 0. Received: 0'
    );
    assert.throws(
      () => coverageFootprint(below, 0 as Radians, 2.5),
      (err) =>
        err instanceof TypeError &&
        err.message === 'points must be an integer. Received: 2.5'
    );
    assert.throws(
      () => coverageFootprint(below, 0 as Radians, 2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'points must be at least 3. Received: 2'
    );
  });
});
