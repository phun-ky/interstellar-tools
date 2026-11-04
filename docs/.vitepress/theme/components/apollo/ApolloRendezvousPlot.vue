<script setup lang="ts">
/**
 * Apollo 11's rendezvous seen from the command module: the LM's coelliptic
 * drift after CDH, then the terminal phase from TPI to TPF. The path comes
 * from cwPropagate and the TPI burn from cwTwoImpulseTransfer. Drag the time,
 * or change how far behind the LM was at TPI and watch both burns change.
 * Use it in Markdown as <ApolloRendezvousPlot />.
 */
import {
  cwPropagate,
  cwTwoImpulseTransfer,
  meanMotion
} from '@interstellar-tools/equations';
import type { CwState } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

const MU_MOON = 4.902800118e12; // m³/s²
const R_MOON = 1_737_400; // m
const NM = 1852; // m
// The CSM in 62 × 56 n mi, the LM coelliptic in 47.4 × 42.1 n mi (Mission Report)
const n = meanMotion(R_MOON + 59 * NM, MU_MOON);
const DH = (59 - (47.4 + 42.1) / 2) * NM;
// CDH at 126:17:49.6, TPI at 127:03:51.8, TPF at 127:46:09.8 (Apollo by the Numbers)
const T_DRIFT = 2762.2;
const T_TERMINAL = 2538;
const GET_CDH = 126 * 3600 + 17 * 60 + 49.6;

const behindKm = ref(46.5);
const t = ref(T_DRIFT);

const plan = computed(() => {
  const D = behindKm.value * 1000;
  // Coelliptic: DH below, drifting forward at 1.5 n DH
  const atTpi: CwState = [-DH, -D, 0, 0, 1.5 * n * DH, 0];
  const atCdh = cwPropagate(atTpi, n, -T_DRIFT);
  const { dv1, dv2 } = cwTwoImpulseTransfer(
    atTpi,
    [0, 0, 0, 0, 0, 0],
    n,
    T_TERMINAL
  );
  const afterTpi: CwState = [
    atTpi[0],
    atTpi[1],
    atTpi[2],
    atTpi[3] + dv1[0],
    atTpi[4] + dv1[1],
    atTpi[5] + dv1[2]
  ];

  return { atCdh, atTpi, afterTpi, dv1, dv2 };
});

const stateAt = (time: number): CwState => {
  const { atCdh, afterTpi } = plan.value;

  return time <= T_DRIFT
    ? cwPropagate(atCdh, n, time)
    : cwPropagate(afterTpi, n, time - T_DRIFT);
};

const samples = computed(() => {
  const points: { y: number; x: number }[] = [];

  for (let k = 0; k <= 240; k++) {
    const s = stateAt(((T_DRIFT + T_TERMINAL) * k) / 240);

    points.push({ y: s[1] / 1000, x: s[0] / 1000 });
  }

  return points;
});

// Drawing: along-track horizontal, radial up; bounds follow the path
const W = 640;
const H = 300;
const PAD = 36;
const view = computed(() => {
  const ys = samples.value.map((p) => p.y);
  const xs = samples.value.map((p) => p.x);
  const yMin = Math.min(...ys, 0) - 5;
  const yMax = Math.max(...ys, 0) + 5;
  const xMin = Math.min(...xs, 0) - 4;
  const xMax = Math.max(...xs, 0) + 4;

  return {
    px: (y: number) => PAD + ((y - yMin) / (yMax - yMin)) * (W - 2 * PAD),
    py: (x: number) => H - PAD - ((x - xMin) / (xMax - xMin)) * (H - 2 * PAD),
    yMin,
    yMax,
    exaggeration:
      (W - 2 * PAD) / (yMax - yMin) / ((H - 2 * PAD) / (xMax - xMin))
  };
});

const path = (from: number, to: number) =>
  samples.value
    .slice(from, to + 1)
    .map(
      (p, i) =>
        `${i ? 'L' : 'M'}${view.value.px(p.y).toFixed(1)} ${view.value.py(p.x).toFixed(1)}`
    )
    .join(' ');

const split = Math.round((240 * T_DRIFT) / (T_DRIFT + T_TERMINAL));
const drift = computed(() => path(0, split));
const terminal = computed(() => path(split, 240));

const now = computed(() => {
  const s = stateAt(t.value);

  return {
    x: view.value.px(s[1] / 1000),
    y: view.value.py(s[0] / 1000),
    range: Math.hypot(s[0], s[1], s[2]) / 1000,
    below: -s[0] / 1000,
    behind: -s[1] / 1000
  };
});

const marks = computed(() => {
  const { atCdh, atTpi } = plan.value;

  return [
    { label: 'CDH', y: atCdh[1] / 1000, x: atCdh[0] / 1000 },
    { label: 'TPI', y: atTpi[1] / 1000, x: atTpi[0] / 1000 },
    { label: 'TPF', y: 0, x: 0 }
  ].map((m) => ({ ...m, px: view.value.px(m.y), py: view.value.py(m.x) }));
});

const get = computed(() => {
  const s = Math.round(GET_CDH + t.value);
  const pad = (k: number) => String(k).padStart(2, '0');

  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
});

const speed = (v: readonly number[]) => Math.hypot(...v).toFixed(2);
</script>

<template>
  <figure class="mc-rdv">
    <figcaption class="mc-rdv__head">
      <span class="mc-rdv__tag">Live</span>
      <span>The LM seen from the command module</span>
    </figcaption>

    <svg
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      :aria-label="`The LM's path relative to the command module. At GET ${get} it is ${now.range.toFixed(1)} km away.`"
    >
      <line
        :x1="PAD"
        :x2="W - PAD"
        :y1="view.py(0)"
        :y2="view.py(0)"
        class="mc-rdv__axis"
      />
      <text :x="PAD" :y="view.py(0) - 8" class="mc-rdv__label">
        CSM's orbit · direction of motion →
      </text>
      <path :d="drift" class="mc-rdv__drift" />
      <path :d="terminal" class="mc-rdv__terminal" />
      <g v-for="m in marks" :key="m.label">
        <circle :cx="m.px" :cy="m.py" r="3.5" class="mc-rdv__mark" />
        <text
          :x="m.px"
          :y="m.label === 'TPF' ? m.py - 12 : m.py + 18"
          text-anchor="middle"
          class="mc-rdv__label"
        >
          {{ m.label }}
        </text>
      </g>
      <circle :cx="view.px(0)" :cy="view.py(0)" r="6" class="mc-rdv__csm" />
      <circle :cx="now.x" :cy="now.y" r="5" class="mc-rdv__lm" />
      <text :x="W - PAD" :y="H - 10" text-anchor="end" class="mc-rdv__label">
        Radial scale × {{ view.exaggeration.toFixed(1) }}
      </text>
    </svg>

    <dl class="mc-rdv__readout" aria-live="polite">
      <div>
        <dt>GET</dt>
        <dd>{{ get }}</dd>
      </div>
      <div>
        <dt>Range</dt>
        <dd>{{ now.range.toFixed(1) }} km</dd>
      </div>
      <div>
        <dt>TPI burn</dt>
        <dd>{{ speed(plan.dv1) }} m/s</dd>
      </div>
      <div>
        <dt>TPF burn</dt>
        <dd>{{ speed(plan.dv2) }} m/s</dd>
      </div>
    </dl>

    <div class="mc-rdv__controls">
      <label>
        <span>Time since CDH</span>
        <input
          v-model.number="t"
          type="range"
          min="0"
          :max="T_DRIFT + T_TERMINAL"
          step="10"
        />
        <output>{{ Math.round(t / 60) }} min</output>
      </label>
      <label>
        <span>Behind at TPI</span>
        <input
          v-model.number="behindKm"
          type="range"
          min="30"
          max="75"
          step="0.5"
        />
        <output>{{ behindKm.toFixed(1) }} km</output>
      </label>
    </div>
  </figure>
</template>

<style scoped>
.mc-rdv {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-rdv__head {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--mc-line);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

.mc-rdv__tag {
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-rdv__axis {
  stroke: var(--mc-grid-strong);
  stroke-dasharray: 4 4;
}

.mc-rdv__drift {
  fill: none;
  stroke: var(--mc-muted);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}

.mc-rdv__terminal {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 2;
}

.mc-rdv__mark {
  fill: var(--mc-bg-2);
  stroke: var(--mc-amber);
  stroke-width: 1.5;
}

.mc-rdv__csm {
  fill: var(--mc-teal);
  filter: drop-shadow(0 0 5px var(--mc-teal));
}

.mc-rdv__lm {
  fill: var(--mc-amber-fill);
  filter: drop-shadow(0 0 5px var(--mc-amber-fill));
}

.mc-rdv__label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-rdv__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-rdv__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-rdv__readout div:last-child {
  border-right: 0;
}

.mc-rdv__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-rdv__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 1.125rem;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-rdv__controls {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-rdv__controls label {
  display: grid;
  grid-template-columns: 9.5em 1fr 5em;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-rdv__controls input {
  accent-color: var(--mc-teal);
}

.mc-rdv__controls output {
  text-align: right;
  text-transform: none;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-rdv__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-rdv__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-rdv__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }

  .mc-rdv__controls label {
    grid-template-columns: 1fr 4.5em;
  }

  .mc-rdv__controls label span {
    grid-column: 1 / -1;
  }
}
</style>
