import type { ShadowType, Vector3DTupleType } from '@interstellar-tools/types';

import { assertVector } from './validate.js';
import { A } from './wgs84.js';

// The Sun's nominal radius in m (IAU 2015 Resolution B3)
const SUN_RADIUS = 695_700_000;
const dot = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const assertNonZero = (name: string, vector: Vector3DTupleType) => {
  if (Math.hypot(...vector) === 0)
    throw new RangeError(`${name} must not be at Earth's centre.`);
};

/**
 * Whether a satellite is in **Earth's shadow**, taking the shadow as a
 * cylinder as wide as Earth, straight back from the Sun. It's the usual quick
 * test for whether a satellite is lit.
 *
 * $$
 * \mathbf{r}\cdot\hat{\mathbf{s}} < 0
 * \quad\text{and}\quad
 * \lVert \mathbf{r} - (\mathbf{r}\cdot\hat{\mathbf{s}})\,\hat{\mathbf{s}} \rVert < R_\oplus
 * $$
 *
 * Where:
 * - $ \mathbf{r} $ is the satellite's position from Earth's centre (m)
 * - $ \hat{\mathbf{s}} $ is the unit vector toward the Sun
 * - $ R_\oplus $ is Earth's equatorial radius, 6 378 137 m (WGS 84)
 *
 * **Units**
 * - Inputs: `r` and `sun` in **m**, from Earth's centre, on the same axes: SGP4's TEME from {@link propagate}, and `sunPosition` from `@interstellar-tools/equations`.
 * - Output: `true` in the shadow.
 *
 * ::: info Notes
 *
 * - The real shadow narrows into a cone, the umbra, inside a widening
 *   penumbra. The cylinder lies between the two, so it puts the start and end
 *   of an eclipse a few seconds out for a low orbit. {@link earthShadow} tells
 *   umbra and penumbra apart.
 * - Earth's atmosphere and flattening shift the edge by a few kilometres,
 *   about a second for the ISS.
 *
 * :::
 *
 * @param r - The satellite's position in **m**, from Earth's centre.
 * @param sun - The Sun's position in **m**, from Earth's centre, on the same axes.
 * @returns `true` if the satellite is in the shadow.
 * @throws {TypeError} If `r` or `sun` is not three finite numbers.
 * @throws {RangeError} If `sun` is at Earth's centre.
 * @group Satellites
 *
 * @example
 * ```ts
 * const date = new Date('2026-11-04T12:00:00Z');
 *
 * isInEarthShadow(propagate(iss, date).r, sunPosition(date).r); // true in eclipse
 * ```
 *
 * @see {@link earthShadow}
 */
export const isInEarthShadow = (
  r: Vector3DTupleType,
  sun: Vector3DTupleType
): boolean => {
  assertVector('r', r);
  assertVector('sun', sun);
  assertNonZero('sun', sun);

  const s = Math.hypot(...sun);
  // How far the satellite is toward the Sun, and from the Earth-Sun line
  const along = dot(r, sun) / s;
  const off = Math.hypot(
    r[0] - (along * sun[0]) / s,
    r[1] - (along * sun[1]) / s,
    r[2] - (along * sun[2]) / s
  );

  return along < 0 && off < A;
};

/**
 * Where a satellite is relative to **Earth's shadow**: in sunlight, in the
 * penumbra where Earth covers part of the Sun, or in the umbra where it
 * covers all of it.
 *
 * Compares the apparent radii of the Sun and of Earth, seen from the
 * satellite, with the angle between them:
 *
 * $$
 * a = \arcsin\frac{R_\odot}{\lVert \mathbf{s} - \mathbf{r} \rVert}, \qquad
 * b = \arcsin\frac{R_\oplus}{\lVert \mathbf{r} \rVert}, \qquad
 * c = \angle(-\mathbf{r},\ \mathbf{s} - \mathbf{r})
 * $$
 *
 * The satellite is sunlit if $ c \ge a + b $, in the umbra if
 * $ c \le b - a $, and in the penumbra between.
 *
 * Where:
 * - $ \mathbf{r} $, $ \mathbf{s} $ are the satellite's and the Sun's positions from Earth's centre (m)
 * - $ R_\odot $ is the Sun's radius, 695 700 km (IAU 2015 B3)
 * - $ R_\oplus $ is Earth's equatorial radius, 6 378 137 m (WGS 84)
 *
 * **Units**
 * - Inputs: `r` and `sun` in **m**, from Earth's centre, on the same axes.
 * - Output: `'sunlit'`, `'penumbra'` or `'umbra'`: see {@link ShadowType}.
 *
 * ::: info Notes
 *
 * - Earth is taken as a sphere without an atmosphere, as in
 *   {@link isInEarthShadow}. Refraction through the atmosphere lights the umbra
 *   a deep red; a satellite there is dark to the eye and its solar panels.
 * - A low satellite crosses the penumbra in about 10 s; Earth's umbra ends
 *   about 1.4 million km away, past which the satellite would see Earth pass
 *   across the Sun, in the penumbra.
 *
 * :::
 *
 * @param r - The satellite's position in **m**, from Earth's centre.
 * @param sun - The Sun's position in **m**, from Earth's centre, on the same axes.
 * @returns `'sunlit'`, `'penumbra'` or `'umbra'`.
 * @throws {TypeError} If `r` or `sun` is not three finite numbers.
 * @throws {RangeError} If `r` is within Earth's equatorial radius of its centre, or `sun` is at Earth's centre.
 * @group Satellites
 *
 * @example
 * ```ts
 * const date = new Date('2026-11-04T12:00:00Z');
 *
 * earthShadow(propagate(iss, date).r, sunPosition(date).r); // 'sunlit', 'penumbra' or 'umbra'
 * ```
 *
 * @see {@link isInEarthShadow}
 */
export const earthShadow = (
  r: Vector3DTupleType,
  sun: Vector3DTupleType
): ShadowType => {
  assertVector('r', r);
  assertVector('sun', sun);
  assertNonZero('sun', sun);

  const distance = Math.hypot(...r);

  if (distance <= A)
    throw new RangeError(
      `r must be farther than ${A} m from Earth's centre. Received: ${distance}`
    );

  const toSun: Vector3DTupleType = [
    sun[0] - r[0],
    sun[1] - r[1],
    sun[2] - r[2]
  ];
  const a = Math.asin(SUN_RADIUS / Math.hypot(...toSun));
  const b = Math.asin(A / distance);
  // The angle between Earth's centre and the Sun's, seen from the satellite
  const c = Math.atan2(
    Math.hypot(
      r[2] * toSun[1] - r[1] * toSun[2],
      r[0] * toSun[2] - r[2] * toSun[0],
      r[1] * toSun[0] - r[0] * toSun[1]
    ),
    -dot(r, toSun)
  );

  if (c >= a + b) return 'sunlit';

  return c <= b - a ? 'umbra' : 'penumbra';
};
