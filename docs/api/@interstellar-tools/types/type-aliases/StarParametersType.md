[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarParametersType

# Type Alias: StarParametersType

```ts
type StarParametersType = Pick<
  StarObservationsInterface,
  | 'spectralClassification'
  | 'effectiveTemperature'
  | 'luminosity'
  | 'logSurfaceGravity'
  | 'metallicity'
  | 'gravityDarkening'
>;
```

Defined in:
[celestial-bodies/observation-groups.ts:37](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/observation-groups.ts#L37)

What a star's **light** tells about it: its spectral class, temperature,
luminosity, surface gravity and metallicity. A part of
[StarObservationsInterface](../interfaces/StarObservationsInterface.md).

## Example

```ts
const sun: StarParametersType = {
  spectralClassification: { raw: 'G2V', spectralClass: 'G', subclass: 2 },
  effectiveTemperature: { value: 5772, unit: 'K' },
  luminosity: { value: 1, unit: 'L_sun' }
};
```
