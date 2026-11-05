[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / EARTH_SIDEREAL_DAY_SECONDS

# Variable: EARTH_SIDEREAL_DAY_SECONDS

```ts
const EARTH_SIDEREAL_DAY_SECONDS: 86164.0905;
```

Defined in:
[temporal.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/temporal.ts#L85)

Earth's **sidereal day** in seconds: one turn against the vernal equinox, 23 h
56 m 4.0905 s. Sidereal time runs at this rate.

::: info

- The equinox drifts west as Earth's axis precesses, so this is 8.4 ms shorter
  than one turn against the stars, 23 h 56 m 4.0989 s, the `rotation` of Earth
  in [PLANETS](PLANETS.md).
- Taken with the tropical year, 365.24219 days, it gives the 86 400 s solar day:
  see `solarDayLength` in `@interstellar-tools/equations`.

:::

## See

[greenwichMeanSiderealTime](../../equations/functions/greenwichMeanSiderealTime.md)
