[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
TileInterface

# Interface: TileInterface

Defined in:
[tiles/tile.ts:11](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L11)

A **web map tile**, in the scheme web maps use ("slippy maps", XYZ): at zoom `z`
the spherical Web Mercator map is cut into $2^z \times 2^z$ square tiles.

- `x` counts columns east from 180° W, and `y` counts rows **south from the top
  edge**, at about 85.0511° N. Both are integers in $[0, 2^z)$.
- This is the XYZ order of OpenStreetMap and most web maps. TMS counts rows
  north from the bottom instead: $y_{\text{TMS}} = 2^z - 1 - y$.

## Properties

### x

```ts
x: number;
```

Defined in:
[tiles/tile.ts:13](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L13)

Column, east from 180° W (an integer in \[0, 2^z)).

---

### y

```ts
y: number;
```

Defined in:
[tiles/tile.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L15)

Row, south from the top edge of the map (an integer in \[0, 2^z)).

---

### z

```ts
z: number;
```

Defined in:
[tiles/tile.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L17)

Zoom level (an integer in \[0, 30]).
