[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SizeObservationsInterface

# Interface: SizeObservationsInterface

Defined in:
[observations.ts:342](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L342)

Measured **size and shape**, with uncertainties. The body's `radius` and
`ellipsoid` stay the values the equations use.

## Properties

### effectiveDiameter?

```ts
effectiveDiameter?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:346](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L346)

The volume-equivalent diameter, as small bodies are usually given.

---

### flattening?

```ts
flattening?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:354](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L354)

The flattening, $(a - c) / a$.

---

### meanRadius?

```ts
meanRadius?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:344](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L344)

The mean radius, with its uncertainty and method.

---

### shapeModel?

```ts
shapeModel?: string;
```

Defined in:
[observations.ts:356](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L356)

The shape model, such as a PDS or DAMIT model ID.

---

### triaxialRadii?

```ts
triaxialRadii?: readonly [ObservedType<DistanceInterface>, ObservedType<DistanceInterface>, ObservedType<DistanceInterface>];
```

Defined in:
[observations.ts:348](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L348)

The triaxial semi-axes, a ≥ b ≥ c.
