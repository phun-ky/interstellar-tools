[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cwPropagate

# Function: cwPropagate()

```ts
function cwPropagate(state: CwState, n: number, t: number): CwState;
```

Defined in:
[orbits/cw-propagate.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-propagate.ts#L52)

**Propagate** a Clohessy–Wiltshire / Hill relative state in closed form.

$$
\begin{pmatrix}\mathbf r \\ \mathbf v\end{pmatrix}(t) =
\begin{bmatrix}\Phi_{rr} & \Phi_{rv} \\ \Phi_{vr} & \Phi_{vv}\end{bmatrix}
\begin{pmatrix}\mathbf r_0 \\ \mathbf v_0\end{pmatrix}
$$

with $\Phi(t)$ from [cwStateTransition](cwStateTransition.md).

**Units**

- Inputs: `state` positions in **m** and velocities in **m/s**, `n` in
  **rad/s**, `t` in **s**.
- Output: the state at `t`, in the same units.

::: info Notes

- The exact solution of the equations [cwHillDerivatives](cwHillDerivatives.md)
  gives to a numerical integrator: no step size, no accumulated error.
- Same LVLH frame and `CwState` layout as `cwHillDerivatives`:
  `[x, y, z, xDot, yDot, zDot]`, with $x$ radial, $y$ along-track, $z$
  cross-track.
- A state with $\dot y_0 = -2n x_0$ has no along-track drift: it traces a closed
  ellipse around the chief.

:::

## Parameters

| Parameter | Type                                             | Description                                                             |
| --------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `state`   | [`CwState`](../../types/type-aliases/CwState.md) | Relative state `[x, y, z, xDot, yDot, zDot]` (finite).                  |
| `n`       | `number`                                         | Mean motion of the circular reference orbit in **rad/s** (finite, > 0). |
| `t`       | `number`                                         | Time to propagate in **s** (finite; negative goes backwards).           |

## Returns

[`CwState`](../../types/type-aliases/CwState.md)

The relative state at `t`.

## Throws

If any input is not a finite number.

## Throws

If `n <= 0`.

## Example

```ts
import type { CwState } from '@interstellar-tools/types';

// 100 m below the chief with no drift: back where it started after one orbit
const n = 0.00113;
const start: CwState = [-100, 0, 0, 0, 2 * n * 100, 0];
const later = cwPropagate(start, n, (2 * Math.PI) / n);
// later ≈ start
```

## See

- [cwStateTransition](cwStateTransition.md)
- [cwTwoImpulseTransfer](cwTwoImpulseTransfer.md)
