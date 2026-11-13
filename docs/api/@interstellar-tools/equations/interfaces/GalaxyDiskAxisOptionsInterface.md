[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / GalaxyDiskAxisOptionsInterface

# Interface: GalaxyDiskAxisOptionsInterface

Defined in:
[galactic/galaxy-disk-axis.ts:24](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galaxy-disk-axis.ts#L24)

Options for [galaxyDiskAxis](../functions/galaxyDiskAxis.md).

## Properties

### sunDistance?

```ts
sunDistance?: DistanceInterface;
```

Defined in:
[galactic/galaxy-disk-axis.ts:29](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galaxy-disk-axis.ts#L29)

The Sun's distance from the Milky Way's centre, $R_0$, for the frame's tilt.
Defaults to `SUN_GALACTOCENTRIC_DISTANCE`, 8275.9 pc.

---

### sunHeight?

```ts
sunHeight?: DistanceInterface;
```

Defined in:
[galactic/galaxy-disk-axis.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galaxy-disk-axis.ts#L34)

The Sun's height above the Milky Way's plane, $z_\odot$, for the frame's tilt.
Defaults to `SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, 20.8 pc.
