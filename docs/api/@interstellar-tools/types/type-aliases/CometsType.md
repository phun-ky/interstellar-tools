[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometsType

# Type Alias: CometsType

```ts
type CometsType = CometInterface[];
```

Defined in:
[celestial-bodies/comets.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/comets.ts#L78)

Type alias for an array of **comets**.

## Example

```ts
const halley: CometsType = [
  {
    id: '1p-halley',
    name: 'Halley',
    type: 'periodic comet',
    category: 'halley-type comet',
    parent: 'sun',
    orbit: {
      a: { value: 17.834, unit: 'au' },
      e: 0.96714,
      i: 162.26 as DegreesType,
      w: 111.33 as DegreesType,
      om: 58.42 as DegreesType,
      angle: 2.97966 as Radians,
      period: { value: 27576, unit: 'd' },
      retrograde: true,
      q: { value: 0.586, unit: 'au' }
    },
    radius: { value: 11, unit: 'km' },
    display: { color: '#ffffff', size: 1.2 }
  }
];
```
