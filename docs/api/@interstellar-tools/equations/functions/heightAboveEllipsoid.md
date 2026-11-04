[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / heightAboveEllipsoid

# Function: heightAboveEllipsoid()

```ts
function heightAboveEllipsoid(
  x: number,
  y: number,
  z: number,
  a: number,
  eSquared: number
): number;
```

Defined in:
[cartography/height-above-ellipsoid.ts:67](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/height-above-ellipsoid.ts#L67)

Compute a point's **height above a body's reference ellipsoid**: the exact
height along the ellipsoid's normal, the height maps and GPS receivers give.

$$
h = p\cos\varphi + z\sin\varphi - a\sqrt{1 - e^2\sin^2\varphi}
$$

with the geodetic latitude $\varphi$ from
[bodyFixedToGeodetic](bodyFixedToGeodetic.md).

Where:

- $p = \sqrt{x^2 + y^2}$ is the distance from the rotation axis (m)
- $a$ is the equatorial radius (m)
- $e^2$ is the first eccentricity squared

**Units**

- Inputs: `x`, `y`, `z` and `a` in **m**, `eSquared` dimensionless.
- Output: $h$ in **m**, negative below the ellipsoid.

::: info Notes

- Exact, not the approximation $\lVert\mathbf r\rVert - R(\varphi)$: the height
  is measured along the normal to the ellipsoid, which misses the centre except
  at the equator and the poles.
- Where [heightAboveSphere](heightAboveSphere.md) uses one radius, this follows
  the body's flattening. On Earth the two differ by up to **21.4 km** at the
  poles if the sphere has the equatorial radius. With $e^2 = 0$ they agree.
- Heights on the ellipsoid are geometric. Elevations on maps are usually
  measured from an equipotential surface instead: the geoid on Earth, within
  about 100 m of the ellipsoid, or the areoid on Mars.
- The position must be in the body-fixed frame, with $z$ along the rotation
  axis.

:::

::: practice Apollo 11, in Earth orbit

**191.1 km up**

_At orbit insertion: 6 563.0 km from Earth's centre, at 32.502° N geocentric_

Above the WGS84 ellipsoid, which at that latitude is 6.2 km below a sphere of
the equatorial radius: [heightAboveSphere](heightAboveSphere.md) gives 184.9 km.

```ts
const lat = toRad(32.502);
const r = 6_563_041;
heightAboveEllipsoid(
  r * Math.cos(lat),
  0,
  r * Math.sin(lat),
  6_378_137,
  0.00669437999014
);
// ≈ 191 100 m
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

`number`

The height $h$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `a <= 0`, `eSquared` is outside \[0, 1), or the point is at the centre.

## Example

```ts
// On the WGS84 ellipsoid at the North Pole: the polar radius, 21.4 km short of the equatorial one
heightAboveEllipsoid(0, 0, 6_356_752.314, 6_378_137, 0.00669437999014); // ≈ 0 m
```

## See

- [bodyFixedToGeodetic](bodyFixedToGeodetic.md)
- [heightAboveSphere](heightAboveSphere.md)
- https://en.wikipedia.org/wiki/Geographic_coordinate_conversion Geographic
  coordinate conversion
