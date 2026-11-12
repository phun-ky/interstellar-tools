[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayRingsInterface

# Interface: DisplayRingsInterface

Defined in:
[celestial-bodies/display.ts:287](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L287)

How to draw a **ring system**. Its radii, rings and gaps are the measured ones,
in the body's `observations.rings`.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:289](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L289)

The rings' colour.

---

### opacity

```ts
opacity: number;
```

Defined in:
[celestial-bodies/display.ts:291](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L291)

How opaque they are overall, 0–1, scaled by each ring's optical depth where it's
known.

---

### shadows?

```ts
shadows?: boolean;
```

Defined in:
[celestial-bodies/display.ts:293](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L293)

Whether the planet and the rings cast shadows on each other.
