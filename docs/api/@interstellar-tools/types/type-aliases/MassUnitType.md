[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MassUnitType

# Type Alias: MassUnitType

```ts
type MassUnitType = 'kg' | 'M_earth' | 'M_jup' | 'M_sun';
```

Defined in:
[quantities.ts:37](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L37)

Canonical **mass unit symbols**.

- `kg`: the SI base.
- `M_earth`, `M_jup`, `M_sun`: Earth's, Jupiter's and the Sun's masses, as
  exoplanet and stellar catalogues give them: the IAU's 2015 nominal
  $(GM)^\mathrm{N}$, 3.986004 × 10¹⁴, 1.2668653 × 10¹⁷ and 1.3271244 × 10²⁰
  m³/s², over $G$.
