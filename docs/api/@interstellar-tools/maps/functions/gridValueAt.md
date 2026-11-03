[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
gridValueAt

# Function: gridValueAt()

```ts
function gridValueAt(grid: GridInterface, row: number, column: number): number;
```

Defined in:
[terrain/grid.ts:117](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L117)

Read the value of one **cell** of a grid.

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | The grid.                                                         |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

`number`

The value, or `NaN` for a missing cell (`noData` or `NaN`).

## Throws

If `row` or `column` is not an integer inside the grid.

## Example

```ts
const grid = createGrid({
  rows: 2,
  columns: 2,
  values: [10, 11, -9999, 13],
  cellSize: { x: 30, y: 30 },
  noData: -9999
});

gridValueAt(grid, 0, 1); // 11
gridValueAt(grid, 1, 0); // NaN
```

## See

[createGrid](createGrid.md)
