[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cwHillDerivatives

# Function: cwHillDerivatives()

```ts
function cwHillDerivatives(state: CwState, n: number): CwStateDerivative;
```

Defined in:
[orbits/cw-hill-derivatives.ts:67](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/orbits/cw-hill-derivatives.ts#L67)

Compute the **time-derivative** of a Clohessy–Wiltshire / Hill relative-motion
state (right-hand side for ODE integration).

This function is intended to be used with a numerical integrator (RK4,
Dormand–Prince, etc.) to propagate the relative motion of a deputy spacecraft
about a chief on a **near-circular** reference orbit, expressed in the **LVLH**
frame:

- `x`: radial (outward from the central body)
- `y`: along-track (tangential / direction of motion)
- `z`: cross-track (orbit-normal)

Governing equations (CW/Hill):

$$
\ddot{x}-2n\dot{y}-3n^2x=0
$$

$$
\ddot{y}+2n\dot{x}=0
$$

$$
\ddot{z}+n^2z=0
$$

Rearranged into explicit accelerations:

$$
\ddot{x}=2n\dot{y}+3n^2x,\quad
\ddot{y}=-2n\dot{x},\quad
\ddot{z}=-n^2z
$$

Input state: `state = [x, y, z, xDot, yDot, zDot]`

Output derivative: `dstate/dt = [xDot, yDot, zDot, xDDot, yDDot, zDDot]`

Units (consistent):

- Position: m or km
- Velocity: m/s or km/s
- Mean motion `n`: rad/s
- Acceleration: m/s² or km/s²

## Parameters

| Parameter | Type                                             | Description                                                          |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `state`   | [`CwState`](../../types/type-aliases/CwState.md) | CW/Hill state `[x, y, z, xDot, yDot, zDot]` (all finite).            |
| `n`       | `number`                                         | Mean motion `n` of the reference orbit (finite, >= 0), in **rad/s**. |

## Returns

[`CwStateDerivative`](../../types/type-aliases/CwStateDerivative.md)

Time derivative of `state` as `[xDot, yDot, zDot, xDDot, yDDot, zDDot]`.

## Throws

If `n` or any state component is not finite.

## Throws

If `n < 0`.

## Example

```ts
import { meanMotion, cwHillDerivatives, type CwState } from '...';

const mu = 398600.4418; // km³/s²
const a = 7000; // km
const n = meanMotion(mu, a); // rad/s

const s: CwState = [100, 0, 0, 0, 0.01, 0];
const ds = cwHillDerivatives(s, n);
// feed ds into your integrator (RK4, etc.)
```
