[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
TileBoundsInterface

# Interface: TileBoundsInterface

Defined in:
[tiles/tile.ts:25](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L25)

The edges of a web map tile: the latitudes of its north and south edges and the
longitudes of its west and east edges.

## Properties

### east

```ts
east: Radians;
```

Defined in:
[tiles/tile.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L33)

Longitude of the east edge, in **radians**, in (−π, π].

---

### north

```ts
north: Radians;
```

Defined in:
[tiles/tile.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L27)

Latitude of the north edge, in **radians**.

---

### south

```ts
south: Radians;
```

Defined in:
[tiles/tile.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L29)

Latitude of the south edge, in **radians**.

---

### west

```ts
west: Radians;
```

Defined in:
[tiles/tile.ts:31](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/tiles/tile.ts#L31)

Longitude of the west edge, in **radians**, in \[−π, π).
