[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / planetographicLatitudeOblate

# Function: planetographicLatitudeOblate()

```ts
function planetographicLatitudeOblate(
  x: number,
  y: number,
  z: number,
  a: number,
  c: number
): Radians;
```

Defined in:
[cartography/planetographic-latitude-oblate.ts:19](https://github.com/phun-ky/interstellar-tools/blob/079e297432574505029c4778a38f2852dffc7694/packages/equations/src/categories/cartography/planetographic-latitude-oblate.ts#L19)

Compute planetographic latitude (oblate spheroid) from body-fixed Cartesian
coordinates.

Given:
$\tan\varphi_g = \frac{z}{\sqrt{x^2+y^2}}(1-e^2)^{-1}, \qquad e^2=1-\frac{c^2}{a^2}$

This returns:
$\varphi_g = \arctan\!\left(\frac{z}{\sqrt{x^2+y^2}}\frac{1}{1-e^2}\right)$

## Parameters

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `x`       | `number` | X coordinate (finite)           |
| `y`       | `number` | Y coordinate (finite)           |
| `z`       | `number` | Z coordinate (finite)           |
| `a`       | `number` | Equatorial radius (finite, > 0) |
| `c`       | `number` | Polar radius (finite, > 0)      |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Planetographic latitude φg in radians (range: \[-π/2, π/2])
