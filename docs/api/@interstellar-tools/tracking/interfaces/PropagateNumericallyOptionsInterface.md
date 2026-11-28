[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ PropagateNumericallyOptionsInterface

# Interface: PropagateNumericallyOptionsInterface

Defined in:
[satellites/propagate-numerically.ts:57](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L57)

Options for [propagateNumerically](../functions/propagateNumerically.md).

## Properties

### forces?

```ts
forces?: NumericalForcesInterface;
```

Defined in:
[satellites/propagate-numerically.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L61)

The forces to model.

---

### integrator?

```ts
integrator?: {
  method?: "rk45" | "rk4";
  step?: number;
  tolerance?: number;
};
```

Defined in:
[satellites/propagate-numerically.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L63)

`'rk45'`, adaptive steps within a relative `tolerance` (default 1e-10), or
`'rk4'`, fixed steps of `step` **s** (default 10). Defaults to `'rk45'`.

| Name         | Type     | Defined in                                                                                                                                                      |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method?`    | `"rk45"` | `"rk4"`                                                                                                                                                         | [satellites/propagate-numerically.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L63) |
| `step?`      | `number` | [satellites/propagate-numerically.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L63) |
| `tolerance?` | `number` | [satellites/propagate-numerically.ts:63](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L63) |

---

### manoeuvres?

```ts
manoeuvres?: readonly ManoeuvreInterface[];
```

Defined in:
[satellites/propagate-numerically.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L65)

Impulsive burns along the way.

---

### step?

```ts
step?: number;
```

Defined in:
[satellites/propagate-numerically.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L59)

The time between the samples returned, in **s**. Defaults to 60.
