[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayRingsInterface

# Interface: DisplayRingsInterface

Defined in:
[celestial-bodies/display.ts:284](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L284)

How to draw a **ring system**. Its radii, rings and gaps are the measured ones,
in the body's `observations.rings`.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:286](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L286)

The rings' colour.

---

### opacity

```ts
opacity: number;
```

Defined in:
[celestial-bodies/display.ts:288](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L288)

How opaque they are overall, 0–1, scaled by each ring's optical depth where it's
known.

---

### shadows?

```ts
shadows?: boolean;
```

Defined in:
[celestial-bodies/display.ts:290](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L290)

Whether the planet and the rings cast shadows on each other.
