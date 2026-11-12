[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ReflectanceInterface

# Interface: ReflectanceInterface

Defined in:
[observations.ts:361](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L361)

How **bright** a body is, and how it reflects light.

## Properties

### absoluteMagnitude?

```ts
absoluteMagnitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[observations.ts:367](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L367)

H for small bodies, V(1,0) for planets and moons.

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[observations.ts:377](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L377)

Apparent magnitudes, at their `epoch`.

---

### bondAlbedo?

```ts
bondAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:365](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L365)

The Bond albedo.

---

### colorIndices?

```ts
colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
```

Defined in:
[observations.ts:375](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L375)

Colour indices, such as `{ 'B-V': …, 'g-r': … }`.

---

### geometricAlbedo?

```ts
geometricAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:363](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L363)

The geometric albedo.

---

### slopeG?

```ts
slopeG?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:369](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L369)

The IAU's H–G phase slope, G.

---

### slopeG1?

```ts
slopeG1?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:371](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L371)

G1, of the H–G1–G2 system.

---

### slopeG2?

```ts
slopeG2?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:373](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L373)

G2, of the H–G1–G2 system.
