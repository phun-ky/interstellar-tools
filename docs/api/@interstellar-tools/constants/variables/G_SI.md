[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / G_SI

# Variable: G_SI

```ts
const G_SI: number = 6.6743e-11;
```

Defined in:
[physics.ts:24](https://github.com/phun-ky/interstellar-tools/blob/7f69ef1cdcae94524fd5860b2f8dc549143e8207/packages/constants/src/physics.ts#L24)

Gravitational constant **G** in SI units.

Numerical value from CODATA 2018: `6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²` (relative
standard uncertainty 2.2e-5). Use this for Newtonian gravity calculations:

$$
F = G\,\frac{m_1 m_2}{r^2}
$$

## Default

```ts
6.6743e-11;
```

## See

- https://physics.nist.gov/cgi-bin/cuu/Value?bg
- https://en.wikipedia.org/wiki/Gravitational\_constant

## Example

```ts
// Standard gravitational parameter (mu) for Earth:
const M_earth = 5.97219e24; // kg
const mu_earth = G_SI * M_earth; // ≈ 3.986004e14 m^3/s^2
```
