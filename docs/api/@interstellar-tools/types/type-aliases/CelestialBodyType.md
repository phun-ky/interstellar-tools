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
[celestial-bodies/celestial-bodies.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/celestial-bodies.ts#L44)

Type alias representing a single celestial body.

Includes:

- **Stars** (`StarInterface`)
- **Planets** (`PlanetInterface`)
- **Moons** (`MoonInterface`)
- **Comets** (`CometInterface`)
- **Asteroids** (`AsteroidInterface`)

Interstellar objects aren't included: their open orbits have their own type,
`InterstellarObjectInterface`.

## Example

```ts
const describe = (body: CelestialBodyType) =>
  `${body.name}, bound to ${body.parent}`;
```
