[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / keplerPropagate

# Function: keplerPropagate()

```ts
function keplerPropagate(
  r0: Vector3DTupleType,
  v0: Vector3DTupleType,
  dt: number,
  mu: number
): StateVectorInterface;
```

Defined in:
[orbits/kepler-propagate.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/kepler-propagate.ts#L74)

Propagate a **two-body state vector** by a time `dt`, on any conic: ellipse,
parabola or hyperbola.

Uses the **universal-variable** formulation. With $r_0 = |\mathbf r_0|$, $v_{r0}
= \mathbf r_0 \cdot \mathbf v_0 / r_0$ and $\alpha = 2/r_0 - v_0^2/\mu$ (that
is, $1/a$), it solves the universal Kepler equation for $\chi$, with $z =
\alpha\chi^2$:

$$
\frac{r_0 v_{r0}}{\sqrt\mu}\,\chi^2 C(z) + (1 - \alpha r_0)\,\chi^3 S(z) + r_0\chi = \sqrt\mu\,\Delta t
$$

then applies the Lagrange coefficients:

$$
f = 1 - \frac{\chi^2}{r_0}C, \quad g = \Delta t - \frac{\chi^3}{\sqrt\mu}S, \quad
\dot f = \frac{\sqrt\mu}{r r_0}\left(\alpha\chi^3 S - \chi\right), \quad
\dot g = 1 - \frac{\chi^2}{r}C
$$

$$
\mathbf r = f\,\mathbf r_0 + g\,\mathbf v_0, \quad \mathbf v = \dot f\,\mathbf r_0 + \dot g\,\mathbf v_0
$$

where $C$ and $S$ are the Stumpff functions, [stumpffC](stumpffC.md) and
[stumpffS](stumpffS.md).

**Units**

- Inputs: `r0` in **m**, `v0` in **m/s**, `dt` in **s**, `mu` in **m³/s²**.
- Output: `r` in **m**, `v` in **m/s**.

::: info Notes

- One formula covers every conic: a parabola is just $\alpha = 0$, with no
  special case.
- `dt` may be negative, to propagate backwards.
- On an ellipse, whole periods are taken off `dt` first: they change nothing,
  and a large $\chi$ costs digits in $C$ and $S$.
- The left side grows with $\chi$ at the rate $r \ge r_p$, the periapsis radius,
  so there's exactly one root, between 0 and $\sqrt\mu\,\Delta t / r_p$.
  Newton's method finds it, falling back to bisection when a step leaves that
  bracket or slows down.
- Two-body motion only: no perturbations, no collision with the central body.

:::

## Parameters

| Parameter | Type                                                                 | Description                                                       |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `r0`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Position vector in **m** (finite components, not zero).           |
| `v0`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Velocity vector in **m/s** (finite components).                   |
| `dt`      | `number`                                                             | Time to propagate by, in **s** (finite; negative goes backwards). |
| `mu`      | `number`                                                             | Gravitational parameter $\mu$ in **m³/s²** (finite, > 0).         |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s** at `dt`.

## Throws

- If any input is not a finite number.
- If `mu <= 0`, `r0` is zero, the motion is straight up or down (no angular
  momentum), or `dt` is so long the solution overflows (far out on a hyperbola).

## Example

```ts
// Curtis, Orbital Mechanics for Engineering Students, Example 3.7: one hour on
const { r, v } = keplerPropagate(
  [7000e3, -12_124e3, 0],
  [2667.9, 4621.0, 0],
  3600,
  398_600e9
);
// r ≈ [-3297.8, 7413.4, 0] km, v ≈ [-8.2976, -0.96404, 0] km/s
```

## See

- [stumpffC](stumpffC.md)
- [stumpffS](stumpffS.md)
- [elementsToState](elementsToState.md)
- https://en.wikipedia.org/wiki/Universal_variable_formulation Universal
  variable formulation
