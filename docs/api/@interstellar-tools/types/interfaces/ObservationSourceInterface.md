[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservationSourceInterface

# Interface: ObservationSourceInterface

Defined in:
[observations.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L92)

Where a value **came from**.

## Example

```ts
const source: ObservationSourceInterface = {
  catalog: 'NASA Exoplanet Archive',
  reference: '10.1088/2041-8205/772/2/L16'
};
```

## Properties

### catalog

```ts
catalog: ObservationCatalogType;
```

Defined in:
[observations.ts:94](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L94)

The catalogue or archive the value was taken from.

---

### reference?

```ts
reference?: string;
```

Defined in:
[observations.ts:96](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L96)

The DOI or ADS bibcode of the paper behind the value.

---

### retrievedAt?

```ts
retrievedAt?: Date;
```

Defined in:
[observations.ts:100](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L100)

When the value was taken from the catalogue.

---

### url?

```ts
url?: string;
```

Defined in:
[observations.ts:98](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L98)

The page the value was read from.
