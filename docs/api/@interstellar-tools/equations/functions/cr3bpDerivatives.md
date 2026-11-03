[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cr3bpDerivatives

# Function: cr3bpDerivatives()

```ts
function cr3bpDerivatives(state: Cr3bpState, mu: number): Cr3bpStateDerivative;
```

Defined in:
[three-body/cr3bp-derivatives.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/cr3bp-derivatives.ts#L71)

Compute the **time derivative** of a state in the circular restricted three-body
problem (right-hand side for ODE integration).

In the rotating frame, normalised so the separation, $G(m_1 + m_2)$ and the
angular rate are 1:

$$
\ddot x - 2\dot y = \frac{\partial U}{\partial x}, \quad
\ddot y + 2\dot x = \frac{\partial U}{\partial y}, \quad
\ddot z = \frac{\partial U}{\partial z}
$$

$$
U = \frac{x^2 + y^2}{2} + \frac{1 - \mu}{r_1} + \frac{\mu}{r_2}, \quad
r_1 = \lVert(x + \mu,\ y,\ z)\rVert, \quad
r_2 = \lVert(x - 1 + \mu,\ y,\ z)\rVert
$$

Where:

- $\mu$ is the mass ratio, from [cr3bpMassRatio](cr3bpMassRatio.md)
- $r_1$, $r_2$ are the distances to the larger body, at $x = -\mu$, and the
  smaller, at $x = 1 - \mu$
- $2\dot y$ and $-2\dot x$ are the Coriolis terms, and $x$, $y$ in $U$ the
  centrifugal ones

**Units**

- Input: `state` `[x, y, z, xDot, yDot, zDot]` in normalised units (see
  [cr3bpUnits](cr3bpUnits.md)), `mu` dimensionless.
- Output: `[xDot, yDot, zDot, xDDot, yDDot, zDDot]` in normalised units.

::: info Notes

- "Restricted": the third body is too light to move the other two, which circle
  their centre of mass. It fits a spacecraft between Earth and Moon far better
  than two patched conics, but the Moon's real orbit is slightly elliptic and
  the Sun pulls on everything.
- Integrate it with [rk4Integrate](rk4Integrate.md), and check the result with
  [jacobiConstant](jacobiConstant.md), which this motion keeps constant.
- Same layout and style as [cwHillDerivatives](cwHillDerivatives.md).

:::

::: practice Apollo 11, the free return

**+3.7 m/s**

_On top of Apollo 11's 10 834.3 m/s at TLI, for a free return in the Earth–Moon
plane_

Integrated from the TLI point, 334.4 km up at 7.367° above the horizontal, a
trajectory 242.27° round from the Earth–Moon line passes 114 km behind the Moon
68.6 h later and comes back to a 38.5 km perigee, inside the atmosphere, 137.4 h
after TLI. That's the figure-eight that would have brought the crew home if the
service module's engine had failed.

:::

## Parameters

| Parameter | Type                                                   | Description                                                             |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `state`   | [`Cr3bpState`](../../types/type-aliases/Cr3bpState.md) | CR3BP state `[x, y, z, xDot, yDot, zDot]` (finite, not at either body). |
| `mu`      | `number`                                               | Mass ratio $\mu$ (finite, in (0, 0.5]).                                 |

## Returns

[`Cr3bpStateDerivative`](../../types/type-aliases/Cr3bpStateDerivative.md)

The time derivative `[xDot, yDot, zDot, xDDot, yDDot, zDDot]`.

## Throws

If `mu` or a state component is not finite.

## Throws

If `mu` is outside (0, 0.5], or the state is at the centre of either body.

## Example

```ts
import type { Cr3bpState } from '@interstellar-tools/types';

// At rest at L4: the forces balance, so the acceleration is zero
const mu = 0.012151;
const l4: Cr3bpState = [0.5 - mu, Math.sqrt(3) / 2, 0, 0, 0, 0];
cr3bpDerivatives(l4, mu); // ≈ [0, 0, 0, 0, 0, 0]
```

## See

- [jacobiConstant](jacobiConstant.md)
- [rk4Integrate](rk4Integrate.md)
- https://en.wikipedia.org/wiki/Three-body_problem#Circular_restricted_three-body_problem
  Circular restricted three-body problem
