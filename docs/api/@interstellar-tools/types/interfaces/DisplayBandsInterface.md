[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayBandsInterface

# Interface: DisplayBandsInterface

Defined in:
[celestial-bodies/display.ts:228](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L228)

How to draw a giant planet's **belts and zones**.

## Properties

### contrast?

```ts
contrast?: number;
```

Defined in:
[celestial-bodies/display.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L236)

How different belts and zones are, 0 (featureless) to 1.

---

### count

```ts
count: number;
```

Defined in:
[celestial-bodies/display.ts:232](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L232)

How many belt and zone pairs, from pole to pole.

---

### palette

```ts
palette: DisplayPaletteType;
```

Defined in:
[celestial-bodies/display.ts:230](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L230)

Belt, zone and accent colours.

---

### storms?

```ts
storms?: DisplayStormInterface[];
```

Defined in:
[celestial-bodies/display.ts:238](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L238)

Storms.

---

### turbulence?

```ts
turbulence?: number;
```

Defined in:
[celestial-bodies/display.ts:234](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L234)

How much the bands waver, 0 (straight) to 1.
