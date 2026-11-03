[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
flowAccumulation

# Function: flowAccumulation()

```ts
function flowAccumulation(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/flow-accumulation.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/flow-accumulation.ts#L52)

Compute the **flow accumulation** of every cell of an elevation grid: the area
that drains through it, its own included.

$$
A_0 = \Delta x\,\Delta y + \sum_{i \to 0} A_i
$$

Where:

- $A_0$ is the cell's contributing area and $A_i$ that of each neighbour
  draining into it (m²)
- $\Delta x\,\Delta y$ is the cell's own area (m²)

**Units**

- Input: heights and the cell size in **m**.
- Output: contributing area in **m²**, at least one cell's area. Divide by
  $\Delta x\,\Delta y$ for a number of cells.

::: info Notes

- Flow follows [flowDirections](flowDirections.md): D8, all of a cell's flow to
  one neighbour. The largest values trace the channels where water, or on Mars
  perhaps ice and fine material, would gather.
- Flow stops at a cell with nowhere to drain, so the areas of all such cells add
  up to the whole grid's. A pit cuts off everything upstream of it: fill pits
  first for connected drainage.
- Only area inside the grid counts: near an edge, more may drain in from
  outside.
- Missing cells are `NaN` and receive no flow.

:::

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, contributing area in **m²**.

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
// Falling to the east, 10 m cells
const grid = createGrid({
  rows: 2,
  columns: 3,
  values: [3, 2, 1, 3, 2, 1],
  cellSize: { x: 10, y: 10 }
});

flowAccumulation(grid).values; // [100, 200, 300, 100, 200, 300] m²
```

## See

- [flowDirections](flowDirections.md)
- [topographicWetnessIndex](topographicWetnessIndex.md)
- https://doi.org/10.1016/S0734-189X(84)80011-0 O'Callaghan & Mark (1984), The
  extraction of drainage networks from digital elevation data
