[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PositionInterface

# Interface: PositionInterface

Defined in:
[positions.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L72)

A **position in 3D**, in a named frame: what a conversion such as
`galactocentricPosition` in `@interstellar-tools/equations` returns, from a
direction and distance measured from the Sun.

## Example

```ts
// Andromeda, 765 kpc from the Milky Way's centre
const andromeda: PositionInterface = {
  frame: 'galactocentric',
  x: { value: -1_224_100, unit: 'ly' },
  y: { value: 1_974_900, unit: 'ly' },
  z: { value: -909_500, unit: 'ly' }
};
```

## Properties

### frame

```ts
frame: 'galactocentric';
```

Defined in:
[positions.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L74)

The frame the coordinates are in.

---

### x

```ts
x: DistanceInterface;
```

Defined in:
[positions.ts:76](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L76)

X-coordinate in the frame.

---

### y

```ts
y: DistanceInterface;
```

Defined in:
[positions.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L78)

Y-coordinate in the frame.

---

### z

```ts
z: DistanceInterface;
```

Defined in:
[positions.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L80)

Z-coordinate in the frame.
