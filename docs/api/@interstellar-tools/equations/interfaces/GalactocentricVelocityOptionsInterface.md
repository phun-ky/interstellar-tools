[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) /
GalactocentricVelocityOptionsInterface

# Interface: GalactocentricVelocityOptionsInterface

Defined in:
[galactic/galactocentric-velocity.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-velocity.ts#L27)

Options for [galactocentricVelocity](../functions/galactocentricVelocity.md).

## Properties

### sunDistance?

```ts
sunDistance?: DistanceInterface;
```

Defined in:
[galactic/galactocentric-velocity.ts:32](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-velocity.ts#L32)

The Sun's distance from the Milky Way's centre, $R_0$. Defaults to
`SUN_GALACTOCENTRIC_DISTANCE`, 8275.9 pc.

---

### sunHeight?

```ts
sunHeight?: DistanceInterface;
```

Defined in:
[galactic/galactocentric-velocity.ts:37](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-velocity.ts#L37)

The Sun's height above the Milky Way's plane, $z_\odot$. Defaults to
`SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, 20.8 pc.

---

### sunVelocity?

```ts
sunVelocity?: VelocityInterface;
```

Defined in:
[galactic/galactocentric-velocity.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-velocity.ts#L42)

The Sun's velocity around the centre, in km/s. Defaults to
`SUN_GALACTOCENTRIC_VELOCITY`, (12.9, 251.51, 8.56).
