[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ProvenanceType

# Type Alias: ProvenanceType

```ts
type ProvenanceType =
  'measured' | 'derived' | 'modelled' | 'estimated' | 'assumed';
```

Defined in:
[observations.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L56)

How a value was obtained.

- `'measured'`: observed directly.
- `'derived'`: computed from other measured values.
- `'modelled'`: the output of a model fit.
- `'estimated'`: a catalogue estimate, such as a diameter from H and an assumed
  albedo.
- `'assumed'`: a convention or placeholder, such as tidal locking.
