[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
slopeAt

# Function: slopeAt()

```ts
function slopeAt(grid: GridInterface, row: number, column: number): Radians;
```

Defined in:
[terrain/slope.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/slope.ts#L52)

Compute the **slope** of an elevation grid at a cell: how steep the terrain is.

$$
\text{slope} = \arctan\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}
$$

with the gradient from Horn's method, [gradientAt](gradientAt.md).

**Units**

- Input: heights and the cell size in **m**.
- Output: slope in **radians**, in \[0, π/2): 0 is flat.

::: info Notes

- The slope over the cell's 3 × 3 neighbourhood, so over a patch three cells
  across: a 1 m grid sees boulders, a 100 m grid only hills. Landing hazards
  depend on the scale of the lander.
- `NaN` on the grid's edge and next to a missing cell.
- [isStableLanding](isStableLanding.md) takes a slope in radians directly.

:::

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                 |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The slope in **radians**, or `NaN` where it can't be computed.

## Throws

If `row` or `column` is not an integer inside the grid.

## Example

```ts
// Rising 1 m every 10 m to the east
const grid = createGrid({
  rows: 3,
  columns: 3,
  values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
  cellSize: { x: 10, y: 10 }
});

slopeAt(grid, 1, 1); // atan(0.1) ≈ 5.7°
```

## See

- [slopeGrid](slopeGrid.md)
- [aspectAt](aspectAt.md)
- [gradientAt](gradientAt.md)
