[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / geodeticToBodyFixed

# Function: geodeticToBodyFixed()

```ts
function geodeticToBodyFixed(
  phi: Radians,
  lambda: Radians,
  h: number,
  a: number,
  eSquared: number
): Vector3DTupleType;
```

Defined in:
[cartography/geodetic-to-body-fixed.ts:76](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/geodetic-to-body-fixed.ts#L76)

Convert **geodetic coordinates** (latitude, longitude, height) to a **body-fixed
Cartesian** position, ECEF for Earth.

$$
\begin{aligned}
x &= (N + h)\cos\varphi\cos\lambda \\
y &= (N + h)\cos\varphi\sin\lambda \\
z &= \big(N(1 - e^2) + h\big)\sin\varphi
\end{aligned}
\qquad
N = \frac{a}{\sqrt{1 - e^2\sin^2\varphi}}
$$

Where:

- $\varphi$ is the geodetic latitude and $\lambda$ the longitude (rad)
- $h$ is the height above the ellipsoid, along its normal (m)
- $a$ is the equatorial radius (m) and $e^2$ the first eccentricity squared
- $N$ is the prime vertical radius of curvature (m), from
  [primeVerticalRadiusOfCurvature](primeVerticalRadiusOfCurvature.md)

**Units**

- Inputs: `phi` and `lambda` in **radians**, `h` and `a` in **m**, `eSquared`
  dimensionless.
- Output: `[x, y, z]` in **m**, with $z$ along the rotation axis and $x$ through
  the prime meridian.

::: info Notes

- Geodetic latitude is the angle of the ellipsoid's normal, the latitude on
  maps. The geocentric latitude, the angle seen from the centre, is
  `atan2(z, hypot(x, y))` of the result, and is smaller everywhere but the
  equator and the poles.
- WGS84: $a = 6\,378\,137$ m, $e^2 = 0.00669437999014$. Get $e^2$ from the radii
  with
  [eccentricitySquaredOblateSpheroid](eccentricitySquaredOblateSpheroid.md).
- [bodyFixedToGeodetic](bodyFixedToGeodetic.md) goes the other way.

:::

::: practice Apollo 11, on Pad 39A

**6 373.3 km**

_From Earth's centre, at 28.608° N geodetic, 80.604° W on the WGS84 ellipsoid_

The geocentric latitude is 28.447°, 0.161° less than on the map. That's the
latitude the launch-site formulas such as `surfaceRotationSpeed` need.

```ts
const [x, y, z] = geodeticToBodyFixed(
  toRad(28.608422),
  toRad(-80.604133),
  0,
  6_378_137,
  0.00669437999014
);
Math.hypot(x, y, z); // ≈ 6 373 266 m
toDeg(Math.atan2(z, Math.hypot(x, y))); // ≈ 28.447°
```

:::

## Parameters

| Parameter  | Type                                             | Description                                                           |
| ---------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| `phi`      | [`Radians`](../../types/type-aliases/Radians.md) | Geodetic latitude $\varphi$ in **radians** (finite, in \[-π/2, π/2]). |
| `lambda`   | [`Radians`](../../types/type-aliases/Radians.md) | Longitude $\lambda$ in **radians**, east positive (finite).           |
| `h`        | `number`                                         | Height $h$ above the ellipsoid in **m** (finite; negative below it).  |
| `a`        | `number`                                         | Equatorial radius $a$ in **m** (finite, > 0).                         |
| `eSquared` | `number`                                         | First eccentricity squared $e^2$ (finite, in \[0, 1)).                |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Body-fixed position `[x, y, z]` in **m**.

## Throws

If any input is not a finite number.

## Throws

If `phi` is outside \[-π/2, π/2], `a <= 0`, or `eSquared` is outside \[0, 1).

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// On the equator at the prime meridian, 100 m up
geodeticToBodyFixed(
  0 as Radians,
  0 as Radians,
  100,
  6_378_137,
  0.00669437999014
);
// [6 378 237, 0, 0]
```

## See

- [bodyFixedToGeodetic](bodyFixedToGeodetic.md)
- [eccentricitySquaredOblateSpheroid](eccentricitySquaredOblateSpheroid.md)
- https://en.wikipedia.org/wiki/Geographic_coordinate_conversion Geographic
  coordinate conversion
