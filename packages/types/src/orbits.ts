import type { DistanceInterface } from './distance.js';
import type { Vector3DTupleType } from './math.js';
import type { DegreesType, Radians } from './numeric.js';
import type { TemporalInterface } from './temporal.js';

/**
 * Clohessy–Wiltshire / Hill relative-motion **state vector** in the LVLH frame.
 *
 * Axes (LVLH / RSW-style):
 * - `x`   — **radial** (outward from the central body / reference orbit radius)
 * - `y`   — **along-track** / tangential (direction of motion of the reference orbit)
 * - `z`   — **cross-track** (completes right-handed frame, roughly orbit-normal)
 *
 * Components:
 * - `x`, `y`, `z` are relative position components.
 * - `xDot`, `yDot`, `zDot` are relative velocity components (time derivatives).
 *
 * Units:
 * - Positions in meters or kilometers (choose one and stay consistent).
 * - Velocities in m/s or km/s accordingly.
 *
 * This tuple is commonly used as the state for integrating the CW/Hill ODEs.
 *
 * @example
 * ```ts
 * const s: CwState = [
 *   100,   // x (m)
 *   0,     // y (m)
 *   0,     // z (m)
 *   0,     // xDot (m/s)
 *   0.01,  // yDot (m/s)
 *   0      // zDot (m/s)
 * ];
 * ```
 *
 * @group Orbits
 */
export type CwState = readonly [
  /** Radial relative position (outward). */
  x: number,
  /** Along-track relative position (tangential). */
  y: number,
  /** Cross-track relative position (orbit-normal). */
  z: number,
  /** Time derivative of `x` (radial relative velocity). */
  xDot: number,
  /** Time derivative of `y` (along-track relative velocity). */
  yDot: number,
  /** Time derivative of `z` (cross-track relative velocity). */
  zDot: number
];

/**
 * Time derivative of {@link CwState} for CW/Hill dynamics.
 *
 * Ordered as:
 * - Position derivatives: `[xDot, yDot, zDot]`
 * - Acceleration terms:   `[xDDot, yDDot, zDDot]`
 *
 * Units:
 * - First three components: velocity (m/s or km/s).
 * - Last three components: acceleration (m/s² or km/s²).
 *
 * Useful as the return type for an ODE RHS function, e.g. `cwHillDerivatives(state, n)`.
 *
 * @example
 * ```ts
 * const ds: CwStateDerivative = [
 *   0,     // xDot (m/s)
 *   0.01,  // yDot (m/s)
 *   0,     // zDot (m/s)
 *   0.0002,// xDDot (m/s²)
 *   0,     // yDDot (m/s²)
 *   0      // zDDot (m/s²)
 * ];
 * ```
 *
 * @group Orbits
 */
export type CwStateDerivative = readonly [
  /** Time derivative of `x` (radial relative velocity). */
  xDot: number,
  /** Time derivative of `y` (along-track relative velocity). */
  yDot: number,
  /** Time derivative of `z` (cross-track relative velocity). */
  zDot: number,
  /** Time derivative of `xDot` (radial relative acceleration). */
  xDDot: number,
  /** Time derivative of `yDot` (along-track relative acceleration). */
  yDDot: number,
  /** Time derivative of `zDot` (cross-track relative acceleration). */
  zDDot: number
];

/**
 * Kepler **orbital elements** of one body around its parent.
 *
 * The parent is whatever the body is gravitationally bound to: a star, a
 * planet, a barycenter or a galaxy. It is named by the `parent` id on the body
 * or system that carries this orbit, and the elements always describe the
 * motion **around that parent**, never around anything further up.
 *
 * ::: info
 *
 * - **Pairs**: when two bodies orbit a shared barycenter (Alpha Centauri A and
 *   B), each carries its own orbit. Both share `e`, `period` and `angle`, their
 *   periapses point in opposite directions, and their semi-major axes split by
 *   mass ratio: $a_1 = a \, m_2 / (m_1 + m_2)$, where $a$ is their separation.
 * - **Direction**: `period` is always a positive duration. A retrograde orbit,
 *   moving against its parent's rotation, has `retrograde: true`; a renderer
 *   can use `retrograde ? -1 : 1` as the direction of travel.
 * - `i`, `w`, `om` and `q` are only given where the dataset has them (comets and
 *   asteroids). Where `i` is given, `retrograde` is set exactly when `i > 90°`.
 *
 * :::
 *
 * @example
 * ```ts
 * const earthOrbit: OrbitInterface = {
 *   a: { value: 1.0, unit: 'au' },
 *   e: 0.0167,
 *   period: { value: 365.256, unit: 'd' },
 *   angle: 1.753 as Radians
 * };
 * ```
 * @group Orbits
 */
export interface OrbitInterface {
  /** Semi-major axis of this body's orbit around the parent's centre of mass. */
  a: DistanceInterface;
  /** Orbital eccentricity (0 = circular, closer to 1 = highly elliptical). */
  e: number;
  /** Orbital period, always positive. See `retrograde` for the direction. */
  period: TemporalInterface;
  /** `true` for a retrograde orbit. Omitted for the usual prograde orbits. */
  retrograde?: boolean;
  /** Current orbital position at J2000 in radians (true anomaly). */
  angle: Radians;
  /** Orbital inclination in degrees, as catalogues give it. */
  i?: DegreesType;
  /** Argument of periapsis in degrees. */
  w?: DegreesType;
  /** Longitude of the ascending node in degrees. */
  om?: DegreesType;
  /** Periapsis distance $q = a(1 - e)$. */
  q?: DistanceInterface;
}

/**
 * An {@link OrbitInterface} with every orientation element given: `i`, `w`,
 * `om` and `q`. Comets and asteroids carry these.
 *
 * @group Orbits
 */
export interface FullOrbitInterface extends OrbitInterface {
  /** Orbital inclination in degrees. */
  i: DegreesType;
  /** Argument of periapsis in degrees. */
  w: DegreesType;
  /** Longitude of the ascending node in degrees. */
  om: DegreesType;
  /** Periapsis distance $q = a(1 - e)$. */
  q: DistanceInterface;
}

/**
 * The six **classical orbital elements** of a two-body orbit, in SI units and radians.
 *
 * Together they fix the orbit's size and shape (`a`, `e`), its plane (`i`,
 * `raan`), its orientation in that plane (`argp`) and the body's place on it
 * (`nu`). Returned by `stateToElements` and taken by `elementsToState` in
 * `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - `a` is negative for a hyperbolic orbit ($e > 1$).
 * - For orbits where an angle is undefined, the conventions are: a circular
 *   orbit has `argp = 0` and measures `nu` from the ascending node; an
 *   equatorial orbit has `raan = 0` and measures `argp` from the x axis; a
 *   circular equatorial orbit measures `nu` from the x axis.
 *
 * :::
 *
 * @example
 * ```ts
 * const iss: ClassicalElementsInterface = {
 *   a: 6_791_000,
 *   e: 0.0005,
 *   i: 0.9013 as Radians,
 *   raan: 1.2 as Radians,
 *   argp: 0.5 as Radians,
 *   nu: 0 as Radians
 * };
 * ```
 * @group Orbits
 */
export interface ClassicalElementsInterface {
  /** Semi-major axis in m; negative for hyperbolic orbits. */
  a: number;
  /** Eccentricity: 0 circular, below 1 elliptic, above 1 hyperbolic. */
  e: number;
  /** Inclination in radians, in [0, π]. */
  i: Radians;
  /** Right ascension of the ascending node (Ω) in radians, in [0, 2π). */
  raan: Radians;
  /** Argument of periapsis (ω) in radians, in [0, 2π). */
  argp: Radians;
  /** True anomaly (ν) in radians, in [0, 2π). */
  nu: Radians;
}

/**
 * A body's **state vector**: its position and velocity in an inertial frame
 * centred on the body it orbits.
 *
 * @group Orbits
 */
export interface StateVectorInterface {
  /** Position in m. */
  r: Vector3DTupleType;
  /** Velocity in m/s. */
  v: Vector3DTupleType;
}
