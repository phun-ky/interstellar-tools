[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rk4Step

# Function: rk4Step()

```ts
function rk4Step(
  f: OdeRightHandSideType,
  t: number,
  y: readonly number[],
  h: number
): number[];
```

Defined in:
[helpers/rk4.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk4.ts#L42)

Take one **fourth-order Runge–Kutta** step of a system of ODEs, $\dot{\mathbf y}
= f(t, \mathbf y)$.

$$
\mathbf y_{n+1} = \mathbf y_n + \frac{h}{6}\left(\mathbf k_1 + 2\mathbf k_2 + 2\mathbf k_3 + \mathbf k_4\right)
$$

with $\mathbf k_1 = f(t, \mathbf y)$, $\mathbf k_2 = f(t + h/2, \mathbf y +
h\mathbf k_1/2)$, $\mathbf k_3 = f(t + h/2, \mathbf y + h\mathbf k_2/2)$ and
$\mathbf k_4 = f(t + h, \mathbf y + h\mathbf k_3)$.

::: info Notes

- The error per step shrinks as $h^5$, and over a fixed interval as $h^4$:
  halving the step makes the result about 16 times more accurate.
- A fixed step suits smooth problems. Close passes, where the forces change
  quickly, need a step small enough for the closest one.
- `h` may be negative, to integrate backwards.

:::

## Parameters

| Parameter | Type                                                                       | Description                                                               |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `f`       | [`OdeRightHandSideType`](../../types/type-aliases/OdeRightHandSideType.md) | The right-hand side $f(t, \mathbf y)$, returning an array as long as `y`. |
| `t`       | `number`                                                                   | Time $t$ at the start of the step (finite).                               |
| `y`       | readonly `number`\[]                                                       | State $\mathbf y$ at `t` (finite components).                             |
| `h`       | `number`                                                                   | Step size $h$ (finite, non-zero).                                         |

## Returns

`number`\[]

The state at `t + h`.

## Throws

If `t`, `h` or a component of `y` is not finite, or `f` returns an array of the
wrong length.

## Throws

If `h` is zero.

## Example

```ts
// dy/dt = y from y = 1: one step of 0.1 gives e^0.1 to 7 digits
rk4Step((_t, [y]) => [y], 0, [1], 0.1); // [1.1051708...]
```

## See

- [rk4Integrate](rk4Integrate.md)
- https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods Runge–Kutta methods
