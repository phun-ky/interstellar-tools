[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
tileAt

# Function: tileAt()

```ts
function tileAt(phi: Radians, lambda: Radians, zoom: number): TileInterface;
```

Defined in:
[tiles/tile-at.ts:55](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile-at.ts#L55)

Find the **web map tile** that holds a point, at a zoom level: the tile scheme
web maps use ("slippy maps", XYZ) on the spherical Web Mercator map.

$$
x = \left\lfloor \frac{\lambda + \pi}{2\pi}\,2^z \right\rfloor,
\qquad
y = \left\lfloor \frac{1 - \ln(\tan\varphi + \sec\varphi)/\pi}{2}\,2^z \right\rfloor
$$

Where:

- $\varphi$ and $\lambda$ are the point's latitude and longitude (rad)
- $z$ is the zoom level: $2^z \times 2^z$ tiles cover the map
- $\ln(\tan\varphi + \sec\varphi)$ is the Mercator $y$ on a unit sphere (see
  [mercator](mercator.md))

**Units**

- Inputs: angles in **radians**, `zoom` an integer.
- Output: `{ x, y, z }`, integer tile indices.

::: info Notes

- Columns run east from 180° W, and rows run **south** from the top edge of the
  map (see [TileInterface](../interfaces/TileInterface.md)).
- The map stops at $\arctan\sinh\pi \approx \pm 85.0511°$, where it is square.
  Latitudes beyond that, up to the poles, are clamped into the top or bottom
  row.
- The longitude is taken modulo a whole turn, so 180° E is 180° W, the west edge
  of column 0.
- A point exactly on an edge between tiles belongs to the tile east or south of
  it.
- The scheme depends only on angles, so it tiles a spherical Mercator map of
  Mars or the Moon as it does Earth's. A tile is $2\pi R / 2^z$ wide at the
  equator.

:::

## Parameters

| Parameter | Type                                             | Description                                                  |
| --------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `phi`     | [`Radians`](../../types/type-aliases/Radians.md) | Latitude $\varphi$ in **radians** (finite, in \[−π/2, π/2]). |
| `lambda`  | [`Radians`](../../types/type-aliases/Radians.md) | Longitude $\lambda$ in **radians** (finite).                 |
| `zoom`    | `number`                                         | Zoom level $z$ (an integer in \[0, 30]).                     |

## Returns

[`TileInterface`](../interfaces/TileInterface.md)

The tile, `{ x, y, z }`.

## Throws

If `phi` or `lambda` is not a finite number.

## Throws

If `phi` is outside \[−π/2, π/2], or `zoom` is not an integer in \[0, 30].

## Example

```ts
// Oslo, at zoom 10
tileAt(toRad(59.9139), toRad(10.7522), 10); // { x: 542, y: 297, z: 10 }
```

## See

- [tileBounds](tileBounds.md)
- [quadkey](quadkey.md)
- https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames OpenStreetMap: Slippy
  map tilenames
