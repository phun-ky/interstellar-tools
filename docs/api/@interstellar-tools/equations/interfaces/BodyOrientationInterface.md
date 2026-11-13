[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / BodyOrientationInterface

# Interface: BodyOrientationInterface

Defined in:
[cartography/body-orientation.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/body-orientation.ts#L23)

A body's orientation at a moment, as
[bodyOrientation](../functions/bodyOrientation.md) gives it.

## Properties

### matrix

```ts
matrix: Matrix3x3Type;
```

Defined in:
[cartography/body-orientation.ts:35](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/body-orientation.ts#L35)

The rotation from the ICRF to the body-fixed frame, row-major.

---

### pole

```ts
pole: CelestialDirectionInterface;
```

Defined in:
[cartography/body-orientation.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/body-orientation.ts#L28)

The direction of the model's pole in the ICRF, the body-fixed `z` axis: right
ascension from 0° up to 360°, and declination.

---

### primeMeridian

```ts
primeMeridian: DegreesType;
```

Defined in:
[cartography/body-orientation.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/body-orientation.ts#L33)

$W$, how far the prime meridian has turned east of the node where the body's
equator crosses the ICRF equator northwards, from 0° up to 360°.
