[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
terrainRoughnessIndexAt

# Function: terrainRoughnessIndexAt()

```ts
function terrainRoughnessIndexAt(
  grid: GridInterface,
  row: number,
  column: number
): number;
```

Defined in:
[terrain/terrain-roughness-index.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/terrain-roughness-index.ts#L53)

Compute the **Terrain Roughness Index** of an elevation grid at a cell: the
root-mean-square height difference between the cell and its eight neighbours.

$$
\text{TRI} = \sqrt{\frac{1}{8}\sum_{i=1}^{8}\left(z_i - z_0\right)^2}
$$

Where:

- $z_0$ is the cell's height (m)
- $z_i$ are the heights of its eight neighbours (m)

**Units**

- Input: heights in **m**.
- Output: TRI in **m**, ≥ 0: 0 is level.

::: info Notes

- How uneven the ground is around a cell: boulders, crags and small craters, the
  things that tip a lander, rather than how steep it is. A cell 1 m above level
  surroundings has a TRI of 1 m. A smooth slope has a TRI too, about its rise
  over one cell, so read it together with [slopeAt](slopeAt.md).
- Other definitions are in use. Riley et al. (1999), who named the **Terrain
  Ruggedness Index**, leave out the $\tfrac18$, which makes theirs $\sqrt8
  \approx 2.83$ times this one; it's the default in `gdaldem` since GDAL 3.3.
  Wilson et al. (2007) take the mean absolute difference instead. Check which
  one before comparing values.
- It compares heights only, so it depends on the cell size: a 1 m grid sees
  boulders, a 100 m grid only hills.
- `NaN` on the grid's edge and next to a missing cell.

:::

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                 |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

`number`

The TRI in **m**, or `NaN` where it can't be computed.

## Throws

If `row` or `column` is not an integer inside the grid.

## Example

```ts
// A 2 m boulder on level ground
const grid = createGrid({
  rows: 3,
  columns: 3,
  values: [0, 0, 0, 0, 2, 0, 0, 0, 0],
  cellSize: { x: 1, y: 1 }
});

terrainRoughnessIndexAt(grid, 1, 1); // 2
```

## See

- [terrainRoughnessIndexGrid](terrainRoughnessIndexGrid.md)
- [slopeAt](slopeAt.md)
- https://download.osgeo.org/qgis/doc/reference-docs/Terrain_Ruggedness_Index.pdf
  Riley, DeGloria & Elliot (1999), A Terrain Ruggedness Index that quantifies
  topographic heterogeneity
- https://gdal.org/en/stable/programs/gdaldem.html gdaldem: the Riley and Wilson
  definitions
