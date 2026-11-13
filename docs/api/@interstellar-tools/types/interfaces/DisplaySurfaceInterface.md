[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplaySurfaceInterface

# Interface: DisplaySurfaceInterface

Defined in:
[celestial-bodies/display.ts:188](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L188)

How to draw a **solid surface**.

## Properties

### iceCaps?

```ts
iceCaps?: DisplayIceCapsInterface;
```

Defined in:
[celestial-bodies/display.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L196)

Polar ice caps.

---

### lava?

```ts
lava?: DisplayLavaInterface;
```

Defined in:
[celestial-bodies/display.ts:198](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L198)

Lava.

---

### ocean?

```ts
ocean?: DisplayOceanInterface;
```

Defined in:
[celestial-bodies/display.ts:194](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L194)

Oceans.

---

### palette

```ts
palette: DisplayPaletteType;
```

Defined in:
[celestial-bodies/display.ts:190](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L190)

Lowland, midland and highland colours.

---

### roughness?

```ts
roughness?: number;
```

Defined in:
[celestial-bodies/display.ts:192](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L192)

Small-scale relief and crater contrast, 0 (smooth) to 1 (rugged).
