[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservedProperMotionInterface

# Interface: ObservedProperMotionInterface

Defined in:
[observations.ts:279](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L279)

A **proper motion** with an uncertainty for each component, in mas/yr.

## Extends

- [`ProperMotionInterface`](ProperMotionInterface.md)
- [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<[`ObservationMetaInterface`](ObservationMetaInterface.md),
  `"uncertainty"`>

## Properties

### declination

```ts
declination: number;
```

Defined in:
[positions.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L137)

Northwards, $\mu_\delta$, in mas/yr.

#### Inherited from

[`ProperMotionInterface`](ProperMotionInterface.md).[`declination`](ProperMotionInterface.md#declination)

---

### epoch?

```ts
epoch?: EpochInterface;
```

Defined in:
[observations.ts:148](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L148)

When the value holds, for one that changes.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`epoch`](ObservationMetaInterface.md#epoch)

---

### limit?

```ts
limit?: "upper" | "lower";
```

Defined in:
[observations.ts:142](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L142)

Set when the value is only a bound, not a detection.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`limit`](ObservationMetaInterface.md#limit)

---

### method?

```ts
method?: string;
```

Defined in:
[observations.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L150)

How it was measured, such as `'stellar occultation'` or `'radar'`.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`method`](ObservationMetaInterface.md#method)

---

### note?

```ts
note?: string;
```

Defined in:
[observations.ts:152](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L152)

A remark.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`note`](ObservationMetaInterface.md#note)

---

### provenance?

```ts
provenance?: ProvenanceType;
```

Defined in:
[observations.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L144)

How the value was obtained.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`provenance`](ObservationMetaInterface.md#provenance)

---

### rightAscension

```ts
rightAscension: number;
```

Defined in:
[positions.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L135)

Eastwards, $\mu_\alpha \cos\delta$, in mas/yr.

#### Inherited from

[`ProperMotionInterface`](ProperMotionInterface.md).[`rightAscension`](ProperMotionInterface.md#rightascension)

---

### source?

```ts
source?: ObservationSourceInterface;
```

Defined in:
[observations.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L146)

Where the value came from.

#### Inherited from

[`ObservationMetaInterface`](ObservationMetaInterface.md).[`source`](ObservationMetaInterface.md#source)

---

### uncertainty?

```ts
uncertainty?: {
  declination: UncertaintyInterface;
  rightAscension: UncertaintyInterface;
};
```

Defined in:
[observations.ts:282](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L282)

The error bars of each component, in mas/yr.

| Name             | Type                                              | Defined in                                                                                                             |
| ---------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `declination`    | [`UncertaintyInterface`](UncertaintyInterface.md) | [observations.ts:284](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L284) |
| `rightAscension` | [`UncertaintyInterface`](UncertaintyInterface.md) | [observations.ts:283](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L283) |
