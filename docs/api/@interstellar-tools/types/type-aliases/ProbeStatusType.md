[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ProbeStatusType

# Type Alias: ProbeStatusType

```ts
type ProbeStatusType = 'active' | 'ended';
```

Defined in:
[tracking.ts:403](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L403)

Whether a space probe is still at work: `'active'` while its mission operates
it, `'ended'` once contact is lost or the mission is over. An ended probe keeps
flying: Pioneer 10 still coasts out of the Solar System.

## Example

```ts
const status: ProbeStatusType = 'ended'; // Pioneer 10, last heard from in 2003
```
