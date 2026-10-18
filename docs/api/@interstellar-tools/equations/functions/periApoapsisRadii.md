[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / periApoapsisRadii

# Function: periApoapsisRadii()

```ts
function periApoapsisRadii(a: number, e: number): PeriApoRadiiType;
```

Defined in:
[orbits/peri-apoapsis-radii.ts:65](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/equations/src/categories/orbits/peri-apoapsis-radii.ts#L65)

**Peri/apoapsis radii** from semi-major axis ($a$) and eccentricity ($e$).

**Definitions**

$$
r_p = a(1-e),\qquad r_a = a(1+e)
$$

**Conic validity**

- **Elliptic / circular**: ($a>0,\; 0\le e<1$) → ($r_p>0$) and ($r_a>0$).
- **Hyperbolic**: ($a<0,\; e>1$) → ($r_p = a(1-e) = |a|(e-1) > 0$), **no
  apoapsis** (unbounded), so ($r_a = null$).
- **Parabolic**: ($e=1$) is **not** defined with finite ($a$). Use the parabolic
  form (e.g. ($r_p = \tfrac{p}{2}$)) or state vectors.

**Units**

- Inputs: ($a$) in **meters (m)**, ($e$) dimensionless.
- Output: ($r_p, r_a$) in **meters (m)**.

::: practice Molniya orbit

**545 km / 39 913 km**

_Altitude at perigee and apogee_

With e = 0.74, a Molniya satellite races through perigee and spends most of its
12 hour orbit slowly crossing apogee, high above the northern latitudes it
serves.

```ts
periApoapsisRadii(26600e3, 0.74);
// rp = 6 916 km, ra = 46 284 km from Earth's centre
```

:::

## Parameters

| Parameter | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `a`       | `number` | Semi-major axis ($a$) (m). Must be finite and **≠ 0**.          |
| `e`       | `number` | Eccentricity ($e$) (dimensionless). Must be finite and **≥ 0**. |

## Returns

[`PeriApoRadiiType`](../../types/type-aliases/PeriApoRadiiType.md)

Object with periapsis `rp` and apoapsis `ra` (or `null` if undefined for
hyperbolic).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If inputs are invalid or the ($(a,e)$) pair does not correspond to an
ellipse/circle or hyperbola with finite ($a$).

## Examples

```ts
// Elliptic example (LEO-like)
const a = 7000e3; // m
const e = 0.01;
const { rp, ra } = periApoapsisRadii(a, e); // rp ≈ 6930 km, ra ≈ 7070 km
```

```ts
// Hyperbolic flyby (no apoapsis)
const a = -50_000e3; // m
const e = 1.2;
const { rp, ra } = periApoapsisRadii(a, e); // rp = |a|(e-1) = 10,000 km, ra = null
```
