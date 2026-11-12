[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyMorphologyInterface

# Interface: GalaxyMorphologyInterface

Defined in:
[celestial-bodies/body-observations.ts:620](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L620)

[GalaxyInterface.type](GalaxyInterface.md#type) **split into its parts**.

## Properties

### bar?

```ts
bar?: "none" | "strong" | "weak";
```

Defined in:
[celestial-bodies/body-observations.ts:641](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L641)

How strong its bar is.

---

### hubbleType?

```ts
hubbleType?:
  | string & {
}
  | "E"
  | "S0"
  | "Sa"
  | "Sab"
  | "Sb"
  | "Sbc"
  | "Sc"
  | "Scd"
  | "Sd"
  | "Sm"
  | "Im"
  | "Irr"
  | "dSph"
  | "dE";
```

Defined in:
[celestial-bodies/body-observations.ts:624](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L624)

The Hubble stage.

---

### interacting?

```ts
interacting?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:649](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L649)

Visibly interacting with a neighbour.

---

### peculiar?

```ts
peculiar?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:647](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L647)

Peculiar in shape.

---

### raw

```ts
raw: string;
```

Defined in:
[celestial-bodies/body-observations.ts:622](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L622)

As published: `GalaxyInterface.type`, such as `'SBbc'`.

---

### ring?

```ts
ring?: "none" | "inner" | "outer" | "nuclear";
```

Defined in:
[celestial-bodies/body-observations.ts:643](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L643)

Its ring structure.

---

### tType?

```ts
tType?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:645](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L645)

de Vaucouleurs's numerical T-type.
