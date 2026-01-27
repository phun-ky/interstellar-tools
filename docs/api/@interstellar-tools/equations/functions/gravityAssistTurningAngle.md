[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / gravityAssistTurningAngle

# Function: gravityAssistTurningAngle()

```ts
function gravityAssistTurningAngle(
  rp: number,
  vInfinity: number,
  mu: number
): Radians;
```

Defined in:
[manoeuvres/gravity-assist-turning-angle.ts:36](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/manoeuvres/gravity-assist-turning-angle.ts#L36)

Compute **gravity-assist turning angle** (flyby deflection) for a hyperbolic
encounter.

Equation:

$$
\delta = 2\arcsin\!\left(\frac{1}{1+\frac{r_p v_{\infty}^2}{\mu}}\right)
$$

Where:

- $r_p$ is periapsis radius from the body's center (m or km)
- $v_{\infty}$ is hyperbolic excess speed (m/s or km/s)
- $\mu$ is the standard gravitational parameter (m³/s² or km³/s²)

Unit consistency is required:

- If $\mu$ is in m³/s², then $r_p$ must be in m and $v_{\infty}$ in m/s.
- If $\mu$ is in km³/s², then $r_p$ must be in km and $v_{\infty}$ in km/s.

## Parameters

| Parameter   | Type     | Description                                           |
| ----------- | -------- | ----------------------------------------------------- |
| `rp`        | `number` | Periapsis radius $r_p$ (finite, > 0).                 |
| `vInfinity` | `number` | Hyperbolic excess speed $v_{\infty}$ (finite, >= 0).  |
| `mu`        | `number` | Standard gravitational parameter $\mu$ (finite, > 0). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Turning angle $\delta$ in **radians** (range: 0 to π).

## Throws

If any input is not finite.

## Throws

If `rp <= 0`, `mu <= 0`, or `vInfinity < 0`.

## Example

```ts
// Example (km-based):
// rp = 7000 km, v∞ = 8 km/s, mu(Earth) = 398600.4418 km³/s²
const delta = gravityAssistTurningAngle(7000, 8, 398600.4418);
// delta is in radians
```
