[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galacticToSupergalactic

# Function: galacticToSupergalactic()

```ts
function galacticToSupergalactic(
  direction: GalacticDirectionInterface
): SupergalacticDirectionInterface;
```

Defined in:
[galactic/galactic-to-supergalactic.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactic-to-supergalactic.ts#L46)

The **supergalactic coordinates of a galactic direction**: the frame of the
Local Supercluster, where the nearby galaxies and clusters gather in a plane.

::: info Notes

- The supergalactic north pole is at galactic longitude 47.37° and latitude
  6.32°, and supergalactic longitude 0° at galactic longitude 137.37°, latitude
  0°, where the two planes cross (de Vaucouleurs et al. 1991).
- It matches Astropy's `Supergalactic` frame to well under 0.001°.

:::

## Parameters

| Parameter   | Type                                                                                 | Description                                          |
| ----------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `direction` | [`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md) | Galactic longitude `l` and latitude `b`, in degrees. |

## Returns

[`SupergalacticDirectionInterface`](../../types/interfaces/SupergalacticDirectionInterface.md)

Supergalactic longitude `sgl`, from 0° up to 360°, and latitude `sgb`.

## Throws

If an angle isn't finite, or `b` is outside −90° to 90°.

## Example

```ts
import { GALAXIES } from '@interstellar-tools/constants';

const m87 = GALAXIES.find((galaxy) => galaxy.id === 'm87')!;
galacticToSupergalactic(m87.direction!); // { sgl: 102.88, sgb: -2.35 }: in the plane
```

## See

- [supergalacticToGalactic](supergalacticToGalactic.md), its inverse.
- https://arxiv.org/abs/astro-ph/9809343 Lahav et al. 2000, MNRAS 312, 166
