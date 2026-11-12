[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservationMetaInterface

# Interface: ObservationMetaInterface

Defined in:
[observations.ts:141](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L141)

What can travel with any **measured value**.

## Properties

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:151](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L151)

When the value holds, for one that changes.

---

### limit?

```ts
limit?: "upper" | "lower";
```

Defined in:
[observations.ts:145](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L145)

Set when the value is only a bound, not a detection.

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:153](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L153)

How it was measured, such as `'stellar occultation'` or `'radar'`.

---

### note?

```ts
note?: string;
```

Defined in:
[observations.ts:155](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L155)

A remark.

---

### provenance?

```ts
provenance?: ProvenanceType;
```

Defined in:
[observations.ts:147](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L147)

How the value was obtained.

---

### source?

```ts
source?: ObservationSourceInterface;
```

Defined in:
[observations.ts:149](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L149)

Where the value came from.

---

### uncertainty?

```ts
uncertainty?: UncertaintyInterface;
```

Defined in:
[observations.ts:143](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L143)

The error bars, in the value's unit.
