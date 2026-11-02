[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / solveKeplerHyperbolic

# Function: solveKeplerHyperbolic()

```ts
function solveKeplerHyperbolic(
  Mh: number,
  e: number,
  tolerance?: number,
  maxIter?: number
): number;
```

Defined in:
[kepler/solve-kepler-hyperbolic.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/kepler/solve-kepler-hyperbolic.ts#L65)

Solve **Kepler's equation for a hyperbola**: find the hyperbolic anomaly $F$
from the hyperbolic mean anomaly $M_h$.

$$
M_h = e \sinh F - F
$$

solved with Newton's method:

$$
F_{n+1} = F_n - \frac{e \sinh F_n - F_n - M_h}{e \cosh F_n - 1}, \qquad F_0 = \min\left(\operatorname{asinh}\frac{|M_h|}{e - 1},\ \sqrt[3]{\frac{6|M_h|}{e}}\right)
$$

**Units**

- Inputs: `Mh` in **radians**, `e` dimensionless.
- Output: $F$ in **radians** (dimensionless, unbounded).

::: info Notes

- The equation is odd in $F$, so the solver works on $|M_h|$ and restores the
  sign. Negative values are before periapsis.
- $F_0$ is an upper bound on the root, since $e\sinh F - F$ is at least
  $(e-1)\sinh F$ and at least $(e-1)F + eF^3/6$. The function is increasing and
  convex for $F > 0$, so Newton's method converges monotonically from there,
  even close to $e = 1$ where the derivative $e\cosh F - 1$ is small near
  periapsis.
- Unlike an ellipse, a hyperbola isn't periodic: $M_h$ isn't reduced to one
  turn.
- [solveKeplerHighEccentricity](solveKeplerHighEccentricity.md) also accepts
  $e > 1$, but this solver throws when it doesn't converge instead of returning
  its last estimate.

:::

## Parameters

| Parameter    | Type     | Default value | Description                                                                        |
| ------------ | -------- | ------------- | ---------------------------------------------------------------------------------- |
| `Mh`         | `number` | `undefined`   | Hyperbolic mean anomaly $M_h$ in **radians** (finite).                             |
| `e`          | `number` | `undefined`   | Eccentricity $e$ (finite, > 1).                                                    |
| `tolerance?` | `number` | `1e-14`       | Stop when a step is smaller than `tolerance * max(1, \|F\|)`. Defaults to `1e-14`. |
| `maxIter?`   | `number` | `50`          | Maximum number of Newton steps. Defaults to `50`.                                  |

## Returns

`number`

The hyperbolic anomaly $F$ in **radians**, with the sign of `Mh`.

## Throws

If any input is not a finite number.

## Throws

If `e <= 1`, `tolerance <= 0` or `maxIter < 1`.

## Throws

If the iteration doesn't converge within `maxIter` steps.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const F = solveKeplerHyperbolic(12.66 as Radians, 1.44);
// F ≈ 3.087, and 1.44 * sinh(F) - F ≈ 12.66
```

## See

- [hyperbolicTimeOfFlight](hyperbolicTimeOfFlight.md)
- https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly
  Hyperbolic anomaly
