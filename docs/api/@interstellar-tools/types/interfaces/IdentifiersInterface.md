[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
IdentifiersInterface

# Interface: IdentifiersInterface

Defined in:
[observations.ts:197](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L197)

**Catalogue identifiers**, besides the body's own `id` and `name`.

## Properties

### aliases?

```ts
aliases?: string[];
```

Defined in:
[observations.ts:215](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L215)

Other names the body goes by.

---

### catalogs?

```ts
catalogs?: Record<string, string>;
```

Defined in:
[observations.ts:213](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L213)

Other catalogue IDs, such as `{ NGC: '224', PGC: '2557' }`.

---

### gaiaDr3?

```ts
gaiaDr3?: string;
```

Defined in:
[observations.ts:205](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L205)

The Gaia DR3 source ID.

---

### hd?

```ts
hd?: number;
```

Defined in:
[observations.ts:209](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L209)

The Henry Draper catalogue number.

---

### hip?

```ts
hip?: number;
```

Defined in:
[observations.ts:207](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L207)

The Hipparcos catalogue number.

---

### minorPlanetNumber?

```ts
minorPlanetNumber?: number;
```

Defined in:
[observations.ts:203](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L203)

The minor planet number, such as `433` for Eros.

---

### mpcDesignation?

```ts
mpcDesignation?: string;
```

Defined in:
[observations.ts:201](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L201)

The Minor Planet Center's designation, packed or unpacked.

---

### spkId?

```ts
spkId?: number;
```

Defined in:
[observations.ts:199](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L199)

JPL's SPK ID, as Horizons and SPICE use.

---

### tic?

```ts
tic?: number;
```

Defined in:
[observations.ts:211](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L211)

The TESS Input Catalog ID.
