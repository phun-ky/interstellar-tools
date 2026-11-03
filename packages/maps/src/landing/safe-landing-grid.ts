import type { Radians } from '@interstellar-tools/types';

import type { GridInterface } from '../terrain/grid.js';
import { slopeAt } from '../terrain/slope.js';
import { terrainRoughnessIndexAt } from '../terrain/terrain-roughness-index.js';
import { assertGrid, mapGrid } from '../terrain/window.js';
import { assertFinite } from '../validate.js';

import { isStableLanding } from './is-stable-landing.js';
import { tipOverAngle } from './tip-over-angle.js';

/**
 * The lander, for {@link safeLandingGrid}.
 *
 * @group Landing sites
 */
export interface SafeLandingOptionsInterface {
  /** Distance from the centre of mass to the tipping edge, horizontally, in **m** (finite, > 0). */
  rFootprint: number;
  /** Height of the centre of mass above the ground in **m** (finite, > 0). */
  hCoM: number;
  /** Extra tilt from touchdown, the rock-up, in **radians** (finite, >= 0). Defaults to 0. */
  dynamicTilt?: Radians;
  /** Largest Terrain Roughness Index the lander can take, in **m** (finite, >= 0): its clearance under the body, for example. */
  maxRoughness: number;
}

/**
 * Map where a lander can **touch down safely** on an elevation grid: where it stays upright on the slope and the ground is smooth enough.
 *
 * $$
 * \text{safe} \iff
 * \theta_\text{slope} + \theta_\text{dynamic} < \arctan\frac{r_\text{footprint}}{h_\text{CoM}}
 * \ \text{ and }\
 * \text{TRI} \le \text{TRI}_\text{max}
 * $$
 *
 * Where:
 * - $ \theta_\text{slope} $ is the cell's slope, from {@link slopeAt}
 * - the tip-over check is {@link isStableLanding}
 * - TRI is the cell's {@link terrainRoughnessIndexAt}
 *
 * **Units**
 * - Inputs: heights, `rFootprint`, `hCoM` and `maxRoughness` in **m**, `dynamicTilt` in **radians**.
 * - Output: a grid of the same shape: **1** where it's safe, **0** where it isn't, `NaN` where it can't tell.
 *
 * ::: info Notes
 *
 * - A first screen, not a landing decision. It's static: touchdown speed, leg stroke, friction and footpads digging in or sliding all change the real limits. And it only sees what the grid sees: pick a cell size about the size of the lander's footprint, since boulders smaller than a cell don't show in its slope or roughness.
 * - The slope is the steepest one over each cell, so the check assumes the lander faces its weakest direction downhill. Pass the footprint distance in that direction: for four legs on a circle of radius $ R $, $ R\cos 45° $.
 * - `NaN` on the grid's edge and next to a missing cell: a cell can only be judged with its whole 3 × 3 neighbourhood.
 *
 * :::
 *
 * @param grid - Elevation grid, heights in **m**.
 * @param lander - The lander: `rFootprint`, `hCoM`, `maxRoughness`, and optionally `dynamicTilt`.
 * @returns A grid of 1 (safe), 0 (unsafe) and `NaN` (unknown).
 * @throws {TypeError} If a grid size, cell size or lander value is not finite.
 * @throws {RangeError} If the grid's parts don't fit together, `rFootprint` or `hCoM` is `<= 0`, or `dynamicTilt` or `maxRoughness` is negative.
 * @group Landing sites
 *
 * @example
 * ```ts
 * // A lander that tips at 40°, with 2° of rock-up and 0.5 m of clearance
 * const safe = safeLandingGrid(grid, {
 *   rFootprint: 3.0,
 *   hCoM: 3.6,
 *   dynamicTilt: toRad(2),
 *   maxRoughness: 0.5
 * });
 * gridValueAt(safe, 10, 12); // 1, 0 or NaN
 * ```
 *
 * @see {@link isStableLanding}
 * @see {@link slopeGrid}
 * @see {@link terrainRoughnessIndexGrid}
 */
export const safeLandingGrid = (
  grid: GridInterface,
  {
    rFootprint,
    hCoM,
    dynamicTilt = 0 as Radians,
    maxRoughness
  }: SafeLandingOptionsInterface
): GridInterface => {
  assertGrid(grid);
  assertFinite([
    ['dynamicTilt', dynamicTilt],
    ['maxRoughness', maxRoughness]
  ]);

  for (const [name, x] of [
    ['dynamicTilt', dynamicTilt],
    ['maxRoughness', maxRoughness]
  ] as const)
    if (x < 0) throw new RangeError(`${name} must be >= 0. Received: ${x}`);

  // Validates rFootprint and hCoM before the first cell
  tipOverAngle(rFootprint, hCoM);

  return mapGrid(grid, (row, column) => {
    const slope = slopeAt(grid, row, column);
    const roughness = terrainRoughnessIndexAt(grid, row, column);

    if (Number.isNaN(slope) || Number.isNaN(roughness)) return NaN;

    return isStableLanding(slope, dynamicTilt, rFootprint, hCoM) &&
      roughness <= maxRoughness
      ? 1
      : 0;
  });
};
