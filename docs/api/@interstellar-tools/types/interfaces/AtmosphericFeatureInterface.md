[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AtmosphericFeatureInterface

# Interface: AtmosphericFeatureInterface

Defined in:
[observations.ts:443](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L443)

A lasting **feature of an atmosphere**, such as a storm.

## Properties

### firstObserved?

```ts
firstObserved?: Date;
```

Defined in:
[observations.ts:451](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L451)

When it was first seen.

---

### lastObserved?

```ts
lastObserved?: Date;
```

Defined in:
[observations.ts:453](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L453)

When it was last seen, set once it has gone.

---

### latitude?

```ts
latitude?: DegreesType;
```

Defined in:
[observations.ts:447](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L447)

The planetographic latitude of its centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:445](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L445)

Its name, such as `'Great Red Spot'`.

---

### size?

```ts
size?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:449](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L449)

Its size, east to west.
