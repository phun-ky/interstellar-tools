[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
topographicWetnessIndex

# Function: topographicWetnessIndex()

```ts
function topographicWetnessIndex(
  grid: GridInterface,
  options?: TopographicWetnessIndexOptionsInterface
): GridInterface;
```

Defined in:
[terrain/topographic-wetness-index.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/topographic-wetness-index.ts#L74)

Compute the **Topographic Wetness Index** of every cell of an elevation grid:
where water would collect, from how much ground drains through a cell and how
slowly it drains away.

$$
\text{TWI} = \ln\frac{a}{\tan\beta},
\qquad
a = \frac{A}{w}
$$

Where:

- $A$ is the area draining through the cell, from
  [flowAccumulation](flowAccumulation.md) (m²)
- $w = \sqrt{\Delta x\,\Delta y}$ is the width the flow crosses, taken as the
  cell size (m)
- $a$ is the area draining through each metre of that width (m)
- $\beta$ is the cell's slope, from [slopeAt](slopeAt.md), at least `minSlope`
  (rad)

**Units**

- Input: heights and the cell size in **m**.
- Output: the index, the logarithm of $a/\tan\beta$ in **m**. Higher is wetter.

::: info Notes

- High where a large area drains through gentle ground: valley floors and the
  foot of slopes. Low on ridges and steep slopes, which shed water fast. Beven &
  Kirkby (1979) used it to predict where soil saturates; on Mars it points to
  where water or ice would collect.
- $a$ is in metres, so the index depends on the unit of length: in kilometres it
  would be $\ln 1000 \approx 6.9$ lower. Compare values computed the same way.
- Level ground has $\tan\beta = 0$; `minSlope` stands in for it there, and makes
  flat ground very wet. Flow is D8, as in [flowDirections](flowDirections.md),
  which can't split flow and stops at pits: fill pits first.
- `NaN` on the grid's edge and next to a missing cell, where the slope can't be
  computed.

:::

## Parameters

| Parameter  | Type                                                                                                  | Description                                      |
| ---------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `grid`     | [`GridInterface`](../interfaces/GridInterface.md)                                                     | Elevation grid, heights in **m**.                |
| `options?` | [`TopographicWetnessIndexOptionsInterface`](../interfaces/TopographicWetnessIndexOptionsInterface.md) | `minSlope`, the smallest slope to use (radians). |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, the index for each cell.

## Throws

If a size, cell size or `minSlope` is not finite.

## Throws

If the grid's parts don't fit together, or `minSlope` is not in (0, π/2).

## Example

```ts
// Falling 1 m every 10 m to the east
const grid = createGrid({
  rows: 3,
  columns: 4,
  values: [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1],
  cellSize: { x: 10, y: 10 }
});
const twi = topographicWetnessIndex(grid);

gridValueAt(twi, 1, 1); // ln(200 m² / 10 m / 0.1) = ln 200 ≈ 5.30
gridValueAt(twi, 1, 2); // ln 300 ≈ 5.70: wetter downhill
```

## See

- [flowAccumulation](flowAccumulation.md)
- [slopeAt](slopeAt.md)
- https://doi.org/10.1080/02626667909491834 Beven & Kirkby (1979), A physically
  based, variable contributing area model of basin hydrology
