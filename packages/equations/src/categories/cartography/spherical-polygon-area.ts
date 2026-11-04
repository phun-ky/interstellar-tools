import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertLatitude } from './validate.js';

/** The unit vector towards a latitude and longitude. */
const unitVector = (lat: number, lon: number) =>
  [
    Math.cos(lat) * Math.cos(lon),
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat)
  ] as const;

/**
 * Compute the **area of a polygon on a sphere**, such as an instrument footprint or a region on a planet, from its corner points.
 *
 * $$
 * A = R^2 E,
 * \qquad
 * E = \sum_{i=1}^{n} \alpha_i - (n - 2)\pi
 * $$
 *
 * The spherical excess $ E $ is summed over the triangles from the first vertex, $ (\mathbf v_1, \mathbf v_i, \mathbf v_{i+1}) $, each from the unit vectors $ \mathbf a $, $ \mathbf b $, $ \mathbf c $ to its corners with **Van Oosterom and Strackee's formula**:
 *
 * $$
 * \tan\frac{E}{2} = \frac{\mathbf a \cdot (\mathbf b \times \mathbf c)}{1 + \mathbf a \cdot \mathbf b + \mathbf b \cdot \mathbf c + \mathbf c \cdot \mathbf a}
 * $$
 *
 * Where:
 * - $ \alpha_i $ are the polygon's interior angles
 * - $ \mathbf a $, $ \mathbf b $, $ \mathbf c $ are unit vectors from the sphere's centre to a triangle's corners
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: latitudes and longitudes in **radians**, `R` in **m**.
 * - Output: $ A $ in **m²**.
 *
 * ::: info Notes
 *
 * - **Edges are great-circle arcs**, the shortest path between neighbouring vertices, not lines of constant latitude: the top edge of a "latitude–longitude box" bulges towards the pole. Add vertices along an edge to follow a parallel more closely.
 * - **Winding doesn't matter**: clockwise and anticlockwise give the same area. A polygon splits the sphere in two, and this is the area of the smaller part, at most half the sphere. Closing the ring by repeating the first vertex is allowed.
 * - **Exact for any simple polygon that fits within a hemisphere**, including one that crosses the antimeridian or has a pole inside it or as a vertex: the vertices are joined in 3D, so longitudes need no unwrapping. The formula's sign follows each triangle's winding, so concave polygons work too. A self-intersecting polygon gives the difference of its loops.
 * - The formula stays accurate for tiny triangles and for long, thin ones, where adding up the interior angles, or l'Huilier's theorem from the side lengths, loses the excess to rounding. The triple product is taken from the differences $ \mathbf b - \mathbf a $ and $ \mathbf c - \mathbf a $ to keep its digits.
 *
 * :::
 *
 * ::: practice The Bermuda Triangle
 *
 * **1.15 million km²**
 *
 * _Between Miami, Bermuda and San Juan, on a 6 371 km Earth_
 *
 * The triangle has no official edges: this is the area between the three cities, with great-circle sides.
 *
 * ```ts
 * sphericalPolygonArea(
 *   [
 *     { lat: toRad(25.7617), lon: toRad(-80.1918) }, // Miami
 *     { lat: toRad(32.3078), lon: toRad(-64.7505) }, // Bermuda
 *     { lat: toRad(18.4655), lon: toRad(-66.1057) } // San Juan
 *   ],
 *   6_371_000
 * );
 * // ≈ 1.147e12 m²
 * ```
 *
 * :::
 *
 * @param vertices - The polygon's corners in order, each `{ lat, lon }` in **radians** (at least 3; finite, latitudes in [-π/2, π/2]).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @returns The area $ A $ in **m²**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If there are fewer than 3 vertices, a latitude is outside [-π/2, π/2], or `R <= 0`.
 * @group Cartography
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
 *
 * // An octant, one eighth of the sphere: πR²/2
 * sphericalPolygonArea(
 *   [
 *     { lat: toRad(0), lon: toRad(0) },
 *     { lat: toRad(0), lon: toRad(90) },
 *     { lat: toRad(90), lon: toRad(0) }
 *   ],
 *   1
 * );
 * // ≈ 1.5708
 * ```
 *
 * @see {@link greatCircleDistance}
 * @see https://en.wikipedia.org/wiki/Spherical_trigonometry#Area_and_spherical_excess Spherical trigonometry: area and spherical excess
 * @see https://doi.org/10.1109/TBME.1983.325207 Van Oosterom and Strackee (1983), The solid angle of a plane triangle
 */
export const sphericalPolygonArea = (
  vertices: readonly { lat: Radians; lon: Radians }[],
  R: number
): number => {
  assertFinite([['R', R]]);

  if (R <= 0) throw new RangeError(`R must be > 0. Received: ${R}`);

  if (vertices.length < 3)
    throw new RangeError(
      `vertices must hold at least 3 points. Received: ${vertices.length}`
    );

  for (const [i, { lat, lon }] of vertices.entries()) {
    assertFinite([
      [`vertices[${i}].lat`, lat],
      [`vertices[${i}].lon`, lon]
    ]);
    assertLatitude(`vertices[${i}].lat`, lat);
  }

  const a = unitVector(vertices[0]!.lat, vertices[0]!.lon);

  let excess = 0;

  for (let i = 1; i < vertices.length - 1; i++) {
    const b = unitVector(vertices[i]!.lat, vertices[i]!.lon);
    const c = unitVector(vertices[i + 1]!.lat, vertices[i + 1]!.lon);
    // a · (b × c) = a · ((b − a) × (c − a)), which keeps its digits when the
    // triangle is small or thin
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]] as const;
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]] as const;
    const tripleProduct =
      a[0] * (u[1] * w[2] - u[2] * w[1]) +
      a[1] * (u[2] * w[0] - u[0] * w[2]) +
      a[2] * (u[0] * w[1] - u[1] * w[0]);
    const dots =
      1 +
      (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) +
      (b[0] * c[0] + b[1] * c[1] + b[2] * c[2]) +
      (c[0] * a[0] + c[1] * a[1] + c[2] * a[2]);

    // Signed by the triangle's winding
    excess += 2 * Math.atan2(tripleProduct, dots);
  }

  const E = Math.abs(excess);

  // The smaller of the two parts the polygon splits the sphere into
  return R * R * Math.min(E, 4 * Math.PI - E);
};
