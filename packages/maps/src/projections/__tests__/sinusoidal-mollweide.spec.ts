import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import type { ProjectedPointInterface } from '../coordinates.js';
import { inverseMollweide, mollweide } from '../mollweide.js';
import { inverseSinusoidal, sinusoidal } from '../sinusoidal.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// Angles equal up to whole turns
const sameAngle = (a: number, b: number, eps = 1e-12) =>
  close(Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))), 0, eps);
const latitude = fc.double({
  min: -Math.PI / 2 + 1e-3,
  max: Math.PI / 2 - 1e-3,
  noNaN: true
}) as fc.Arbitrary<Radians>;
const longitude = fc.double({
  min: -10,
  max: 10,
  noNaN: true
}) as fc.Arbitrary<Radians>;
const radius = fc.double({ min: 1, max: 1e8, noNaN: true });

type Projection = (
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: { lambda0?: Radians }
) => ProjectedPointInterface;
type Inverse = (
  x: number,
  y: number,
  R: number,
  options?: { lambda0?: Radians }
) => { phi: Radians; lambda: Radians };

for (const [name, project, inverse] of [
  ['sinusoidal', sinusoidal, inverseSinusoidal],
  ['mollweide', mollweide, inverseMollweide]
] as [string, Projection, Inverse][])
  describe(`${name} (shared)`, () => {
    test('round-trips through its inverse', () => {
      fc.assert(
        fc.property(
          latitude,
          longitude,
          longitude,
          radius,
          (phi, lambda, lambda0, R) => {
            const { x, y } = project(phi, lambda, R, { lambda0 });
            const back = inverse(x, y, R, { lambda0 });

            close(back.phi, phi, 1e-9);
            sameAngle(back.lambda, lambda, 1e-9);
            assert.ok(back.lambda > -Math.PI && back.lambda <= Math.PI);
          }
        )
      );
    });

    test('is equal-area: a small cell keeps its area on the sphere', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1.5, max: 1.5, noNaN: true }),
          fc.double({ min: -3, max: 3, noNaN: true }),
          (phi, lambda) => {
            const h = 1e-6;
            const at = (p: number, l: number) =>
              project(p as Radians, l as Radians, 1);
            const east = [at(phi, lambda + h), at(phi, lambda - h)] as const;
            const north = [at(phi + h, lambda), at(phi - h, lambda)] as const;
            const xl = (east[0].x - east[1].x) / (2 * h);
            const yl = (east[0].y - east[1].y) / (2 * h);
            const xp = (north[0].x - north[1].x) / (2 * h);
            const yp = (north[0].y - north[1].y) / (2 * h);

            // dA on the map over dλ dφ, against R² cos φ on the sphere
            close(Math.abs(xl * yp - xp * yl), Math.cos(phi), 1e-6);
          }
        )
      );
    });

    test('maps the equator to y = 0, the central meridian to x = 0', () => {
      const { x, y } = project(0 as Radians, rad(40), 7, { lambda0: rad(40) });

      close(x, 0);
      close(y, 0);
    });

    test('meets at a point at each pole', () => {
      for (const sign of [1, -1]) {
        const a = project(((sign * Math.PI) / 2) as Radians, rad(-120), 3);
        const b = project(((sign * Math.PI) / 2) as Radians, rad(75), 3);

        close(a.x, 0);
        close(b.x, 0);
        close(a.y, b.y);
        const pole = inverse(0, a.y, 3, { lambda0: rad(10) });

        close(pole.phi, (sign * Math.PI) / 2);
        assert.equal(pole.lambda, rad(10));
      }
    });

    test('throws off the map and on bad inputs', () => {
      const edge = project(rad(30), rad(180), 1);

      assert.throws(() => inverse(edge.x * 1.001, edge.y, 1), RangeError);
      assert.throws(() => inverse(0, 2, 1), RangeError);
      assert.throws(() => inverse(0, 0, 0), RangeError);
      assert.throws(() => inverse(NaN, 0, 1), TypeError);
      assert.throws(() => project(2 as Radians, 0 as Radians, 1), RangeError);
      assert.throws(
        () => project(0 as Radians, Infinity as Radians, 1),
        TypeError
      );
      assert.throws(
        () =>
          project(0 as Radians, 0 as Radians, 1, { lambda0: NaN as Radians }),
        TypeError
      );
    });
  });

describe('sinusoidal', () => {
  test('draws every parallel at its true length', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }),
        (phi) => {
          const edge = sinusoidal(phi as Radians, Math.PI as Radians, 2);

          close(edge.x, 2 * Math.PI * Math.cos(phi));
          close(edge.y, 2 * phi);
        }
      )
    );
  });

  test('matches the docs example on the Moon', () => {
    const { x, y } = sinusoidal(rad(60), rad(90), 1_737_400);

    close(x, 1_364_550.769, 1e-3);
    close(y, 1_819_401.025, 1e-3);

    const back = inverseSinusoidal(1_364_551, 1_819_401, 1_737_400);

    close(back.phi, rad(60), 1e-6);
    close(back.lambda, rad(90), 1e-6);
  });
});

describe('mollweide', () => {
  test('fits the whole sphere in an ellipse twice as wide as tall', () => {
    close(mollweide(0 as Radians, Math.PI as Radians, 1).x, 2 * Math.SQRT2);
    close(mollweide(rad(90), 0 as Radians, 1).y, Math.SQRT2);

    // The edge meridians trace the ellipse
    fc.assert(
      fc.property(
        fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }),
        (phi) => {
          const { x, y } = mollweide(phi as Radians, Math.PI as Radians, 1);

          close((x / (2 * Math.SQRT2)) ** 2 + (y / Math.SQRT2) ** 2, 1);
        }
      )
    );
  });

  test('solves 2θ + sin 2θ = π sin φ, right up to the poles', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }),
          fc
            .double({ min: 1e-15, max: 1e-2, noNaN: true })
            .map((d) => Math.PI / 2 - d)
        ),
        (phi) => {
          // sin θ from y, then the equation's left side
          const theta = Math.asin(
            mollweide(phi as Radians, 0 as Radians, 1).y / Math.SQRT2
          );

          close(
            2 * theta + Math.sin(2 * theta),
            Math.PI * Math.sin(phi),
            1e-14
          );
        }
      )
    );
  });

  test('round-trips the edge of the map', () => {
    const { x, y } = mollweide(rad(-30), Math.PI as Radians, 1);
    const back = inverseMollweide(x, y, 1);

    close(back.phi, rad(-30));
    sameAngle(back.lambda, Math.PI);
  });
});
