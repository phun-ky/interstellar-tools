[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / isOnTriaxialEllipsoidSurface

# Function: isOnTriaxialEllipsoidSurface()

```ts
function isOnTriaxialEllipsoidSurface(
  x: number,
  y: number,
  z: number,
  a: number,
  b: number,
  c: number,
  eps: number
): boolean;
```

Defined in:
[cartography/is-on-triaxial-ellipsoid-surface.ts:53](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/cartography/is-on-triaxial-ellipsoid-surface.ts#L53)

Test whether a 3D point lies on the surface of a **triaxial ellipsoid** (within
a tolerance).

A triaxial ellipsoid centered at the origin with semi-axes ($a$), ($b$), ($c$)
aligned to the ($x$), ($y$), ($z$) axes is defined by the implicit surface:

$$
\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1
$$

This function evaluates the left-hand side and checks whether it is within `eps`
of 1.

::: info Notes:

- This is a **pure geometric** surface membership test; it does not compute the
  closest point on the ellipsoid or any geodetic latitude/longitude.
- For ellipsoids of revolution (oblate/prolate), you typically have ($a=b$), but
  this supports the general triaxial case.

:::

## Parameters

| Parameter | Type     | Default value | Description                                                                           |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------- |
| `x`       | `number` | `undefined`   | X coordinate (finite).                                                                |
| `y`       | `number` | `undefined`   | Y coordinate (finite).                                                                |
| `z`       | `number` | `undefined`   | Z coordinate (finite).                                                                |
| `a`       | `number` | `undefined`   | Semi-axis length along x (finite, > 0).                                               |
| `b`       | `number` | `undefined`   | Semi-axis length along y (finite, > 0).                                               |
| `c`       | `number` | `undefined`   | Semi-axis length along z (finite, > 0).                                               |
| `eps`     | `number` | `1e-12`       | Allowed absolute tolerance on the implicit value (finite, >= 0). Defaults to `1e-12`. |

## Returns

`boolean`

`true` if the point satisfies the ellipsoid equation within `eps`, otherwise
`false`.

## Throws

If any input is not a finite number.

## Throws

If `a <= 0`, `b <= 0`, `c <= 0`, or `eps < 0`.

## Examples

```ts
// Ellipsoid with semi-axes a=3, b=2, c=1
// Point on +X axis should be on the surface: (x,y,z) = (a,0,0)
const onSurface = isOnTriaxialEllipsoidSurface(3, 0, 0, 3, 2, 1);
// onSurface === true
```

```ts
// Slightly off the surface (use a looser eps if needed)
const onSurface = isOnTriaxialEllipsoidSurface(3.0000001, 0, 0, 3, 2, 1, 1e-6);
// onSurface === true
```

## See

- https://en.wikipedia.org/wiki/Ellipsoid Ellipsoid (general definition and
  implicit equation)
- https://mathworld.wolfram.com/Ellipsoid.html Wolfram MathWorld — Ellipsoid
  (properties and equations)
- https://en.wikipedia.org/wiki/Triaxial\_ellipsoid Triaxial ellipsoid (special
  case discussion)
