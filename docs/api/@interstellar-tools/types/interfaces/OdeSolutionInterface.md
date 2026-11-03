[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OdeSolutionInterface

# Interface: OdeSolutionInterface

Defined in:
[math.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/math.ts#L73)

The output of a numerical integration: the times, and the state at each.

`t[k]` and `y[k]` belong together; `t[0]` and `y[0]` are the starting point.

## Properties

### t

```ts
t: number[];
```

Defined in:
[math.ts:75](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/math.ts#L75)

Times, in the units the right-hand side uses.

---

### y

```ts
y: number[][];
```

Defined in:
[math.ts:77](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/math.ts#L77)

States, one per time.
