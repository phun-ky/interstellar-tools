[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MissionVisitInterface

# Interface: MissionVisitInterface

Defined in:
[celestial-bodies/body-observations.ts:248](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L248)

A **spacecraft's visit** to a small body.

## Properties

### date

```ts
date: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:254](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L254)

When it arrived or passed.

---

### kind

```ts
kind: 'flyby' | 'orbiter' | 'lander' | 'impactor' | 'sample return';
```

Defined in:
[celestial-bodies/body-observations.ts:252](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L252)

What it did there.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/body-observations.ts:250](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L250)

The mission, such as `'OSIRIS-REx'`.
