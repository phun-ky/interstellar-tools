[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyDiskInterface

# Interface: GalaxyDiskInterface

Defined in:
[celestial-bodies/galaxies.ts:91](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L91)

How a **galaxy's disk** is turned, as seen from the Sun.

::: info

- `inclination` is the angle between the disk and the sky: 0° face-on, 90°
  edge-on.
- `positionAngle` is the direction on the sky, east of north, of the receding
  half of the disk's major axis, where the disk crosses the sky's plane: from
  its rotation, 0° up to 360°.
- `nearSide` is the direction of the half of the minor axis that's nearer to us,
  `positionAngle` plus or minus 90°. Without it, the disk could tilt either way.

:::

## Example

```ts
// Andromeda (Corbelli et al. 2010): its north-east half recedes, and its
// north-west side is nearer
const andromeda: GalaxyDiskInterface = {
  inclination: 77.7 as DegreesType,
  positionAngle: 38 as DegreesType,
  nearSide: 308 as DegreesType
};
```

## Properties

### inclination

```ts
inclination: DegreesType;
```

Defined in:
[celestial-bodies/galaxies.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L93)

Angle between the disk and the sky, 0° face-on to 90° edge-on.

---

### nearSide?

```ts
nearSide?: DegreesType;
```

Defined in:
[celestial-bodies/galaxies.ts:97](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L97)

Position angle of the nearer half of the minor axis, in degrees. Omitted where
it isn't known.

---

### positionAngle

```ts
positionAngle: DegreesType;
```

Defined in:
[celestial-bodies/galaxies.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/galaxies.ts#L95)

Position angle of the receding half of the major axis, east of north, in
degrees.
