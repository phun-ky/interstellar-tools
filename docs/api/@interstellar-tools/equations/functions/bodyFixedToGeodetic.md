[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / bodyFixedToGeodetic

# Function: bodyFixedToGeodetic()

```ts
function bodyFixedToGeodetic(
  x: number,
  y: number,
  z: number,
  a: number,
  eSquared: number
): GeodeticCoordinatesInterface;
```

Defined in:
[cartography/body-fixed-to-geodetic.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/body-fixed-to-geodetic.ts#L82)

Convert a **body-fixed Cartesian** position (ECEF for Earth) to **geodetic
coordinates**: latitude, longitude and height.

There's no closed form for the latitude. This uses Bowring's iteration on the
parametric latitude $\beta$:

$$
\tan\varphi = \frac{z + e'^2 b \sin^3\beta}{p - e^2 a \cos^3\beta},
\qquad
\tan\beta = \frac{b}{a}\tan\varphi
$$

and then

$$
\lambda = \operatorname{atan2}(y, x), \qquad
h = p\cos\varphi + z\sin\varphi - a\sqrt{1 - e^2\sin^2\varphi}
$$

Where:

- $p = \sqrt{x^2 + y^2}$ is the distance from the rotation axis (m)
- $a$ is the equatorial radius, $b = a\sqrt{1 - e^2}$ the polar radius (m)
- $e^2$ is the first eccentricity squared, $e'^2 = e^2 / (1 - e^2)$ the second

**Units**

- Inputs: `x`, `y`, `z` and `a` in **m**, `eSquared` dimensionless.
- Output: `phi` and `lambda` in **radians**, `h` in **m**.

::: info Notes

- Starting from $\tan\beta = a z / (b p)$, two iterations reach sub-millimetre
  accuracy for points near Earth's surface; the loop runs until $\beta$ stops
  changing, to at most 10 iterations.
- The height formula is stable everywhere, the poles included. On the rotation
  axis, `phi` is ±π/2 and `lambda` is 0.
- For a point on the surface, `phi` equals
  [planetographicLatitudeOblate](planetographicLatitudeOblate.md); this one also
  handles points above and below it.
- [geodeticToBodyFixed](geodeticToBodyFixed.md) goes the other way.

:::

::: practice Apollo 11, in Earth orbit

**32.672° N, 191.1 km up**

_At orbit insertion: 6 563.0 km from Earth's centre, at 32.502° N geocentric_

Seen from Earth's centre, the insertion point was at 32.502°, the latitude that
fixes the orbit's inclination. On a map it was 0.170° further north, the
latitude the flight evaluation report gives.

```ts
const lat = toRad(32.502);
const r = 6_563_041;
bodyFixedToGeodetic(
  r * Math.cos(lat),
  0,
  r * Math.sin(lat),
  6_378_137,
  0.00669437999014
);
// phi ≈ 32.672°, h ≈ 191.1 km
```

:::

## Parameters

| Parameter  | Type     | Description                                                   |
| ---------- | -------- | ------------------------------------------------------------- |
| `x`        | `number` | Body-fixed $x$ in **m** (finite), through the prime meridian. |
| `y`        | `number` | Body-fixed $y$ in **m** (finite), through 90° east.           |
| `z`        | `number` | Body-fixed $z$ in **m** (finite), along the rotation axis.    |
| `a`        | `number` | Equatorial radius $a$ in **m** (finite, > 0).                 |
| `eSquared` | `number` | First eccentricity squared $e^2$ (finite, in \[0, 1)).        |

## Returns

[`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md)

The geodetic latitude, longitude and height.

## Throws

If any input is not a finite number.

## Throws

If `a <= 0`, `eSquared` is outside \[0, 1), or the point is at the centre.

## Example

```ts
// 1 km above the North Pole on WGS84
const { phi, h } = bodyFixedToGeodetic(
  0,
  0,
  6_357_752.314,
  6_378_137,
  0.00669437999014
);
// phi = π/2, h ≈ 1 000 m
```

## See

- [geodeticToBodyFixed](geodeticToBodyFixed.md)
- [planetographicLatitudeOblate](planetographicLatitudeOblate.md)
- https://en.wikipedia.org/wiki/Geographic_coordinate_conversion Geographic
  coordinate conversion
