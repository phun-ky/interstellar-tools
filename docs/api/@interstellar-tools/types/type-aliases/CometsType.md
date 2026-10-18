[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometsType

# Type Alias: CometsType

```ts
type CometsType = CometInterface[];
```

Defined in:
[celestial-bodies/comets.ts:87](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/types/src/celestial-bodies/comets.ts#L87)

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
      i: 162.26,
      w: 111.33,
      om: 58.42,
      angle: 0.669857 as Radians,
      period: { value: 27576, unit: 'd' },
      q: 0.586
    },
    radius: { value: 11, unit: 'km' },
    color: '#ffffff',
    size: 1.2
  }
];
```
