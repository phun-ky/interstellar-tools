[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rk45Integrate

# Function: rk45Integrate()

```ts
function rk45Integrate(
  f: OdeRightHandSideType,
  y0: readonly number[],
  t0: number,
  t1: number,
  options?: Rk45IntegrateOptionsInterface
): OdeSolutionInterface;
```

Defined in:
[helpers/rk45.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/rk45.ts#L99)

**Integrate** a system of ODEs from `t0` to `t1` with **adaptive steps**: the
Dormand–Prince method, RK45, which takes long steps where the solution is smooth
and short ones where it changes fast, to keep each step's error within a
tolerance.

Each step evaluates $f$ six times (the seventh is the next step's first) and
gives two estimates, of fifth and fourth order. Their difference estimates the
step's error $\mathbf e$, which sets the next step:

$$
\text{err} = \sqrt{\frac{1}{n}\sum_i \left(\frac{e_i}{\text{atol} + \text{rtol}\,|y_i|}\right)^2},
\qquad
h_{\text{next}} = h \cdot \min\!\big(5, \max(0.2, 0.9\,\text{err}^{-1/5})\big)
$$

A step with $\text{err} > 1$ is rejected and taken again, shorter.

::: info Notes

- **Use it for orbits** that aren't circular: on an eccentric orbit, it steps
  quickly through apoapsis and slowly through periapsis, where
  [rk4Integrate](rk4Integrate.md) needs the short step everywhere.
- The tolerance bounds each step's error, not the total: errors add up over many
  steps. Tighten it until the answer stops changing.
- The solution holds the accepted steps, with `t1` exactly last. Their times are
  wherever the steps fell; for given times, integrate to each in turn.
- `t1` may be before `t0`, to integrate backwards.

:::

## Parameters

| Parameter  | Type                                                                              | Description                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `f`        | [`OdeRightHandSideType`](../../types/type-aliases/OdeRightHandSideType.md)        | The right-hand side $f(t, \mathbf y)$, returning an array as long as `y0`.                                                              |
| `y0`       | readonly `number`\[]                                                              | State at `t0` (finite components).                                                                                                      |
| `t0`       | `number`                                                                          | Start time (finite).                                                                                                                    |
| `t1`       | `number`                                                                          | End time (finite, not equal to `t0`).                                                                                                   |
| `options?` | [`Rk45IntegrateOptionsInterface`](../interfaces/Rk45IntegrateOptionsInterface.md) | `tolerance` and `absoluteTolerance` (finite, > 0), `initialStep` and `maxStep` (finite, > 0), `maxSteps` (an integer >= 1), and `stop`. |

## Returns

[`OdeSolutionInterface`](../../types/interfaces/OdeSolutionInterface.md)

The times and states of the accepted steps, `t[k]` with `y[k]`, from `t0` to
`t1`.

## Throws

If a number is not finite, `maxSteps` is not an integer, or `f` returns an array
of the wrong length.

## Throws

If `t1 = t0`, an option is out of range, or the integration needs more than
`maxSteps` steps, or a step too small to tell from rounding.

## Example

```ts
// A harmonic oscillator over one period: back where it started
const { t, y } = rk45Integrate((_t, [x, v]) => [v, -x], [1, 0], 0, 2 * Math.PI);

y[y.length - 1]; // ≈ [1, 0], to 3e-9
t.length; // 94: the start, and the 93 steps it took
```

## See

- [rk4Integrate](rk4Integrate.md)
- Dormand & Prince (1980), "A family of embedded Runge-Kutta formulae", _Journal
  of Computational and Applied Mathematics_ 6(1), 19-26
- Hairer, Nørsett & Wanner, _Solving Ordinary Differential Equations I_, 2nd ed.
  (1993), section II.4
