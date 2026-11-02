[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / trueToHyperbolicAnomaly

# Function: trueToHyperbolicAnomaly()

```ts
function trueToHyperbolicAnomaly(nu: Radians, e: number): number;
```

Defined in:
[anomalies/true-to-hyperbolic-anomaly.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/anomalies/true-to-hyperbolic-anomaly.ts#L42)

Convert a **true anomaly** on a hyperbola to the **hyperbolic anomaly** $F$.

$$
\tanh\frac{F}{2} = \sqrt{\frac{e - 1}{e + 1}}\,\tan\frac{\nu}{2}
$$

**Units**

- Inputs: `nu` in **radians**, `e` dimensionless.
- Output: $F$ in **radians** (dimensionless, unbounded).

::: info Notes

- The hyperbolic counterpart of the eccentric anomaly. Feed it to $M_h = e \sinh
  F - F$ to get a time from periapsis.
- `nu` is wrapped to (-π, π] first, so the incoming branch can be given either
  as a negative angle or just below 2π, as [stateToElements](stateToElements.md)
  returns it.
- Only $|\nu| < \nu_\infty$ exists on a hyperbola; see
  [asymptoteTrueAnomaly](asymptoteTrueAnomaly.md).

:::

## Parameters

| Parameter | Type                                             | Description                                                        |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `nu`      | [`Radians`](../../types/type-aliases/Radians.md) | True anomaly $\nu$ in **radians** (finite, inside the asymptotes). |
| `e`       | `number`                                         | Eccentricity $e$ (finite, > 1).                                    |

## Returns

`number`

Hyperbolic anomaly $F$ in **radians**: negative before periapsis, positive
after.

## Throws

If any input is not a finite number.

## Throws

If `e <= 1` or `nu` is at or beyond the asymptotes.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const F = trueToHyperbolicAnomaly((Math.PI / 2) as Radians, 2);
// F ≈ 1.317 (cosh F = e)
```

## See

- [hyperbolicToTrueAnomaly](hyperbolicToTrueAnomaly.md)
- https://en.wikipedia.org/wiki/Hyperbolic_trajectory#Hyperbolic_anomaly
  Hyperbolic anomaly
