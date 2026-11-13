[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MagnetosphereInterface

# Interface: MagnetosphereInterface

Defined in:
[observations.ts:569](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L569)

A body's **magnetic field**.

## Properties

### dipoleMoment?

```ts
dipoleMoment?: ObservedType<MagneticMomentInterface>;
```

Defined in:
[observations.ts:573](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L573)

The dipole moment.

---

### dipoleTilt?

```ts
dipoleTilt?: DegreesType;
```

Defined in:
[observations.ts:577](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L577)

The angle between the dipole and the spin axis.

---

### equatorialSurfaceField?

```ts
equatorialSurfaceField?: ObservedType<MagneticFieldInterface>;
```

Defined in:
[observations.ts:575](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L575)

The field at the surface, on the equator.

---

### origin

```ts
origin: 'none' | 'intrinsic' | 'induced' | 'remanent' | 'unknown';
```

Defined in:
[observations.ts:571](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L571)

Where the field comes from.
