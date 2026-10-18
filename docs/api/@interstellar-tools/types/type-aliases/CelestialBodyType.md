[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialBodyType

# Type Alias: CelestialBodyType

```ts
type CelestialBodyType =
  | StarInterface
  | PlanetInterface
  | MoonInterface
  | CometInterface
  | AsteroidInterface;
```

Defined in:
[celestial-bodies/celestial-bodies.ts:47](https://github.com/phun-ky/interstellar-tools/blob/c48c12d1e1a0c7662e062aba029fbaa6743ccf30/packages/types/src/celestial-bodies/celestial-bodies.ts#L47)

Type alias representing a single celestial body.

Includes:

- **Stars** (`StarInterface`)
- **Planets** (`PlanetInterface`)
- **Moons** (`MoonInterface`)
- **Comets** (`CometInterface`)

## Example

```ts
const earth: CelestialBodyType = {
  name: 'Earth',
  type: 'planet',
  mass: 5.972e24
};
```
