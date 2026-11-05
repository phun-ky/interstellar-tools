[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / repeatGroundTrack

# Function: repeatGroundTrack()

```ts
function repeatGroundTrack(
  revolutions: number,
  days: number,
  J2: number,
  mu: number,
  Re: number,
  i: Radians,
  e: number,
  rotationRate: number
): number;
```

Defined in:
[orbits/repeat-ground-track.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/repeat-ground-track.ts#L73)

The semi-major axis of a **repeat ground track** orbit: one whose track over the
ground repeats exactly after a whole number of revolutions in a whole number of
days, so a satellite revisits the same places on a fixed cycle. Landsat 8 and 9
make 233 revolutions in 16 days.

The track repeats when the satellite has crossed the equator northbound $k$
times while the ground has turned $N$ times under the orbit's plane:

$$
k\,(\omega_\oplus - \dot\Omega) = N\,(n + \dot\omega + \dot M)
$$

with the J2 drifts of the node, the perigee and the mean anomaly:

$$
\begin{aligned}
\dot\Omega &= -\tfrac{3}{2} J_2 n \left(\tfrac{R}{p}\right)^2 \cos i \\
\dot\omega &= \tfrac{3}{4} J_2 n \left(\tfrac{R}{p}\right)^2 (5\cos^2 i - 1) \\
\dot M &= \tfrac{3}{4} J_2 n \left(\tfrac{R}{p}\right)^2 \sqrt{1 - e^2}\,(3\cos^2 i - 1)
\end{aligned}
$$

solved for $a$ by fixed-point iteration from the Kepler orbit.

Where:

- $k$, $N$ are the revolutions and the days of the cycle
- $\omega_\oplus$ is the planet's rotation rate (rad/s): 7.292115 × 10⁻⁵ for
  Earth
- $n = \sqrt{\mu / a^3}$ is the mean motion, and $p = a(1 - e^2)$
- $J_2$, $R$, $\mu$ are the planet's second zonal harmonic, equatorial radius
  (m) and gravitational parameter (m³/s²)

**Units**

- Inputs: `mu` in **m³/s²**, `Re` in **m**, `i` in **radians**, `rotationRate`
  in **rad/s**.
- Output: $a$ in **m**.

::: info Notes

- `days` are **nodal days**: the time for the ground to turn once under the
  orbit's plane. For a sun-synchronous orbit they're solar days.
- Keep `revolutions` and `days` without a common factor: 30 in 2 repeats after 1
  day, as 15 in 1.
- First order in J2. Drag lowers a real orbit slowly, so missions trim it to
  keep the cycle.

:::

## Parameters

| Parameter      | Type                                             | Description                                                            |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `revolutions`  | `number`                                         | Revolutions in the cycle $k$ (an integer, > 0).                        |
| `days`         | `number`                                         | Nodal days in the cycle $N$ (an integer, > 0).                         |
| `J2`           | `number`                                         | The planet's second zonal harmonic $J_2$ (finite).                     |
| `mu`           | `number`                                         | The planet's gravitational parameter $\mu$ in **m³/s²** (finite, > 0). |
| `Re`           | `number`                                         | The planet's equatorial radius $R$ in **m** (finite, > 0).             |
| `i`            | [`Radians`](../../types/type-aliases/Radians.md) | Inclination $i$ in **radians** (finite).                               |
| `e`            | `number`                                         | Eccentricity $e$ (finite, in \[0, 1)).                                 |
| `rotationRate` | `number`                                         | The planet's rotation rate $\omega_\oplus$ in **rad/s** (finite, > 0). |

## Returns

`number`

The semi-major axis $a$ in **m**.

## Throws

If any input is not a finite number, or `revolutions` or `days` is not an
integer.

## Throws

If `revolutions`, `days`, `mu`, `Re` or `rotationRate` is not > 0, `e` is
outside \[0, 1), or the cycle has no orbit above the planet's surface.

## Example

```ts
// Landsat 8 and 9: 233 revolutions in 16 days, at 98.2°
repeatGroundTrack(
  233,
  16,
  1.08262668e-3,
  3.986004418e14,
  6_378_137,
  toRad(98.2),
  0.0001,
  7.292115e-5
);
// ≈ 7 077 700 m: Landsat's semi-major axis, 700 km above the equator
```

## See

- [sunSynchronousInclination](sunSynchronousInclination.md)
- [j2NodalPrecessionRate](j2NodalPrecessionRate.md)
