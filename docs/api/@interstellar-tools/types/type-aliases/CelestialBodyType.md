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
[celestial-bodies/celestial-bodies.ts:47](https://github.com/phun-ky/interstellar-tools/blob/b96d8dd82d534ad472a1d6fa410cf27b90d0a731/packages/types/src/celestial-bodies/celestial-bodies.ts#L47)

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
