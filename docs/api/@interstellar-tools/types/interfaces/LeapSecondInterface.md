[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LeapSecondInterface

# Interface: LeapSecondInterface

Defined in:
[temporal.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L187)

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
[temporal.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L189)

The first UTC day with this offset, as `YYYY-MM-DD`. The leap second itself is
the last second of the day before, 23:59:60.

---

### taiMinusUtc

```ts
taiMinusUtc: number;
```

Defined in:
[temporal.ts:191](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L191)

TAI − UTC from that day on, in **s**.
