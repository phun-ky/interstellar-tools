[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
hillshadeGrid

# Function: hillshadeGrid()

```ts
function hillshadeGrid(
  grid: GridInterface,
  sunAzimuth: Radians,
  sunElevation: Radians
): GridInterface;
```

Defined in:
[terrain/hillshade.ts:140](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/hillshade.ts#L140)

Compute the **hillshade** of every cell of an elevation grid, as a new grid of
brightness in \[0, 1].

See [hillshadeAt](hillshadeAt.md); the slope and aspect come from
[slopeAt](slopeAt.md) and [aspectAt](aspectAt.md). Cells on the edge and next to
a missing cell are `NaN`.

## Parameters

| Parameter      | Type                                              | Description                                                         |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `grid`         | [`GridInterface`](../interfaces/GridInterface.md) | Elevation grid, heights in **m**.                                   |
| `sunAzimuth`   | [`Radians`](../../types/type-aliases/Radians.md)  | Sun's azimuth in **radians**, clockwise from north (finite).        |
| `sunElevation` | [`Radians`](../../types/type-aliases/Radians.md)  | Sun's elevation above the horizon in **radians** (in \[−π/2, π/2]). |

## Returns

[`GridInterface`](../interfaces/GridInterface.md)

A grid of the same shape, hillshade in \[0, 1].

## Throws

If a size, cell size or Sun angle is not finite.

## Throws

If the grid's parts don't fit together, or `sunElevation` is outside \[−π/2,
π/2].

## Example

```ts
// The cartographers' convention: light from the north-west, 45° up
const shaded = hillshadeGrid(grid, toRad(315), toRad(45));
```

## See

[hillshadeAt](hillshadeAt.md)
