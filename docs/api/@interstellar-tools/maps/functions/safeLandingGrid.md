[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
safeLandingGrid

# Function: safeLandingGrid()

```ts
function safeLandingGrid(
  grid: GridInterface,
  lander: SafeLandingOptionsInterface
): GridInterface;
```

Defined in:
[landing/safe-landing-grid.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L78)

Map where a lander can **touch down safely** on an elevation grid: where it
stays upright on the slope and the ground is smooth enough.

$$
\text{safe} \iff
\theta_\text{slope} + \theta_\text{dynamic} < \arctan\frac{r_\text{footprint}}{h_\text{CoM}}
\ \text{ and }\
\text{TRI} \le \text{TRI}_\text{max}
$$

Where:

- $\theta_\text{slope}$ is the cell's slope, from [slopeAt](slopeAt.md)
- the tip-over check is [isStableLanding](isStableLanding.md)
- TRI is the cell's [terrainRoughnessIndexAt](terrainRoughnessIndexAt.md)

**Units**

- Inputs: heights, `rFootprint`, `hCoM` and `maxRoughness` in **m**,
  `dynamicTilt` in **radians**.
- Output: a grid of the same shape: **1** where it's safe, **0** where it isn't,
  `NaN` where it can't tell.

::: info Notes

- A first screen, not a landing decision. It's static: touchdown speed, leg
  stroke, friction and footpads digging in or sliding all change the real
  limits. And it only sees what the grid sees: pick a cell size about the size
  of the lander's footprint, since boulders smaller than a cell don't show in
  its slope or roughness.
- The slope is the steepest one over each cell, so the check assumes the lander
  faces its weakest direction downhill. Pass the footprint distance in that
  direction: for four legs on a circle of radius $R$, $R\cos 45°$.
- `NaN` on the grid's edge and next to a missing cell: a cell can only be judged
  with its whole 3 × 3 neighbourhood.

:::

## Parameters

| Parameter | Type                                                                          | Description                                                                     |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md)                             | Elevation grid, heights in **m**.                                               |
| `lander`  | [`SafeLandingOptionsInterface`](../interfaces/SafeLandingOptionsInterface.md) | The lander: `rFootprint`, `hCoM`, `maxRoughness`, and optionally `dynamicTilt`. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of 1 (safe), 0 (unsafe) and `NaN` (unknown).

## Throws

If a grid size, cell size or lander value is not finite.

## Throws

If the grid's parts don't fit together, `rFootprint` or `hCoM` is `<= 0`, or
`dynamicTilt` or `maxRoughness` is negative.

## Example

```ts
// A lander that tips at 40°, with 2° of rock-up and 0.5 m of clearance
const safe = safeLandingGrid(grid, {
  rFootprint: 3.0,
  hCoM: 3.6,
  dynamicTilt: toRad(2),
  maxRoughness: 0.5
});
gridValueAt(safe, 10, 12); // 1, 0 or NaN
```

## See

- [isStableLanding](isStableLanding.md)
- [slopeGrid](slopeGrid.md)
- [terrainRoughnessIndexGrid](terrainRoughnessIndexGrid.md)
