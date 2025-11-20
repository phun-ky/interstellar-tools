# Equations

[[toc]]

## Manoeuvres

Example usage of: `hohmannTransfer`, `hohmannSemiMajorAxis`,
`hohmannTransferTime`

### Essentials

```typescript
import {
  hohmannTransfer,
  hohmannSemiMajorAxis,
  hohmannTransferTime
} from '@interstellar-tools/equations';

// Earth’s standard gravitational parameter (μ), m^3/s^2
const muEarth = 3.986004418e14;
```

### LEO → GEO Hohmann transfer (raise)

```typescript
const rLEO = 6378e3 + 400e3; // Earth radius + 400 km (m)
const rGEO = 42164e3; // GEO radius (m)
const raise = hohmannTransfer(rLEO, rGEO, muEarth);

console.log('LEO → GEO');
console.log('at (m)        :', raise.at.toFixed(0));
console.log('Δv1 (m/s)     :', raise.dv1.toFixed(2), raise.dir1); // prograde
console.log('Δv2 (m/s)     :', raise.dv2.toFixed(2), raise.dir2); // prograde
console.log('ΔvTotal (m/s) :', raise.dvTotal.toFixed(2));
console.log('tTransfer (h) :', (raise.tTransfer / 3600).toFixed(2));

// Optionally via convenience helpers:
const at = hohmannSemiMajorAxis(rLEO, rGEO);
const tTransfer = hohmannTransferTime(rLEO, rGEO, muEarth);

console.log('at (from helper)       :', at.toFixed(0));
console.log('tTransfer (from helper):', (tTransfer / 3600).toFixed(2));
```

### Higher → Lower circular orbit (retrograde burns)

```typescript
const rHigh = 12000e3; // m
const rLow = 7000e3; // m
const lower = hohmannTransfer(rHigh, rLow, muEarth);

console.log('\nHigh → Low');
console.log('Δv1 (m/s) :', lower.dv1.toFixed(2), lower.dir1); // retrograde
console.log('Δv2 (m/s) :', lower.dv2.toFixed(2), lower.dir2); // retrograde
console.log('ΔvTotal   :', lower.dvTotal.toFixed(2));
```

### Degenerate case (no change): r1 == r2

```typescript
const rSame = rLEO;
const noop = hohmannTransfer(rSame, rSame, muEarth);

console.log('\nNo-op (same orbit)');
console.log('Δv1, Δv2, ΔvTotal:', noop.dv1, noop.dv2, noop.dvTotal); // all ~0
console.log('dirs:', noop.dir1, noop.dir2); // both 'none'
console.log(
  'tTransfer (half period):',
  (noop.tTransfer / 60).toFixed(2),
  'min'
);
```
