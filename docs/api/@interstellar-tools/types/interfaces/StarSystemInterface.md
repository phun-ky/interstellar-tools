[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarSystemInterface

# Interface: StarSystemInterface

Defined in:
[celestial-bodies/stars.ts:22](https://github.com/phun-ky/interstellar-tools/blob/629651921fe4421e613048f6c89a0251b7b6a97d/packages/types/src/celestial-bodies/stars.ts#L22)

Represents a **star system**, which can be a planetary system or a stellar
system.

## Example

```ts
const solarSystem: StarSystemInterface = {
  name: 'Solar System',
  type: 'planetary system'
};
```

## Properties

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/stars.ts:23](https://github.com/phun-ky/interstellar-tools/blob/629651921fe4421e613048f6c89a0251b7b6a97d/packages/types/src/celestial-bodies/stars.ts#L23)

Name of the star system.

---

### type

```ts
type: 'planetary system' | 'stellar system';
```

Defined in:
[celestial-bodies/stars.ts:24](https://github.com/phun-ky/interstellar-tools/blob/629651921fe4421e613048f6c89a0251b7b6a97d/packages/types/src/celestial-bodies/stars.ts#L24)

Specifies if it is a **planetary system** or a **stellar system**.
