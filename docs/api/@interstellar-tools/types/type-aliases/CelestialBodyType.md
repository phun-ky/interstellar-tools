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
[celestial-bodies/celestial-bodies.ts:47](https://github.com/phun-ky/interstellar-tools/blob/4751b7fe9a5d1e0aa9e12d36d2f5d061dcebe3c2/packages/types/src/celestial-bodies/celestial-bodies.ts#L47)

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
