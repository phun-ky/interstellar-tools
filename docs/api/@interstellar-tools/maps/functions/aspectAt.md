[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
aspectAt

# Function: aspectAt()

```ts
function aspectAt(grid: GridInterface, row: number, column: number): Radians;
```

Defined in:
[terrain/aspect.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/aspect.ts#L52)

Compute the **aspect** of an elevation grid at a cell: the direction the terrain
faces.

$$
\text{aspect} = \operatorname{atan2}\!\left(-\frac{\partial z}{\partial x},\, -\frac{\partial z}{\partial y}\right) \bmod 2\pi
$$

with the gradient from Horn's method, [gradientAt](gradientAt.md).

**Units**

- Input: heights and the cell size in **m**.
- Output: aspect in **radians**, in \[0, 2π): the compass direction downhill,
  clockwise from north.

::: info Notes

- The GIS convention: the direction a slope faces, which is the way water runs
  off it. A slope that descends to the east faces east, $\pi/2$; one that
  descends to the south faces south, $\pi$.
- Clockwise from north, since `x` points east and `y` north (see
  [GridInterface](../interfaces/GridInterface.md)). Sources differ on this, so
  check the convention before comparing with other software.
- Flat ground faces nowhere: the aspect is `NaN` where the gradient is zero, as
  well as on the grid's edge and next to a missing cell.

:::

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                 |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The aspect in **radians**, clockwise from north, or `NaN` where there is none.

## Throws

If `row` or `column` is not an integer inside the grid.

## Example

```ts
// Rising to the east, so facing west
const grid = createGrid({
  rows: 3,
  columns: 3,
  values: [0, 1, 2, 0, 1, 2, 0, 1, 2],
  cellSize: { x: 10, y: 10 }
});

aspectAt(grid, 1, 1); // 3π/2, west
```

## See

- [aspectGrid](aspectGrid.md)
- [slopeAt](slopeAt.md)
- [gradientAt](gradientAt.md)
