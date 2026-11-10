import {
  ASTEROIDS,
  AU_METERS,
  COMETS,
  J2000_UTC,
  MILLISECONDS_PER_DAY,
  MOONS,
  PLANETS,
  STARS,
  SYSTEMS
} from '@interstellar-tools/constants';
import type {
  OrbitInterface,
  Radians,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { moonPosition } from '../../cartography/moon-position.js';
import { sunPosition } from '../../cartography/sun-position.js';
import { stateAt } from '../state-at.js';
import { visVivaSpeed } from '../vis-viva-speed.js';

const DEG = Math.PI / 180;
const length = (v: Vector3DTupleType) => Math.hypot(...v);
const cross = (
  [a1, a2, a3]: Vector3DTupleType,
  [b1, b2, b3]: Vector3DTupleType
): Vector3DTupleType => [
  a2 * b3 - a3 * b2,
  a3 * b1 - a1 * b3,
  a1 * b2 - a2 * b1
];
// The angle between two vectors, in degrees
const angleBetween = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  Math.acos(
    Math.min(
      1,
      (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (length(a) * length(b))
    )
  ) / DEG;
const toward = (ra: number, dec: number): Vector3DTupleType => [
  Math.cos(dec * DEG) * Math.cos(ra * DEG),
  Math.cos(dec * DEG) * Math.sin(ra * DEG),
  Math.sin(dec * DEG)
];
const body = <T extends { id: string }>(bodies: readonly T[], id: string) =>
  bodies.find((entry) => entry.id === id)!;
const later = (days: number) =>
  new Date(J2000_UTC.getTime() + days * MILLISECONDS_PER_DAY);

describe('stateAt', () => {
  test('turns every dataset orbit into a 3D position, in its reference plane', () => {
    const orbits = [
      ...PLANETS,
      ...MOONS,
      ...STARS,
      ...SYSTEMS,
      ...COMETS,
      ...ASTEROIDS
    ].flatMap(({ name, orbit }) => (orbit ? [{ name, orbit }] : []));

    assert.ok(orbits.length > 100);

    for (const { name, orbit } of orbits) {
      const { r, v } = stateAt(orbit, later(3652.5), { frame: 'reference' });

      assert.ok([...r, ...v].every(Number.isFinite), name);
    }
  });

  test("puts the Sun's planets at their x, y, z at J2000 (within 0.02 %)", () => {
    for (const { name, parent, orbit, x, y, z } of PLANETS) {
      if (parent !== 'sun') continue;

      const { r } = stateAt(orbit!, J2000_UTC, { frame: 'reference' });
      const au = r.map((m) => m / AU_METERS) as unknown as Vector3DTupleType;
      const miss = Math.hypot(
        au[0] - x!.value,
        au[1] - y!.value,
        au[2] - z!.value
      );

      assert.ok(miss / length(au) < 2e-4, `${name}: ${miss} au off`);
    }
  });

  test('puts Earth opposite the Sun as Earth sees it at J2000 (within 0.05°)', () => {
    const earth = stateAt(body(PLANETS, 'earth').orbit!, J2000_UTC);
    const sun = sunPosition(J2000_UTC).r;

    assert.ok(
      angleBetween(
        earth.r,
        sun.map((m) => -m) as unknown as Vector3DTupleType
      ) < 0.05
    );
  });

  test('puts the Moon where Earth sees it at J2000 (within 1°, and 3 % of its distance)', () => {
    const moon = stateAt(body(MOONS, 'moon').orbit, J2000_UTC);
    const seen = moonPosition(J2000_UTC);

    assert.ok(angleBetween(moon.r, seen.r) < 1);
    assert.ok(Math.abs(length(moon.r) / seen.distance - 1) < 0.03);
  });

  test('turns each moon about the pole of its plane, by its inclination', () => {
    // Titan on Saturn's Laplace plane, Miranda on Uranus's equator, the pole
    // the moons circle counterclockwise, and Triton, backwards, on Neptune's
    for (const [id, ra, dec] of [
      ['titan', 36.4, 84.0],
      ['miranda', 77.311, 15.175],
      ['triton', 299.334, 42.95]
    ] as const) {
      const { orbit } = body(MOONS, id);
      const { r, v } = stateAt(orbit, later(1000));

      assert.ok(
        Math.abs(angleBetween(cross(r, v), toward(ra, dec)) - orbit.i!) < 1e-6,
        id
      );
    }
  });

  test('comes back to the same place after one period, at its distance', () => {
    for (const id of ['moon', 'titan', 'charon', 'dimorphos']) {
      const { orbit } = body(MOONS, id);
      const start = stateAt(orbit, later(100));
      const end = stateAt(orbit, later(100 + orbit.period.value));
      const a = orbit.a.value * AU_METERS;
      const r = length(start.r);

      // A Date rounds to the millisecond: 1e-7 of Dimorphos's 11.9 h orbit
      assert.ok(length(cross(start.r, end.r)) / r ** 2 < 1e-6, id);
      assert.ok(r >= a * (1 - orbit.e) * (1 - 1e-12), id);
      assert.ok(r <= a * (1 + orbit.e) * (1 + 1e-12), id);
    }
  });

  test("moves Earth at the vis-viva speed around the Sun's GM (within 0.1 %)", () => {
    const { r, v } = stateAt(body(PLANETS, 'earth').orbit!, later(200));
    const { orbit } = body(PLANETS, 'earth');
    const expected = visVivaSpeed(
      length(r),
      orbit!.a.value * AU_METERS,
      body(STARS, 'sun').mu!
    );

    assert.ok(Math.abs(length(v) / expected - 1) < 1e-3);
  });

  test('draws an orbit without i flat, backwards when it is retrograde', () => {
    const flat: OrbitInterface = {
      a: { value: 1, unit: 'au' },
      e: 0.1,
      period: { value: 365.25, unit: 'd' },
      angle: 1 as Radians
    };

    for (const retrograde of [false, true]) {
      const { r, v } = stateAt(
        { ...flat, ...(retrograde ? { retrograde } : {}) },
        later(10),
        { frame: 'reference' }
      );
      const h = cross(r, v);

      assert.ok(Math.abs(r[2]) < 1e-12 * length(r));
      assert.equal(Math.sign(h[2]), retrograde ? -1 : 1);
    }
  });

  test("needs a frame it can place in the ICRF, unless asked for the orbit's own", () => {
    const proxima = body(STARS, 'proxima-centauri').orbit!;
    const alphaCentauriA = body(STARS, 'alpha-centauri-a').orbit!;

    assert.throws(() => stateAt(proxima, J2000_UTC), /has no frame/);
    assert.throws(() => stateAt(alphaCentauriA, J2000_UTC), RangeError);
    assert.doesNotThrow(() =>
      stateAt(alphaCentauriA, J2000_UTC, { frame: 'reference' })
    );
  });

  test('rejects an invalid date', () => {
    assert.throws(
      () => stateAt(body(PLANETS, 'mars').orbit!, new Date('nope')),
      TypeError
    );
  });
});
