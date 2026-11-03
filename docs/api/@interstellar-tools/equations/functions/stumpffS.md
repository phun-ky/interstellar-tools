[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / stumpffS

# Function: stumpffS()

```ts
function stumpffS(z: number): number;
```

Defined in:
[helpers/stumpff.ts:104](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/stumpff.ts#L104)

Compute the **Stumpff function** $S(z)$, used by the universal-variable
formulation of the two-body problem.

$$
S(z) =
\begin{cases}
\dfrac{\sqrt z - \sin\sqrt z}{\sqrt{z}^{\,3}} & z > 0 \\[1ex]
\dfrac{\sinh\sqrt{-z} - \sqrt{-z}}{\sqrt{-z}^{\,3}} & z < 0 \\[1ex]
\tfrac16 & z = 0
\end{cases}
\qquad
= \sum_{k=0}^{\infty} \frac{(-z)^k}{(2k + 3)!}
$$

Where $z = \alpha\chi^2$ is the universal anomaly squared, scaled by $\alpha =
1/a$: positive on an ellipse, zero on a parabola and negative on a hyperbola.

::: info Notes

- Near $z = 0$ (for $|z| < 0.1$) the series is used, since $\sqrt z - \sin\sqrt
  z$ loses digits to cancellation there.
- $S$ decreases as $z$ grows, and stays positive.

:::

## Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `z`       | `number` | The argument $z$ (finite, dimensionless). |

## Returns

`number`

$S(z)$.

## Throws

If `z` is not a finite number.

## Example

```ts
stumpffS(0); // 1/6
stumpffS(Math.PI ** 2); // 1 / π² ≈ 0.1013
```

## See

- [stumpffC](stumpffC.md)
- [solveLambert](solveLambert.md)
- https://en.wikipedia.org/wiki/Universal_variable_formulation Universal
  variable formulation
