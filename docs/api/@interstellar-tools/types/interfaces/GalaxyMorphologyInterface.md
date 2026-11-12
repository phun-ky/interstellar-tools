[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyMorphologyInterface

# Interface: GalaxyMorphologyInterface

Defined in:
[celestial-bodies/body-observations.ts:710](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L710)

[GalaxyInterface.type](GalaxyInterface.md#type) **split into its parts**.

## Properties

### bar?

```ts
bar?: "none" | "strong" | "weak";
```

Defined in:
[celestial-bodies/body-observations.ts:731](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L731)

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
[celestial-bodies/body-observations.ts:714](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L714)

The Hubble stage.

---

### interacting?

```ts
interacting?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:739](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L739)

Visibly interacting with a neighbour.

---

### peculiar?

```ts
peculiar?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:737](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L737)

Peculiar in shape.

---

### raw

```ts
raw: string;
```

Defined in:
[celestial-bodies/body-observations.ts:712](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L712)

As published: `GalaxyInterface.type`, such as `'SBbc'`.

---

### ring?

```ts
ring?: "none" | "inner" | "outer" | "nuclear";
```

Defined in:
[celestial-bodies/body-observations.ts:733](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L733)

Its ring structure.

---

### tType?

```ts
tType?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:735](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L735)

de Vaucouleurs's numerical T-type.
