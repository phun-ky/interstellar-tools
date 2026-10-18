[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:45](https://github.com/phun-ky/interstellar-tools/blob/c937a42cf99d9a589645c5e215479f165095d9c2/packages/types/src/celestial-bodies/asteroid-belts.ts#L45)

Type alias for a collection of asteroid belts.

## Example

```ts
const asteroidBelts: AsteroidBeltsType = [
  {
    id: 'main-asteroid-belt',
    name: 'Main Belt',
    parent: 'sun',
    innerRadius: 2.1,
    outerRadius: 3.3,
    display: { color: '#888888', opacity: 0.5, density: 100 }
  }
];
```
