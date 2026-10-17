import { DistanceInterface } from '../distance.js';
import type { OrbitInterface } from '../orbits.js';

/**
 * Kind of system a barycenter holds together.
 *
 * - `'planetary'`: one star with planets, like the Solar System.
 * - `'binary'`: two stars orbiting a shared barycenter.
 * - `'multiple'`: three or more stars, nested as pairs (Alpha Centauri).
 * - `'cluster'`: a loosely bound group whose members have a parent but no orbit.
 *
 * @group Celestial Bodies
 */
export type SystemKindType = 'planetary' | 'binary' | 'multiple' | 'cluster';

/**
 * Represents a **system**: the barycenter (centre of mass) that its members
 * orbit.
 *
 * A system does not list its members. Each member names the system as its
 * `parent`, so the member list is derived and there is one source of truth.
 * Systems nest: the Alpha Centauri AB pair is a system whose parent is the
 * Alpha Centauri system.
 *
 * - `parent` and `orbit` set: the system orbits its parent as one body.
 * - `parent` without `orbit`: bound to the parent, but not on a Kepler orbit.
 * - Neither: unbound.
 *
 * @example
 * ```ts
 * const alphaCentauriAB: SystemInterface = {
 *   id: 'alpha-centauri-ab',
 *   name: 'Alpha Centauri AB',
 *   kind: 'binary',
 *   parent: 'alpha-centauri',
 *   orbit: {
 *     a: { value: 503, unit: 'au' },
 *     e: 0.5,
 *     period: { value: -547, unit: 'kyr' },
 *     angle: Math.PI as Radians
 *   }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface SystemInterface {
  /** Stable identifier, used by `parent` references. Never translated. */
  id: string;
  /** Display name of the system. */
  name: string;
  /** What kind of system the barycenter holds together. */
  kind: SystemKindType;
  /** Id of the galaxy or system this system is bound to. */
  parent?: string;
  /** Orbit of the system's barycenter around its parent. */
  orbit?: OrbitInterface;
  /** Distance from the Sun. */
  distance?: DistanceInterface;
  /** X-coordinate of the barycenter in the parent's frame. */
  x?: DistanceInterface;
  /** Y-coordinate of the barycenter in the parent's frame. */
  y?: DistanceInterface;
  /** Z-coordinate of the barycenter in the parent's frame. */
  z?: DistanceInterface;
}

/**
 * Type alias for a collection of systems.
 * @group Celestial Bodies
 */
export type SystemsType = SystemInterface[];
