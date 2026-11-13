[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MissionVisitInterface

# Interface: MissionVisitInterface

Defined in:
[celestial-bodies/body-observations.ts:251](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L251)

A **spacecraft's visit** to a small body.

## Properties

### date

```ts
date: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:257](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L257)

When it arrived or passed.

---

### kind

```ts
kind: 'flyby' | 'orbiter' | 'lander' | 'impactor' | 'sample return';
```

Defined in:
[celestial-bodies/body-observations.ts:255](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L255)

What it did there.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/body-observations.ts:253](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L253)

The mission, such as `'OSIRIS-REx'`.
