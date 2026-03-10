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
[celestial-bodies/celestial-bodies.ts:51](https://github.com/phun-ky/interstellar-tools/blob/be17ff22c6290f56a50244b1ae9e915d3e4e5be0/packages/types/src/celestial-bodies/celestial-bodies.ts#L51)

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
