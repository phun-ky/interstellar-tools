[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayComaInterface

# Interface: DisplayComaInterface

Defined in:
[celestial-bodies/display.ts:348](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L348)

How to draw a comet's **coma and tails**.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:350](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L350)

The coma's colour.

---

### intensity?

```ts
intensity?: number;
```

Defined in:
[celestial-bodies/display.ts:354](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L354)

How bright it is, 0–1.

---

### radius

```ts
radius: number;
```

Defined in:
[celestial-bodies/display.ts:352](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L352)

Its radius, in multiples of the drawn nucleus's radius.

---

### tails?

```ts
tails?: DisplayTailInterface[];
```

Defined in:
[celestial-bodies/display.ts:356](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L356)

Its tails.
