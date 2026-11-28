[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / EPOCH_2000_UTC_MIDNIGHT

# Variable: EPOCH_2000_UTC_MIDNIGHT

```ts
const EPOCH_2000_UTC_MIDNIGHT: Date;
```

Defined in:
[date.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/date.ts#L73)

**UTC midnight at the start of 2000-01-01** (convenient calendar anchor).

::: warning

This is **not** the J2000 epoch itself (which occurs 11:58:55.816 later in UTC).

:::

A `Date` can't be frozen, so its setters change it for every importer: copy it
before changing it, `new Date(EPOCH_2000_UTC_MIDNIGHT)`.
