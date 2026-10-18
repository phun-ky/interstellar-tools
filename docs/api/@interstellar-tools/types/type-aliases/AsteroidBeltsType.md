[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidBeltsType

# Type Alias: AsteroidBeltsType

```ts
type AsteroidBeltsType = AsteroidBeltInterface[];
```

Defined in:
[celestial-bodies/asteroid-belts.ts:47](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/asteroid-belts.ts#L47)

Type alias for a collection of asteroid belts.

## Example

```ts
const asteroidBelts: AsteroidBeltsType = [
  {
    id: 'main-asteroid-belt',
    name: 'Main Belt',
    parent: 'sun',
    innerRadius: { value: 2.1, unit: 'au' },
    outerRadius: { value: 3.3, unit: 'au' },
    display: { color: '#888888', opacity: 0.5, density: 100 }
  }
];
```
