[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AtmosphericFeatureInterface

# Interface: AtmosphericFeatureInterface

Defined in:
[observations.ts:446](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L446)

A lasting **feature of an atmosphere**, such as a storm.

## Properties

### firstObserved?

```ts
firstObserved?: Date;
```

Defined in:
[observations.ts:454](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L454)

When it was first seen.

---

### lastObserved?

```ts
lastObserved?: Date;
```

Defined in:
[observations.ts:456](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L456)

When it was last seen, set once it has gone.

---

### latitude?

```ts
latitude?: DegreesType;
```

Defined in:
[observations.ts:450](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L450)

The planetographic latitude of its centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:448](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L448)

Its name, such as `'Great Red Spot'`.

---

### size?

```ts
size?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:452](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L452)

Its size, east to west.
