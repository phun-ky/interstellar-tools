[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
UncertaintyInterface

# Interface: UncertaintyInterface

Defined in:
[observations.ts:124](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L124)

An **uncertainty**, in the value's own unit. Equal `plus` and `minus` is a
symmetric ±σ.

## Properties

### minus

```ts
minus: number;
```

Defined in:
[observations.ts:128](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L128)

The lower error bar, as a positive number.

---

### plus

```ts
plus: number;
```

Defined in:
[observations.ts:126](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L126)

The upper error bar.

---

### sigma?

```ts
sigma?: 3 | 1 | 2;
```

Defined in:
[observations.ts:130](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L130)

How many σ the interval is wide. Left out, 1σ, 68.3 %.
