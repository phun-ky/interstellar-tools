[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / supergalacticToGalactic

# Function: supergalacticToGalactic()

```ts
function supergalacticToGalactic(
  direction: SupergalacticDirectionInterface
): GalacticDirectionInterface;
```

Defined in:
[galactic/supergalactic-to-galactic.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/supergalactic-to-galactic.ts#L40)

The **galactic coordinates of a supergalactic direction**: the inverse of
[galacticToSupergalactic](galacticToSupergalactic.md).

## Parameters

| Parameter   | Type                                                                                           | Description                                                   |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `direction` | [`SupergalacticDirectionInterface`](../../types/interfaces/SupergalacticDirectionInterface.md) | Supergalactic longitude `sgl` and latitude `sgb`, in degrees. |

## Returns

[`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md)

Galactic longitude `l`, from 0° up to 360°, and latitude `b`.

## Throws

If an angle isn't finite, or `sgb` is outside −90° to 90°.

## Example

```ts
import type { DegreesType } from '@interstellar-tools/types';

// The supergalactic north pole
supergalacticToGalactic({ sgl: 0 as DegreesType, sgb: 90 as DegreesType });
// { l: 47.37, b: 6.32 }
```

## See

[galacticToSupergalactic](galacticToSupergalactic.md), its inverse.
