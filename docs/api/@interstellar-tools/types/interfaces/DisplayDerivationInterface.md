[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayDerivationInterface

# Interface: DisplayDerivationInterface

Defined in:
[celestial-bodies/display.ts:416](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L416)

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
[celestial-bodies/display.ts:420](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L420)

How it was set: `'imagery'` for colours taken from spacecraft or telescope
images.

---

### from?

```ts
from?: string;
```

Defined in:
[celestial-bodies/display.ts:424](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L424)

A dotted path into `observations` to the value it came from.

---

### property

```ts
property: string;
```

Defined in:
[celestial-bodies/display.ts:418](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L418)

A dotted path into `display`, such as `'bands.count'`.

---

### reason

```ts
reason: string;
```

Defined in:
[celestial-bodies/display.ts:422](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L422)

Why, in plain words.
