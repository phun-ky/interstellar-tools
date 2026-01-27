[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / bodyFixedFromInertialDcmIAU

# Function: bodyFixedFromInertialDcmIAU()

```ts
function bodyFixedFromInertialDcmIAU(
  alphaP: Radians,
  deltaP: Radians,
  W: Radians
): Matrix3x3Type;
```

Defined in:
[cartography/body-fixed-from-inertial-dcm-iau.ts:54](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/cartography/body-fixed-from-inertial-dcm-iau.ts#L54)

Build the **IAU-style inertial → body-fixed** direction cosine matrix (DCM).

This constructs the 3×3 rotation matrix that transforms a vector expressed in an
inertial frame (commonly ICRF/J2000-like) into the body-fixed, planetocentric
frame defined by:

- the body's north pole right ascension ($\alpha_p$),
- the body's north pole declination ($\delta_p$),
- the prime meridian angle ($W(t)$).

Using the common 3-1-3 sequence:

$$
\mathbf R_{\text{BF}\leftarrow\text{ICRF}} =
\mathbf R_3(W)\,\mathbf R_1\!\left(\frac{\pi}{2}-\delta_p\right)\,\mathbf R_3\!\left(\frac{\pi}{2}+\alpha_p\right)
$$

::: info Notes:

- All angles are in **radians**.
- Matrices are **row-major** (`M[row][col]`).
- The returned matrix can be applied to inertial vectors via
  `applyMatrix3(R, v)`.

:::

## Parameters

| Parameter | Type                                             | Description                                                         |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `alphaP`  | [`Radians`](../../types/type-aliases/Radians.md) | Right ascension of the north pole ($\alpha_p$) in radians (finite). |
| `deltaP`  | [`Radians`](../../types/type-aliases/Radians.md) | Declination of the north pole ($\delta_p$) in radians (finite).     |
| `W`       | [`Radians`](../../types/type-aliases/Radians.md) | Prime meridian angle ($W(t)$) in radians (finite).                  |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

3×3 DCM ($\mathbf R_{\text{BF}\leftarrow\text{ICRF}}$) (row-major).

## Throws

If any input is not a finite number.

## Example

```ts
// Given IAU pole and prime meridian angles (radians):
const R = bodyFixedFromInertialDcmIAU(alphaP, deltaP, W);

// Transform an inertial vector into body-fixed:
const vBF = applyMatrix3(R, vICRF);
```

## See

- [applyMatrix3](applyMatrix3.md)
- https://naif.jpl.nasa.gov/pub/naif/toolkit\_docs/FORTRAN/req/pck.html NAIF
  SPICE PCK Required Reading (RA, DEC, W orientation model)
- https://naif.jpl.nasa.gov/pub/naif/toolkit\_docs/C/req/frames.html NAIF SPICE
  Frames Required Reading (reference frames and transformations)
- https://naif.jpl.nasa.gov/pub/naif/toolkit\_docs/C/cspice/tipbod\_c.html SPICE
  `tipbod_c` (inertial → body-equator-and-prime-meridian rotation)
- https://www.iau.org/WG100/WG100/Home.aspx IAU WGCCRE / WG100 (cartographic
  coordinates & rotational elements reports)
- https://aa.usno.navy.mil/downloads/reports/Archinaletal2011a.pdf Archinal et
  al. (2011) IAU WGCCRE report (pole and prime meridian definitions)
