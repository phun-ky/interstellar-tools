[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
TerrainGradientInterface

# Interface: TerrainGradientInterface

Defined in:
[terrain/gradient-at.ts:9](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/gradient-at.ts#L9)

The rate at which the terrain rises, east and north, at a cell.

## Properties

### dzdx

```ts
dzdx: number;
```

Defined in:
[terrain/gradient-at.ts:11](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/gradient-at.ts#L11)

Rise per metre towards the east, $\partial z/\partial x$ (m/m).

---

### dzdy

```ts
dzdy: number;
```

Defined in:
[terrain/gradient-at.ts:13](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/gradient-at.ts#L13)

Rise per metre towards the north, $\partial z/\partial y$ (m/m).
