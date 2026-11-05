[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ globeView

# Function: globeView()

```ts
function globeView(
  points: readonly Pick<GeodeticCoordinatesInterface, 'phi' | 'lambda'>[],
  R?: number,
  options?: GlobeViewOptionsInterface
): GlobePointInterface[];
```

Defined in:
[satellites/globe.ts:191](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L191)

Points on a **globe view**: the orthographic projection, a globe seen from far
away, with the points on the far side marked hidden. It draws ground tracks and
footprints on a 2D globe, without WebGL.

$$
\begin{aligned}
x &= R\cos\varphi\sin(\lambda - \lambda_0) \\
y &= R\,(\cos\varphi_0\sin\varphi - \sin\varphi_0\cos\varphi\cos(\lambda - \lambda_0)) \\
\cos c &= \sin\varphi_0\sin\varphi + \cos\varphi_0\cos\varphi\cos(\lambda - \lambda_0)
\end{aligned}
$$

A point is visible when $\cos c \ge 0$: within 90° of the centre of the view.

Where:

- $\varphi$, $\lambda$ are the point's latitude and longitude (rad)
- $\varphi_0$, $\lambda_0$ are those of the centre of the view (rad)
- $R$ is the globe's radius on the screen, in any unit

**Units**

- Inputs: latitudes and longitudes in **radians**; `R` in the unit of the
  drawing.
- Output: `x` and `y` in the unit of `R`, from the centre of the disc, with
  `visible`.

::: info Notes

- **Every point gets `x` and `y`**, the far side's mirrored onto the disc, so a
  renderer can fade them or break a line where it goes behind. `orthographic` in
  `@interstellar-tools/maps` throws for them instead.
- For points on the ground: a satellite above the far side can still show past
  the edge of the disc. Project its 3D position from
  [orbitPath3D](orbitPath3D.md) for that.
- Any `h` on the points is ignored.

:::

## Parameters

| Parameter  | Type                                                                                                                                                                                               | Default value  | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------- |
| `points`   | readonly [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md), `"phi"` | `"lambda"`>\[] | `undefined`                                                                      | The points, `{ phi, lambda }` in **radians**: from [groundTrack](groundTrack.md) or [coverageFootprint](coverageFootprint.md), for example. |
| `R?`       | `number`                                                                                                                                                                                           | `1`            | The globe's radius, in the unit of the drawing (finite, > 0): 1 by default.      |
| `options?` | [`GlobeViewOptionsInterface`](../interfaces/GlobeViewOptionsInterface.md)                                                                                                                          | `{}`           | The centre of the view, `phi0` and `lambda0` in **radians**: 0 and 0 by default. |

## Returns

[`GlobePointInterface`](../../types/interfaces/GlobePointInterface.md)\[]

The points on the disc, in order: see
[GlobePointInterface](../../types/interfaces/GlobePointInterface.md).

## Throws

If a latitude, longitude, `R`, `phi0` or `lambda0` is not a finite number.

## Throws

If a latitude or `phi0` is outside \[-π/2, π/2], or `R <= 0`.

## Example

```ts
// The ISS's next orbit, on a globe of radius 200 px centred on Oslo
const track = groundTrack(iss, now, later).flat();
const view = globeView(track, 200, {
  phi0: toRad(59.91),
  lambda0: toRad(10.75)
});

view.filter(({ visible }) => visible); // the part of the track on the near side
```

## See

- [groundTrack](groundTrack.md)
- [coverageFootprint](coverageFootprint.md)
