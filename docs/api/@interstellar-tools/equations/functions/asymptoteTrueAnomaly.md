[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / asymptoteTrueAnomaly

# Function: asymptoteTrueAnomaly()

```ts
function asymptoteTrueAnomaly(e: number): Radians;
```

Defined in:
[anomalies/asymptote-true-anomaly.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/anomalies/asymptote-true-anomaly.ts#L50)

Compute the **true anomaly of a hyperbola's asymptotes**: the limit a body on a
hyperbola approaches but never reaches.

$$
\nu_\infty = \arccos\left(-\frac{1}{e}\right)
$$

**Units**

- Input: `e` dimensionless.
- Output: $\nu_\infty$ in **radians**, in (π/2, π).

::: info Notes

- The body comes in from $-\nu_\infty$ and leaves towards $+\nu_\infty$.
- The trajectory turns through $2\nu_\infty - \pi = 2\arcsin(1/e)$, the turning
  angle of a flyby; see `gravityAssistTurningAngle`.
- Just above $e = 1$ the asymptotes open to almost π (a near-parabola); for
  large $e$ they close towards π/2 (a near-straight line).

:::

::: practice Apollo 11, arriving at the Moon

**134.0°**

_Asymptote of the approach hyperbola, e = 1.44_

Without the lunar orbit insertion burn at closest approach, the Moon's gravity
would have bent Apollo 11's path through 88° and sent it back out of the Moon's
sphere of influence.

```ts
asymptoteTrueAnomaly(1.44); // ≈ 2.338 rad, 134.0°
```

:::

## Parameters

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `e`       | `number` | Eccentricity $e$ (finite, > 1). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Asymptote true anomaly $\nu_\infty$ in **radians**.

## Throws

If `e` is not a finite number.

## Throws

If `e <= 1`.

## Example

```ts
asymptoteTrueAnomaly(2); // 2π/3 (120°)
```

## See

- [trueToHyperbolicAnomaly](trueToHyperbolicAnomaly.md)
- https://en.wikipedia.org/wiki/Hyperbolic_trajectory Hyperbolic trajectory
