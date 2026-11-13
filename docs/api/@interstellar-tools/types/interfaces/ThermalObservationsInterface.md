[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ThermalObservationsInterface

# Interface: ThermalObservationsInterface

Defined in:
[observations.ts:388](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L388)

Measured **temperatures** and heat.

## Properties

### daysideTemperature?

```ts
daysideTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:398](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L398)

An exoplanet's dayside brightness temperature, from its secondary eclipse.

---

### energyBalance?

```ts
energyBalance?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:402](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L402)

Emitted over absorbed power: above 1, the body has heat of its own.

---

### equilibriumTemperature?

```ts
equilibriumTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:390](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L390)

The blackbody equilibrium temperature.

---

### heatFlow?

```ts
heatFlow?: ObservedType<IrradianceInterface>;
```

Defined in:
[observations.ts:404](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L404)

Internal or tidal heat flowing out through the surface.

---

### nightsideTemperature?

```ts
nightsideTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:400](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L400)

An exoplanet's nightside brightness temperature, from its phase curve.

---

### oneBarTemperature?

```ts
oneBarTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[observations.ts:396](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L396)

A giant planet's temperature at the 1-bar level.

---

### surfaceTemperature?

```ts
surfaceTemperature?:
  | ObservedType<TemperatureInterface>
| ObservedRangeInterface<TemperatureInterface>;
```

Defined in:
[observations.ts:392](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L392)

A solid body's surface temperature, or its range.

---

### thermalInertia?

```ts
thermalInertia?: ObservedType<ThermalInertiaInterface>;
```

Defined in:
[observations.ts:406](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L406)

The surface's thermal inertia.
