[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / stumpffC

# Function: stumpffC()

```ts
function stumpffC(z: number): number;
```

Defined in:
[helpers/stumpff.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/stumpff.ts#L48)

Compute the **Stumpff function** $C(z)$, used by the universal-variable
formulation of the two-body problem.

$$
C(z) =
\begin{cases}
\dfrac{1 - \cos\sqrt z}{z} & z > 0 \\[1ex]
\dfrac{\cosh\sqrt{-z} - 1}{-z} & z < 0 \\[1ex]
\tfrac12 & z = 0
\end{cases}
\qquad
= \sum_{k=0}^{\infty} \frac{(-z)^k}{(2k + 2)!}
$$

Where $z = \alpha\chi^2$ is the universal anomaly squared, scaled by $\alpha =
1/a$: positive on an ellipse, zero on a parabola and negative on a hyperbola.

::: info Notes

- One formula for all three kinds of orbit: the circular functions on an
  ellipse, the hyperbolic ones on a hyperbola, and the series that joins them at
  $z = 0$.
- Near $z = 0$ (for $|z| < 0.1$) the series is used, since $1 - \cos\sqrt z$
  loses digits to cancellation there.
- $C(4\pi^2) = 0$: one whole revolution. [solveLambert](solveLambert.md) only
  searches below it.

:::

## Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `z`       | `number` | The argument $z$ (finite, dimensionless). |

## Returns

`number`

$C(z)$, positive everywhere but at $z = (2\pi k)^2$ for whole $k \ge 1$.

## Throws

If `z` is not a finite number.

## Example

```ts
stumpffC(0); // 0.5
stumpffC(Math.PI ** 2); // 2 / π² ≈ 0.2026
```

## See

- [stumpffS](stumpffS.md)
- [solveLambert](solveLambert.md)
- https://en.wikipedia.org/wiki/Universal_variable_formulation Universal
  variable formulation
