import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { groundSampleDistance } from '../ground-sample-distance.js';
import { illuminationAngles } from '../illumination-angles.js';
import { instantaneousFieldOfView } from '../instantaneous-field-of-view.js';
import { lambertReflectance } from '../lambert-reflectance.js';
import { lommelSeeligerReflectance } from '../lommel-seeliger-reflectance.js';
import { swathWidth } from '../swath-width.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (r: number) => (r * 180) / Math.PI;
const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≉ ${b}`);
const direction = (elevationDeg: number): Vector3DTupleType => [
  Math.cos(rad(elevationDeg)),
  0,
  Math.sin(rad(elevationDeg))
];

describe('instantaneousFieldOfView', () => {
  test('is p / f for a real camera', () => {
    close(instantaneousFieldOfView(7e-6, 0.7), 1e-5, 1e-9);
  });

  test('is exact for wide angles: a pitch twice the focal length sees 90°', () => {
    close(instantaneousFieldOfView(2, 1), Math.PI / 2);
  });

  test('throws for non-finite or non-positive inputs', () => {
    assert.throws(
      () => instantaneousFieldOfView(Number.NaN, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'pixelPitch must be a finite number. Received: NaN'
    );
    assert.throws(
      () => instantaneousFieldOfView(1e-6, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'focalLength must be > 0. Received: 0'
    );
  });
});

describe('groundSampleDistance and swathWidth', () => {
  test('scale linearly with distance', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1e8, noNaN: true }),
        fc.double({ min: 1e-9, max: 1, noNaN: true }),
        fc.double({ min: 1.5, max: 10, noNaN: true }),
        (h, angle, k) => {
          close(
            groundSampleDistance(k * h, angle as Radians),
            k * groundSampleDistance(h, angle as Radians),
            1e-12
          );
          close(
            swathWidth(k * h, angle as Radians),
            k * swathWidth(h, angle as Radians),
            1e-12
          );
        }
      )
    );
  });

  test('approach distance × angle for small angles', () => {
    close(groundSampleDistance(300_000, 1e-6 as Radians), 0.3, 1e-9);
  });

  test('see twice the distance across with a 90° field of view', () => {
    close(swathWidth(1000, rad(90)), 2000);
  });

  test('throw for a non-positive distance or an angle outside (0, π)', () => {
    assert.throws(
      () => groundSampleDistance(0, 1e-6 as Radians),
      (err) =>
        err instanceof RangeError &&
        err.message === 'distance must be > 0. Received: 0'
    );
    assert.throws(
      () => groundSampleDistance(1, Math.PI as Radians),
      (err) =>
        err instanceof RangeError &&
        err.message === `ifov must be < π. Received: ${Math.PI}`
    );
    assert.throws(
      () => swathWidth(1, Number.POSITIVE_INFINITY as Radians),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'fieldOfView must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => swathWidth(1, 4 as Radians),
      (err) =>
        err instanceof RangeError &&
        err.message === 'fieldOfView must be < π. Received: 4'
    );
  });
});

describe('illuminationAngles', () => {
  test('has zero phase with the Sun behind the observer', () => {
    const { phase } = illuminationAngles(
      [0, 0, 1],
      direction(40),
      direction(40)
    );

    assert.equal(phase, 0);
  });

  test('gives the Sun’s zenith angle as incidence, independent of vector lengths', () => {
    const { incidence, emission, phase } = illuminationAngles(
      [0, 0, 5],
      [0.5 * 3, 0, (Math.sqrt(3) / 2) * 3],
      [0, 0, 0.1]
    );

    close(incidence, Math.PI / 6);
    close(emission, 0);
    close(phase, Math.PI / 6);
  });

  test('marks a point in shadow with an incidence past π/2', () => {
    assert.ok(
      illuminationAngles([0, 0, 1], direction(-5), [0, 0, 1]).incidence >
        Math.PI / 2
    );
  });

  test('throws for non-finite components or a zero vector', () => {
    assert.throws(
      () => illuminationAngles([0, 0, 1], [Number.NaN, 0, 1], [0, 0, 1]),
      (err) =>
        err instanceof TypeError &&
        err.message === 'toSun must have finite components. Received: NaN'
    );
    assert.throws(
      () => illuminationAngles([0, 0, 1], [0, 0, 1], [0, 0, 0]),
      (err) =>
        err instanceof RangeError &&
        err.message === 'toObserver must not be the zero vector.'
    );
  });
});

describe('lambertReflectance', () => {
  test('is cos i, 1 overhead and 0 in shadow', () => {
    assert.equal(lambertReflectance(rad(0)), 1);
    close(lambertReflectance(rad(60)), 0.5);
    assert.equal(lambertReflectance(rad(120)), 0);
  });

  test('throws for a non-finite or negative incidence', () => {
    assert.throws(() => lambertReflectance(Number.NaN as Radians), TypeError);
    assert.throws(
      () => lambertReflectance(-1 as Radians),
      (err) =>
        err instanceof RangeError &&
        err.message === 'incidence must be >= 0. Received: -1'
    );
  });
});

describe('lommelSeeligerReflectance', () => {
  test('is 1/2 whenever i = e', () => {
    for (const a of [0, 10, 45, 80, 89.9])
      close(lommelSeeligerReflectance(rad(a), rad(a)), 0.5);
  });

  test('brightens towards 1 as the observer nears the horizon', () => {
    assert.ok(
      lommelSeeligerReflectance(rad(30), rad(89)) >
        lommelSeeligerReflectance(rad(30), rad(60))
    );
    assert.ok(lommelSeeligerReflectance(rad(30), rad(89.999)) > 0.99);
  });

  test('is 0 in shadow or out of sight', () => {
    assert.equal(lommelSeeligerReflectance(rad(90), rad(10)), 0);
    assert.equal(lommelSeeligerReflectance(rad(10), rad(95)), 0);
  });

  test('throws for a non-finite or negative angle', () => {
    assert.throws(
      () => lommelSeeligerReflectance(rad(10), Number.NaN as Radians),
      (err) =>
        err instanceof TypeError &&
        err.message === 'emission must be a finite number. Received: NaN'
    );
    assert.throws(
      () => lommelSeeligerReflectance(-0.5 as Radians, rad(10)),
      (err) =>
        err instanceof RangeError &&
        err.message === 'incidence must be >= 0. Received: -0.5'
    );
  });
});

// HiRISE: 1 µrad IFOV, 1.14° × 0.18° field of view, about 30 cm a pixel and
// a 6 km swath from 300 km (NASA, Mars Reconnaissance Orbiter science
// instruments). Apollo 11: sun elevation 10.8° at landing, mean descent angle
// 16° (Apollo by the Numbers)
describe('In practice values', () => {
  test('groundSampleDistance: HiRISE sees 30 cm a pixel from 300 km', () => {
    assert.equal(
      groundSampleDistance(300_000, 1e-6 as Radians).toFixed(2),
      '0.30'
    );
  });

  test('swathWidth: HiRISE covers 5.97 km, about 20 000 pixels of 30 cm', () => {
    const w = swathWidth(300_000, rad(1.14));

    assert.equal((w / 1000).toFixed(2), '5.97');
    assert.equal(Math.round(w / 0.3 / 1000) * 1000, 20_000);
  });

  test('illuminationAngles: 5.2° phase at Tranquility Base, 79.2° incidence, 74.0° emission', () => {
    const { incidence, emission, phase } = illuminationAngles(
      [0, 0, 1],
      direction(10.8),
      direction(16)
    );

    assert.equal(deg(phase).toFixed(1), '5.2');
    assert.equal(deg(incidence).toFixed(1), '79.2');
    assert.equal(deg(emission).toFixed(1), '74.0');
  });
});
