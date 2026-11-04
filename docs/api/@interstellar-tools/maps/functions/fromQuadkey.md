[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
fromQuadkey

# Function: fromQuadkey()

```ts
function fromQuadkey(key: string): TileInterface;
```

Defined in:
[tiles/quadkey.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/quadkey.ts#L81)

Find the web map tile named by a **quadkey**: the inverse of
[quadkey](quadkey.md).

**Units**

- Input: a string of digits 0–3, one per zoom level.
- Output: `{ x, y, z }`, integer tile indices, with `z` the key's length.

::: info Notes

- Each digit adds one bit to the column (1 or 3) and the row (2 or 3).
- The empty key `''` is the single tile at zoom 0.

:::

## Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `key`     | `string` | The quadkey: at most 30 digits 0–3. |

## Returns

[`TileInterface`](../interfaces/TileInterface.md)

The tile, `{ x, y, z }`.

## Throws

If `key` holds anything but the digits 0–3, or more than 30 of them.

## Example

```ts
fromQuadkey('213'); // { x: 3, y: 5, z: 3 }
```

## See

- [quadkey](quadkey.md)
- [tileBounds](tileBounds.md)
- https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system
  Microsoft: Bing Maps tile system
