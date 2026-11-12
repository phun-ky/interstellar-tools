[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ReflectanceInterface

# Interface: ReflectanceInterface

Defined in:
[observations.ts:364](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L364)

How **bright** a body is, and how it reflects light.

## Properties

### absoluteMagnitude?

```ts
absoluteMagnitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[observations.ts:370](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L370)

H for small bodies, V(1,0) for planets and moons.

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[observations.ts:380](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L380)

Apparent magnitudes, at their `epoch`.

---

### bondAlbedo?

```ts
bondAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:368](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L368)

The Bond albedo.

---

### colorIndices?

```ts
colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
```

Defined in:
[observations.ts:378](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L378)

Colour indices, such as `{ 'B-V': …, 'g-r': … }`.

---

### geometricAlbedo?

```ts
geometricAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:366](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L366)

The geometric albedo.

---

### slopeG?

```ts
slopeG?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:372](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L372)

The IAU's H–G phase slope, G.

---

### slopeG1?

```ts
slopeG1?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:374](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L374)

G1, of the H–G1–G2 system.

---

### slopeG2?

```ts
slopeG2?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:376](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L376)

G2, of the H–G1–G2 system.
