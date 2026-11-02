<script setup lang="ts">
/**
 * Apollo 11's entry as a ballistic body would have flown it: deceleration
 * against altitude, from ballisticEntrySpeed, in one exponential atmosphere.
 * Change the flight-path angle and the ballistic coefficient and watch the
 * peak: the angle sets how hard it is, the ballistic coefficient only where.
 * The flown 6.56 g is marked for comparison. Use it in Markdown as
 * <ApolloEntryPlot />.
 */
import {
  ballisticCoefficient,
  ballisticEntrySpeed,
  ballisticPeakDeceleration,
  ballisticPeakDecelerationAltitude,
  stagnationHeatFlux
} from '@interstellar-tools/equations';
import { computed, ref } from 'vue';

const G0 = 9.80665;
// Earth's atmosphere as one exponential
const RHO0 = 1.225;
const H = 7200;
// Entry interface: 400 000 ft, 36 194.4 ft/s, −6.48° (Mission Report Table 7-VII)
const H_EI = 121_920;
const VE = 11_032;
const FLOWN = { angle: 6.48, g: 6.56 };
// The CM at entry: 12 095.5 lb (Mission Report), hypersonic C_D 1.2891 on
// 129.35 ft² (TN D-6725, TN D-5399), heat shield radius 183.5 in (TN D-5399)
const BETA = Math.round(ballisticCoefficient(5486.4, 1.2891, 12.017));
const R_NOSE = 4.661;

const angle = ref(FLOWN.angle);
const beta = ref(BETA);

const profile = computed(() => {
  const gamma = (-angle.value * Math.PI) / 180;
  const points: { h: number; g: number; q: number; v: number }[] = [];

  for (let k = 0; k <= 244; k++) {
    const h = H_EI - k * 500;
    const v = ballisticEntrySpeed(h, VE, gamma, beta.value, RHO0, H);
    const rho = RHO0 * Math.exp(-h / H);

    points.push({
      h,
      v,
      g: (rho * v * v) / (2 * beta.value) / G0,
      q: stagnationHeatFlux(rho, v, R_NOSE)
    });
  }

  const hPeak = ballisticPeakDecelerationAltitude(gamma, beta.value, RHO0, H);

  return {
    points,
    peak: {
      g: ballisticPeakDeceleration(VE, gamma, H) / G0,
      h: hPeak,
      v: ballisticEntrySpeed(hPeak, VE, gamma, beta.value, RHO0, H)
    },
    heat: Math.max(...points.map((p) => p.q))
  };
});

// Drawing: deceleration across, altitude up, to a fixed scale
const W = 640;
const H_PX = 300;
const PAD = { l: 44, r: 16, t: 16, b: 34 };
const G_MAX = 60;
const KM_MAX = 125;
const px = (g: number) =>
  PAD.l + (Math.min(g, G_MAX) / G_MAX) * (W - PAD.l - PAD.r);
const py = (km: number) =>
  H_PX - PAD.b - (km / KM_MAX) * (H_PX - PAD.t - PAD.b);
const G_TICKS = [0, 10, 20, 30, 40, 50, 60];
const KM_TICKS = [0, 25, 50, 75, 100, 125];

const path = computed(() =>
  profile.value.points
    .map(
      (p, i) =>
        `${i ? 'L' : 'M'}${px(p.g).toFixed(1)} ${py(p.h / 1000).toFixed(1)}`
    )
    .join(' ')
);

const peak = computed(() => ({
  x: px(profile.value.peak.g),
  y: py(profile.value.peak.h / 1000)
}));
</script>

<template>
  <figure class="mc-entry">
    <figcaption class="mc-entry__head">
      <span class="mc-entry__tag">Live</span>
      <span>A ballistic entry at 11.03 km/s</span>
    </figcaption>

    <svg
      :viewBox="`0 0 ${W} ${H_PX}`"
      role="img"
      :aria-label="`Deceleration against altitude for a ballistic entry at ${angle.toFixed(2)} degrees. It peaks at ${profile.peak.g.toFixed(1)} g, ${(profile.peak.h / 1000).toFixed(1)} km up; Apollo 11 felt ${FLOWN.g} g.`"
    >
      <g v-for="g in G_TICKS" :key="`g${g}`">
        <line
          :x1="px(g)"
          :x2="px(g)"
          :y1="py(0)"
          :y2="py(KM_MAX)"
          class="mc-entry__grid"
        />
        <text
          :x="px(g)"
          :y="H_PX - 14"
          text-anchor="middle"
          class="mc-entry__label"
        >
          {{ g }}
        </text>
      </g>
      <g v-for="km in KM_TICKS" :key="`km${km}`">
        <line
          :x1="px(0)"
          :x2="px(G_MAX)"
          :y1="py(km)"
          :y2="py(km)"
          class="mc-entry__grid"
        />
        <text
          :x="PAD.l - 8"
          :y="py(km) + 4"
          text-anchor="end"
          class="mc-entry__label"
        >
          {{ km }}
        </text>
      </g>
      <text
        :x="W - PAD.r"
        :y="H_PX - 2"
        text-anchor="end"
        class="mc-entry__label"
      >
        Deceleration, g
      </text>
      <text
        :x="PAD.l - 8"
        :y="PAD.t - 4"
        text-anchor="end"
        class="mc-entry__label"
      >
        km
      </text>

      <line
        :x1="px(FLOWN.g)"
        :x2="px(FLOWN.g)"
        :y1="py(0)"
        :y2="py(KM_MAX)"
        class="mc-entry__flown"
      />
      <text
        :x="px(FLOWN.g) + 6"
        :y="py(KM_MAX) + 12"
        class="mc-entry__label mc-entry__label--flown"
      >
        Flown: {{ FLOWN.g }} g
      </text>

      <path :d="path" class="mc-entry__curve" />
      <circle :cx="peak.x" :cy="peak.y" r="5" class="mc-entry__peak" />
    </svg>

    <dl class="mc-entry__readout" aria-live="polite">
      <div>
        <dt>Peak</dt>
        <dd>{{ profile.peak.g.toFixed(1) }} g</dd>
      </div>
      <div>
        <dt>At</dt>
        <dd>{{ (profile.peak.h / 1000).toFixed(1) }} km</dd>
      </div>
      <div>
        <dt>Speed there</dt>
        <dd>{{ (profile.peak.v / 1000).toFixed(2) }} km/s</dd>
      </div>
      <div>
        <dt>Peak heating</dt>
        <dd>{{ (profile.heat / 1e6).toFixed(2) }} MW/m²</dd>
      </div>
    </dl>

    <div class="mc-entry__controls">
      <label>
        <span>Entry angle</span>
        <input
          v-model.number="angle"
          type="range"
          min="3"
          max="10"
          step="0.01"
        />
        <output>−{{ angle.toFixed(2) }}°</output>
      </label>
      <label>
        <span>Ballistic coef.</span>
        <input
          v-model.number="beta"
          type="range"
          min="100"
          max="1000"
          step="2"
        />
        <output>{{ beta }} kg/m²</output>
      </label>
    </div>
  </figure>
</template>

<style scoped>
.mc-entry {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-entry__head {
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

.mc-entry__tag {
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-entry__grid {
  stroke: var(--mc-line);
}

.mc-entry__flown {
  stroke: var(--mc-amber);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}

.mc-entry__curve {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 2;
}

.mc-entry__peak {
  fill: var(--mc-teal);
  filter: drop-shadow(0 0 5px var(--mc-teal));
}

.mc-entry__label {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-entry__label--flown {
  fill: var(--mc-amber);
}

.mc-entry__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-entry__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-entry__readout div:last-child {
  border-right: 0;
}

.mc-entry__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-entry__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-entry__controls {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-entry__controls label {
  display: grid;
  grid-template-columns: 9.5em 1fr 6.5em;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-entry__controls input {
  accent-color: var(--mc-teal);
}

.mc-entry__controls output {
  text-align: right;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-entry__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-entry__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-entry__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }

  .mc-entry__controls label {
    grid-template-columns: 1fr 6.5em;
  }

  .mc-entry__controls label span {
    grid-column: 1 / -1;
  }
}
</style>
