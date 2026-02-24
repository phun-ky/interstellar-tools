[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / TWO_PI

# Variable: TWO_PI

```ts
const readonly TWO_PI: number;
```

Defined in:
[math.ts:69](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/constants/src/math.ts#L69)

The circle constant **τ** (tau), equal to **2π** `(≈ 6.283185307179586)`. Useful
for full rotations, radians-per-turn calculations, angular velocity, and other
periodic math where factors of 2 arise naturally.

$$
\tau = 2\pi
$$

$$
1\ \text{turn} = \tau\ \text{radians} = 360^\circ
$$

$$
\theta_{\text{rad}} = t\,\tau \quad (\text{turn fraction } t \in [0,1))
$$

$$
\theta_{\deg} = \frac{180^\circ}{\pi}\,\theta_{\text{rad}} = 360^\circ\,t
$$

$$
\omega = 2\pi f = \tau f \quad\text{(angular frequency)}
$$

$$
T = \frac{2\pi}{\omega} = \frac{\tau}{\omega} \quad\text{(period)}
$$

::: info

- Using **τ** often simplifies formulas that involve _full cycles_ (e.g.,
  Fourier analysis, rotations, oscillator phase), eliminating stray factors
  of 2.
- `TWO_PI` is a runtime numeric constant; do not compare floating-point results
  using `===` when they involve trigonometric operations-prefer tolerance
  checks.

:::

## See

- https://en.wikipedia.org/wiki/Tau\_(mathematics)
- https://en.wikipedia.org/wiki/Radian

## Examples

```ts
import { TWO_PI } from './constants';

// A quarter turn (π/2 radians)
const quarterTurn = 0.25 * TWO_PI; // ≈ 1.5707963267948966

// Point on the unit circle at 1/8 of a turn
const t = 1 / 8;
const angle = t * TWO_PI; // τ/8 = π/4
const x = Math.cos(angle); // ≈ 0.7071
const y = Math.sin(angle); // ≈ 0.7071
```

```ts
// Wrap any angle (radians) to [0, τ):
function wrapTau(theta: number): number {
  const tau = TWO_PI;
  return ((theta % tau) + tau) % tau;
}

// Convert turn fraction to radians:
const radiansFromTurns = (turns: number) => turns * TWO_PI;

// Angular frequency from frequency (Hz):
const omega = (f: number) => TWO_PI * f; // ω = τ f
```
