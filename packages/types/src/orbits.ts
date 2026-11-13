import type { DistanceInterface } from './distance.js';
import type { Vector3DTupleType } from './math.js';
import type { DegreesType, Radians } from './numeric.js';
import type { SpeedInterface } from './quantities.js';
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
 * A **direction on the sky**, in the ICRF (the J2000 equator and equinox), in
 * degrees as catalogues give it: the pole of a reference plane, for example.
 *
 * @example
 * ```ts
 * // Saturn's north pole (Archinal et al. 2018)
 * const pole: CelestialDirectionInterface = {
 *   rightAscension: 40.589 as DegreesType,
 *   declination: 83.537 as DegreesType
 * };
 * ```
 * @group Orbits
 */
export interface CelestialDirectionInterface {
  /** Right ascension, eastwards from the equinox along the equator, in degrees. */
  rightAscension: DegreesType;
  /** Declination, north of the equator, in degrees. */
  declination: DegreesType;
}

/**
 * A **direction in ecliptic coordinates**, against the J2000 ecliptic and
 * equinox, in degrees: how a small body's spin pole or the interstellar wind's
 * direction is often given.
 *
 * @example
 * ```ts
 * // Where the interstellar wind comes from (McComas et al. 2015)
 * const upwind: EclipticDirectionInterface = {
 *   eclipticLongitude: 255.7 as DegreesType,
 *   eclipticLatitude: 5.1 as DegreesType
 * };
 * ```
 * @group Orbits
 */
export interface EclipticDirectionInterface {
  /** Ecliptic longitude, eastwards from the equinox along the ecliptic, in degrees. */
  eclipticLongitude: DegreesType;
  /** Ecliptic latitude, north of the ecliptic, in degrees. */
  eclipticLatitude: DegreesType;
}

/**
 * The **reference plane** an orbit's `i`, `om` and `w` are measured from.
 *
 * ::: info
 *
 * - `'ecliptic'`: the J2000 ecliptic, `om` from the J2000 equinox. Planets,
 *   asteroids, comets and Earth's Moon.
 * - `'equator'`: the ICRF equator, `om` from the J2000 equinox.
 * - `'laplace'`: a moon's local Laplace plane, the plane its orbit precesses
 *   around, with its pole in the frame's `pole`. As in JPL's satellite mean
 *   elements, `om` is measured along the plane from its ascending node on the
 *   ICRF equator, which lies at the pole's right ascension plus 90°.
 * - `'parent-equator'`: the equator of the body the orbit is around, with its
 *   pole in the frame's `pole`, and `om` measured as for a Laplace plane. The
 *   pole is the one the moons circle counterclockwise: for Uranus, which spins
 *   backwards, the opposite of the IAU's north pole.
 * - `'sky'`: the plane of the sky, as binary stars and the S-stars are
 *   measured: `i` to the sky (above 90° is clockwise on the sky, not
 *   retrograde), `om` the position angle of the ascending node, from north
 *   through east, and the node the one where the body moves away from us.
 * - `'galactic'`: the galaxy's disk, for a galactic orbit.
 *
 * :::
 *
 * @group Orbits
 */
export type OrbitReferencePlaneType =
  'ecliptic' | 'equator' | 'laplace' | 'parent-equator' | 'sky' | 'galactic';

/**
 * The **frame** of an orbit's orientation elements: the plane `i`, `om` and
 * `w` are measured from, and that plane's pole where it isn't a standard one.
 *
 * @example
 * ```ts
 * const earthFrame: OrbitFrameInterface = { plane: 'ecliptic' };
 * // A Laplace plane close to Saturn's equator
 * const moonFrame: OrbitFrameInterface = {
 *   plane: 'laplace',
 *   pole: {
 *     rightAscension: 40.6 as DegreesType,
 *     declination: 83.5 as DegreesType
 *   }
 * };
 * ```
 * @group Orbits
 */
export interface OrbitFrameInterface {
  /** The reference plane. */
  plane: OrbitReferencePlaneType;
  /** The plane's pole in the ICRF, for a `'laplace'` or `'parent-equator'` plane. */
  pole?: CelestialDirectionInterface;
}

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
 * - `i`, `w`, `om` and `q` are only given where the dataset has them. `frame`
 *   says which plane they're measured from: without it, an orbit can only be
 *   drawn flat, in its own plane.
 * - Where `i` is given against the ecliptic, for a body around the Sun, or
 *   against its parent's equator or Laplace plane, `retrograde` is set exactly
 *   when `i > 90°`. On the sky, `i > 90°` only
 *   means the orbit turns clockwise as we see it.
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
  /** The plane `i`, `om` and `w` are measured from. Given with them. */
  frame?: OrbitFrameInterface;
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
 * An **open orbit**: a hyperbola, $e > 1$, that passes its parent once and
 * never comes back, as an interstellar object's does around the Sun.
 *
 * It has no period, so it's a type of its own, not an
 * {@link OrbitInterface}: functions that read an orbit's `period` don't take
 * it.
 *
 * ::: info
 *
 * - `a` is negative, and the periapsis distance $q = a(1 - e)$ is still
 *   positive.
 * - `angle` is the true anomaly at J2000, as for every other orbit. On a
 *   hyperbola it lies between $-\nu_\infty$ and $\nu_\infty$, the directions of
 *   its asymptotes, $\nu_\infty = \arccos(-1/e)$: negative before periapsis,
 *   on the way in.
 * - `periapsisTime` and `excessSpeed` describe the pass better than `a` and
 *   `angle` do: when it's closest, and how fast it comes in, far away. On an
 *   ideal two-body hyperbola $v_\infty = \sqrt{-\mu / a}$; a real object's
 *   speed is better taken from its orbit around the Solar System's
 *   barycentre, before the planets and its own outgassing pulled on it.
 * - `retrograde` is set exactly when `i > 90°`, as for a closed orbit.
 *
 * :::
 *
 * @example
 * ```ts
 * // 2I/Borisov, from JPL Horizons' elements osculating at its perihelion
 * const borisov: OpenOrbitInterface = {
 *   a: { value: -0.8515, unit: 'au' },
 *   e: 3.3565,
 *   q: { value: 2.0065, unit: 'au' },
 *   i: 44.053 as DegreesType,
 *   w: 209.124 as DegreesType,
 *   om: 308.148 as DegreesType,
 *   angle: -1.8537 as Radians,
 *   periapsisTime: new Date('2019-12-08T13:16:04Z'),
 *   excessSpeed: { value: 32.28, unit: 'km/s' },
 *   frame: { plane: 'ecliptic' }
 * };
 * ```
 * @group Orbits
 */
export interface OpenOrbitInterface {
  /** Semi-major axis, negative. */
  a: DistanceInterface;
  /** Orbital eccentricity, above 1. */
  e: number;
  /** Periapsis distance $q = a(1 - e)$, positive. */
  q: DistanceInterface;
  /** `true` for a retrograde orbit, `i > 90°`. Omitted for prograde ones. */
  retrograde?: boolean;
  /** True anomaly at J2000 in radians, between $-\nu_\infty$ and $\nu_\infty$. */
  angle: Radians;
  /** Orbital inclination in degrees. */
  i: DegreesType;
  /** Argument of periapsis in degrees. */
  w: DegreesType;
  /** Longitude of the ascending node in degrees. */
  om: DegreesType;
  /** When it passes periapsis, in UTC. */
  periapsisTime: Date;
  /** Hyperbolic excess speed $v_\infty$: its speed far from its parent, coming in. */
  excessSpeed: SpeedInterface;
  /** The plane `i`, `om` and `w` are measured from. */
  frame?: OrbitFrameInterface;
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
