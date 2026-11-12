[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ThermalObservationsInterface

# Interface: ThermalObservationsInterface

Defined in:
[observations.ts:385](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L385)

Measured **temperatures** and heat.

## Properties

### daysideTemperature?

```ts
daysideTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:395](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L395)

An exoplanet's dayside brightness temperature, from its secondary eclipse.

---

### energyBalance?

```ts
energyBalance?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:399](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L399)

Emitted over absorbed power: above 1, the body has heat of its own.

---

### equilibriumTemperature?

```ts
equilibriumTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:387](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L387)

The blackbody equilibrium temperature.

---

### heatFlow?

```ts
heatFlow?: ObservedType<IrradianceInterface>;
```

Defined in:
[observations.ts:401](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L401)

Internal or tidal heat flowing out through the surface.

---

### nightsideTemperature?

```ts
nightsideTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:397](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L397)

An exoplanet's nightside brightness temperature, from its phase curve.

---

### oneBarTemperature?

```ts
oneBarTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:393](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L393)

A giant planet's temperature at the 1-bar level.

---

### surfaceTemperature?

```ts
surfaceTemperature?:
  | ObservedType<TemperatureInterface>
| ObservedRangeInterface<TemperatureInterface>;
```

Defined in:
[observations.ts:389](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L389)

A solid body's surface temperature, or its range.

---

### thermalInertia?

```ts
thermalInertia?: ObservedType<ThermalInertiaInterface>;
```

Defined in:
[observations.ts:403](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L403)

The surface's thermal inertia.
