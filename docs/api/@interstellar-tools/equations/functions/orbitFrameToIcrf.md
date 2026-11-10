[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / orbitFrameToIcrf

# Function: orbitFrameToIcrf()

```ts
function orbitFrameToIcrf(frame: OrbitFrameInterface): Matrix3x3Type;
```

Defined in:
[orbits/orbit-frame-to-icrf.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/orbit-frame-to-icrf.ts#L56)

The **rotation from an orbit's reference plane to the ICRF**, the J2000 equator
and equinox: multiply a vector in the plane's coordinates by it to get the
vector in the ICRF.

In the plane's coordinates, `x` points to where the plane's `om` is counted
from, and `z` to the plane's pole:

- `'ecliptic'`: `x` to the J2000 equinox, `z` to the ecliptic's north pole. The
  rotation is $R_1(\varepsilon)$, with $\varepsilon$ = 84 381.448″.
- `'equator'`: the ICRF itself.
- `'laplace'` and `'parent-equator'`: `x` to the plane's ascending node on the
  ICRF equator, at right ascension $\alpha + 90°$, and `z` to its pole $(\alpha,
  \delta)$, as JPL's satellite mean elements count `om`. The rotation is
  $R_3(\alpha + 90°) \, R_1(90° - \delta)$.

## Parameters

| Parameter | Type                                                                   | Description                                                        |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `frame`   | [`OrbitFrameInterface`](../../types/interfaces/OrbitFrameInterface.md) | An orbit's `frame`, for example `body.orbit.frame` from a dataset. |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

The rotation matrix from the plane's coordinates to the ICRF.

## Throws

If `frame` is a `'laplace'` or `'parent-equator'` plane without a `pole`.

## Throws

If `frame` is `'sky'` or `'galactic'`: the sky needs the direction to the
system, and the galactic plane where its `om` is counted from, which the
datasets don't give yet.

## Example

```ts
import { MOONS } from '@interstellar-tools/constants';
import { applyMatrix3, orbitFrameToIcrf } from '@interstellar-tools/equations';

const titan = MOONS.find((moon) => moon.id === 'titan')!;
const toIcrf = orbitFrameToIcrf(titan.orbit.frame!);

applyMatrix3(toIcrf, [0, 0, 1]); // ≈ [0.084, 0.062, 0.995]: the pole of Titan's Laplace plane
```

## See

[stateAt](stateAt.md), which uses it to place a dataset orbit in the ICRF.
