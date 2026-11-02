[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cwTwoImpulseTransfer

# Function: cwTwoImpulseTransfer()

```ts
function cwTwoImpulseTransfer(
  state0: CwState,
  target: CwState,
  n: number,
  t: number
): CwTwoImpulseTransferInterface;
```

Defined in:
[manoeuvres/cw-two-impulse-transfer.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/manoeuvres/cw-two-impulse-transfer.ts#L62)

Compute the **two burns of a Clohessy–Wiltshire rendezvous**: from a relative
state to a target state in a given time.

$$
\mathbf v_0^+ = \Phi_{rv}^{-1}\left(\mathbf r_f - \Phi_{rr}\,\mathbf r_0\right), \quad
\Delta\mathbf v_1 = \mathbf v_0^+ - \mathbf v_0, \quad
\Delta\mathbf v_2 = \mathbf v_f - \left(\Phi_{vr}\,\mathbf r_0 + \Phi_{vv}\,\mathbf v_0^+\right)
$$

with the blocks of $\Phi(t)$ from [cwStateTransition](cwStateTransition.md).

**Units**

- Inputs: states in **m** and **m/s**, `n` in **rad/s**, `t` in **s**.
- Output: both burns in **m/s**, as vectors in the LVLH frame.

::: info Notes

- The first burn puts the deputy on a path that reaches the target position
  after `t`; the second matches the target velocity there. For a rendezvous with
  the chief, the target state is all zeros.
- Some transfer times can't be targeted: in the orbital plane, every whole
  number of orbits ($nt = 2\pi k$), and out of plane, every half orbit, where
  the cross-track motion returns to $\pm z_0$ whatever the burn. At a half orbit
  the cross-track burn is zero if the target is already on that path, and
  otherwise the function throws.
- Valid near a circular reference orbit, for small separations.

:::

## Parameters

| Parameter | Type                                             | Description                                                                                        |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `state0`  | [`CwState`](../../types/type-aliases/CwState.md) | Deputy's relative state before the first burn `[x, y, z, xDot, yDot, zDot]` (finite).              |
| `target`  | [`CwState`](../../types/type-aliases/CwState.md) | State to arrive at `[x, y, z, xDot, yDot, zDot]` (finite); all zeros to rendezvous with the chief. |
| `n`       | `number`                                         | Mean motion of the circular reference orbit in **rad/s** (finite, > 0).                            |
| `t`       | `number`                                         | Transfer time in **s** (finite, > 0).                                                              |

## Returns

[`CwTwoImpulseTransferInterface`](../interfaces/CwTwoImpulseTransferInterface.md)

The two burns `dv1` and `dv2` in **m/s**.

## Throws

If any input is not a finite number.

## Throws

If `n <= 0`, `t <= 0`, or the transfer time can't be targeted.

## Example

```ts
import type { CwState } from '@interstellar-tools/types';

// 1 km behind the chief, at rest: rendezvous in a quarter of an orbit
const n = 0.00113;
const { dv1, dv2 } = cwTwoImpulseTransfer(
  [0, -1000, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  n,
  Math.PI / 2 / n
);
```

## See

- [cwPropagate](cwPropagate.md)
- https://en.wikipedia.org/wiki/Clohessy%E2%80%93Wiltshire_equations
  Clohessy–Wiltshire equations
