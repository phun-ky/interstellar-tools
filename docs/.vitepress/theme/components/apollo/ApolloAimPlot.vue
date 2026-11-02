<script setup lang="ts">
/**
 * Aiming for the Moon: a hyperbola at Apollo 11's 1.08 km/s, for any aim
 * distance (the offset of the incoming asymptote from the Moon's centre).
 * The Moon's gravity bends every path in, so the aim is wider than the miss.
 * The aim before and after the midcourse correction is marked. Use it in
 * Markdown as <ApolloAimPlot />.
 */
import {
  asymptoteTrueAnomaly,
  hyperbolicPeriapsisSpeed,
  hyperbolicSemiMajorAxis
} from '@interstellar-tools/equations';
import { computed, ref } from 'vue';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
// v∞ from 3775 ft/s at 33 823 n mi (Mission Director's Summary Report)
const V_INF = 1080;
const A = hyperbolicSemiMajorAxis(V_INF, MU_MOON);
// Aim for the pericynthion before (180.8 n mi) and after (61.5 n mi) the
// midcourse correction (Mission Report Table 7-III)
const aimFor = (rp: number) => Math.sqrt(rp * rp - 2 * A * rp);
const MARKS = [
  { label: 'Before MCC', b: aimFor(R_MOON + 180.8 * 1852) },
  { label: 'After MCC', b: aimFor(R_MOON + 61.5 * 1852) }
];
const HIT = aimFor(R_MOON);

const aimKm = ref(Math.round(MARKS[1].b / 1000));

const flyby = computed(() => {
  const b = aimKm.value * 1000;
  // b = |a| √(e² − 1)
  const e = Math.sqrt(1 + (b / A) ** 2);
  const rp = -A * (e - 1);
  const nuInf = asymptoteTrueAnomaly(e);

  return {
    b,
    e,
    rp,
    impact: rp <= R_MOON,
    turn: ((2 * nuInf - Math.PI) * 180) / Math.PI,
    speed: hyperbolicPeriapsisSpeed(V_INF, rp, MU_MOON)
  };
});

// Drawing: 1 px = 75 km, the incoming asymptote horizontal, left to right
const W = 640;
const H = 300;
const KM_PER_PX = 75;
const CX = 380;
const CY = 110;
const R_VIEW = 40_000_000;

const toScreen = (x: number, y: number) =>
  `${(CX + x / 1000 / KM_PER_PX).toFixed(1)} ${(CY + y / 1000 / KM_PER_PX).toFixed(1)}`;

const path = computed(() => {
  const { e, impact } = flyby.value;
  const p = -A * (e * e - 1);
  const nuInf = asymptoteTrueAnomaly(e);
  // Rotate so the velocity far out on the way in points along +x
  const turn = Math.atan2(e - 1 / e, Math.sin(nuInf));
  const [c, s] = [Math.cos(-turn), Math.sin(-turn)];
  const nuFrom = -Math.acos((p / R_VIEW - 1) / e);
  const nuTo = impact ? -Math.acos(Math.min(1, (p / R_MOON - 1) / e)) : -nuFrom;
  const points: string[] = [];

  for (let k = 0; k <= 200; k++) {
    const nu = nuFrom + ((nuTo - nuFrom) * k) / 200;
    const r = p / (1 + e * Math.cos(nu));
    const x = r * Math.cos(nu);
    const y = r * Math.sin(nu);

    // SVG's y points down, so the path passes above the Moon and bends down
    points.push(`${k ? 'L' : 'M'}${toScreen(c * x - s * y, s * x + c * y)}`);
  }

  return points.join(' ');
});

const aimY = computed(() => CY - flyby.value.b / 1000 / KM_PER_PX);
const markY = (b: number) => CY - b / 1000 / KM_PER_PX;
</script>

<template>
  <figure class="mc-aim">
    <figcaption class="mc-aim__head">
      <span class="mc-aim__tag">Live</span>
      <span>Aiming for the Moon at 1.08 km/s</span>
    </figcaption>

    <svg
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      :aria-label="
        flyby.impact
          ? `Aimed ${aimKm} km from the Moon's centre, the spacecraft hits the Moon.`
          : `Aimed ${aimKm} km from the Moon's centre, the spacecraft passes ${((flyby.rp - R_MOON) / 1000).toFixed(0)} km above the surface and turns ${flyby.turn.toFixed(0)} degrees.`
      "
    >
      <line x1="0" :x2="CX" :y1="aimY" :y2="aimY" class="mc-aim__asymptote" />
      <line :x1="CX" :x2="CX" :y1="CY" :y2="aimY" class="mc-aim__offset" />
      <text :x="CX + 6" :y="(CY + aimY) / 2 + 4" class="mc-aim__label">
        aim {{ aimKm.toLocaleString('en-US').replace(/,/g, ' ') }} km
      </text>
      <g v-for="m in MARKS" :key="m.label">
        <line
          x1="0"
          x2="14"
          :y1="markY(m.b)"
          :y2="markY(m.b)"
          class="mc-aim__mark"
        />
        <text
          x="18"
          :y="markY(m.b) + (m.label === 'After MCC' ? 12 : -4)"
          class="mc-aim__label mc-aim__label--mark"
        >
          {{ m.label }}
        </text>
      </g>
      <circle
        :cx="CX"
        :cy="CY"
        :r="HIT / 1000 / KM_PER_PX"
        class="mc-aim__capture"
      />
      <circle
        :cx="CX"
        :cy="CY"
        :r="R_MOON / 1000 / KM_PER_PX"
        class="mc-aim__moon"
      />
      <path
        :d="path"
        :class="['mc-aim__path', { 'mc-aim__path--impact': flyby.impact }]"
      />
      <text :x="W - 12" :y="H - 12" text-anchor="end" class="mc-aim__label">
        Dashed ring: aim inside it and you hit the Moon
      </text>
    </svg>

    <dl class="mc-aim__readout" aria-live="polite">
      <div>
        <dt>Closest</dt>
        <dd v-if="flyby.impact">Impact</dd>
        <dd v-else>{{ ((flyby.rp - R_MOON) / 1000).toFixed(0) }} km up</dd>
      </div>
      <div>
        <dt>Eccentricity</dt>
        <dd>{{ flyby.e.toFixed(2) }}</dd>
      </div>
      <div>
        <dt>Turned</dt>
        <dd>{{ flyby.impact ? '—' : `${flyby.turn.toFixed(0)}°` }}</dd>
      </div>
      <div>
        <dt>Speed there</dt>
        <dd>
          {{ flyby.impact ? '—' : `${(flyby.speed / 1000).toFixed(2)} km/s` }}
        </dd>
      </div>
    </dl>

    <div class="mc-aim__controls">
      <label>
        <span>Aim distance</span>
        <input
          v-model.number="aimKm"
          type="range"
          min="3000"
          max="8000"
          step="1"
        />
        <output>{{ aimKm }} km</output>
      </label>
    </div>
  </figure>
</template>

<style scoped>
.mc-aim {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-aim__head {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--mc-line);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

.mc-aim__tag {
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-aim__asymptote {
  stroke: var(--mc-grid-strong);
  stroke-dasharray: 4 4;
}

.mc-aim__offset {
  stroke: var(--mc-faint);
}

.mc-aim__mark {
  stroke: var(--mc-amber);
  stroke-width: 2;
}

.mc-aim__capture {
  fill: none;
  stroke: var(--mc-red);
  stroke-dasharray: 3 4;
}

.mc-aim__moon {
  fill: var(--mc-bg-3);
  stroke: var(--mc-muted);
}

.mc-aim__path {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 2;
}

.mc-aim__path--impact {
  stroke: var(--mc-red);
}

.mc-aim__label {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-aim__label--mark {
  fill: var(--mc-amber);
}

.mc-aim__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-aim__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-aim__readout div:last-child {
  border-right: 0;
}

.mc-aim__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-aim__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-aim__controls {
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-aim__controls label {
  display: grid;
  grid-template-columns: 9.5em 1fr 5.5em;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-aim__controls input {
  accent-color: var(--mc-teal);
}

.mc-aim__controls output {
  text-align: right;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-aim__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-aim__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-aim__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }

  .mc-aim__controls label {
    grid-template-columns: 1fr 5.5em;
  }

  .mc-aim__controls label span {
    grid-column: 1 / -1;
  }
}
</style>
