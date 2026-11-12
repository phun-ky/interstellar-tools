[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingSystemInterface

# Interface: RingSystemInterface

Defined in:
[observations.ts:555](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L555)

A planet's **ring system**, in its equator's plane.

## Example

```ts
const saturn: RingSystemInterface = {
  rings: [
    {
      name: 'A',
      innerRadius: { value: 122170, unit: 'km' },
      outerRadius: { value: 136775, unit: 'km' }
    }
  ]
};
```

## Properties

### gaps?

```ts
gaps?: RingGapInterface[];
```

Defined in:
[observations.ts:559](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L559)

Its named gaps.

---

### rings

```ts
rings: RingInterface[];
```

Defined in:
[observations.ts:557](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L557)

Its rings, from the inside out.

---

### shepherdIds?

```ts
shepherdIds?: string[];
```

Defined in:
[observations.ts:561](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L561)

Ids of the moons that shepherd or shape it.
