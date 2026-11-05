[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ earthShadow

# Function: earthShadow()

```ts
function earthShadow(r: Vector3DTupleType, sun: Vector3DTupleType): ShadowType;
```

Defined in:
[shadow.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/shadow.ts#L135)

Where a satellite is relative to **Earth's shadow**: in sunlight, in the
penumbra where Earth covers part of the Sun, or in the umbra where it covers all
of it.

Compares the apparent radii of the Sun and of Earth, seen from the satellite,
with the angle between them:

$$
a = \arcsin\frac{R_\odot}{\lVert \mathbf{s} - \mathbf{r} \rVert}, \qquad
b = \arcsin\frac{R_\oplus}{\lVert \mathbf{r} \rVert}, \qquad
c = \angle(-\mathbf{r},\ \mathbf{s} - \mathbf{r})
$$

The satellite is sunlit if $c \ge a + b$, in the umbra if $c \le b - a$, and in
the penumbra between.

Where:

- $\mathbf{r}$, $\mathbf{s}$ are the satellite's and the Sun's positions from
  Earth's centre (m)
- $R_\odot$ is the Sun's radius, 695 700 km (IAU 2015 B3)
- $R_\oplus$ is Earth's equatorial radius, 6 378 137 m (WGS 84)

**Units**

- Inputs: `r` and `sun` in **m**, from Earth's centre, on the same axes.
- Output: `'sunlit'`, `'penumbra'` or `'umbra'`: see
  [ShadowType](../../types/type-aliases/ShadowType.md).

::: info Notes

- Earth is taken as a sphere without an atmosphere, as in
  [isInEarthShadow](isInEarthShadow.md). Refraction through the atmosphere
  lights the umbra a deep red; a satellite there is dark to the eye and its
  solar panels.
- A low satellite crosses the penumbra in about 10 s; Earth's umbra ends about
  1.4 million km away, past which the satellite would see Earth pass across the
  Sun, in the penumbra.

:::

## Parameters

| Parameter | Type                                                                 | Description                                                         |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The satellite's position in **m**, from Earth's centre.             |
| `sun`     | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The Sun's position in **m**, from Earth's centre, on the same axes. |

## Returns

[`ShadowType`](../../types/type-aliases/ShadowType.md)

`'sunlit'`, `'penumbra'` or `'umbra'`.

## Throws

If `r` or `sun` is not three finite numbers.

## Throws

If `r` is within Earth's equatorial radius of its centre, or `sun` is at Earth's
centre.

## Example

```ts
const date = new Date('2026-11-04T12:00:00Z');

earthShadow(propagate(iss, date).r, sunPosition(date).r); // 'sunlit', 'penumbra' or 'umbra'
```

## See

[isInEarthShadow](isInEarthShadow.md)
