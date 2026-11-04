[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ShadowType

# Type Alias: ShadowType

```ts
type ShadowType = 'sunlit' | 'penumbra' | 'umbra';
```

Defined in:
[tracking.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L185)

Where a satellite is relative to **Earth's shadow**.

- `'sunlit'`: the whole Sun is visible from the satellite.
- `'penumbra'`: Earth covers part of the Sun.
- `'umbra'`: Earth covers the whole Sun.

Returned by `earthShadow` in `@interstellar-tools/tracking`.

## Example

```ts
const shadow: ShadowType = 'umbra'; // in eclipse: no sunlight on the panels
```
