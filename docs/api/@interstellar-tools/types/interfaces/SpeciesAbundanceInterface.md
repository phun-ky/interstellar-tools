[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpeciesAbundanceInterface

# Interface: SpeciesAbundanceInterface

Defined in:
[observations.ts:411](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L411)

A **chemical species**, and how much of it there is.

## Properties

### abundance?

```ts
abundance?: ObservedType<
  | DexInterface
| FractionInterface>;
```

Defined in:
[observations.ts:415](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L415)

How much, as a share or in dex.

---

### detectedOnly?

```ts
detectedOnly?: boolean;
```

Defined in:
[observations.ts:417](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L417)

`true` when it's detected without an amount.

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:419](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L419)

How, such as `'transmission spectroscopy'`.

---

### species

```ts
species: string;
```

Defined in:
[observations.ts:413](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L413)

A formula or name, such as `'N2'`, `'CH4'`, `'H2O'` or `'Na'`.
