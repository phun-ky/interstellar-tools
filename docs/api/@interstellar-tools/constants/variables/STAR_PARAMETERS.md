[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / STAR_PARAMETERS

# Variable: STAR_PARAMETERS

```ts
const STAR_PARAMETERS: ByBodyIdType<StarParametersType>;
```

Defined in:
[bodies/star-parameters.ts:86](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/star-parameters.ts#L86)

What each star's **light** tells about it, keyed by star id: its spectral class,
effective temperature, luminosity, surface gravity and metallicity, and for Vega
and Altair, the temperatures at their poles and equators.

Kept apart from [STARS](STARS.md), so an app that shows a star's class and
temperature loads only these.
[withObservations](../functions/withObservations.md) puts them on the stars.
Every value carries the DOI of its paper; see `STARS` for how they were chosen.

## Example

```ts
STAR_PARAMETERS.vega.luminosity?.value; // 40.12, in L☉
STAR_PARAMETERS.sun.effectiveTemperature?.value; // 5772, in K
```
