[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / jacobiConstant

# Function: jacobiConstant()

```ts
function jacobiConstant(state: Cr3bpState, mu: number): number;
```

Defined in:
[three-body/jacobi-constant.ts:55](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/three-body/jacobi-constant.ts#L55)

Compute the **Jacobi constant** of a state in the circular restricted three-body
problem.

$$
C_J = x^2 + y^2 + \frac{2(1 - \mu)}{r_1} + \frac{2\mu}{r_2} - \left(\dot x^2 + \dot y^2 + \dot z^2\right) = 2U - v^2
$$

Where:

- $r_1$, $r_2$ are the distances to the two bodies, as in
  [cr3bpDerivatives](cr3bpDerivatives.md)
- $v$ is the speed in the rotating frame

**Units**

- Input: `state` in normalised units, `mu` dimensionless.
- Output: $C_J$, normalised.

::: info Notes

- The only quantity the CR3BP keeps constant: an energy in the rotating frame.
  Watch it to check a numerical integration.
- Since $v^2 \ge 0$, a body can only go where $2U \ge C_J$. The boundaries, the
  zero-velocity curves, wall off regions of space: with a high $C_J$, a
  spacecraft near Earth can't reach the Moon at all.
- The walls first open at L1. For Earth–Moon, $C_J$ there is about 3.188; below
  that, the way to the Moon is open.

:::

::: practice Apollo 11, the free return

**1.778**

_The Jacobi constant of a free return from Apollo 11's TLI_

Well below the 3.188 at L1, so the zero-velocity curves leave the whole
Earth–Moon region open. Apollo 11 left Earth with energy to spare, as far as the
walls are concerned; reaching the Moon was a matter of aim.

:::

## Parameters

| Parameter | Type                                                   | Description                                                             |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `state`   | [`Cr3bpState`](../../types/type-aliases/Cr3bpState.md) | CR3BP state `[x, y, z, xDot, yDot, zDot]` (finite, not at either body). |
| `mu`      | `number`                                               | Mass ratio $\mu$ (finite, in (0, 0.5]).                                 |

## Returns

`number`

The Jacobi constant $C_J$.

## Throws

If `mu` or a state component is not finite.

## Throws

If `mu` is outside (0, 0.5], or the state is at the centre of either body.

## Example

```ts
import type { Cr3bpState } from '@interstellar-tools/types';

// At rest at L4, C_J = 3 − μ(1 − μ)
const mu = 0.012151;
jacobiConstant([0.5 - mu, Math.sqrt(3) / 2, 0, 0, 0, 0], mu); // ≈ 2.98800
```

## See

- [cr3bpDerivatives](cr3bpDerivatives.md)
- https://en.wikipedia.org/wiki/Jacobi_integral Jacobi integral
