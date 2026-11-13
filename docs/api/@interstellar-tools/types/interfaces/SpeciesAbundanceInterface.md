[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpeciesAbundanceInterface

# Interface: SpeciesAbundanceInterface

Defined in:
[observations.ts:414](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L414)

A **chemical species**, and how much of it there is.

## Properties

### abundance?

```ts
abundance?: ObservedType<
  | DexInterface
| FractionInterface>;
```

Defined in:
[observations.ts:418](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L418)

How much, as a share or in dex.

---

### detectedOnly?

```ts
detectedOnly?: boolean;
```

Defined in:
[observations.ts:420](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L420)

`true` when it's detected without an amount.

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:422](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L422)

How, such as `'transmission spectroscopy'`.

---

### species

```ts
species: string;
```

Defined in:
[observations.ts:416](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L416)

A formula or name, such as `'N2'`, `'CH4'`, `'H2O'` or `'Na'`.
