import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { sphericalPolygonArea } from '../spherical-polygon-area.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// A polygon from [lat, lon] pairs in degrees
const polygon = (points: readonly (readonly [number, number])[]) =>
  points.map(([lat, lon]) => ({ lat: rad(lat), lon: rad(lon) }));
const unit = (lat: number, lon: number) => [
  Math.cos(lat) * Math.cos(lon),
  Math.cos(lat) * Math.sin(lon),
  Math.sin(lat)
];
const dot = (a: number[], b: number[]) =>
  a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const cross = (a: number[], b: number[]) => [
  a[1]! * b[2]! - a[2]! * b[1]!,
  a[2]! * b[0]! - a[0]! * b[2]!,
  a[0]! * b[1]! - a[1]! * b[0]!
];
const octant = polygon([
  [0, 0],
  [0, 90],
  [90, 0]
]);

describe('sphericalPolygonArea', () => {
  test('gives πR²/2 for an octant, one eighth of the sphere', () => {
    const R = 3_389_500;

    relClose(sphericalPolygonArea(octant, R) / (R * R), Math.PI / 2, 1e-14);
  });

  test('ignores the winding, the starting vertex and a closing vertex', () => {
    const ring = polygon([
      [10, 20],
      [12, 31],
      [25, 28],
      [21, 17]
    ]);
    const area = sphericalPolygonArea(ring, 1);

    relClose(sphericalPolygonArea([...ring].reverse(), 1), area, 1e-14);
    relClose(
      sphericalPolygonArea([...ring.slice(2), ...ring.slice(0, 2)], 1),
      area,
      1e-14
    );
    relClose(sphericalPolygonArea([...ring, ring[0]!], 1), area, 1e-14);
  });

  test('matches the flat area for a tiny triangle', () => {
    // Legs of 1e-6 rad along the equator and a meridian: 6.4 m on Earth
    const d = 1e-6;
    const area = sphericalPolygonArea(
      [
        { lat: 0 as Radians, lon: 0 as Radians },
        { lat: 0 as Radians, lon: d as Radians },
        { lat: d as Radians, lon: 0 as Radians }
      ],
      1
    );

    relClose(area / (d * d), 1 / 2, 1e-8);
  });

  test('matches the flat area for a tiny square', () => {
    // 1e-5 rad on a side at 30° N, on a 6 371 km Earth: about 64 m
    const R = 6_371_000;
    const [phi, d] = [rad(30), 1e-5];
    const area = sphericalPolygonArea(
      [
        { lat: phi, lon: 0 as Radians },
        { lat: phi, lon: d as Radians },
        { lat: (phi + d) as Radians, lon: d as Radians },
        { lat: (phi + d) as Radians, lon: 0 as Radians }
      ],
      R
    );

    relClose(area / (R * R * d * d * Math.cos(phi + d / 2)), 1, 1e-8);
  });

  test('holds a pole, and crosses the antimeridian', () => {
    // Four vertices at colatitude θ, 90° apart, around the north pole:
    // E = 8 atan(sec θ) − 2π, from Girard's theorem
    for (const lat of [89, 80, 45, 10]) {
      const theta = rad(90 - lat);
      const expected = 8 * Math.atan(1 / Math.cos(theta)) - 2 * Math.PI;

      for (const lon0 of [0, 45, 170]) {
        const square = polygon(
          [0, 90, 180, 270].map((lon) => [lat, lon0 + lon] as const)
        );

        relClose(sphericalPolygonArea(square, 1), expected, 1e-12);
        // The same about the south pole
        relClose(
          sphericalPolygonArea(
            square.map(({ lat: l, lon }) => ({ lat: -l as Radians, lon })),
            1
          ),
          expected,
          1e-12
        );
      }
    }

    // Straddling 180°, against the same shape straddling 0°
    relClose(
      sphericalPolygonArea(
        polygon([
          [-5, 170],
          [-5, -170],
          [8, -175],
          [6, 172]
        ]),
        1
      ),
      sphericalPolygonArea(
        polygon([
          [-5, -10],
          [-5, 10],
          [8, 5],
          [6, -8]
        ]),
        1
      ),
      1e-12
    );
  });

  test('takes a pole as a vertex', () => {
    relClose(
      sphericalPolygonArea(
        polygon([
          [90, 123],
          [0, 0],
          [0, 90]
        ]),
        1
      ),
      Math.PI / 2,
      1e-14
    );
  });

  test('adds up the parts of a concave polygon', () => {
    // An L, cut along the edge from (1°, 0°) to (1°, 1°) into two parts
    const L = polygon([
      [0, 0],
      [0, 2],
      [1, 2],
      [1, 1],
      [2, 1],
      [2, 0]
    ]);
    const bottom = polygon([
      [0, 0],
      [0, 2],
      [1, 2],
      [1, 1],
      [1, 0]
    ]);
    const top = polygon([
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 0]
    ]);

    relClose(
      sphericalPolygonArea(L, 1),
      sphericalPolygonArea(bottom, 1) + sphericalPolygonArea(top, 1),
      1e-14
    );
  });

  test("agrees with l'Huilier's theorem for well-shaped triangles", () => {
    // tan(E/4) = √(tan(s/2) tan((s − a)/2) tan((s − b)/2) tan((s − c)/2))
    // Spread evenly over the sphere: fast-check's doubles favour 0 and the
    // ends of a range, which gives mostly degenerate triangles
    const point = fc
      .tuple(fc.integer({ min: 0, max: 1e6 }), fc.integer({ min: 0, max: 1e6 }))
      .map(([u, v]) => ({
        lat: Math.asin((2 * u) / 1e6 - 1),
        lon: (v / 1e6) * 2 * Math.PI - Math.PI
      }));
    const side = (u: number[], v: number[]) =>
      Math.atan2(Math.hypot(...cross(u, v)), dot(u, v));

    fc.assert(
      fc.property(point, point, point, (p, q, r) => {
        const [a, b, c] = [p, q, r].map(({ lat, lon }) => unit(lat, lon)) as [
          number[],
          number[],
          number[]
        ];
        const sides = [side(b, c), side(c, a), side(a, b)];
        const s = (sides[0]! + sides[1]! + sides[2]!) / 2;

        // l'Huilier loses thin triangles, sides near π are ill-defined,
        fc.pre(sides.every((x) => s - x > 1e-3 && x < Math.PI - 1e-3));

        const E =
          4 *
          Math.atan(
            Math.sqrt(
              Math.tan(s / 2) *
                sides.reduce((t, x) => t * Math.tan((s - x) / 2), 1)
            )
          );
        // and it loses digits as a triangle nears a hemisphere, E → 2π
        fc.pre(E < 1.8 * Math.PI);

        const area = sphericalPolygonArea(
          [p, q, r].map(({ lat, lon }) => ({
            lat: lat as Radians,
            lon: lon as Radians
          })),
          1
        );

        relClose(area, Math.min(E, 4 * Math.PI - E), 1e-9);
      })
    );
  });

  test('stays accurate for triangles of nearly a hemisphere', () => {
    // Against 50-digit values from mpmath
    for (const [vertices, expected] of [
      [
        [
          [0.0009999994756266983, -3.141591592541168],
          [0, 0],
          [-0.0010486448188880176, 3.141592115916969]
        ],
        6.2820886717912956085
      ],
      [
        [
          [-0.0009999999904761814, 0],
          [0, -3.1415924575451526],
          [0.11371118276600971, 0]
        ],
        6.282789773533066733
      ],
      [
        [
          [0, 3.14159217177278],
          [0.9186209042236433, 0],
          [-1.5551751343760165, 0]
        ],
        6.283183843602511947
      ],
      [
        [
          [0, -3.1415924500723347],
          [-0.05115658431759368, 0],
          [0.01628485205019609, 0]
        ],
        6.2831523581241558954
      ]
    ] as const)
      relClose(
        sphericalPolygonArea(
          vertices.map(([lat, lon]) => ({
            lat: lat as Radians,
            lon: lon as Radians
          })),
          1
        ),
        expected,
        1e-12
      );
  });

  test('keeps the area of a long, thin triangle', () => {
    // A quarter of the equator, with its apex 1e-10 rad north of the middle:
    // E ≈ (2√2 − 2) h. The side lengths can't show it: a + b − c ≈ 1e-20
    const h = 1e-10;
    const area = sphericalPolygonArea(
      [
        { lat: 0 as Radians, lon: 0 as Radians },
        { lat: 0 as Radians, lon: rad(90) },
        { lat: h as Radians, lon: rad(45) }
      ],
      1
    );

    relClose(area / h, 2 * Math.SQRT2 - 2, 1e-6);
  });

  test('matches the docs examples', () => {
    relClose(sphericalPolygonArea(octant, 1), 1.5708, 1e-4);
    relClose(
      sphericalPolygonArea(
        polygon([
          [25.7617, -80.1918], // Miami
          [32.3078, -64.7505], // Bermuda
          [18.4655, -66.1057] // San Juan
        ]),
        6_371_000
      ) / 1e12,
      1.147,
      1e-3
    );
  });

  test('throws on bad inputs', () => {
    assert.throws(
      () => sphericalPolygonArea(octant.slice(0, 2), 1),
      RangeError
    );
    assert.throws(() => sphericalPolygonArea(octant, 0), RangeError);
    assert.throws(() => sphericalPolygonArea(octant, NaN), TypeError);
    assert.throws(
      () =>
        sphericalPolygonArea(
          [...octant, { lat: 2 as Radians, lon: 0 as Radians }],
          1
        ),
      RangeError
    );
    assert.throws(
      () =>
        sphericalPolygonArea(
          [...octant, { lat: 0 as Radians, lon: Infinity as Radians }],
          1
        ),
      TypeError
    );
  });
});
