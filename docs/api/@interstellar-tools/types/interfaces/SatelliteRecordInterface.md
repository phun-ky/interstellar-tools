[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SatelliteRecordInterface

# Interface: SatelliteRecordInterface

Defined in:
[tracking.ts:309](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L309)

A satellite in the `SATELLITES` dataset of `@interstellar-tools/tracking`: a
stable id, a common name, its orbit regime and a dated OMM record.

::: info

- **The elements go stale within days.** They're a snapshot, for examples and
  tests; for tracking, fetch fresh elements from CelesTrak.

:::

## Example

```ts
const hubble: SatelliteRecordInterface = {
  id: 'hubble',
  name: 'Hubble Space Telescope',
  regime: 'LEO',
  omm: { OBJECT_NAME: 'HST', NORAD_CAT_ID: 20580, ... }
};
```

## Properties

### id

```ts
id: string;
```

Defined in:
[tracking.ts:311](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L311)

Stable id, in kebab case: `'iss'`, `'hubble'`.

---

### name

```ts
name: string;
```

Defined in:
[tracking.ts:313](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L313)

Common name: `'International Space Station'`.

---

### omm

```ts
omm: OmmRecordInterface;
```

Defined in:
[tracking.ts:317](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L317)

The elements, as an OMM record.

---

### regime

```ts
regime: OrbitRegimeType;
```

Defined in:
[tracking.ts:315](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L315)

The orbit regime.
