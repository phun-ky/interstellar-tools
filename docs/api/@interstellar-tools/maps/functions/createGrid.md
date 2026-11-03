[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
createGrid

# Function: createGrid()

```ts
function createGrid(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/grid.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L65)

Create a **raster grid**, such as an elevation model, checking that its parts
fit together.

The values are kept as given, not copied: a `Float64Array` stays one, and
changing it later changes the grid.

::: info Notes

- Row 0 is the northernmost row, and columns run west to east: see
  [GridInterface](../interfaces/GridInterface.md).
- Missing cells hold `noData` or `NaN`. Any other value must be finite.

:::

## Parameters

| Parameter | Type                                              | Description                                                               |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | The grid's size, values, cell size in **m** and optional `noData` marker. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

The grid.

## Throws

If a size or `noData` is not a finite number, or a value is infinite.

## Throws

If `rows` or `columns` is not a positive integer, the number of values isn't
`rows × columns`, or a cell size is `<= 0`.

## Example

```ts
// 3 × 3 cells of 10 m, rising 1 m a cell to the east
const grid = createGrid({
  rows: 3,
  columns: 3,
  values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
  cellSize: { x: 10, y: 10 }
});
```

## See

[gridValueAt](gridValueAt.md)
