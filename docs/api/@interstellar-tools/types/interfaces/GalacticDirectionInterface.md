[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalacticDirectionInterface

# Interface: GalacticDirectionInterface

Defined in:
[positions.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L27)

A **direction in galactic coordinates**, from the Sun, in degrees as catalogues
give it.

::: info

- `l`, the galactic longitude, runs along the Milky Way's plane, from 0° towards
  its centre, through 90° in the direction the Sun moves around it.
- `b`, the galactic latitude, is the angle above (north of) the plane, from −90°
  to 90°.

:::

## Example

```ts
// Andromeda (McConnachie 2012)
const andromeda: GalacticDirectionInterface = {
  l: 121.17 as DegreesType,
  b: -21.57 as DegreesType
};
```

## Properties

### b

```ts
b: DegreesType;
```

Defined in:
[positions.ts:31](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L31)

Galactic latitude, north of the Milky Way's plane, in degrees.

---

### l

```ts
l: DegreesType;
```

Defined in:
[positions.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L29)

Galactic longitude, from 0° towards the Milky Way's centre, in degrees.
