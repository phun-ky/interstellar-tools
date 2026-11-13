[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) /
GalactocentricPositionOptionsInterface

# Interface: GalactocentricPositionOptionsInterface

Defined in:
[galactic/galactocentric-position.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-position.ts#L18)

Options for [galactocentricPosition](../functions/galactocentricPosition.md).

## Properties

### sunDistance?

```ts
sunDistance?: DistanceInterface;
```

Defined in:
[galactic/galactocentric-position.ts:25](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-position.ts#L25)

The Sun's distance from the Milky Way's centre, $R_0$. Defaults to
`SUN_GALACTOCENTRIC_DISTANCE`, 8275.9 pc.

---

### sunHeight?

```ts
sunHeight?: DistanceInterface;
```

Defined in:
[galactic/galactocentric-position.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-position.ts#L30)

The Sun's height above the Milky Way's plane, $z_\odot$. Defaults to
`SUN_HEIGHT_ABOVE_GALACTIC_PLANE`, 20.8 pc.

---

### unit?

```ts
unit?:
  | "m"
  | "meter"
  | "meters"
  | "metre"
  | "metres"
  | "kilometer"
  | "kilometers"
  | "kilometre"
  | "kilometres"
  | "AU"
  | "Au"
  | "astronomical-unit"
  | "astronomical-units"
  | "astronomical unit"
  | "astronomical units"
  | "lightyear"
  | "lightyears"
  | "light-year"
  | "light-years"
  | "kilolightyear"
  | "kilolightyears"
  | "kly"
  | "megalightyear"
  | "megalightyears"
  | "Mly"
  | "gigalightyear"
  | "gigalightyears"
  | "Gly"
  | "parsec"
  | "parsecs"
  | "kiloparsec"
  | "kiloparsecs"
  | "kpc"
  | "megaparsec"
  | "megaparsecs"
  | "Mpc"
  | "gigaparsec"
  | "gigaparsecs"
  | "Gpc"
  | "km"
  | "au"
  | "ly"
  | "pc";
```

Defined in:
[galactic/galactocentric-position.ts:20](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-position.ts#L20)

The unit of the position. Defaults to the unit of `distance`.
