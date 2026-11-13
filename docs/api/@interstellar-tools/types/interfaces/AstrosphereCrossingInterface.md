[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrosphereCrossingInterface

# Interface: AstrosphereCrossingInterface

Defined in:
[celestial-bodies/body-observations.ts:571](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L571)

A **probe crossing** an astrosphere's boundary, as the Voyagers crossed the
Sun's.

## Properties

### boundary

```ts
boundary: AstrosphereBoundaryType;
```

Defined in:
[celestial-bodies/body-observations.ts:575](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L575)

Which boundary it crossed.

---

### date

```ts
date: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:577](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L577)

When it crossed.

---

### direction?

```ts
direction?: EclipticDirectionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:581](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L581)

Which way from the star it was.

---

### distance

```ts
distance: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:579](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L579)

How far from the star it was.

---

### probeId

```ts
probeId: string;
```

Defined in:
[celestial-bodies/body-observations.ts:573](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L573)

The probe's id, as in `PROBES` in `@interstellar-tools/tracking`.
