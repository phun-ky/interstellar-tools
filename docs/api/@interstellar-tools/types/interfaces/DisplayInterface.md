[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayInterface

# Interface: DisplayInterface

Defined in:
[celestial-bodies/display.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L80)

How a body is **drawn**: everything about rendering, kept apart from its
physical data, its `orbit` and its `observations`.

It holds three kinds of values:

- **Hints from the datasets**: `color` on every body, `size` on comets and
  asteroids, `opacity` and `density` on asteroid belts.
- **State a renderer computes** and keeps on the body, so it doesn't have to
  recompute it every frame: `semiMinorAxis`, `focusOffsetX` and `orbitPath`. The
  datasets never set these.
- **How to draw the body itself**, for a procedural renderer: `model`, and the
  groups that model reads, `surface`, `bands`, `clouds`, `atmosphere`,
  `emission`, `rings`, `photosphere`, `astrosphere`, `coma`, `galaxy` and
  `blackHole`, with a noise `seed`. They come from the body's `observations` or
  from images of it, and `derivation` records which.

::: info

- Colours are hex strings (`#rrggbb`) or CSS colour names, like `color`.
- Intensities, coverages and fractions run from 0 to 1.
- Sizes in the drawing groups are in multiples of the drawn body's radius, never
  physical units, but for `astrosphere`'s, which come from `observations`. The
  physical sizes, such as a ring's radii, are in `observations`.
- The computed orbit distances are in whatever unit the renderer uses for
  `orbit.a` (for example au), in the orbit's plane, with the parent at the
  origin and periapsis along +x.

:::

## Examples

```ts
// Drawing an orbit: compute once, keep it on the body
const a = convertDistanceUnit(body.orbit.a, 'au').value;
const { e } = body.orbit;

body.display = {
  ...body.display,
  semiMinorAxis: a * Math.sqrt(1 - e ** 2),
  focusOffsetX: a * e
};
```

```ts
// Saturn, for a procedural renderer
const saturn: DisplayInterface = {
  color: '#D2B48C',
  model: 'giant',
  bands: {
    palette: ['#d4b884', '#efe1bd', '#b8975f'],
    count: 12,
    contrast: 0.45
  },
  rings: { color: '#d6c4a0', opacity: 0.95, shadows: true }
};
```

## Properties

### astrosphere?

```ts
astrosphere?: DisplayAstrosphereInterface;
```

Defined in:
[celestial-bodies/display.ts:112](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L112)

How to draw a star's astrosphere.

---

### atmosphere?

```ts
atmosphere?: DisplayAtmosphereInterface;
```

Defined in:
[celestial-bodies/display.ts:104](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L104)

The glow of an atmosphere at the limb.

---

### bands?

```ts
bands?: DisplayBandsInterface;
```

Defined in:
[celestial-bodies/display.ts:100](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L100)

A giant planet's belts, zones and storms.

---

### blackHole?

```ts
blackHole?: DisplayBlackHoleInterface;
```

Defined in:
[celestial-bodies/display.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L118)

A black hole's photon ring and accretion disk.

---

### clouds?

```ts
clouds?: DisplayCloudsInterface;
```

Defined in:
[celestial-bodies/display.ts:102](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L102)

A cloud layer over a solid surface.

---

### color?

```ts
color?: string;
```

Defined in:
[celestial-bodies/display.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L82)

Colour to draw the body in, as a hex string (`#rrggbb`) or a CSS colour name.

---

### coma?

```ts
coma?: DisplayComaInterface;
```

Defined in:
[celestial-bodies/display.ts:114](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L114)

A comet's coma and tails.

---

### density?

```ts
density?: number;
```

Defined in:
[celestial-bodies/display.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L88)

How densely to fill an area, e.g. how many asteroids to draw in a belt.

---

### derivation?

```ts
derivation?: DisplayDerivationInterface[];
```

Defined in:
[celestial-bodies/display.ts:122](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L122)

Why each drawing value is what it is.

---

### emission?

```ts
emission?: DisplayEmissionInterface;
```

Defined in:
[celestial-bodies/display.ts:106](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L106)

Light the body gives off itself, seen on its night side too.

---

### focusOffsetX?

```ts
focusOffsetX?: number;
```

Defined in:
[celestial-bodies/display.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L92)

Distance from the ellipse's centre to its focus, $c = a e$, computed by a
renderer.

---

### galaxy?

```ts
galaxy?: DisplayGalaxyInterface;
```

Defined in:
[celestial-bodies/display.ts:116](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L116)

A galaxy's bulge, disk and arms.

---

### model?

```ts
model?: DisplayModelType;
```

Defined in:
[celestial-bodies/display.ts:96](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L96)

Which procedural model draws the body.

---

### opacity?

```ts
opacity?: number;
```

Defined in:
[celestial-bodies/display.ts:86](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L86)

Transparency, from 0 (invisible) to 1 (solid).

---

### orbitPath?

```ts
orbitPath?: CartesianCoordinatesInterface[];
```

Defined in:
[celestial-bodies/display.ts:94](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L94)

Points along the drawn orbit, computed by a renderer.

---

### photosphere?

```ts
photosphere?: DisplayPhotosphereInterface;
```

Defined in:
[celestial-bodies/display.ts:110](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L110)

A star's disc: its colour, limb darkening, granulation, spots and corona.

---

### rings?

```ts
rings?: DisplayRingsInterface;
```

Defined in:
[celestial-bodies/display.ts:108](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L108)

How to draw the rings in `observations.rings`.

---

### seed?

```ts
seed?: number;
```

Defined in:
[celestial-bodies/display.ts:120](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L120)

A seed for the procedural noise, so the body always looks the same.

---

### semiMinorAxis?

```ts
semiMinorAxis?: number;
```

Defined in:
[celestial-bodies/display.ts:90](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L90)

Semi-minor axis of the orbit, $b = a\sqrt{1 - e^2}$, computed by a renderer.

---

### size?

```ts
size?: number;
```

Defined in:
[celestial-bodies/display.ts:84](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L84)

Scaled size for drawing, not the physical size (see `radius`).

---

### surface?

```ts
surface?: DisplaySurfaceInterface;
```

Defined in:
[celestial-bodies/display.ts:98](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L98)

A solid surface: its colours, relief, oceans, ice caps and lava.
