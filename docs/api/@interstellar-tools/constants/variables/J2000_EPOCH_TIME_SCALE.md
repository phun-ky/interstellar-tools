[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / J2000_EPOCH_TIME_SCALE

# Variable: J2000_EPOCH_TIME_SCALE

```ts
const J2000_EPOCH_TIME_SCALE: 'TT' = TIME_SCALE_TT;
```

Defined in:
[date.ts:84](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/constants/src/date.ts#L84)

The **defining** time scale for the J2000 epoch. J2000 is conventionally
specified in **Terrestrial Time** (TT).

## Example

```ts
// When computing Julian centuries:
//   T = (JD_TT - J2000_TT) / 36525
```
