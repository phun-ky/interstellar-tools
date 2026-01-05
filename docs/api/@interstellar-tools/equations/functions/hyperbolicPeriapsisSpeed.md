[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / hyperbolicPeriapsisSpeed

# Function: hyperbolicPeriapsisSpeed()

```ts
function hyperbolicPeriapsisSpeed(
  vInfinity: number,
  mu: number,
  rp: number
): number;
```

Defined in:
[orbits/hyperbolic-periapsis-speed.ts:35](https://github.com/phun-ky/interstellar-tools/blob/eba42da13df2a93d9bf5de153f401b02d475cf3b/packages/equations/src/categories/orbits/hyperbolic-periapsis-speed.ts#L35)

Compute **hyperbolic periapsis speed** for a flyby/escape hyperbola.

Equation:

$$
v_p = \sqrt{v_{\infty}^2 + \frac{2\mu}{r_p}}
$$

Where:

- $v_{\infty}$ is the hyperbolic excess speed (m/s or km/s)
- $\mu$ is the standard gravitational parameter of the central body (m³/s² or
  km³/s²)
- $r_p$ is the periapsis radius measured from the body's center (m or km)

Unit consistency is required:

- If $\mu$ is in m³/s², then $r_p$ must be in m and speeds are in m/s.
- If $\mu$ is in km³/s², then $r_p$ must be in km and speeds are in km/s.

## Parameters

| Parameter   | Type     | Description                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------------- |
| `vInfinity` | `number` | Hyperbolic excess speed $v_{\infty}$ (must be finite, >= 0).                 |
| `mu`        | `number` | Standard gravitational parameter $\mu$ (must be finite, > 0).                |
| `rp`        | `number` | Periapsis radius $r_p$ from the central body's center (must be finite, > 0). |

## Returns

`number`

Periapsis speed $v_p$ in the same speed units as `vInfinity`.

## Throws

If any input is not finite.

## Throws

If `vInfinity < 0`, `mu <= 0`, or `rp <= 0`.

## Example

```ts
// Earth example (km-based):
// mu = 398600.4418 km³/s², rp ~ 6678 km (LEO-ish), v∞ = 3.2 km/s
const vp = hyperbolicPeriapsisSpeed(3.2, 398600.4418, 6678);
```
