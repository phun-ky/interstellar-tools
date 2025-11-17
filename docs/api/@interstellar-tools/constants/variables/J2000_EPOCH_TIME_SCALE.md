[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / J2000_EPOCH_TIME_SCALE

# Variable: J2000_EPOCH_TIME_SCALE

```ts
const J2000_EPOCH_TIME_SCALE: 'TT' = TIME_SCALE_TT;
```

Defined in:
[date.ts:84](https://github.com/phun-ky/interstellar-tools/blob/832c313b094c927abcdab3b706dc5f72fdc7bae0/packages/constants/src/date.ts#L84)

The **defining** time scale for the J2000 epoch. J2000 is conventionally
specified in **Terrestrial Time** (TT).

## Example

```ts
// When computing Julian centuries:
//   T = (JD_TT - J2000_TT) / 36525
```
