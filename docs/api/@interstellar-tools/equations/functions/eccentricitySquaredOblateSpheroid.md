[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / eccentricitySquaredOblateSpheroid

# Function: eccentricitySquaredOblateSpheroid()

```ts
function eccentricitySquaredOblateSpheroid(a: number, c: number): number;
```

Defined in:
[cartography/eccentricity-squared-oblate-spheroid.ts:39](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/cartography/eccentricity-squared-oblate-spheroid.ts#L39)

Compute **first eccentricity squared** ($e^2$) for an oblate spheroid.

The first eccentricity describes how much an oblate spheroid (ellipsoid of
revolution) deviates from a perfect sphere. For equatorial radius ($a$) and
polar radius ($c$):

$$
e^2 = 1 - \frac{c^2}{a^2}
$$

::: info Notes:

- ($e^2$) is **dimensionless**.
- For a physically valid oblate spheroid with ($a \ge c > 0$),
  ($0 \le e^2 < 1$).
- This quantity is widely used in geodesy and mapping formulas (e.g.,
  planetographic latitude, geodetic coordinates, map projections).

:::

## Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `a`       | `number` | Equatorial radius ($a$) (finite, > 0). |
| `c`       | `number` | Polar radius ($c$) (finite, > 0).      |

## Returns

`number`

First eccentricity squared ($e^2$) (dimensionless).

## Throws

If `a` or `c` is not a finite number.

## Throws

If `a <= 0` or `c <= 0`.

## Example

```ts
// Earth (WGS84-ish radii in meters):
const a = 6378137.0;
const c = 6356752.314245;
const e2 = eccentricitySquaredOblateSpheroid(a, c);
```

## See

- https://en.wikipedia.org/wiki/Eccentricity\_(mathematics)#Ellipses\_and\_ellipsoids
  Eccentricity for ellipses/ellipsoids (includes first eccentricity)
- https://en.wikipedia.org/wiki/Reference\_ellipsoid Reference ellipsoid
  (geodesy context; uses a, b and eccentricity)
- https://epsg.org/guidance-notes.html EPSG Guidance Notes (geodesy reference;
  ellipsoid parameters and derived quantities)
