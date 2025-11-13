[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
StarSystemInterface

# Interface: StarSystemInterface

Defined in: celestial-bodies/stars.ts:22

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

Defined in: celestial-bodies/stars.ts:23

Name of the star system.

---

### type

```ts
type: 'planetary system' | 'stellar system';
```

Defined in: celestial-bodies/stars.ts:24

Specifies if it is a **planetary system** or a **stellar system**.
