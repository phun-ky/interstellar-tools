[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
aspectGrid

# Function: aspectGrid()

```ts
function aspectGrid(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/aspect.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/aspect.ts#L85)

Compute the **aspect** of every cell of an elevation grid, as a new grid in
radians clockwise from north.

See [aspectAt](aspectAt.md). Flat cells, cells on the edge and cells next to a
missing cell are `NaN`.

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, aspects in **radians**.

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
const aspects = aspectGrid(grid);
gridValueAt(aspects, 1, 1); // 3π/2
```

## See

[aspectAt](aspectAt.md)
