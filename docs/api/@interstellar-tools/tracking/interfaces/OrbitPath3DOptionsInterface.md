[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ OrbitPath3DOptionsInterface

# Interface: OrbitPath3DOptionsInterface

Defined in:
[satellites/globe.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L17)

Options for [orbitPath3D](../functions/orbitPath3D.md).

## Properties

### frame?

```ts
frame?: "earth-fixed" | "inertial";
```

Defined in:
[satellites/globe.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L21)

`'earth-fixed'`, turning with Earth, the default; or `'inertial'`, SGP4's TEME
frame, where the orbit stays still.

---

### step?

```ts
step?: number;
```

Defined in:
[satellites/globe.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L19)

Time between points in **s**: 60 by default.

---

### unit?

```ts
unit?: number;
```

Defined in:
[satellites/globe.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L23)

The length of one unit of the result, in **m**: 1 by default. Earth's radius, 6
378 137, gives Earth radii, for a globe of radius 1.
