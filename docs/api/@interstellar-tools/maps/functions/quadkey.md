[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
quadkey

# Function: quadkey()

```ts
function quadkey(x: number, y: number, z: number): string;
```

Defined in:
[tiles/quadkey.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/quadkey.ts#L42)

Find the **quadkey** of a web map tile: one base-4 digit per zoom level, naming
which quarter of its parent the tile is, from zoom 1 down.

$$
d_i = b_i(x) + 2\,b_i(y), \qquad i = z, z - 1, \dots, 1
$$

Where:

- $b_i(x)$ and $b_i(y)$ are the $i$-th bits of the column and row, counted from
  1 at the least significant
- $d_i$ is a digit: 0 north-west, 1 north-east, 2 south-west, 3 south-east

**Units**

- Inputs: integer tile indices.
- Output: a string of `z` digits 0–3.

::: info Notes

- Bing Maps and many tile caches name tiles this way. A tile's key starts with
  its parent's key, so tiles that are close together usually share a prefix,
  which suits sorting and spatial indexes.
- The single tile at zoom 0 has the empty key `''`.

:::

## Parameters

| Parameter | Type     | Description                                                        |
| --------- | -------- | ------------------------------------------------------------------ |
| `x`       | `number` | Column, east from 180° W (an integer in \[0, 2^z)).                |
| `y`       | `number` | Row, south from the top edge of the map (an integer in \[0, 2^z)). |
| `z`       | `number` | Zoom level (an integer in \[0, 30]).                               |

## Returns

`string`

The quadkey: `z` digits 0–3.

## Throws

If `z` is not an integer in \[0, 30], or `x` or `y` is not an integer in \[0,
2^z).

## Example

```ts
quadkey(3, 5, 3); // '213'
```

## See

- [fromQuadkey](fromQuadkey.md)
- [tileAt](tileAt.md)
- https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system
  Microsoft: Bing Maps tile system
