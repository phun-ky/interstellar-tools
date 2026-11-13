[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SupergalacticDirectionInterface

# Interface: SupergalacticDirectionInterface

Defined in:
[positions.ts:194](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L194)

A **direction in supergalactic coordinates**, from the Sun, in degrees.

::: info

- The supergalactic plane is where the nearby galaxies and clusters gather, the
  Local Supercluster. Its north pole is at galactic longitude 47.37° and
  latitude 6.32° (de Vaucouleurs et al. 1991).
- `sgl`, the supergalactic longitude, runs along the plane from 0° at galactic
  longitude 137.37°, latitude 0°.
- `sgb`, the supergalactic latitude, is the angle north of the plane, from −90°
  to 90°.

:::

## Example

```ts
// M87, near the plane, at the heart of the Virgo Cluster
const m87: SupergalacticDirectionInterface = {
  sgl: 102.88 as DegreesType,
  sgb: -2.35 as DegreesType
};
```

## Properties

### sgb

```ts
sgb: DegreesType;
```

Defined in:
[positions.ts:198](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L198)

Supergalactic latitude, north of the supergalactic plane, in degrees.

---

### sgl

```ts
sgl: DegreesType;
```

Defined in:
[positions.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L196)

Supergalactic longitude, in degrees.
