[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayInterface

# Interface: DisplayInterface

Defined in:
[celestial-bodies/display.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L48)

How a body is **drawn**: everything about rendering, kept apart from its
physical data and its `orbit`.

It holds two kinds of values:

- **Hints from the datasets**: `color` on every body, `size` on comets and
  asteroids, `opacity` and `density` on asteroid belts.
- **State a renderer computes** and keeps on the body, so it doesn't have to
  recompute it every frame: `semiMinorAxis`, `focusOffsetX` and `orbitPath`. The
  datasets never set these.

The computed distances are in whatever unit the renderer uses for `orbit.a` (for
example au), measured in the orbit's plane with the parent body at the origin
and periapsis along +x.

## Example

```ts
// Drawing an orbit: compute once, keep it on the body
const a = convertDistance(body.orbit.a, 'au').value;
const { e } = body.orbit;

body.display = {
  ...body.display,
  semiMinorAxis: a * Math.sqrt(1 - e ** 2),
  focusOffsetX: a * e
};
```

## Properties

### color?

```ts
optional color?: string;
```

Defined in:
[celestial-bodies/display.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L50)

Colour to draw the body in, as a hex string (`#rrggbb`) or a CSS colour name.

---

### density?

```ts
optional density?: number;
```

Defined in:
[celestial-bodies/display.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L56)

How densely to fill an area, e.g. how many asteroids to draw in a belt.

---

### focusOffsetX?

```ts
optional focusOffsetX?: number;
```

Defined in:
[celestial-bodies/display.ts:60](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L60)

Distance from the ellipse's centre to its focus, $c = a e$, computed by a
renderer.

---

### opacity?

```ts
optional opacity?: number;
```

Defined in:
[celestial-bodies/display.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L54)

Transparency, from 0 (invisible) to 1 (solid).

---

### orbitPath?

```ts
optional orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/display.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L62)

Points along the drawn orbit, computed by a renderer.

---

### semiMinorAxis?

```ts
optional semiMinorAxis?: number;
```

Defined in:
[celestial-bodies/display.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L58)

Semi-minor axis of the orbit, $b = a\sqrt{1 - e^2}$, computed by a renderer.

---

### size?

```ts
optional size?: number;
```

Defined in:
[celestial-bodies/display.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L52)

Scaled size for drawing, not the physical size (see `radius`).
