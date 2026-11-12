[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservationMetaInterface

# Interface: ObservationMetaInterface

Defined in:
[observations.ts:138](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L138)

What can travel with any **measured value**.

## Properties

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:148](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L148)

When the value holds, for one that changes.

---

### limit?

```ts
limit?: "upper" | "lower";
```

Defined in:
[observations.ts:142](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L142)

Set when the value is only a bound, not a detection.

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L150)

How it was measured, such as `'stellar occultation'` or `'radar'`.

---

### note?

```ts
note?: string;
```

Defined in:
[observations.ts:152](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L152)

A remark.

---

### provenance?

```ts
provenance?: ProvenanceType;
```

Defined in:
[observations.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L144)

How the value was obtained.

---

### source?

```ts
source?: ObservationSourceInterface;
```

Defined in:
[observations.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L146)

Where the value came from.

---

### uncertainty?

```ts
uncertainty?: UncertaintyInterface;
```

Defined in:
[observations.ts:140](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L140)

The error bars, in the value's unit.
