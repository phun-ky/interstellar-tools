[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
gradientAt

# Function: gradientAt()

```ts
function gradientAt(
  grid: GridInterface,
  row: number,
  column: number
): TerrainGradientInterface;
```

Defined in:
[terrain/gradient-at.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/gradient-at.ts#L65)

Compute the **gradient** of an elevation grid at a cell, from its 3 × 3
neighbourhood with **Horn's method**.

$$
\frac{\partial z}{\partial x} = \frac{(z_{13} + 2z_{23} + z_{33}) - (z_{11} + 2z_{21} + z_{31})}{8\,\Delta x},
\qquad
\frac{\partial z}{\partial y} = \frac{(z_{11} + 2z_{12} + z_{13}) - (z_{31} + 2z_{32} + z_{33})}{8\,\Delta y}
$$

Where:

- $z_{rc}$ is the height in row $r$ and column $c$ of the neighbourhood, from
  the north-west: $z_{22}$ is the cell itself (m)
- $\Delta x$ and $\Delta y$ are the cell size east–west and north–south (m)

**Units**

- Inputs: heights and the cell size in **m**.
- Output: `dzdx` and `dzdy` in **m/m**: the rise per metre towards the east and
  towards the north.

::: info Notes

- Each difference is taken across two cells, weighting the middle row or column
  twice, which smooths out noise in the heights. It's the method most GIS
  software uses for slope and aspect.
- Row 0 is the northern edge of the grid (see
  [GridInterface](../interfaces/GridInterface.md)), so $\partial z/\partial y$
  is the northern row minus the southern one.
- On the grid's edge, or next to a missing cell, the neighbourhood is incomplete
  and both components are `NaN`.

:::

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                 |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

[`TerrainGradientInterface`](../interfaces/TerrainGradientInterface.md)

The gradient `{ dzdx, dzdy }` in **m/m**, `NaN` where it can't be computed.

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

gradientAt(grid, 1, 1); // { dzdx: 0.1, dzdy: 0 }
```

## See

- [slopeAt](slopeAt.md)
- [aspectAt](aspectAt.md)
- https://doi.org/10.1109/PROC.1981.11918 Horn (1981), Hill shading and the
  reflectance map
