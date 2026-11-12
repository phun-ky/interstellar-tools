[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingSystemInterface

# Interface: RingSystemInterface

Defined in:
[observations.ts:552](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L552)

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
[observations.ts:556](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L556)

Its named gaps.

---

### rings

```ts
rings: RingInterface[];
```

Defined in:
[observations.ts:554](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L554)

Its rings, from the inside out.

---

### shepherdIds?

```ts
shepherdIds?: string[];
```

Defined in:
[observations.ts:558](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L558)

Ids of the moons that shepherd or shape it.
