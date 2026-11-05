[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / sunSynchronousInclination

# Function: sunSynchronousInclination()

```ts
function sunSynchronousInclination(
  J2: number,
  mu: number,
  Re: number,
  a: number,
  e: number,
  rate: number
): Radians;
```

Defined in:
[orbits/sun-synchronous-inclination.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/sun-synchronous-inclination.ts#L59)

The **sun-synchronous inclination**: the inclination at which the planet's
equatorial bulge turns an orbit's plane as fast as the planet goes round the
Sun, so the satellite crosses the equator at the same local time every day. Most
Earth-observation satellites fly one, for the same light on every pass.

Sets the J2 nodal precession rate
([j2NodalPrecessionRate](j2NodalPrecessionRate.md)) equal to the planet's mean
motion around the Sun, and solves for the inclination:

$$
\cos i = -\frac{2\,\dot\Omega_\odot\,a^{7/2}\,(1 - e^2)^2}{3\,J_2\,R^2\sqrt{\mu}}
$$

Where:

- $\dot\Omega_\odot$ is the planet's mean motion around the Sun (rad/s): 1.991 ×
  10⁻⁷ for Earth, 360° a year
- $a$, $e$ are the orbit's semi-major axis (m) and eccentricity
- $J_2$, $R$, $\mu$ are the planet's second zonal harmonic, equatorial radius
  (m) and gravitational parameter (m³/s²)

**Units**

- Inputs: `mu` in **m³/s²**, `Re` and `a` in **m**, `rate` in **rad/s**.
- Output: $i$ in **radians**, retrograde: just over 90°.

::: info Notes

- The orbit must turn eastward, with the Sun, so it's retrograde: about 97° to
  99° for low Earth orbits.
- Only low enough orbits can be sun-synchronous: above about 5 980 km for Earth,
  even a polar orbit's J2 drift is too slow.
- First order in J2, as the precession rate itself.

:::

## Parameters

| Parameter | Type     | Description                                                                            |
| --------- | -------- | -------------------------------------------------------------------------------------- |
| `J2`      | `number` | The planet's second zonal harmonic $J_2$ (finite, > 0): 1.08263 × 10⁻³ for Earth.      |
| `mu`      | `number` | The planet's gravitational parameter $\mu$ in **m³/s²** (finite, > 0).                 |
| `Re`      | `number` | The planet's equatorial radius $R$ in **m** (finite, > 0).                             |
| `a`       | `number` | Semi-major axis $a$ in **m** (finite, > 0).                                            |
| `e`       | `number` | Eccentricity $e$ (finite, in \[0, 1)).                                                 |
| `rate`    | `number` | The planet's mean motion around the Sun $\dot\Omega_\odot$ in **rad/s** (finite, > 0). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The inclination $i$ in **radians**.

## Throws

If any input is not a finite number.

## Throws

If `J2`, `mu`, `Re`, `a` or `rate` is not > 0, `e` is outside \[0, 1), or the
orbit is too high to be sun-synchronous.

## Example

```ts
// Earth, 500 km up: one turn a tropical year
const rate = (2 * Math.PI) / (365.2421897 * 86_400);

sunSynchronousInclination(
  1.08262668e-3,
  3.986004418e14,
  6_378_137,
  6_878_137,
  0,
  rate
);
// ≈ 1.7000 rad, 97.4°
```

## See

- [j2NodalPrecessionRate](j2NodalPrecessionRate.md)
- [repeatGroundTrack](repeatGroundTrack.md)
