[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ProbeRecordInterface

# Interface: ProbeRecordInterface

Defined in:
[tracking.ts:436](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L436)

A probe in the `PROBES` dataset of `@interstellar-tools/tracking`: a deep-space
spacecraft, with what it is, where it's headed and a dated ephemeris.

::: info

- `near` and `destination` are ids from the body datasets of
  `@interstellar-tools/constants`, such as `'sun'` or `'europa'`, or a Lagrange
  point as the two bodies and the point, such as `'sun-earth-l2'`.
- `status` is as of the ephemeris's start.
- The ephemeris covers a limited span: outside it, fetch one from JPL Horizons
  with `horizonsId`.

:::

## Example

```ts
const jwst: ProbeRecordInterface = {
  id: 'jwst',
  name: 'James Webb Space Telescope',
  agencies: ['NASA', 'ESA', 'CSA'],
  launch: '2021-12-25',
  status: 'active',
  near: 'sun-earth-l2',
  horizonsId: '-170',
  ephemeris
};
```

## Properties

### agencies

```ts
agencies: readonly string[];
```

Defined in:
[tracking.ts:442](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L442)

The agencies that built and fly it, leading agency first.

---

### destination?

```ts
destination?: string;
```

Defined in:
[tracking.ts:450](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L450)

The body or Lagrange point it's on its way to, if it's still travelling there.

---

### ephemeris

```ts
ephemeris: EphemerisInterface;
```

Defined in:
[tracking.ts:454](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L454)

Positions and velocities from the Sun's centre, in the ICRF.

---

### horizonsId

```ts
horizonsId: string;
```

Defined in:
[tracking.ts:452](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L452)

Its id in JPL Horizons, for fetching a fresh ephemeris: `'-31'`.

---

### id

```ts
id: string;
```

Defined in:
[tracking.ts:438](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L438)

Stable id, in kebab case: `'voyager-1'`, `'jwst'`.

---

### launch

```ts
launch: string;
```

Defined in:
[tracking.ts:444](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L444)

Launch date, in UTC: `YYYY-MM-DD`.

---

### name

```ts
name: string;
```

Defined in:
[tracking.ts:440](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L440)

Common name: `'Voyager 1'`.

---

### near

```ts
near: string;
```

Defined in:
[tracking.ts:448](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L448)

The body or Lagrange point it's near, or orbits: `'sun'` for a probe in
interplanetary space.

---

### status

```ts
status: ProbeStatusType;
```

Defined in:
[tracking.ts:446](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L446)

Whether its mission still operates it.
