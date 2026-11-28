import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import type {
  GeographicCoordinatesInterface,
  ProjectedPointInterface,
  ProjectionOptionsInterface
} from './coordinates.js';
import {
  assertLatitude,
  assertOnMap,
  assertSphere,
  edgeLongitude,
  mapLongitude,
  wrapLongitude
} from './shared.js';

/** Solve 2θ + sin 2θ = π sin φ for θ, for φ in [0, π/2]. */
// w − sin w, by its series where the two nearly cancel
const wMinusSinW = (w: number): number => {
  if (w >= 0.5) return w - Math.sin(w);

  // w³/3! − w⁵/5! + …: by w¹⁷ the terms are 1e-18 of the first
  let term = w ** 3 / 6;
  let sum = 0;

  for (let k = 1; k <= 8; k++) {
    sum += term;
    term *= (-w * w) / ((2 * k + 2) * (2 * k + 3));
  }

  return sum;
};
// sin θ and cos θ of the auxiliary angle, 2θ + sin 2θ = π sin φ, for φ ≥ 0
const auxiliaryAngle = (phi: number): { sin: number; cos: number } => {
  if (phi < 1.4) {
    const target = Math.PI * Math.sin(phi);

    let lo = 0;
    let hi = Math.PI / 2;
    let theta = phi;

    for (let i = 0; i < 100; i++) {
      const f = 2 * theta + Math.sin(2 * theta) - target;

      if (f === 0) break;

      if (f > 0) hi = theta;
      else lo = theta;

      // Newton's step, or bisection if it leaves the bracket
      let next = theta - f / (4 * Math.cos(theta) ** 2);

      if (!(next > lo && next < hi)) next = (lo + hi) / 2;

      const done = Math.abs(next - theta) <= Number.EPSILON;

      theta = next;

      if (done) break;
    }

    return { sin: Math.sin(theta), cos: Math.cos(theta) };
  }

  // Near the pole π sin φ rounds towards π, and cos θ loses its digits: solve
  // for θ′ = π/2 − θ instead, 2θ′ − sin 2θ′ = π(1 − sin φ) = 2π sin²(φ′/2),
  // where φ′ = π/2 − φ is exact. It starts from 2θ′ − sin 2θ′ ≈ (2θ′)³/6
  const target = 2 * Math.PI * Math.sin((Math.PI / 2 - phi) / 2) ** 2;

  let lo = 0;
  let hi = Math.PI / 2;
  let fromPole = Math.cbrt(0.75 * target);

  for (let i = 0; i < 100; i++) {
    const f = wMinusSinW(2 * fromPole) - target;

    if (f === 0) break;

    if (f > 0) hi = fromPole;
    else lo = fromPole;

    let next = fromPole - f / (4 * Math.sin(fromPole) ** 2);

    if (!(next > lo && next < hi)) next = (lo + hi) / 2;

    // θ′ can be tiny, so stop on a relative step
    const done = Math.abs(next - fromPole) <= 1e-15 * next;

    fromPole = next;

    if (done) break;
  }

  return { sin: Math.cos(fromPole), cos: Math.sin(fromPole) };
};

/**
 * Project a point on a sphere with the **Mollweide projection**: an equal-area map of the whole sphere inside an ellipse twice as wide as tall.
 *
 * $$
 * 2\theta + \sin 2\theta = \pi\sin\varphi,
 * \qquad
 * x = \frac{2\sqrt2}{\pi}R\,(\lambda - \lambda_0)\cos\theta,
 * \qquad
 * y = \sqrt2\,R\sin\theta
 * $$
 *
 * Where:
 * - $ \varphi $ and $ \lambda $ are the point's latitude and longitude (rad)
 * - $ \theta $ is an auxiliary angle, found with Newton's method (rad)
 * - $ \lambda_0 $ is the central meridian (rad)
 * - $ R $ is the sphere's radius (m)
 *
 * **Units**
 * - Inputs: angles in **radians**, `R` in **m**.
 * - Output: `{ x, y }` in **m**.
 *
 * ::: info Notes
 *
 * - **Equal-area**: a region's area on the map is its area on the sphere. The whole sphere fills an ellipse $ 4\sqrt2 R $ wide and $ 2\sqrt2 R $ tall, with straight parallels and elliptical meridians, which distorts shapes less near the edges than {@link sinusoidal}. Sky surveys, such as maps of the cosmic microwave background, use it.
 * - Near the poles, where $ \pi \sin\varphi $ rounds towards $ \pi $, the solver works with the angles from the pole, $ \theta' = \pi/2 - \theta $ and $ \varphi' = \pi/2 - \varphi $, solving $ 2\theta' - \sin 2\theta' = 2\pi \sin^2(\varphi'/2) $, so $ x $ and the latitude keep their digits. Newton's method falls back to bisection, so it always converges. At a pole, $ x $ is 0.
 * - $ \lambda - \lambda_0 $ is wrapped to [−π, π]: −π, the west edge, only when $ \lambda - \lambda_0 $ is exactly −π, and π otherwise.
 *   −π itself stays on the left edge, so a line that ends there, like a
 *   ground track split at the antimeridian, isn't drawn across the map.
 *
 * :::
 *
 * @param phi - Latitude $ \varphi $ in **radians** (finite, in [−π/2, π/2]).
 * @param lambda - Longitude $ \lambda $ in **radians** (finite).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the map, `{ x, y }` in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `phi` is outside [−π/2, π/2], or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * // The edge of the map: 180° E on the equator, and the north pole
 * mollweide(0 as Radians, Math.PI as Radians, 1); // { x: 2√2, y: 0 }
 * mollweide((Math.PI / 2) as Radians, 0 as Radians, 1); // { x: 0, y: √2 }
 * ```
 *
 * @see {@link inverseMollweide}
 * @see {@link sinusoidal}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 31
 */
export const mollweide = (
  phi: Radians,
  lambda: Radians,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);

  const theta = auxiliaryAngle(Math.abs(phi));

  return {
    x:
      ((2 * Math.SQRT2) / Math.PI) *
      R *
      mapLongitude(lambda - lambda0) *
      theta.cos,
    y: Math.sign(phi) * Math.SQRT2 * R * theta.sin
  };
};

/**
 * Find the point on a sphere for a point on a **Mollweide** map: the inverse of {@link mollweide}.
 *
 * $$
 * \theta = \arcsin\frac{y}{\sqrt2 R},
 * \qquad
 * \varphi = \arcsin\frac{2\theta + \sin 2\theta}{\pi},
 * \qquad
 * \lambda = \lambda_0 + \frac{\pi x}{2\sqrt2 R\cos\theta}
 * $$
 *
 * **Units**
 * - Inputs: `x`, `y` and `R` in **m**, `lambda0` in **radians**.
 * - Output: `{ phi, lambda }` in **radians**, with $ \lambda $ in (−π, π].
 *
 * ::: info Notes
 *
 * - No iteration is needed this way round. Near a pole it works with the angles from the pole, as {@link mollweide} does, so $ \varphi $ comes back to within about $ 10^{-12} $ rad even there: what $ y $, rounded so close to $ \sqrt2 R $, still tells apart. $ \lambda $ is less certain so near a pole, but the parallels are so short there that the point is still within about $ 10^{-12} R $ along them.
 * - Only points inside the ellipse have an inverse: a point outside it throws a `RangeError`. Near a pole the ellipse narrows faster than `y` can say where it is, so points that rounding puts just outside it are taken as on its edge: up to about $ 10^{-7} R $ outside, right at the pole.
 * - Every longitude meets at a pole, so there $ \lambda $ is $ \lambda_0 $.
 *
 * :::
 *
 * @param x - Distance east of the origin in **m** (finite, on the map).
 * @param y - Distance north of the origin in **m** (finite, on the map).
 * @param R - Radius $ R $ of the sphere in **m** (finite, > 0).
 * @param options - `lambda0`, the central meridian (radians, defaults to 0).
 * @returns The point on the sphere, `{ phi, lambda }` in **radians**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If the point is outside the map's ellipse, or `R <= 0`.
 * @group Projections
 *
 * @example
 * ```ts
 * inverseMollweide(2 * Math.SQRT2, 0, 1); // { phi: 0, lambda: π }
 * ```
 *
 * @see {@link mollweide}
 * @see https://doi.org/10.3133/pp1395 Snyder (1987), Map projections: a working manual, ch. 31
 */
export const inverseMollweide = (
  x: number,
  y: number,
  R: number,
  { lambda0 = 0 as Radians }: ProjectionOptionsInterface = {}
): GeographicCoordinatesInterface => {
  assertFinite([
    ['x', x],
    ['y', y]
  ]);
  assertSphere(R, lambda0);

  const sinTheta = y / (Math.SQRT2 * R);

  // Allowing for rounding at the poles
  if (Math.abs(sinTheta) > 1 + 1e-12)
    throw new RangeError(
      `y must be on the map: it is beyond a pole. Received: ${y}`
    );

  const s = Math.min(1, Math.max(-1, sinTheta));

  let cosTheta: number;
  let phi: number;

  if (Math.abs(s) <= 0.5) {
    const theta = Math.asin(s);

    cosTheta = Math.cos(theta);
    phi = Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI);
  } else {
    // Near a pole, asin of a number next to 1 loses most of its digits: work
    // with the angles from the pole, θ′ = π/2 − |θ| and φ′ = π/2 − |φ|.
    // 1 − |s| is exact here, and 1 − sin|φ| = (2θ′ − sin 2θ′)/π
    const fromPole = 2 * Math.asin(Math.sqrt((1 - Math.abs(s)) / 2));
    const d = wMinusSinW(2 * fromPole) / Math.PI;

    cosTheta = Math.sin(fromPole);
    phi = Math.sign(s) * (Math.PI / 2 - 2 * Math.asin(Math.sqrt(d / 2)));
  }

  const scale = ((2 * Math.SQRT2) / Math.PI) * R;
  const perRadian = scale * cosTheta;
  // y holds sin θ to an ulp or so, which moves cos θ by up to ε / cos θ, and
  // by √ε at a pole: allow 4 of that before calling x off the map
  const rounding =
    (4 * Number.EPSILON) / Math.max(cosTheta, Math.sqrt(Number.EPSILON));

  assertOnMap(x, scale * (cosTheta + rounding));

  return {
    phi: phi as Radians,
    // At a pole every longitude meets, and the map has no width
    lambda: wrapLongitude(
      lambda0 + (x === 0 || perRadian === 0 ? 0 : edgeLongitude(x / perRadian))
    )
  };
};
