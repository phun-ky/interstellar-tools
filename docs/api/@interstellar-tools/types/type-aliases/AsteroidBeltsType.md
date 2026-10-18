[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:45](https://github.com/phun-ky/interstellar-tools/blob/3b3e9ce5b537aa4032c382fccd8b2cef0ae6ff57/packages/types/src/celestial-bodies/asteroid-belts.ts#L45)

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
