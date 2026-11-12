[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayCloudsInterface

# Interface: DisplayCloudsInterface

Defined in:
[celestial-bodies/display.ts:243](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L243)

How to draw a **cloud layer** over a solid surface.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:245](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L245)

The clouds' colour.

---

### coverage

```ts
coverage: number;
```

Defined in:
[celestial-bodies/display.ts:247](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L247)

The share of the disc they cover, 0–1; 1 hides the surface.

---

### drift?

```ts
drift?: number;
```

Defined in:
[celestial-bodies/display.ts:249](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L249)

How fast they move against the surface, as a share of the body's spin: 0 still.
