[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / QuantityType

# Type Alias: QuantityType

```ts
type QuantityType =
  | MassInterface
  | DensityInterface
  | SpeedInterface
  | AccelerationInterface
  | GravitationalParameterInterface
  | TemperatureInterface
  | PressureInterface
  | AngleInterface
  | MagnitudeInterface
  | LuminosityInterface
  | EnergyInterface
  | IrradianceInterface
  | FluxDensityInterface
  | MassRateInterface
  | ProductionRateInterface
  | EventRateInterface
  | DexInterface
  | FractionInterface
  | MagneticFieldInterface
  | MagneticMomentInterface
  | ThermalInertiaInterface
  | InverseDistanceInterface
  | SpinAccelerationInterface
  | PeriodChangeInterface;
```

Defined in:
[helpers/convert-quantity.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/convert-quantity.ts#L46)

Any **unit-carrying quantity** from `@interstellar-tools/types`' quantities, as
[convertQuantity](../functions/convertQuantity.md) takes it.
