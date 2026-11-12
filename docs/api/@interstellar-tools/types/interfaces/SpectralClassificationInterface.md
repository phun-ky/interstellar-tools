[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpectralClassificationInterface

# Interface: SpectralClassificationInterface

Defined in:
[celestial-bodies/body-observations.ts:433](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L433)

[StarInterface.type](StarInterface.md#type) **split into its parts**. A class
given as a range, such as Spica's `'B1III-IV'` or Betelgeuse's `'M1-M2Ia-Iab'`,
takes both ends.

## Example

```ts
const betelgeuse: SpectralClassificationInterface = {
  raw: 'M1-M2Ia-Iab',
  spectralClass: 'M',
  subclass: [1, 2],
  luminosityClass: ['Ia', 'Iab']
};
```

## Properties

### luminosityClass?

```ts
luminosityClass?:
  | LuminosityClassType
  | readonly [LuminosityClassType, LuminosityClassType];
```

Defined in:
[celestial-bodies/body-observations.ts:456](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L456)

The luminosity class, or a range, `['III', 'IV']` in B1III-IV.

---

### peculiarities?

```ts
peculiarities?: string[];
```

Defined in:
[celestial-bodies/body-observations.ts:459](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L459)

Peculiarity codes, such as `'e'`, `'m'`, `'p'` or `'n'`.

---

### raw

```ts
raw: string;
```

Defined in:
[celestial-bodies/body-observations.ts:435](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L435)

As published: `StarInterface.type`, such as `'G2V'`.

---

### spectralClass?

```ts
spectralClass?:
  | "K"
  | "W"
  | "T"
  | "G"
  | string & {
}
  | "B"
  | "O"
  | "A"
  | "F"
  | "M"
  | "L"
  | "Y"
  | "C"
  | "S"
  | "D";
```

Defined in:
[celestial-bodies/body-observations.ts:437](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L437)

The spectral class letter.

---

### subclass?

```ts
subclass?: number | readonly [number, number];
```

Defined in:
[celestial-bodies/body-observations.ts:454](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L454)

The subclass, such as `2` in G2V, or a range, `[1, 2]` in M1-M2.
