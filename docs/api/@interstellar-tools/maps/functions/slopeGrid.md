[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
slopeGrid

# Function: slopeGrid()

```ts
function slopeGrid(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/slope.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/slope.ts#L81)

Compute the **slope** of every cell of an elevation grid, as a new grid in
radians.

See [slopeAt](slopeAt.md). Cells on the edge and next to a missing cell are
`NaN`.

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, slopes in **radians**.

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
const slopes = slopeGrid(grid);
gridValueAt(slopes, 1, 1); // ≈ 0.0997 rad
```

## See

[slopeAt](slopeAt.md)
