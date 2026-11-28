[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / DISCOVERIES

# Variable: DISCOVERIES

```ts
const DISCOVERIES: ByBodyIdType<{
  discovery: DiscoveryInterface;
}>;
```

Defined in:
[bodies/discoveries.ts:24](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/discoveries.ts#L24)

How and when bodies were **discovered**, keyed by body id: the date, the people
credited and the observatory, from the Minor Planet Center's circulars. For the
interstellar objects so far.

Small and apart, so an app that shows a discovery date loads only this.
[withObservations](../functions/withObservations.md) puts it on, as a body's
`observations.discovery`.

Its dates are `Date`s, which can't be frozen, so their setters change them for
every importer: copy one before changing it, `new Date(date)`.

## Example

```ts
DISCOVERIES['2i-borisov'].discovery.date; // 2019-08-30
```
