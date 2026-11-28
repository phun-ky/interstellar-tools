[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LeapSecondInterface

# Interface: LeapSecondInterface

Defined in:
[temporal.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L196)

One step in the **leap second table**: the offset TAI − UTC from a given UTC day
on.

## Example

```ts
const step: LeapSecondInterface = { date: '2017-01-01', taiMinusUtc: 37 };
```

## Properties

### date

```ts
date: string;
```

Defined in:
[temporal.ts:198](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L198)

The first UTC day with this offset, as `YYYY-MM-DD`. The leap second itself is
the last second of the day before, 23:59:60.

---

### taiMinusUtc

```ts
taiMinusUtc: number;
```

Defined in:
[temporal.ts:200](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L200)

TAI − UTC from that day on, in **s**.
