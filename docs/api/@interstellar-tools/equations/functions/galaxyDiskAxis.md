[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galaxyDiskAxis

# Function: galaxyDiskAxis()

```ts
function galaxyDiskAxis(
  direction: GalacticDirectionInterface,
  disk: GalaxyDiskInterface,
  options?: GalaxyDiskAxisOptionsInterface
): Vector3DTupleType;
```

Defined in:
[galactic/galaxy-disk-axis.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galaxy-disk-axis.ts#L82)

The **spin axis of a galaxy's disk**, in the `'galactocentric'` frame's axes:
the unit vector its disk turns around, counter-clockwise seen from its tip. Draw
the disk at right angles to it.

On the sky at the galaxy, with $\hat{r}$ pointing away from the Sun and
$\hat{s}(\varphi)$ the direction at position angle $\varphi$, east of north:

$$
\hat{\ell} = \hat{s}(\varphi_\text{receding}), \qquad
\hat{e} = \cos i \, \hat{s}(\varphi_\text{near}) - \sin i \, \hat{r}, \qquad
\hat{L} = \hat{e} \times \hat{\ell}
$$

$\hat{\ell}$ points along the major axis to the half moving away from us, and
$\hat{e}$ across the disk to its nearer side, tilted towards us.

::: info Notes

- It needs the disk's `nearSide`: without it, the disk could tilt either way.
- Seen from the Sun, the disk turns counter-clockwise when $\hat{L}$ points
  towards us, as Andromeda's does.

:::

## Parameters

| Parameter   | Type                                                                                 | Description                                                   |
| ----------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `direction` | [`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md) | The galaxy's direction from the Sun, in galactic coordinates. |
| `disk`      | [`GalaxyDiskInterface`](../../types/interfaces/GalaxyDiskInterface.md)               | How its disk is turned on the sky.                            |
| `options?`  | [`GalaxyDiskAxisOptionsInterface`](../interfaces/GalaxyDiskAxisOptionsInterface.md)  | The Sun's place, for the frame's tilt, if not the default.    |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

The unit spin axis, in the `'galactocentric'` frame's axes.

## Throws

If the disk has no `nearSide`, the near side isn't 90° from `positionAngle`, an
angle isn't finite, or the inclination is outside 0° to 90°.

## Example

```ts
import { GALAXIES } from '@interstellar-tools/constants';

const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
const axis = galaxyDiskAxis(andromeda.direction!, andromeda.disk!);
// ≈ [-0.4186, -0.7544, -0.5057]
```
