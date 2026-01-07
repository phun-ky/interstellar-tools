/**
 * Compute **planetocentric latitude** ($ \varphi_c $) from body-fixed Cartesian coordinates.
 *
 * Planetocentric latitude is defined as the angle between the body's equatorial plane and
 * the radius vector from the body's center of mass to the point:
 *
 * $$
 * \varphi_c = \arctan\!\left(\frac{z}{\sqrt{x^2+y^2}}\right)
 * $$
 *
 * Implementation note:
 * - This uses `atan2(z, hypot(x,y))` for numerical stability and correct quadrant handling.
 *
 * @param x - X coordinate in a body-fixed frame (finite).
 * @param y - Y coordinate in a body-fixed frame (finite).
 * @param z - Z coordinate in a body-fixed frame (finite).
 * @returns Planetocentric latitude ($ \varphi_c $) in **radians** (range: ($[- \pi/2, \pi/2] $)).
 * @throws {TypeError} If any input is not a finite number.
 * @group Cartography
 *
 * @example
 * ```ts
 * // Point directly above the equator on +X axis:
 * const phi = planetocentricLatitude(1, 0, 0);
 * // phi === 0
 *
 * // Point on +Z axis:
 * const northPole = planetocentricLatitude(0, 0, 1);
 * // northPole === Math.PI / 2
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Planetary_coordinate_system Planetary coordinate system (definitions of planetocentric vs. planetographic latitude)
 * @see https://planetarynames.wr.usgs.gov/Page/Website USGS Planetary Names (planetocentric latitude definition)
 * @see https://pds.nasa.gov/datastandards/pds3/standards/sr/Chapter02.pdf NASA PDS Standards Reference (planetocentric latitude defined as angle to the center-of-mass vector)
 * @see https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/Tutorials/pdf/individual_docs/17_frames_and_coordinate_systems.pdf NAIF SPICE tutorial: Frames and Coordinate Systems (planetocentric/body-fixed frame conventions)
 */
export const planetocentricLatitude = (
  x: number,
  y: number,
  z: number
): number => {
  if (!Number.isFinite(x))
    throw new TypeError(`x must be finite. Received: ${x}`);

  if (!Number.isFinite(y))
    throw new TypeError(`y must be finite. Received: ${y}`);

  if (!Number.isFinite(z))
    throw new TypeError(`z must be finite. Received: ${z}`);

  const rxy = Math.hypot(x, y);

  return Math.atan2(z, rxy);
};
