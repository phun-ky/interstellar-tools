[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galacticToEquatorial

# Function: galacticToEquatorial()

```ts
function galacticToEquatorial(
  direction: GalacticDirectionInterface
): CelestialDirectionInterface;
```

Defined in:
[galactic/galactic-to-equatorial.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactic-to-equatorial.ts#L44)

The **right ascension and declination of a galactic direction**: from galactic
longitude `l` and latitude `b` to the ICRS (J2000), the inverse of
[equatorialToGalactic](equatorialToGalactic.md), with the transpose of the
Hipparcos matrix $A_G$.

::: info Notes

- At the celestial poles, the right ascension is 0.

:::

## Parameters

| Parameter   | Type                                                                                 | Description                                          |
| ----------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `direction` | [`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md) | Galactic longitude `l` and latitude `b`, in degrees. |

## Returns

[`CelestialDirectionInterface`](../../types/interfaces/CelestialDirectionInterface.md)

Right ascension, from 0° up to 360°, and declination, from −90° to 90°.

## Throws

If an angle isn't finite, or `b` is outside −90° to 90°.

## Example

```ts
import type { DegreesType } from '@interstellar-tools/types';

// The galactic centre, l = b = 0
const centre = galacticToEquatorial({
  l: 0 as DegreesType,
  b: 0 as DegreesType
}); // { rightAscension: 266.4050, declination: -28.9362 }
```

## See

[equatorialToGalactic](equatorialToGalactic.md), its inverse.
