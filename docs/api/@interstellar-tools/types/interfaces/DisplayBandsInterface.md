[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayBandsInterface

# Interface: DisplayBandsInterface

Defined in:
[celestial-bodies/display.ts:225](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L225)

How to draw a giant planet's **belts and zones**.

## Properties

### contrast?

```ts
contrast?: number;
```

Defined in:
[celestial-bodies/display.ts:233](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L233)

How different belts and zones are, 0 (featureless) to 1.

---

### count

```ts
count: number;
```

Defined in:
[celestial-bodies/display.ts:229](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L229)

How many belt and zone pairs, from pole to pole.

---

### palette

```ts
palette: DisplayPaletteType;
```

Defined in:
[celestial-bodies/display.ts:227](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L227)

Belt, zone and accent colours.

---

### storms?

```ts
storms?: DisplayStormInterface[];
```

Defined in:
[celestial-bodies/display.ts:235](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L235)

Storms.

---

### turbulence?

```ts
turbulence?: number;
```

Defined in:
[celestial-bodies/display.ts:231](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L231)

How much the bands waver, 0 (straight) to 1.
