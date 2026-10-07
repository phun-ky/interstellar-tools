[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidSpectralType

# Type Alias: AsteroidSpectralType

```ts
type AsteroidSpectralType =
  | 'c-type'
  | 's-type'
  | 'v-type'
  | 'm-type'
  | 'b-type'
  | 'd-type'
  | 'p-type'
  | 'f-type'
  | 'g-type'
  | 'x-type'
  | 'e-type'
  | 'other';
```

Defined in:
[celestial-bodies/asteroids.ts:74](https://github.com/phun-ky/interstellar-tools/blob/ca19b3ee4d96f8365482f3870f73960191b1923c/packages/types/src/celestial-bodies/asteroids.ts#L74)

**Spectral (taxonomic) class** based on reflectance spectra & albedo.

::: info

Examples:

- **C** (carbonaceous, dark), **S** (stony, silicaceous), **M** (metal-rich)
- **V** (Vesta-like, basaltic), **D/P** (very red/dark, outer system)
- **B/F/G** (subclasses of C/X), **E** (high-albedo enstatite), **X**
  (degenerate group)

:::
