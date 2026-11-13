[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayDerivationInterface

# Interface: DisplayDerivationInterface

Defined in:
[celestial-bodies/display.ts:441](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L441)

**Why a drawing value is what it is**: taken from images, worked out from an
observation, or assumed.

## Example

```ts
const why: DisplayDerivationInterface = {
  property: 'photosphere.color',
  basis: 'derived',
  reason: 'Blackbody colour at Teff = 5772 K',
  from: 'effectiveTemperature'
};
```

## Properties

### basis

```ts
basis: ProvenanceType | 'imagery';
```

Defined in:
[celestial-bodies/display.ts:445](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L445)

How it was set: `'imagery'` for colours taken from spacecraft or telescope
images.

---

### from?

```ts
from?: string;
```

Defined in:
[celestial-bodies/display.ts:449](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L449)

A dotted path into `observations` to the value it came from.

---

### property

```ts
property: string;
```

Defined in:
[celestial-bodies/display.ts:443](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L443)

A dotted path into `display`, such as `'bands.count'`.

---

### reason

```ts
reason: string;
```

Defined in:
[celestial-bodies/display.ts:447](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L447)

Why, in plain words.
