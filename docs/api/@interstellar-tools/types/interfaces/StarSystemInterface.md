[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarSystemInterface

# Interface: StarSystemInterface

Defined in:
[celestial-bodies/stars.ts:22](https://github.com/phun-ky/interstellar-tools/blob/ea0a86937873dd87778d2639a79625d7c05309a7/packages/types/src/celestial-bodies/stars.ts#L22)

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
[celestial-bodies/stars.ts:23](https://github.com/phun-ky/interstellar-tools/blob/ea0a86937873dd87778d2639a79625d7c05309a7/packages/types/src/celestial-bodies/stars.ts#L23)

Name of the star system.

---

### type

```ts
type: 'planetary system' | 'stellar system';
```

Defined in:
[celestial-bodies/stars.ts:24](https://github.com/phun-ky/interstellar-tools/blob/ea0a86937873dd87778d2639a79625d7c05309a7/packages/types/src/celestial-bodies/stars.ts#L24)

Specifies if it is a **planetary system** or a **stellar system**.
