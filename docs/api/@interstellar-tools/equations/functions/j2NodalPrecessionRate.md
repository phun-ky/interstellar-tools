[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / j2NodalPrecessionRate

# Function: j2NodalPrecessionRate()

```ts
function j2NodalPrecessionRate(
  J2: number,
  n: number,
  Re: number,
  a: number,
  i: Radians,
  e: number
): number;
```

Defined in:
[orbits/j2-nodal-precession-rate.ts:54](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/orbits/j2-nodal-precession-rate.ts#L54)

Compute **J2 nodal precession** (RAAN drift) for an orbit about an oblate body.

Equation (common approximation):

$$
\dot{\Omega}\approx-\frac{3}{2}J_2\,n\left(\frac{R_e}{a}\right)^2\frac{\cos i}{(1-e^2)^2}
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

RAAN drift rate $\dot{\Omega}$ in rad/s.

## Throws

If any input is not finite.

## Throws

If `n < 0`, `Re <= 0`, `a <= 0`, or `e` is outside \[0,1].

## Example

```ts
// Earth-ish example (units must be consistent):
const J2 = 1.08262668e-3;
const n = 0.001078; // rad/s (roughly LEO)
const Re = 6378.137; // km
const a = 7000; // km
const i = ((98 * Math.PI) / 180) as Radians;
const e = 0.001;

const raanDot = j2NodalPrecessionRate(J2, n, Re, a, i, e);
```

## See

- https://science.nasa.gov/wp-content/uploads/2023/05/GDC\_OrbitPrimer.pdf?emrc=5e452c
  NASA GSFC - GDC Orbit Primer (includes nodal precession / regression formulas)
- https://en.wikipedia.org/wiki/Nodal\_precession Wikipedia - Nodal precession
  (gives common J2 RAAN drift approximation)
- https://ai-solutions.com/\_freeflyeruniversityguide/j2\_perturbation.htm
  FreeFlyer University Guide - J2 perturbation (mission-design oriented
  explanation + formulas)
- https://articles.adsabs.harvard.edu/pdf/1959AJ.....64..367K Kozai (1959) - The
  Motion of a Close Earth Satellite (classic primary source on secular J2
  effects)
- https://help.agi.com/stk/Content/stk/vehSat\_orbitProp\_2bodyJ2J4.htm AGI/STK
  Help - Two-Body with J2/J4 perturbations (practical propagation context)
