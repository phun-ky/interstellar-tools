[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / axialTilt

# Function: axialTilt()

```ts
function axialTilt(
  model: IauRotationModelInterface,
  orbit: OrbitInterface,
  date?: Date
): DegreesType;
```

Defined in:
[cartography/axial-tilt.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/axial-tilt.ts#L65)

The **axial tilt** of a body, its obliquity: the angle between its spin axis and
its orbit's pole, from its IAU rotation model and its orbit.

The spin axis is the model's pole $\hat{p}$, turned around if the prime meridian
runs backwards, and the orbit's pole $\hat{n}$ comes from its `i` and `om`,
placed in the ICRF by [orbitFrameToIcrf](orbitFrameToIcrf.md):

$$
\hat{s} = \operatorname{sign}(\dot W)\,\hat{p}, \qquad
\hat{n} = R_\text{frame} \begin{pmatrix} \sin i \sin\Omega \\ -\sin i \cos\Omega \\ \cos i \end{pmatrix}, \qquad
\varepsilon = \arccos(\hat{s} \cdot \hat{n})
$$

::: info Notes

- Over 90°, the body spins backwards against its orbit: Venus 177.36°, Uranus
  97.77°, Pluto 119.61°.
- The spin axis follows the right-hand rule, so it doesn't matter whether the
  model's pole is the IAU's `'north'` or `'positive'` one.
- The datasets' orbits are fixed at J2000, so the default `date` is J2000. A
  later date moves the pole, not the orbit.
- The IAU's models of most moons assume the spin axis follows the orbit's pole,
  so a moon's tilt from them says how well the model fits the orbit, not what
  anyone measured.

:::

## Parameters

| Parameter | Type                                                                                      | Default value | Description                                                                    |
| --------- | ----------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| `model`   | [`IauRotationModelInterface`](../../types/interfaces/IauRotationModelInterface.md)        | `undefined`   | The body's IAU rotation model, for example `body.rotation.iau` from a dataset. |
| `orbit`   | [`OrbitInterface`](../../types/interfaces/OrbitInterface.md)                              | `undefined`   | Its orbit, with a `frame` that can be placed in the ICRF.                      |
| `date?`   | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `J2000_UTC`   | The moment to take the pole at, on or after 1972-01-01. Defaults to J2000.     |

## Returns

[`DegreesType`](../../types/type-aliases/DegreesType.md)

The axial tilt, from 0° to 180°.

## Throws

If the model's prime meridian doesn't turn, the orbit has no `frame`, or one
that can't be placed in the ICRF ([orbitFrameToIcrf](orbitFrameToIcrf.md)).

## Example

```ts
import { PLANETS } from '@interstellar-tools/constants';

const mars = PLANETS.find((planet) => planet.id === 'mars')!;

axialTilt(mars.rotation!.iau!, mars.orbit!); // ≈ 25.19
```

## See

[bodyOrientation](bodyOrientation.md), for the pole.
