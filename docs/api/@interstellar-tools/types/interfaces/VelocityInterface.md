[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
VelocityInterface

# Interface: VelocityInterface

Defined in:
[positions.ts:100](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L100)

A **velocity in 3D**, in a named frame, in km/s: the Sun's motion around the
Milky Way's centre, for example, or a galaxy's, from its
[ObservedMotionInterface](ObservedMotionInterface.md).

## Example

```ts
// The Sun's motion around the Milky Way's centre
const sun: VelocityInterface = {
  frame: 'galactocentric',
  x: 12.9,
  y: 251.51,
  z: 8.56
};
```

## Properties

### frame

```ts
frame: 'galactocentric';
```

Defined in:
[positions.ts:102](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L102)

The frame the components are in.

---

### x

```ts
x: number;
```

Defined in:
[positions.ts:104](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L104)

Velocity along `x`, in km/s.

---

### y

```ts
y: number;
```

Defined in:
[positions.ts:106](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L106)

Velocity along `y`, in km/s.

---

### z

```ts
z: number;
```

Defined in:
[positions.ts:108](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L108)

Velocity along `z`, in km/s.
