[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometsType

# Type Alias: CometsType

```ts
type CometsType = CometInterface[];
```

Defined in:
[celestial-bodies/comets.ts:96](https://github.com/phun-ky/interstellar-tools/blob/a64e834c86c544c4daa99be2e8cd850a0ff7183c/packages/types/src/celestial-bodies/comets.ts#L96)

Type alias for an array of **comets**.

## Example

```ts
const halley: CometInterface = [{
  name: 'Halley',
  type: 'periodic comet',
  category: 'halley-type comet',
  system: 'Sun,
  a: { value: 17.8, unit: 'au' },
  e: 0.967,
  i: 162.26,
  w: 111.33,
  om: 58.42,
  angle: 0,
  period: { value: 76, unit: 'years' },
  q: 0.586,
  radius: { value: 11, unit: 'km' },
  color: '#ffffff',
  size: 1.2
}];
```
