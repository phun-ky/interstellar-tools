[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayAtmosphereInterface

# Interface: DisplayAtmosphereInterface

Defined in:
[celestial-bodies/display.ts:257](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L257)

How to draw the **glow of an atmosphere** at the limb.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:259](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L259)

The glow's colour, such as Rayleigh blue.

---

### haloExtent?

```ts
haloExtent?: number;
```

Defined in:
[celestial-bodies/display.ts:263](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L263)

How far it reaches past the limb, in body radii.

---

### intensity

```ts
intensity: number;
```

Defined in:
[celestial-bodies/display.ts:261](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L261)

How strong it is, 0 (airless) to 1 (thick).
