[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / Rk45IntegrateOptionsInterface

# Interface: Rk45IntegrateOptionsInterface

Defined in:
[helpers/rk45.ts:7](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L7)

Options for [rk45Integrate](../functions/rk45Integrate.md).

## Properties

### absoluteTolerance?

```ts
absoluteTolerance?: number;
```

Defined in:
[helpers/rk45.ts:11](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L11)

Absolute tolerance on each step's error, in the units of `y`. Defaults to
`1e-9`.

---

### initialStep?

```ts
initialStep?: number;
```

Defined in:
[helpers/rk45.ts:13](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L13)

The first step to try. Defaults to a hundredth of the interval.

---

### maxStep?

```ts
maxStep?: number;
```

Defined in:
[helpers/rk45.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L15)

The largest step to take. Defaults to the whole interval.

---

### maxSteps?

```ts
maxSteps?: number;
```

Defined in:
[helpers/rk45.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L17)

The most steps to take, accepted or rejected, before giving up. Defaults to
`1e6`.

---

### stop?

```ts
stop?: (t: number, y: readonly number[]) => boolean;
```

Defined in:
[helpers/rk45.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L19)

Ends the integration early when it returns `true`, checked after every accepted
step.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `t`       | `number`             |
| `y`       | readonly `number`\[] |

#### Returns

`boolean`

---

### tolerance?

```ts
tolerance?: number;
```

Defined in:
[helpers/rk45.ts:9](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L9)

Relative tolerance on each step's error. Defaults to `1e-9`.
