[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayAstrosphereInterface

# Interface: DisplayAstrosphereInterface

Defined in:
[celestial-bodies/display.ts:338](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L338)

How to draw a star's **astrosphere**, its boundaries from the star's
`observations.astrosphere`.

Unlike the other groups, its sizes are physical, from `observations`, as it's
drawn around the star's whole system: the heliosphere is over a hundred times
wider than Neptune's orbit.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:340](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L340)

The colour of its boundaries.

---

### opacity

```ts
opacity: number;
```

Defined in:
[celestial-bodies/display.ts:342](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L342)

How opaque they are, 0–1.

---

### visibleByDefault?

```ts
visibleByDefault?: boolean;
```

Defined in:
[celestial-bodies/display.ts:347](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L347)

Whether to draw it without being asked. Left out, a renderer keeps it hidden,
behind an option to show it.
