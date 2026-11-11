[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PositionFrameType

# Type Alias: PositionFrameType

```ts
type PositionFrameType = 'galactocentric';
```

Defined in:
[positions.ts:53](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L53)

The **frame** of a [PositionInterface](../interfaces/PositionInterface.md).

::: info

- `'galactocentric'`: centred on the Milky Way's centre, as Astropy's
  `Galactocentric` frame is: the IAU's galactic centre, at galactic longitude
  and latitude 0°, as far from the Sun as Sagittarius A\*, $R_0$. Sagittarius
  A\*, its central black hole, is 4.3′ from it, 10.5 pc at $R_0$. `x` points
  from the Sun towards the centre, `y` in the direction the Sun moves around it
  (galactic longitude 90°), and `z` to the galaxy's north pole, out of its disk.
  The Sun is $z_\odot$ above the plane, so the plane is tilted by
  $\arcsin(z_\odot / R_0)$ from the galactic equator, and the Sun sits at
  $(-\sqrt{R_0^2 - z_\odot^2}, 0, z_\odot)$.

:::
