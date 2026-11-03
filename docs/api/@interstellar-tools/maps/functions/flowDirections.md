[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
flowDirections

# Function: flowDirections()

```ts
function flowDirections(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/flow-directions.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/flow-directions.ts#L54)

Compute the **D8 flow direction** of every cell of an elevation grid: which of
its eight neighbours water would run to.

$$
d = \operatorname*{arg\,max}_{i} \frac{z_0 - z_i}{L_i}, \qquad z_0 - z_i > 0
$$

Where:

- $z_0$ is the cell's height and $z_i$ its neighbours' (m)
- $L_i$ is the distance to neighbour $i$: $\Delta x$, $\Delta y$, or
  $\sqrt{\Delta x^2 + \Delta y^2}$ on a diagonal (m)

**Units**

- Input: heights and the cell size in **m**.
- Output: a direction from 0 to 7, clockwise from north: 0 north, 1 north-east,
  2 east, and so on to 7 north-west.

::: info Notes

- Each cell sends all its flow to the one neighbour with the steepest drop
  (O'Callaghan & Mark, 1984). It can't split flow between neighbours, so on a
  broad slope flow runs in parallel lines along the eight directions rather than
  spreading out.
- A cell with no lower neighbour, such as a pit, level ground or the low edge of
  the grid, has nowhere to drain and is `NaN`, as are missing cells. Real
  terrain has many small pits from noise in the heights: fill them first to get
  connected drainage.
- Flow can run out of the grid only from such a cell: an edge cell drains to a
  lower neighbour inside the grid if it has one.
- On a tie, the direction that comes first clockwise from north wins.
- For ArcGIS-style codes (1 east, 2 south-east, 4 south, …, 128 north-east), use
  $2^{(d + 6) \bmod 8}$.

:::

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, flow directions from 0 to 7 clockwise from north, or
`NaN`.

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
// Falling to the east
const grid = createGrid({
  rows: 2,
  columns: 3,
  values: [3, 2, 1, 3, 2, 1],
  cellSize: { x: 10, y: 10 }
});

flowDirections(grid).values; // [2, 2, NaN, 2, 2, NaN]: east, and nowhere at the east edge
```

## See

- [flowAccumulation](flowAccumulation.md)
- [topographicWetnessIndex](topographicWetnessIndex.md)
- [aspectAt](aspectAt.md)
- https://doi.org/10.1016/S0734-189X(84)80011-0 O'Callaghan & Mark (1984), The
  extraction of drainage networks from digital elevation data
