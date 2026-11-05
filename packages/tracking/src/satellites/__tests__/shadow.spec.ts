import { AU_METERS as AU } from '@interstellar-tools/constants';
import { sunPosition } from '@interstellar-tools/equations';
import type { Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { propagate } from '../propagate.js';
import { earthShadow, isInEarthShadow } from '../shadow.js';
import { parseTle } from '../tle.js';
import { A } from '../wgs84.js';

const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);
// The Sun along x, and a satellite `behind` m behind Earth, `off` m from the
// Earth-Sun line
const sun: Vector3DTupleType = [AU, 0, 0];
const at = (behind: number, off: number): Vector3DTupleType => [
  -behind,
  off,
  0
];
const times = (v: Vector3DTupleType, k: number): Vector3DTupleType => [
  v[0] * k,
  v[1] * k,
  v[2] * k
];
const unit = fc
  .tuple(
    fc.double({ min: -1, max: 1, noNaN: true }),
    fc.double({ min: -1, max: 1, noNaN: true }),
    fc.double({ min: -1, max: 1, noNaN: true })
  )
  .filter((v) => Math.hypot(...v) > 0.1)
  .map((v) => times(v, 1 / Math.hypot(...v)));

describe('isInEarthShadow', () => {
  test('shadows a satellite behind Earth, opposite the Sun', () => {
    assert.equal(isInEarthShadow(at(7e6, 0), sun), true);
    assert.equal(isInEarthShadow(at(7e6, A - 1000), sun), true);
  });

  test('lights a satellite on the Sun side, beside Earth or beyond its width', () => {
    assert.equal(isInEarthShadow(at(-7e6, 0), sun), false);
    assert.equal(isInEarthShadow([0, 7e6, 0], sun), false);
    assert.equal(isInEarthShadow(at(7e6, A + 1000), sun), false);
  });

  test('lights any satellite closer to the Sun than Earth is', () => {
    fc.assert(
      fc.property(
        unit,
        unit,
        fc.double({ min: 6.6e6, max: 5e7, noNaN: true }),
        (direction, toSun, distance) => {
          const r = times(direction, distance);
          const s = times(toSun, AU);

          fc.pre(r[0] * s[0] + r[1] * s[1] + r[2] * s[2] > 0);
          assert.equal(isInEarthShadow(r, s), false);
        }
      )
    );
  });

  test("rejects an invalid position or a Sun at Earth's centre", () => {
    assert.throws(
      () => isInEarthShadow([1, 2, Number.NaN], sun),
      (err) =>
        err instanceof TypeError &&
        err.message === 'r must be three finite numbers. Received: 1,2,NaN'
    );
    assert.throws(
      () => isInEarthShadow(at(7e6, 0), [0, 0, 0]),
      (err) =>
        err instanceof RangeError &&
        err.message === "sun must not be at Earth's centre."
    );
  });
});

describe('earthShadow', () => {
  test('puts a satellite straight behind Earth in the umbra', () => {
    assert.equal(earthShadow(at(7e6, 0), sun), 'umbra');
  });

  test('puts a satellite on the Sun side, or beside Earth, in sunlight', () => {
    assert.equal(earthShadow(at(-7e6, 0), sun), 'sunlit');
    assert.equal(earthShadow([0, 7e6, 0], sun), 'sunlit');
  });

  test('narrows the umbra and widens the penumbra away from Earth', () => {
    // 7 000 km behind Earth's centre, the edges are about 30 km either side
    // of the cylinder
    assert.equal(earthShadow(at(7e6, A - 100_000), sun), 'umbra');
    assert.equal(earthShadow(at(7e6, A), sun), 'penumbra');
    assert.equal(earthShadow(at(7e6, A + 100_000), sun), 'sunlit');
  });

  test('ends the umbra about 1.4 million km behind Earth', () => {
    assert.equal(earthShadow(at(1.3e9, 0), sun), 'umbra');
    // Earth passes across the Sun, but doesn't cover it
    assert.equal(earthShadow(at(1.5e9, 0), sun), 'penumbra');
  });

  test('agrees with the cylinder: the umbra is inside it, sunlight outside it', () => {
    fc.assert(
      fc.property(
        unit,
        unit,
        fc.double({ min: 6.6e6, max: 5e7, noNaN: true }),
        (direction, toSun, distance) => {
          const r = times(direction, distance);
          const s = times(toSun, AU);
          const shadow = earthShadow(r, s);

          if (shadow === 'umbra') assert.equal(isInEarthShadow(r, s), true);

          if (shadow === 'sunlit') assert.equal(isInEarthShadow(r, s), false);
        }
      )
    );
  });

  test('keeps the ISS in the umbra for about a third of each orbit', () => {
    let umbra = 0;
    let cylinder = 0;

    // Every 30 s for a day: 15.5 orbits
    for (let s = 0; s < 86_400; s += 30) {
      const date = new Date(iss.epoch.getTime() + s * 1000);
      const { r } = propagate(iss, date);
      const toSun = sunPosition(date).r;

      if (earthShadow(r, toSun) === 'umbra') umbra++;

      if (isInEarthShadow(r, toSun)) cylinder++;
    }

    // 37 % on this day; less as the orbit turns edge-on to the Sun
    assert.ok(umbra / 2880 > 0.33 && umbra / 2880 < 0.4, `${umbra / 2880}`);
    assert.ok(Math.abs(cylinder - umbra) < 10);
  });

  test("rejects an invalid position, one inside Earth or a Sun at Earth's centre", () => {
    assert.throws(
      () => earthShadow(at(7e6, 0), [AU, Infinity, 0]),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'sun must be three finite numbers. Received: 149597870700,Infinity,0'
    );
    assert.throws(
      () => earthShadow(at(6e6, 0), sun),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          "r must be farther than 6378137 m from Earth's centre. Received: 6000000"
    );
    assert.throws(() => earthShadow(at(7e6, 0), [0, 0, 0]), RangeError);
  });
});
