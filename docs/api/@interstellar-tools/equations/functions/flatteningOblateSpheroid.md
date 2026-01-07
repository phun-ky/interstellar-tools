[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / flatteningOblateSpheroid

# Function: flatteningOblateSpheroid()

```ts
function flatteningOblateSpheroid(a: number, c: number): number;
```

Defined in:
[cartography/flattening-oblate-spheroid.ts:39](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/cartography/flattening-oblate-spheroid.ts#L39)

Compute **flattening** ($f$) of an oblate spheroid.

Flattening quantifies how much an ellipsoid of revolution is "squashed" at the
poles, using equatorial radius ($a$) and polar radius ($c$):

$$
f = \frac{a - c}{a}
$$

::: info Notes:

- ($f$) is **dimensionless**.
- For a physically valid oblate spheroid with ($a \ge c > 0$), ($0 \le f < 1$).
- Commonly used in geodesy/cartography (e.g., defining reference ellipsoids and
  deriving related parameters like eccentricity).

:::

## Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `a`       | `number` | Equatorial radius ($a$) (finite, > 0). |
| `c`       | `number` | Polar radius ($c$) (finite, > 0).      |

## Returns

`number`

Flattening ($f$) (dimensionless).

## Throws

If `a` or `c` is not a finite number.

## Throws

If `a <= 0` or `c <= 0`.

## Example

```ts
// Earth (WGS84-ish radii in meters):
const a = 6378137.0;
const c = 6356752.314245;
const f = flatteningOblateSpheroid(a, c);
```

## See

- https://en.wikipedia.org/wiki/Flattening Flattening (definition and geodesy
  usage)
- https://en.wikipedia.org/wiki/Reference\_ellipsoid Reference ellipsoid (a,
  b/c, and flattening used to define ellipsoids)
- https://epsg.org/guidance-notes.html EPSG Guidance Notes (geodesy reference;
  ellipsoid parameters and derived quantities)
