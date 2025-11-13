[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / J2000_EPOCH_TIME_SCALE

# Variable: J2000_EPOCH_TIME_SCALE

```ts
const J2000_EPOCH_TIME_SCALE: 'TT' = TIME_SCALE_TT;
```

Defined in:
[date.ts:84](https://github.com/phun-ky/interstellar-tools/blob/de093dcb047b9aaae6ea3706fd8ef5ec2dd7b0ae/packages/constants/src/date.ts#L84)

The **defining** time scale for the J2000 epoch. J2000 is conventionally
specified in **Terrestrial Time** (TT).

## Example

```ts
// When computing Julian centuries:
//   T = (JD_TT - J2000_TT) / 36525
```
