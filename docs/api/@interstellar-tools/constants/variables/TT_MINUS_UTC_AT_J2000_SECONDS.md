[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / TT_MINUS_UTC_AT_J2000_SECONDS

# Variable: TT_MINUS_UTC_AT_J2000_SECONDS

```ts
const TT_MINUS_UTC_AT_J2000_SECONDS: 64.184 = 64.184;
```

Defined in:
[date.ts:100](https://github.com/phun-ky/interstellar-tools/blob/c92c21e64c6c17a1e137f86d826c046c9ea440ca/packages/constants/src/date.ts#L100)

Useful offset at the J2000 epoch (for UTC↔TT conversions near that instant).

- TT − UTC = **64.184 s** at 2000-01-01
- Provided in both seconds and milliseconds for convenience.

::: info

UTC–TT offset changes when leap seconds are introduced; this constant is
specific to the J2000 epoch.

:::
