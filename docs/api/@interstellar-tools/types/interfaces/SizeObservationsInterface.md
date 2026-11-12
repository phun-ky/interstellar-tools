[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SizeObservationsInterface

# Interface: SizeObservationsInterface

Defined in:
[observations.ts:339](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L339)

Measured **size and shape**, with uncertainties. The body's `radius` and
`ellipsoid` stay the values the equations use.

## Properties

### effectiveDiameter?

```ts
effectiveDiameter?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:343](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L343)

The volume-equivalent diameter, as small bodies are usually given.

---

### flattening?

```ts
flattening?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:351](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L351)

The flattening, $(a - c) / a$.

---

### meanRadius?

```ts
meanRadius?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:341](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L341)

The mean radius, with its uncertainty and method.

---

### shapeModel?

```ts
shapeModel?: string;
```

Defined in:
[observations.ts:353](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L353)

The shape model, such as a PDS or DAMIT model ID.

---

### triaxialRadii?

```ts
triaxialRadii?: readonly [ObservedType<DistanceInterface>, ObservedType<DistanceInterface>, ObservedType<DistanceInterface>];
```

Defined in:
[observations.ts:345](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L345)

The triaxial semi-axes, a ≥ b ≥ c.
