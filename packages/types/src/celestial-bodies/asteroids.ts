import { DistanceInterface } from '../distance.js';
import type { FullOrbitInterface } from '../orbits.js';

import type { DisplayInterface } from './display.js';

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
 * **Orbital elements (angles & distances)**, all in `orbit`:
 *
 * - Semi-major axis `a` should be in **astronomical units (au)**.
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
 * **Period convention:** `period` is a positive duration (e.g., in **days**).
 * A retrograde orbit (`i > 90°`) has `retrograde: true`.
 *
 * **Coordinates:** Optional `x,y,z` are distances in a chosen reference frame (e.g., ecliptic
 * J2000). Always document the frame you use in calling code.
 *
 * :::
 *
 * @group Celestial Bodies
 */
export interface AsteroidInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;

  /** Name of the asteroid (e.g., `"Ceres"`, `"Vesta"`). */
  name: string;

  /** General dynamical region (e.g., main-belt, NEO, Trojan). */
  type: AsteroidType;

  /** Specific family/group classification (e.g., Apollo group, Plutino). */
  category: AsteroidCategory;

  /** Spectral/taxonomic class (composition & albedo proxy). */
  spectralType: AsteroidSpectralType;

  /** Id of the star the asteroid orbits (e.g., `'sun'`). */
  parent: string;

  /** Orbit around the parent, with all elements including `i`, `w`, `om` and `q`. */
  orbit: FullOrbitInterface;

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

  /** Mean/characteristic **radius** (e.g., in **km**) as a distance value. */
  radius: DistanceInterface;

  /** How to draw the asteroid: its colour and drawn size, and state a renderer computes. */
  display?: DisplayInterface;
}

/**
 * Convenience alias for a list of asteroids.
 * @group Celestial Bodies
 */
export type AsteroidsType = AsteroidInterface[];
