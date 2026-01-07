import { DistanceInterface, MeasureInterface } from '../distance';
import type { Radians } from '../numeric';
import { TemporalInterface } from '../temporal';

import { CartesianCoordinatesInterface } from './planets';

/**
 * High-level **orbital class** of an asteroid (by dynamical region).
 *
 *
 * ::: info
 *
 * These labels group objects by where they reside or co-orbit:
 * - *Main-belt* (between Mars and Jupiter)
 * - *Near-Earth* (perihelion near Earth’s orbit)
 * - *Trojan* (co-orbital with a planet at L4/L5)
 * - *Centaur* (between Jupiter and Neptune)
 * - *Trans-Neptunian Object* (beyond Neptune)
 *
 * :::
 *
 * @group Celestial Bodies
 */
export type AsteroidType =
  | 'main-belt asteroid'
  | 'near-earth asteroid'
  | 'trojan asteroid'
  | 'centaur'
  | 'trans-neptunian object';

/**
 * More specific **group/category** for dynamical families or special bodies.
 *
 *
 * ::: info
 *
 * Common near-Earth subgroups: Amor / Apollo / Aten / Atira.
 * Outer main-belt families: Cybele / Hilda. TNOs: Plutinos (2:3 resonance),
 * "classical" Kuiper belt objects (*cubewanos*), and *scattered disk* objects.
 *
 * :::
 *
 * @group Celestial Bodies
 */
export type AsteroidCategory =
  | 'dwarf planet'
  | 'large asteroid'
  | 'amor group'
  | 'apollo group'
  | 'aten group'
  | 'atira group'
  | 'cybele group'
  | 'hilda group'
  | 'jupiter trojan'
  | 'plutino'
  | 'cubewano'
  | 'scattered disk object';

/**
 * **Spectral (taxonomic) class** based on reflectance spectra & albedo.
 *
 *
 * ::: info
 *
 * Examples:
 * - **C** (carbonaceous, dark), **S** (stony, silicaceous), **M** (metal-rich)
 * - **V** (Vesta-like, basaltic), **D/P** (very red/dark, outer system)
 * - **B/F/G** (subclasses of C/X), **E** (high-albedo enstatite), **X** (degenerate group)
 *
 * :::
 *
 * @group Celestial Bodies
 */
export type AsteroidSpectralType =
  | 'c-type'
  | 's-type'
  | 'v-type'
  | 'm-type'
  | 'b-type'
  | 'd-type'
  | 'p-type'
  | 'f-type'
  | 'g-type'
  | 'x-type'
  | 'e-type'
  | 'other';

/**
 * Canonical shape for an **asteroid record**: identity, dynamics, and optional
 * visualization aides.
 *
 *
 * ::: info
 *
 * **Orbital elements (angles & distances):**
 *
 * - Semi-major axis `a` should be in **astronomical units (au)** via {@link MeasureInterface}.
 * - Eccentricity `e` for bound ellipses typically satisfies \(0 \le e < 1\).
 * - Inclination `i`, argument of perihelion `w` (ω), and longitude of ascending node `om` (Ω)
 *   are given in **degrees**.
 * - True anomaly `angle` (ν) is in **radians**.
 * - Perihelion distance \(q\) should satisfy:
 *
 * $$
 * q \;=\; a\,(1 - e)
 * $$
 *
 * **Period convention:** `period` is a duration (e.g., in **days**) using {@link TemporalInterface}.
 * If you encode direction, a **negative value** indicates **counter-clockwise** in your display
 * convention (visualization-specific; not a physical requirement).
 *
 * **Coordinates:** Optional `x,y,z` are distances in a chosen reference frame (e.g., ecliptic
 * J2000). Always document the frame you use in calling code.
 *
 * :::
 *
 * @group Celestial Bodies
 */
export interface AsteroidInterface {
  /** Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`). */
  name: string;

  /** General dynamical region (e.g., main-belt, NEO, Trojan). */
  type: AsteroidType;

  /** Specific family/group classification (e.g., Apollo group, Plutino). */
  category: AsteroidCategory;

  /** Spectral/taxonomic class (composition & albedo proxy). */
  spectralType: AsteroidSpectralType;

  /** Star system identifier (e.g., `"Solar System"`). */
  system: string;

  /**
   * **Semi-major axis** (typically in **au**).
   *
   * @example
   * ```ts
   * a: { value: 2.77, unit: 'au' }
   * ```
   */
  a: MeasureInterface;

  /**
   * **Eccentricity** of the orbit.
   * ::: info
   *
   * Elliptical orbits: \(0 \le e < 1\). Parabolic: \(e=1\). Hyperbolic: \(e>1\).
   *
   * :::
   */
  e: number;

  /** **Inclination** \(i\) in **degrees**. */
  i: number;

  /** **Argument of perihelion** \( \omega \) in **degrees**. */
  w: number;

  /** **Longitude of ascending node** \( \Omega \) in **degrees**. */
  om: number;

  /** **True anomaly** \( \nu \) (current orbital position) in **radians**. */
  angle: Radians;

  /**
   * **Orbital period** as a duration (e.g., in **days**).
   * ::: info
   *
   * A **negative** value may be used to flag **counter-clockwise** drawing direction in UIs.
   *
   * :::
   */
  period: TemporalInterface;

  /**
   * **Perihelion distance** \( q = a(1-e) \) (typically in **au**).
   * @see a
   * @see e
   */
  q: number;

  /**
   * Optional **Cartesian coordinates** (distance values) in a specified frame.
   * ::: info
   *
   * Provide the reference frame (e.g., ecliptic J2000) in calling code.
   *
   * :::
   */
  x?: DistanceInterface;
  /** See {@link x}. */
  y?: DistanceInterface;
  /** See {@link x}. */
  z?: DistanceInterface;

  /**
   * Optional **semi-minor axis** in **pixels** (for 2D ellipse rendering).
   *
   * ::: info
   *
   * Visualization aid only; not a physical quantity.
   *
   * :::
   */
  miA?: number;

  /**
   * Optional **focus offset** along X for ellipse rendering (pixels).
   *
   * ::: info
   *
   * Visualization aid only; not a physical quantity.
   *
   * :::
   */
  focus_x?: number;

  /** Mean/characteristic **radius** (e.g., in **km**) as a distance value. */
  radius: DistanceInterface;

  /**
   * Optional precomputed **orbit path** for plotting.
   * ::: info
   *
   * Commonly a list of points in your rendering coordinate system.
   *
   * :::
   */
  orbitPath?: CartesianCoordinatesInterface[];

  /** Display color (hex string, e.g., `#AABBCC`). */
  color: string;

  /** Visual **scale factor** (UI only; not physical size). */
  size: number;
}

/**
 * Convenience alias for a list of asteroids.
 * @group Celestial Bodies
 */
export type AsteroidsType = AsteroidInterface[];
