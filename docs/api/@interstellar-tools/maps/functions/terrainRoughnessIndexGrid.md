[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
terrainRoughnessIndexGrid

# Function: terrainRoughnessIndexGrid()

```ts
function terrainRoughnessIndexGrid(grid: GridInterface): GridInterface;
```

Defined in:
[terrain/terrain-roughness-index.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/terrain-roughness-index.ts#L92)

Compute the **Terrain Roughness Index** of every cell of an elevation grid, as a
new grid in metres.

See [terrainRoughnessIndexAt](terrainRoughnessIndexAt.md). Cells on the edge and
next to a missing cell are `NaN`.

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, TRI in **m**.

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
const roughness = terrainRoughnessIndexGrid(grid);
gridValueAt(roughness, 1, 1); // 2
```

## See

[terrainRoughnessIndexAt](terrainRoughnessIndexAt.md)
