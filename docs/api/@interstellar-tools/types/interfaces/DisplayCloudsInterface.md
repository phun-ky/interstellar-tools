[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayCloudsInterface

# Interface: DisplayCloudsInterface

Defined in:
[celestial-bodies/display.ts:246](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L246)

How to draw a **cloud layer** over a solid surface.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:248](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L248)

The clouds' colour.

---

### coverage

```ts
coverage: number;
```

Defined in:
[celestial-bodies/display.ts:250](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L250)

The share of the disc they cover, 0–1; 1 hides the surface.

---

### drift?

```ts
drift?: number;
```

Defined in:
[celestial-bodies/display.ts:252](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L252)

How fast they move against the surface, as a share of the body's spin: 0 still.
