[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / subsolarPoint

# Function: subsolarPoint()

```ts
function subsolarPoint(
  model: IauRotationModelInterface,
  sunDirection: Vector3DTupleType,
  date: Date
): PlanetocentricPointInterface;
```

Defined in:
[cartography/subsolar-point.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/subsolar-point.ts#L81)

The **subsolar point**: where on a body the Sun is overhead, from its IAU
rotation model and the direction from the body to the Sun.

The direction is turned into the body-fixed frame by
[bodyOrientation](bodyOrientation.md)'s matrix, $\vec{s}' = M \vec{s}$, and read
off as

$$
\varphi = \operatorname{atan2}\left(s'_z, \sqrt{s'^2_x + s'^2_y}\right), \qquad
\lambda = \operatorname{atan2}(s'_y, s'_x)
$$

::: info Notes

- Any direction will do: the direction to Earth gives the sub-Earth point, the
  centre of the disk a telescope sees.
- The latitude is **planetocentric**, from the body's centre. Maps of Mars use
  planetographic latitudes, which are a little further from the equator on a
  flattened body: −25.23° where this gives −24.98°.
- The longitude is east, around the model's pole. Mars's maps also count west,
  which is $360° - \lambda$.
- The axes of `sunDirection` are the ICRF's. Light time is the caller's to
  apply: the Sun moves little in the minutes its light takes.

:::

## Parameters

| Parameter      | Type                                                                                      | Description                                                                    |
| -------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `model`        | [`IauRotationModelInterface`](../../types/interfaces/IauRotationModelInterface.md)        | The body's IAU rotation model, for example `body.rotation.iau` from a dataset. |
| `sunDirection` | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)                      | The direction from the body to the Sun in the ICRF, of any length.             |
| `date`         | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, as a UTC `Date`, on or after 1972-01-01.                           |

## Returns

[`PlanetocentricPointInterface`](../interfaces/PlanetocentricPointInterface.md)

The planetocentric latitude and east longitude where the Sun is overhead.

## Throws

If `date` is not a valid `Date`.

## Throws

If `sunDirection` is zero or not finite, `date` is before 1972-01-01, or the
model gives an angle that isn't finite.

## Example

```ts
import { PLANETS } from '@interstellar-tools/constants';

const mars = PLANETS.find((planet) => planet.id === 'mars')!;
const date = new Date('2000-01-06T00:00:00Z');
// From Mars to the Sun: minus Mars's place around the Sun
const { r } = stateAt(mars.orbit!, date);
const point = subsolarPoint(mars.rotation!.iau!, [-r[0], -r[1], -r[2]], date); // ≈ { latitude: -24.98, longitude: 185.27 }, 174.73° west
```

## See

- [bodyOrientation](bodyOrientation.md), for the matrix.
- https://www.giss.nasa.gov/tools/mars24/help/algorithm.html NASA GISS's Mars24
  algorithm and worked examples
