[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
IdentifiersInterface

# Interface: IdentifiersInterface

Defined in:
[observations.ts:194](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L194)

**Catalogue identifiers**, besides the body's own `id` and `name`.

## Properties

### aliases?

```ts
aliases?: string[];
```

Defined in:
[observations.ts:212](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L212)

Other names the body goes by.

---

### catalogs?

```ts
catalogs?: Record<string, string>;
```

Defined in:
[observations.ts:210](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L210)

Other catalogue IDs, such as `{ NGC: '224', PGC: '2557' }`.

---

### gaiaDr3?

```ts
gaiaDr3?: string;
```

Defined in:
[observations.ts:202](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L202)

The Gaia DR3 source ID.

---

### hd?

```ts
hd?: number;
```

Defined in:
[observations.ts:206](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L206)

The Henry Draper catalogue number.

---

### hip?

```ts
hip?: number;
```

Defined in:
[observations.ts:204](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L204)

The Hipparcos catalogue number.

---

### minorPlanetNumber?

```ts
minorPlanetNumber?: number;
```

Defined in:
[observations.ts:200](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L200)

The minor planet number, such as `433` for Eros.

---

### mpcDesignation?

```ts
mpcDesignation?: string;
```

Defined in:
[observations.ts:198](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L198)

The Minor Planet Center's designation, packed or unpacked.

---

### spkId?

```ts
spkId?: number;
```

Defined in:
[observations.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L196)

JPL's SPK ID, as Horizons and SPICE use.

---

### tic?

```ts
tic?: number;
```

Defined in:
[observations.ts:208](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L208)

The TESS Input Catalog ID.
