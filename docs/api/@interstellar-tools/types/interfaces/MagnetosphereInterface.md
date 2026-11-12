[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MagnetosphereInterface

# Interface: MagnetosphereInterface

Defined in:
[observations.ts:566](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L566)

A body's **magnetic field**.

## Properties

### dipoleMoment?

```ts
dipoleMoment?: ObservedType<MagneticMomentInterface>;
```

Defined in:
[observations.ts:570](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L570)

The dipole moment.

---

### dipoleTilt?

```ts
dipoleTilt?: DegreesType;
```

Defined in:
[observations.ts:574](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L574)

The angle between the dipole and the spin axis.

---

### equatorialSurfaceField?

```ts
equatorialSurfaceField?: ObservedType<MagneticFieldInterface>;
```

Defined in:
[observations.ts:572](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L572)

The field at the surface, on the equator.

---

### origin

```ts
origin: 'none' | 'intrinsic' | 'induced' | 'remanent' | 'unknown';
```

Defined in:
[observations.ts:568](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L568)

Where the field comes from.
