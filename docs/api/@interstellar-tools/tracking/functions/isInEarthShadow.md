[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ isInEarthShadow

# Function: isInEarthShadow()

```ts
function isInEarthShadow(r: Vector3DTupleType, sun: Vector3DTupleType): boolean;
```

Defined in:
[shadow.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/shadow.ts#L62)

Whether a satellite is in **Earth's shadow**, taking the shadow as a cylinder as
wide as Earth, straight back from the Sun. It's the usual quick test for whether
a satellite is lit.

$$
\mathbf{r}\cdot\hat{\mathbf{s}} < 0
\quad\text{and}\quad
\lVert \mathbf{r} - (\mathbf{r}\cdot\hat{\mathbf{s}})\,\hat{\mathbf{s}} \rVert < R_\oplus
$$

Where:

- $\mathbf{r}$ is the satellite's position from Earth's centre (m)
- $\hat{\mathbf{s}}$ is the unit vector toward the Sun
- $R_\oplus$ is Earth's equatorial radius, 6 378 137 m (WGS 84)

**Units**

- Inputs: `r` and `sun` in **m**, from Earth's centre, on the same axes: SGP4's
  TEME from [propagate](propagate.md), and `sunPosition` from
  `@interstellar-tools/equations`.
- Output: `true` in the shadow.

::: info Notes

- The real shadow narrows into a cone, the umbra, inside a widening penumbra.
  The cylinder lies between the two, so it puts the start and end of an eclipse
  a few seconds out for a low orbit. [earthShadow](earthShadow.md) tells umbra
  and penumbra apart.
- Earth's atmosphere and flattening shift the edge by a few kilometres, about a
  second for the ISS.

:::

## Parameters

| Parameter | Type                                                                 | Description                                                         |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The satellite's position in **m**, from Earth's centre.             |
| `sun`     | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | The Sun's position in **m**, from Earth's centre, on the same axes. |

## Returns

`boolean`

`true` if the satellite is in the shadow.

## Throws

If `r` or `sun` is not three finite numbers.

## Throws

If `sun` is at Earth's centre.

## Example

```ts
const date = new Date('2026-11-04T12:00:00Z');

isInEarthShadow(propagate(iss, date).r, sunPosition(date).r); // true in eclipse
```

## See

[earthShadow](earthShadow.md)
