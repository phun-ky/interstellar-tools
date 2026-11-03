[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
curvatureGrid

# Function: curvatureGrid()

```ts
function curvatureGrid(grid: GridInterface): {
  planform: GridInterface;
  profile: GridInterface;
};
```

Defined in:
[terrain/curvature.ts:148](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L148)

Compute the **profile and planform curvature** of every cell of an elevation
grid, as two new grids in 1/m.

See [curvatureAt](curvatureAt.md). Cells on the edge and next to a missing cell
are `NaN`.

## Parameters

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| `grid`    | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**. |

## Returns

```ts
{
  planform: GridInterface;
  profile: GridInterface;
}
```

Two grids of the same shape, `{ profile, planform }`, curvature in **1/m**.

| Name       | Type                                              | Defined in                                                                                                                      |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `planform` | [`GridInterface`](../interfaces/GridInterface.md) | [terrain/curvature.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L150) |
| `profile`  | [`GridInterface`](../interfaces/GridInterface.md) | [terrain/curvature.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L150) |

## Throws

If a size or cell size is not finite.

## Throws

If the grid's parts don't fit together.

## Example

```ts
const { profile, planform } = curvatureGrid(grid);
gridValueAt(planform, 1, 1); // ≈ 0.00995
```

## See

[curvatureAt](curvatureAt.md)
