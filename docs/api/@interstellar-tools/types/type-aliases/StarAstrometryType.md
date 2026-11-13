[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarAstrometryType

# Type Alias: StarAstrometryType

```ts
type StarAstrometryType = Pick<
  StarObservationsInterface,
  'identifiers' | 'astrometry' | 'apparentMagnitudes' | 'component'
>;
```

Defined in:
[celestial-bodies/observation-groups.ts:61](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/observation-groups.ts#L61)

Where a star **is on the sky** and which catalogues list it: its identifiers,
position, motion and apparent magnitudes, and its letter within its system. A
part of [StarObservationsInterface](../interfaces/StarObservationsInterface.md).

## Example

```ts
const proxima: StarAstrometryType = {
  identifiers: { hip: 70890, gaiaDr3: '5853498713190525696' },
  component: 'C'
};
```
