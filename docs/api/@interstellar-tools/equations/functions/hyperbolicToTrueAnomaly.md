[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hyperbolicToTrueAnomaly

# Function: hyperbolicToTrueAnomaly()

```ts
function hyperbolicToTrueAnomaly(F: number, e: number): Radians;
```

Defined in:
[anomalies/hyperbolic-to-true-anomaly.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/anomalies/hyperbolic-to-true-anomaly.ts#L38)

Convert a **hyperbolic anomaly** $F$ to the **true anomaly** on a hyperbola.

$$
\tan\frac{\nu}{2} = \sqrt{\frac{e + 1}{e - 1}}\,\tanh\frac{F}{2}
$$

**Units**

- Inputs: `F` in **radians**, `e` dimensionless.
- Output: $\nu$ in **radians**, in $(-\nu_\infty, \nu_\infty)$.

::: info Notes

- The inverse of [trueToHyperbolicAnomaly](trueToHyperbolicAnomaly.md).
- As $F \to \pm\infty$, $\nu$ approaches the asymptotes $\pm\nu_\infty$ but
  never reaches them.
- Returns a signed angle, negative before periapsis. Use `norm2pi` for \[0, 2π).

:::

## Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `F`       | `number` | Hyperbolic anomaly $F$ in **radians** (finite). |
| `e`       | `number` | Eccentricity $e$ (finite, > 1).                 |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

True anomaly $\nu$ in **radians**, in (-π, π).

## Throws

If any input is not a finite number.

## Throws

If `e <= 1`.

## Example

```ts
const nu = hyperbolicToTrueAnomaly(Math.acosh(2), 2);
// nu ≈ π/2
```

## See

- [trueToHyperbolicAnomaly](trueToHyperbolicAnomaly.md)
- [solveKeplerHyperbolic](solveKeplerHyperbolic.md)
