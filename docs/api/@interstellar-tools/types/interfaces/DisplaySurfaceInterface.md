[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplaySurfaceInterface

# Interface: DisplaySurfaceInterface

Defined in:
[celestial-bodies/display.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L185)

How to draw a **solid surface**.

## Properties

### iceCaps?

```ts
iceCaps?: DisplayIceCapsInterface;
```

Defined in:
[celestial-bodies/display.ts:193](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L193)

Polar ice caps.

---

### lava?

```ts
lava?: DisplayLavaInterface;
```

Defined in:
[celestial-bodies/display.ts:195](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L195)

Lava.

---

### ocean?

```ts
ocean?: DisplayOceanInterface;
```

Defined in:
[celestial-bodies/display.ts:191](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L191)

Oceans.

---

### palette

```ts
palette: DisplayPaletteType;
```

Defined in:
[celestial-bodies/display.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L187)

Lowland, midland and highland colours.

---

### roughness?

```ts
roughness?: number;
```

Defined in:
[celestial-bodies/display.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L189)

Small-scale relief and crater contrast, 0 (smooth) to 1 (rugged).
