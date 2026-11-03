[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
GridInterface

# Interface: GridInterface

Defined in:
[terrain/grid.ts:14](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L14)

A **raster grid** of values over a map, such as a digital elevation model (DEM):
`rows × columns` cells of equal size, stored row by row.

- **Row 0 is the northernmost row**, as in most GeoTIFFs, and rows run south.
  Columns run west to east. So `x` points east and `y` north, and the value at
  `row`, `column` is `values[row * columns + column]`.
- **Cells are a constant size** in metres, `cellSize.x` east–west and
  `cellSize.y` north–south: a projected grid. A grid in latitude and longitude
  has cells that narrow towards the poles, $\Delta x =
  R\cos\varphi\,\Delta\lambda$; project it first, or use it only where that
  change is small.
- **Missing cells** hold `noData`, or `NaN`. Terrain functions return `NaN`
  wherever they would need one, and wherever a cell's 3 × 3 neighbourhood leaves
  the grid.

Grids returned by the terrain functions mark missing cells with `NaN` and have
no `noData`.

## Properties

### cellSize

```ts
cellSize: {
  x: number;
  y: number;
}
```

Defined in:
[terrain/grid.ts:22](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L22)

Size of a cell in **m**, east–west (`x`) and north–south (`y`).

| Name | Type     | Defined in                                                                                                          |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `x`  | `number` | [terrain/grid.ts:22](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L22) |
| `y`  | `number` | [terrain/grid.ts:22](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L22) |

---

### columns

```ts
columns: number;
```

Defined in:
[terrain/grid.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L18)

Number of columns, west to east (an integer, > 0).

---

### noData?

```ts
noData?: number;
```

Defined in:
[terrain/grid.ts:24](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L24)

The value that marks a missing cell, if any. `NaN` always does.

---

### rows

```ts
rows: number;
```

Defined in:
[terrain/grid.ts:16](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L16)

Number of rows, north to south (an integer, > 0).

---

### values

```ts
values:
  | readonly number[]
| Float64Array<ArrayBufferLike>;
```

Defined in:
[terrain/grid.ts:20](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/grid.ts#L20)

The values, row by row from the north-west corner: `rows × columns` of them.
