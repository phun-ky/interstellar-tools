[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayGalaxyInterface

# Interface: DisplayGalaxyInterface

Defined in:
[celestial-bodies/display.ts:389](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L389)

How to draw a **galaxy**.

## Properties

### armCount

```ts
armCount: number;
```

Defined in:
[celestial-bodies/display.ts:399](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L399)

How many spiral arms; 0 for ellipticals and irregulars.

---

### armPitch?

```ts
armPitch?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:401](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L401)

The arms' pitch angle: the smaller, the tighter they wind.

---

### barLength?

```ts
barLength?: number;
```

Defined in:
[celestial-bodies/display.ts:403](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L403)

The bar's length, as a share of the disk's radius, 0–1.

---

### bulgeColor

```ts
bulgeColor: string;
```

Defined in:
[celestial-bodies/display.ts:391](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L391)

The bulge's colour.

---

### bulgeRadius?

```ts
bulgeRadius?: number;
```

Defined in:
[celestial-bodies/display.ts:405](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L405)

The bulge's radius, as a share of the disk's radius, 0–1.

---

### diskColor

```ts
diskColor: string;
```

Defined in:
[celestial-bodies/display.ts:393](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L393)

The disk's colour.

---

### dust?

```ts
dust?: number;
```

Defined in:
[celestial-bodies/display.ts:409](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L409)

How strong the dust lanes are, 0–1.

---

### dustColor?

```ts
dustColor?: string;
```

Defined in:
[celestial-bodies/display.ts:397](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L397)

The colour of the dust lanes.

---

### ellipticity?

```ts
ellipticity?: number;
```

Defined in:
[celestial-bodies/display.ts:407](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L407)

An elliptical's axis ratio, b/a, 0–1.

---

### starFormingColor?

```ts
starFormingColor?: string;
```

Defined in:
[celestial-bodies/display.ts:395](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L395)

The colour of star-forming knots in the arms.
