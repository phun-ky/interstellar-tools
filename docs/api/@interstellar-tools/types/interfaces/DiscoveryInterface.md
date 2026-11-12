[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DiscoveryInterface

# Interface: DiscoveryInterface

Defined in:
[observations.ts:223](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L223)

How and when a body was **discovered**.

## Properties

### date?

```ts
date?: Date;
```

Defined in:
[observations.ts:225](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L225)

The date, where the day is known.

---

### discoverers?

```ts
discoverers?: string[];
```

Defined in:
[observations.ts:229](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L229)

The people credited.

---

### facility?

```ts
facility?: string;
```

Defined in:
[observations.ts:231](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L231)

The observatory, mission or survey, such as `'Pan-STARRS1'`.

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:233](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L233)

How it was found, such as `'transit'` or `'photographic plates'`.

---

### year?

```ts
year?: number;
```

Defined in:
[observations.ts:227](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L227)

The year.
