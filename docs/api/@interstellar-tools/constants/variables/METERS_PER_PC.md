[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / METERS_PER_PC

# Variable: METERS_PER_PC

```ts
const METERS_PER_PC: number;
```

Defined in:
[distance.ts:71](https://github.com/phun-ky/interstellar-tools/blob/3607c42aab35c28efbf96b5b3085ee20e1d129c8/packages/constants/src/distance.ts#L71)

Meters in one **parsec**, using the exact IAU 2015 Resolution B2 definition:
`pc = (648000 / π) au`.

::: info

Computed as [AU_METERS](AU_METERS.md) × 648000 / π. The older trigonometric form
`au / tan(1″)` differs by about 8 parts in 10¹².

:::

## See

https://www.iau.org/static/resolutions/IAU2015_English.pdf
