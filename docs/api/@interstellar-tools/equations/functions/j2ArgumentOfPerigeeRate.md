[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / j2ArgumentOfPerigeeRate

# Function: j2ArgumentOfPerigeeRate()

```ts
function j2ArgumentOfPerigeeRate(
  J2: number,
  n: number,
  Re: number,
  a: number,
  i: Radians,
  e: number
): number;
```

Defined in:
[orbits/j2-argument-of-perigee-rate.ts:55](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/equations/src/categories/orbits/j2-argument-of-perigee-rate.ts#L55)

Compute **argument of perigee rotation** (J2 secular drift of ω) for an orbit
about an oblate body.

Equation (common approximation):

$$
\dot{\omega}\approx\frac{3}{4}J_2\,n\left(\frac{R_e}{a}\right)^2\frac{(5\cos^2 i-1)}{(1-e^2)^2}
$$

Where:

- $J_2$ is the second zonal harmonic (dimensionless)
- $n$ is mean motion (rad/s)
- $R_e$ is the body's equatorial radius (m or km)
- $a$ is semi-major axis (m or km)
- $i$ is inclination (radians)
- $e$ is eccentricity (dimensionless)

Units:

- If `n` is in rad/s and `i` is in radians, the result is in **rad/s**.
- `Re` and `a` must use the same distance unit.

## Parameters

| Parameter | Type                                             | Description                           |
| --------- | ------------------------------------------------ | ------------------------------------- |
| `J2`      | `number`                                         | Second zonal harmonic (finite).       |
| `n`       | `number`                                         | Mean motion (finite, >= 0), in rad/s. |
| `Re`      | `number`                                         | Equatorial radius (finite, > 0).      |
| `a`       | `number`                                         | Semi-major axis (finite, > 0).        |
| `i`       | [`Radians`](../../types/type-aliases/Radians.md) | Inclination (finite), in radians.     |
| `e`       | `number`                                         | Eccentricity (finite, 0 <= e < 1).    |

## Returns

`number`

Argument of perigee drift rate $\dot{\omega}$ in rad/s.

## Throws

If any input is not finite.

## Throws

If `n < 0`, `Re <= 0`, `a <= 0`, or `e` is outside \[0, 1].

## Example

```ts
// Earth-ish example (units must be consistent):
const J2 = 1.08262668e-3;
const n = 0.001078; // rad/s (roughly LEO)
const Re = 6378.137; // km
const a = 7000; // km
const i = ((63.4 * Math.PI) / 180) as Radians; // "critical inclination" region
const e = 0.001;

const omegaDot = j2ArgumentOfPerigeeRate(J2, n, Re, a, i, e);
```

## See

- https://science.nasa.gov/wp-content/uploads/2023/05/GDC_OrbitPrimer.pdf NASA
  GSFC - GDC Orbit Primer (shows apsidal precession dω/dt from J2; equivalent to
  the (5cos²i−1) form)
- https://en.wikipedia.org/wiki/Apsidal_precession Wikipedia - Apsidal
  precession (background + links on causes incl. quadrupole/oblateness)
- https://freeflyer.com/\_freeflyeruniversityguide/j2_perturbation.htm FreeFlyer
  University Guide - J2 perturbation (mission-design oriented discussion of RAAN
  & argument of perigee drift)
- https://juliaspace.github.io/SatelliteToolboxPropagators.jl/stable/man/propagators/j2/
  SatelliteToolboxPropagators.jl - J2 analytical propagator (lists secular ω(t)
  rate with the (4−5sin²i) term)
- https://articles.adsabs.harvard.edu/pdf/1959AJ.....64..367K Kozai (1959) - The
  Motion of a Close Earth Satellite (classic primary source on secular J2
  effects)
- https://help.agi.com/stk/Content/stk/vehSat_orbitProp_2bodyJ2J4.htm AGI/STK
  Help - Two-Body + J2/J4 perturbations (notes secular drift in argument of
  perigee)
