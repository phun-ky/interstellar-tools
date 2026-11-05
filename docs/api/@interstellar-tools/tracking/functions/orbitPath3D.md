[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ orbitPath3D

# Function: orbitPath3D()

```ts
function orbitPath3D(
  elements: MeanElementsInterface,
  from: Date,
  to: Date,
  options?: OrbitPath3DOptionsInterface
): Vector3DTupleType[];
```

Defined in:
[satellites/globe.ts:84](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/globe.ts#L84)

The **path of a satellite in 3D**, for drawing its orbit around a globe:
positions from Earth's centre over time, in the frame and unit a renderer wants.

Propagates the elements with SGP4 ([propagate](propagate.md)) from `from` to
`to`, and turns the positions with Earth
([temeToEarthFixed](temeToEarthFixed.md)) unless the inertial frame is asked
for.

::: info Notes

- **Earth-fixed or inertial.** In the Earth-fixed frame, the ground stays still
  under the path: the path is the ground track, lifted to the satellite's
  height, and a geostationary satellite is a point. In the inertial frame, the
  orbit stays still while Earth turns under it: draw the globe turned by
  `greenwichMeanSiderealTime`.
- Axes: x toward 0° longitude (Earth-fixed) or the vernal equinox (inertial), z
  toward the North Pole. Many 3D engines put y up: swap the axes to suit.
- Positions are divided by `unit`: pass Earth's radius to draw on a globe of
  radius 1.

:::

## Parameters

| Parameter  | Type                                                                                      | Description                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)                | The mean elements, from [parseTle](parseTle.md) or [parseOmm](parseOmm.md). |
| `from`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Start of the path, as a `Date`.                                             |
| `to`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | End of the path, as a `Date` after `from`.                                  |
| `options?` | [`OrbitPath3DOptionsInterface`](../interfaces/OrbitPath3DOptionsInterface.md)             | `step` in **s** (finite, > 0), `frame`, and `unit` in **m** (finite, > 0).  |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)\[]

The positions, at `from`, every `step` after it, and at `to`, in units of
`unit`.

## Throws

If `from` or `to` is not a valid `Date`, `step` or `unit` is not a finite
number, or a value of `elements` is not a finite number.

## Throws

If `to` is not after `from`, `step` or `unit` is not > 0, `frame` is neither
`'earth-fixed'` nor `'inertial'`, the path would have more than a million
points, or SGP4 fails along it, as in [propagate](propagate.md).

## Example

```ts
import { WGS84 } from '@interstellar-tools/constants';

const now = new Date();
const later = new Date(now.getTime() + 92 * 60_000);

// One ISS orbit, in Earth radii, around a globe of radius 1
const path = orbitPath3D(iss, now, later, {
  frame: 'inertial',
  unit: WGS84.equatorialRadius.value
});
```

## See

- [globeView](globeView.md)
- [groundTrack](groundTrack.md)
