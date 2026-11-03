[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rk4Integrate

# Function: rk4Integrate()

```ts
function rk4Integrate(
  f: OdeRightHandSideType,
  y0: readonly number[],
  t0: number,
  t1: number,
  steps: number,
  options?: {
    every?: number;
    stop?: (t: number, y: readonly number[]) => boolean;
  }
): OdeSolutionInterface;
```

Defined in:
[helpers/rk4.ts:115](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk4.ts#L115)

**Integrate** a system of ODEs from `t0` to `t1` in fixed fourth-order
Runge–Kutta steps.

Takes `steps` steps of $h = (t_1 - t_0)/\text{steps}$ with
[rk4Step](rk4Step.md), and returns the state after each, starting with `y0` at
`t0`.

::: info Notes

- `stop(t, y)`, if given, is checked after every step; when it returns `true`
  the integration ends there, and the last sample is the state that triggered
  it. Use it to catch a crash into a body, or a crossing.
- `every` keeps only every n-th sample (the last one is always kept), to save
  memory on long runs.
- `t1` may be before `t0`, to integrate backwards.

:::

## Parameters

| Parameter        | Type                                                                                      | Description                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `f`              | [`OdeRightHandSideType`](../../types/type-aliases/OdeRightHandSideType.md)                | The right-hand side $f(t, \mathbf y)$.                                                                             |
| `y0`             | readonly `number`\[]                                                                      | State at `t0` (finite components).                                                                                 |
| `t0`             | `number`                                                                                  | Start time (finite).                                                                                               |
| `t1`             | `number`                                                                                  | End time (finite, not equal to `t0`).                                                                              |
| `steps`          | `number`                                                                                  | Number of steps (integer, >= 1).                                                                                   |
| `options?`       | { `every?`: `number`; `stop?`: (`t`: `number`, `y`: readonly `number`\[]) => `boolean`; } | `stop`, a function that ends the integration early, and `every`, the sampling interval (integer, >= 1; default 1). |
| `options.every?` | `number`                                                                                  | -                                                                                                                  |
| `options.stop?`  | (`t`: `number`, `y`: readonly `number`\[]) => `boolean`                                   | -                                                                                                                  |

## Returns

[`OdeSolutionInterface`](../../types/interfaces/OdeSolutionInterface.md)

The times and states, `t[k]` with `y[k]`.

## Throws

If a number is not finite, or `steps` or `every` is not an integer.

## Throws

If `t1 = t0`, `steps < 1` or `every < 1`.

## Example

```ts
// A harmonic oscillator over one period: back where it started
const { y } = rk4Integrate(
  (_t, [x, v]) => [v, -x],
  [1, 0],
  0,
  2 * Math.PI,
  1000
);
y[y.length - 1]; // ≈ [1, 0]
```

## See

[rk4Step](rk4Step.md)
