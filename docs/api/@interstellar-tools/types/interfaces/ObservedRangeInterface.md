[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservedRangeInterface

# Interface: ObservedRangeInterface\<T _extends_ [`ValueInterface`](ValueInterface.md)>

Defined in:
[observations.ts:180](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L180)

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
[observations.ts:184](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L184)

The highest value.

---

### mean?

```ts
mean?: ObservedType<T>;
```

Defined in:
[observations.ts:186](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L186)

The mean, where one is given.

---

### min

```ts
min: ObservedType<T>;
```

Defined in:
[observations.ts:182](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L182)

The lowest value.
