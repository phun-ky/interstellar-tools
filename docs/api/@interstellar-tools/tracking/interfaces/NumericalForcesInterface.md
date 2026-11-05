[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ NumericalForcesInterface

# Interface: NumericalForcesInterface

Defined in:
[satellites/propagate-numerically.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L38)

The forces for [propagateNumerically](../functions/propagateNumerically.md), on
top of Earth's central pull.

## Properties

### drag?

```ts
drag?: {
  ballisticCoefficient: number;
  density?: (point: GeodeticCoordinatesInterface, date: Date) => number;
};
```

Defined in:
[satellites/propagate-numerically.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L46)

Air drag: the ballistic coefficient $m/(C_D A)$ in **kg/m²**, and the density in
**kg/m³** at a point above the WGS 84 ellipsoid and a moment, from the
exponential model by default. Off unless given.

| Name                   | Type                                                                                                                                                                                                               | Defined in                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ballisticCoefficient` | `number`                                                                                                                                                                                                           | [satellites/propagate-numerically.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L47) |
| `density()?`           | (`point`: [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md), `date`: [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)) => `number` | [satellites/propagate-numerically.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L48) |

---

### moon?

```ts
moon?: boolean;
```

Defined in:
[satellites/propagate-numerically.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L44)

The Moon's tidal pull. Defaults to `true`.

---

### solarRadiationPressure?

```ts
solarRadiationPressure?: {
  areaToMass: number;
  Cr: number;
};
```

Defined in:
[satellites/propagate-numerically.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L51)

Sunlight's push: the reflectivity coefficient $C_R$ and the area facing the Sun
per unit mass in **m²/kg**. Off unless given.

| Name         | Type     | Defined in                                                                                                                                                      |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `areaToMass` | `number` | [satellites/propagate-numerically.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L51) |
| `Cr`         | `number` | [satellites/propagate-numerically.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L51) |

---

### sun?

```ts
sun?: boolean;
```

Defined in:
[satellites/propagate-numerically.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L42)

The Sun's tidal pull. Defaults to `true`.

---

### zonal?

```ts
zonal?: boolean | readonly number[];
```

Defined in:
[satellites/propagate-numerically.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L40)

Earth's zonal harmonics: `true` for EGM2008's J2 to J6, `false` for none, or
your own J2, J3, … for EGM2008's reference radius. Defaults to `true`.
