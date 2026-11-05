[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / LEAP_SECONDS

# Variable: LEAP_SECONDS

```ts
const LEAP_SECONDS: readonly Readonly<LeapSecondInterface>[];
```

Defined in:
[date.ts:173](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/date.ts#L173)

The **leap second table**: TAI − UTC, in **s**, from each date on, since UTC
took whole-second steps on 1972-01-01.

Each step after the first is a leap second, inserted as 23:59:60 UTC on the day
before `date`. Before 1972, TAI − UTC wasn't a whole number of seconds, and this
table doesn't cover it.

::: warning Keeping it current

The International Earth Rotation and Reference Systems Service (IERS) announces
each leap second about six months ahead, in its Bulletin C. When it announces
one, add a row here and release `constants`. The last one so far was at the end
of 2016.

:::

## Example

```ts
LEAP_SECONDS[LEAP_SECONDS.length - 1]; // { date: '2017-01-01', taiMinusUtc: 37 }
```

## See

[IERS: leap seconds since 1972](https://hpiers.obspm.fr/iers/bul/bulc/Leap_Second.dat)
