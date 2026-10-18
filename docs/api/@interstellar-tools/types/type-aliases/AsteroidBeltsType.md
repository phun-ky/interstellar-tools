[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:45](https://github.com/phun-ky/interstellar-tools/blob/08c86c0d17e8945b4ff7b3559c6fe5852df4925c/packages/types/src/celestial-bodies/asteroid-belts.ts#L45)

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
