[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservedRangeInterface

# Interface: ObservedRangeInterface\<T _extends_ [`ValueInterface`](ValueInterface.md)>

Defined in:
[observations.ts:183](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L183)

A quantity given as a **range**, such as a surface's day and night temperatures.

## Type Parameters

| Type Parameter                                                                    |
| --------------------------------------------------------------------------------- |
| <a id="type-parameter-t"></a> `T` _extends_ [`ValueInterface`](ValueInterface.md) |

## Properties

### max

```ts
max: ObservedType<T>;
```

Defined in:
[observations.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L187)

The highest value.

---

### mean?

```ts
mean?: ObservedType<T>;
```

Defined in:
[observations.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L189)

The mean, where one is given.

---

### min

```ts
min: ObservedType<T>;
```

Defined in:
[observations.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L185)

The lowest value.
