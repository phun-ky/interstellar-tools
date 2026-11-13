[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingDisplayType

# Type Alias: RingDisplayType

```ts
type RingDisplayType = Pick<DisplayInterface, 'rings' | 'derivation'>;
```

Defined in:
[celestial-bodies/observation-groups.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/observation-groups.ts#L78)

How to **draw a planet's rings**, and why the values are what they are. A part
of [DisplayInterface](../interfaces/DisplayInterface.md).

## Example

```ts
const saturn: RingDisplayType = {
  rings: { color: '#cabcba', opacity: 0.93, shadows: true }
};
```
