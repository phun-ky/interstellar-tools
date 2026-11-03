[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
TopographicWetnessIndexOptionsInterface

# Interface: TopographicWetnessIndexOptionsInterface

Defined in:
[terrain/topographic-wetness-index.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/topographic-wetness-index.ts#L15)

Options for [topographicWetnessIndex](../functions/topographicWetnessIndex.md).

## Properties

### minSlope?

```ts
minSlope?: Radians;
```

Defined in:
[terrain/topographic-wetness-index.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/topographic-wetness-index.ts#L17)

Smallest slope to use, in **radians** (in (0, π/2)), so level ground gets a
finite index. Defaults to 0.001 (about 0.06°).
