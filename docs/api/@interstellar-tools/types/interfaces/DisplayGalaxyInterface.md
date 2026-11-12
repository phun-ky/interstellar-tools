[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayGalaxyInterface

# Interface: DisplayGalaxyInterface

Defined in:
[celestial-bodies/display.ts:364](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L364)

How to draw a **galaxy**.

## Properties

### armCount

```ts
armCount: number;
```

Defined in:
[celestial-bodies/display.ts:374](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L374)

How many spiral arms; 0 for ellipticals and irregulars.

---

### armPitch?

```ts
armPitch?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:376](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L376)

The arms' pitch angle: the smaller, the tighter they wind.

---

### barLength?

```ts
barLength?: number;
```

Defined in:
[celestial-bodies/display.ts:378](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L378)

The bar's length, as a share of the disk's radius, 0–1.

---

### bulgeColor

```ts
bulgeColor: string;
```

Defined in:
[celestial-bodies/display.ts:366](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L366)

The bulge's colour.

---

### bulgeRadius?

```ts
bulgeRadius?: number;
```

Defined in:
[celestial-bodies/display.ts:380](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L380)

The bulge's radius, as a share of the disk's radius, 0–1.

---

### diskColor

```ts
diskColor: string;
```

Defined in:
[celestial-bodies/display.ts:368](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L368)

The disk's colour.

---

### dust?

```ts
dust?: number;
```

Defined in:
[celestial-bodies/display.ts:384](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L384)

How strong the dust lanes are, 0–1.

---

### dustColor?

```ts
dustColor?: string;
```

Defined in:
[celestial-bodies/display.ts:372](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L372)

The colour of the dust lanes.

---

### ellipticity?

```ts
ellipticity?: number;
```

Defined in:
[celestial-bodies/display.ts:382](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L382)

An elliptical's axis ratio, b/a, 0–1.

---

### starFormingColor?

```ts
starFormingColor?: string;
```

Defined in:
[celestial-bodies/display.ts:370](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L370)

The colour of star-forming knots in the arms.
