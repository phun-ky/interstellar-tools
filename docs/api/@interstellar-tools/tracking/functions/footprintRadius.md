[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ footprintRadius

# Function: footprintRadius()

```ts
function footprintRadius(height: number, minElevation?: Radians): Radians;
```

Defined in:
[satellites/ground-track.ts:176](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/ground-track.ts#L176)

The **angular radius of a satellite's footprint**: how far from the point below
it, as an angle at Earth's centre, the satellite is above the minimum elevation.

$$
\lambda_0 = \arccos\!\left(\frac{R\cos\varepsilon}{R + h}\right) - \varepsilon
$$

Where:

- $R$ is Earth's equatorial radius, 6 378 137 m (WGS 84)
- $h$ is the satellite's height (m)
- $\varepsilon$ is the minimum elevation (rad)

**Units**

- Inputs: `height` in **m**, `minElevation` in **radians**.
- Output: $\lambda_0$ in **radians**; times $R$, the radius along the ground in
  m.

::: info Notes

- With `minElevation` 0, it's the distance to the horizon,
  `horizonSurfaceDistance` in `@interstellar-tools/equations`, over $R$.
- It grows with height, toward $90^\circ - \varepsilon$: even from far away, a
  satellite sees less than half of Earth.

:::

## Parameters

| Parameter       | Type                                             | Description                                                               |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `height`        | `number`                                         | Height $h$ above the ground in **m** (finite, > 0).                       |
| `minElevation?` | [`Radians`](../../types/type-aliases/Radians.md) | Minimum elevation $\varepsilon$ in **radians** (in \[0, π/2), default 0). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The angular radius $\lambda_0$ in **radians**.

## Throws

If an input is not a finite number.

## Throws

If `height <= 0`, or `minElevation` is outside \[0, π/2).

## Example

```ts
footprintRadius(420_000); // ≈ 0.353 rad, 20.2°: 2 252 km, the ISS's horizon
footprintRadius(35_786_000, toRad(10)); // ≈ 1.23 rad, 71°: a geostationary satellite
```

## See

[coverageFootprint](coverageFootprint.md)
