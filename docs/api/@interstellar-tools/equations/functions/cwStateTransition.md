[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cwStateTransition

# Function: cwStateTransition()

```ts
function cwStateTransition(n: number, t: number): CwStateTransitionInterface;
```

Defined in:
[orbits/cw-state-transition.ts:66](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L66)

Compute the **Clohessy–Wiltshire state transition matrix**: the closed-form
solution of the CW / Hill equations.

With $s = \sin nt$ and $c = \cos nt$, in the LVLH frame of
[cwHillDerivatives](cwHillDerivatives.md) ($x$ radial, $y$ along-track, $z$
cross-track):

$$
\Phi_{rr} = \begin{bmatrix} 4 - 3c & 0 & 0 \\ 6(s - nt) & 1 & 0 \\ 0 & 0 & c \end{bmatrix}, \quad
\Phi_{rv} = \frac{1}{n}\begin{bmatrix} s & 2(1 - c) & 0 \\ -2(1 - c) & 4s - 3nt & 0 \\ 0 & 0 & s \end{bmatrix}
$$

$$
\Phi_{vr} = \begin{bmatrix} 3ns & 0 & 0 \\ 6n(c - 1) & 0 & 0 \\ 0 & 0 & -ns \end{bmatrix}, \quad
\Phi_{vv} = \begin{bmatrix} c & 2s & 0 \\ -2s & 4c - 3 & 0 \\ 0 & 0 & c \end{bmatrix}
$$

**Units**

- Inputs: `n` in **rad/s**, `t` in **s**.
- Output: dimensionless blocks, except $\Phi_{rv}$ in **s** and $\Phi_{vr}$ in
  **1/s**.

::: info Notes

- Valid near a **circular** reference orbit, for separations small compared with
  its radius. Elliptic reference orbits need other solutions (e.g.
  Yamanaka–Ankersen).
- The $-3nt$ terms grow without bound: a deputy slightly lower than the chief
  drifts ahead every orbit.
- $\Phi(0)$ is the identity, and $\Phi(t_1 + t_2) = \Phi(t_2)\,\Phi(t_1)$.
- Negative `t` propagates backwards.

:::

## Parameters

| Parameter | Type     | Description                                                                 |
| --------- | -------- | --------------------------------------------------------------------------- |
| `n`       | `number` | Mean motion of the circular reference orbit $n$ in **rad/s** (finite, > 0). |
| `t`       | `number` | Time since the initial state $t$ in **s** (finite).                         |

## Returns

[`CwStateTransitionInterface`](../interfaces/CwStateTransitionInterface.md)

The four 3×3 blocks of $\Phi(t)$.

## Throws

If any input is not a finite number.

## Throws

If `n <= 0`.

## Example

```ts
// ISS-like orbit: n ≈ 0.00113 rad/s, a quarter of an orbit later
const { rr, rv } = cwStateTransition(0.00113, Math.PI / 2 / 0.00113);
```

## See

- [cwPropagate](cwPropagate.md)
- [cwTwoImpulseTransfer](cwTwoImpulseTransfer.md)
- https://en.wikipedia.org/wiki/Clohessy%E2%80%93Wiltshire_equations
  Clohessy–Wiltshire equations
