[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
UncertaintyInterface

# Interface: UncertaintyInterface

Defined in:
[observations.ts:127](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L127)

An **uncertainty**, in the value's own unit. Equal `plus` and `minus` is a
symmetric ±σ.

## Properties

### minus

```ts
minus: number;
```

Defined in:
[observations.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L131)

The lower error bar, as a positive number.

---

### plus

```ts
plus: number;
```

Defined in:
[observations.ts:129](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L129)

The upper error bar.

---

### sigma?

```ts
sigma?: 3 | 1 | 2;
```

Defined in:
[observations.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L133)

How many σ the interval is wide. Left out, 1σ, 68.3 %.
