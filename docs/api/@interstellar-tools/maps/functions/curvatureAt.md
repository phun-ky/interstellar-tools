[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
curvatureAt

# Function: curvatureAt()

```ts
function curvatureAt(
  grid: GridInterface,
  row: number,
  column: number
): TerrainCurvatureInterface;
```

Defined in:
[terrain/curvature.ts:86](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L86)

Compute the **profile and planform curvature** of an elevation grid at a cell:
how the terrain bends along the steepest slope and across it.

$$
k_\text{profile} = -\frac{p^2 r + 2pqs + q^2 t}{(p^2 + q^2)\,(1 + p^2 + q^2)^{3/2}},
\qquad
k_\text{planform} = -\frac{q^2 r - 2pqs + p^2 t}{(p^2 + q^2)\,(1 + p^2 + q^2)^{1/2}}
$$

with the derivatives from the 3 × 3 neighbourhood, after Zevenbergen & Thorne
(1987):

$$
p = \frac{z_{23} - z_{21}}{2\,\Delta x},
\quad
q = \frac{z_{12} - z_{32}}{2\,\Delta y},
\quad
r = \frac{z_{21} - 2z_{22} + z_{23}}{\Delta x^2},
\quad
t = \frac{z_{12} - 2z_{22} + z_{32}}{\Delta y^2},
\quad
s = \frac{z_{13} + z_{31} - z_{11} - z_{33}}{4\,\Delta x\,\Delta y}
$$

Where:

- $p = \partial z/\partial x$ and $q = \partial z/\partial y$ are the rise per
  metre east and north (m/m)
- $r = \partial^2 z/\partial x^2$, $t = \partial^2 z/\partial y^2$ and $s =
  \partial^2 z/\partial x\,\partial y$ are the second derivatives (1/m)
- $z_{rc}$ is the height in row $r$ and column $c$ of the neighbourhood, from
  the north-west: $z_{22}$ is the cell itself (m)
- $\Delta x$ and $\Delta y$ are the cell size east–west and north–south (m)

**Units**

- Input: heights and the cell size in **m**.
- Output: `profile` and `planform` in **1/m**: one over the radius of the bend.
  0 is straight.

::: info Notes

- **Profile** curvature follows the steepest slope downhill. Positive is convex,
  like the shoulder of a hill, where the ground gets steeper and flowing
  material speeds up; negative is concave, like the foot of a slope, where it
  slows down.
- **Planform** curvature is across the slope. Positive is convex, like a ridge
  or a spur, where flow spreads out; negative is concave, like a hollow or a
  gully, where it converges.
- So a dome is positive both ways and a bowl negative both ways: on a sphere of
  radius $R$ both are $\pm 1/R$. Sign conventions differ between GIS tools:
  check before comparing values.
- Both are true curvatures of the surface, from the formulas in Florinsky
  (2016), where planform is his _horizontal_ curvature. Zevenbergen & Thorne's
  own formulas leave out the $(1 + p^2 + q^2)$ terms, which only matters on
  steep ground. Planform is not the curvature of the contour line, which is
  larger by $1/\sin(\text{slope})$ and grows without bound on gentle slopes.
- The fitted surface passes through the cell and its four direct neighbours, so
  the gradient here is a plain central difference, not
  [gradientAt](gradientAt.md)'s smoothed one.
- Level ground has no downslope direction, so both are `NaN`, unless the
  neighbourhood is flat too and both are 0. Also `NaN` on the grid's edge and
  next to a missing cell.

:::

## Parameters

| Parameter | Type                                              | Description                                                       |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                 |
| `row`     | `number`                                          | Row index, 0 at the north edge (an integer in \[0, `rows`)).      |
| `column`  | `number`                                          | Column index, 0 at the west edge (an integer in \[0, `columns`)). |

## Returns

[`TerrainCurvatureInterface`](../interfaces/TerrainCurvatureInterface.md)

The curvature `{ profile, planform }` in **1/m**, `NaN` where it can't be
computed.

## Throws

If `row` or `column` is not an integer inside the grid.

## Example

```ts
// A ridge running north–south, falling 1 m every 10 m to the north
const grid = createGrid({
  rows: 3,
  columns: 3,
  values: [98.5, 99, 98.5, 99.5, 100, 99.5, 100.5, 101, 100.5],
  cellSize: { x: 10, y: 10 }
});

curvatureAt(grid, 1, 1); // { profile: 0, planform: ≈ 0.00995 }: a 100 m radius across
```

## See

- [curvatureGrid](curvatureGrid.md)
- [slopeAt](slopeAt.md)
- https://doi.org/10.1002/esp.3290120107 Zevenbergen & Thorne (1987),
  Quantitative analysis of land surface topography
- https://doi.org/10.1016/B978-0-12-804632-6.00002-X Florinsky (2016),
  Topographic surface and its characterization
- https://doi.org/10.1080/13658810310001596058 Schmidt, Evans & Brinkmann
  (2003), Comparison of polynomial models for land surface curvature calculation
