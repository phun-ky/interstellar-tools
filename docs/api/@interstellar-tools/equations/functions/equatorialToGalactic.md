[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / equatorialToGalactic

# Function: equatorialToGalactic()

```ts
function equatorialToGalactic(
  direction: CelestialDirectionInterface
): GalacticDirectionInterface;
```

Defined in:
[galactic/equatorial-to-galactic.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/equatorial-to-galactic.ts#L56)

The **galactic coordinates of a direction on the sky**: from right ascension and
declination in the ICRS (J2000), as catalogues give them, to galactic longitude
`l` and latitude `b`.

It uses the IAU's galactic coordinates as Hipparcos defines them in the ICRS:
the north galactic pole at right ascension 192.85948° and declination 27.12825°,
and the galactic plane crossing the equator northwards at $l = 32.93192°$. The
rotation is the Hipparcos matrix $A_G$:

$$
\begin{pmatrix} \cos b \cos l \\ \cos b \sin l \\ \sin b \end{pmatrix}
= A_G \begin{pmatrix} \cos\delta \cos\alpha \\ \cos\delta \sin\alpha \\ \sin\delta \end{pmatrix}
$$

::: info Notes

- It agrees with Astropy's `Galactic` frame, which starts from the older B1950
  definition, to better than 0.0001° for the galaxies in `GALAXIES`.
- At the galactic poles, `l` is 0.

:::

## Parameters

| Parameter   | Type                                                                                   | Description                                  |
| ----------- | -------------------------------------------------------------------------------------- | -------------------------------------------- |
| `direction` | [`CelestialDirectionInterface`](../../types/interfaces/CelestialDirectionInterface.md) | Right ascension and declination, in degrees. |

## Returns

[`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md)

Galactic longitude `l`, from 0° up to 360°, and latitude `b`, from −90° to 90°.

## Throws

If an angle isn't finite, or the declination is outside −90° to 90°.

## Example

```ts
import type { DegreesType } from '@interstellar-tools/types';

// Andromeda (NED)
const andromeda = equatorialToGalactic({
  rightAscension: 10.68479292 as DegreesType,
  declination: 41.269065 as DegreesType
}); // { l: 121.1744, b: -21.5730 }
```

## See

- [galacticToEquatorial](galacticToEquatorial.md), its inverse.
- ESA 1997, The Hipparcos and Tycho Catalogues, ESA SP-1200, Vol. 1, §1.5.3
