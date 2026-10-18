/**
 * Represents **2D coordinates**, for example a point on a drawn orbit.
 *
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 *
 * @example
 * ```ts
 * const position: CartesianCoordinatesInterface = { x: 100, y: 200 };
 * ```
 * @group Celestial Bodies
 */
export interface CartesianCoordinatesInterface {
  x: number;
  y: number;
}

/**
 * How a body is **drawn**: everything about rendering, kept apart from its
 * physical data and its `orbit`.
 *
 * It holds two kinds of values:
 *
 * - **Hints from the datasets**: `color` on every body, `size` on comets and
 *   asteroids, `opacity` and `density` on asteroid belts.
 * - **State a renderer computes** and keeps on the body, so it doesn't have to
 *   recompute it every frame: `semiMinorAxis`, `focusOffsetX` and
 *   `orbitPath`. The datasets never set these.
 *
 * The computed distances are in whatever unit the renderer uses for
 * `orbit.a` (for example au), measured in the orbit's plane with the parent
 * body at the origin and periapsis along +x.
 *
 * @example
 * ```ts
 * // Drawing an orbit: compute once, keep it on the body
 * const a = convertDistance(body.orbit.a, 'au').value;
 * const { e } = body.orbit;
 *
 * body.display = {
 *   ...body.display,
 *   semiMinorAxis: a * Math.sqrt(1 - e ** 2),
 *   focusOffsetX: a * e
 * };
 * ```
 * @group Celestial Bodies
 */
export interface DisplayInterface {
  /** Colour to draw the body in, as a hex string (`#rrggbb`) or a CSS colour name. */
  color?: string;
  /** Scaled size for drawing, not the physical size (see `radius`). */
  size?: number;
  /** Transparency, from 0 (invisible) to 1 (solid). */
  opacity?: number;
  /** How densely to fill an area, e.g. how many asteroids to draw in a belt. */
  density?: number;
  /** Semi-minor axis of the orbit, $b = a\sqrt{1 - e^2}$, computed by a renderer. */
  semiMinorAxis?: number;
  /** Distance from the ellipse's centre to its focus, $c = a e$, computed by a renderer. */
  focusOffsetX?: number;
  /** Points along the drawn orbit, computed by a renderer. */
  orbitPath?: CartesianCoordinatesInterface[];
}
