[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayAtmosphereInterface

# Interface: DisplayAtmosphereInterface

Defined in:
[celestial-bodies/display.ts:260](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L260)

How to draw the **glow of an atmosphere** at the limb.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:262](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L262)

The glow's colour, such as Rayleigh blue.

---

### haloExtent?

```ts
haloExtent?: number;
```

Defined in:
[celestial-bodies/display.ts:266](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L266)

How far it reaches past the limb, in body radii.

---

### intensity

```ts
intensity: number;
```

Defined in:
[celestial-bodies/display.ts:264](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L264)

How strong it is, 0 (airless) to 1 (thick).
