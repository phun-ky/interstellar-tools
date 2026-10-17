<script setup lang="ts">
/**
 * Drag eccentricity and mean anomaly, and see the mean, eccentric and true
 * anomaly side by side. The maths comes from @interstellar-tools/equations.
 * Use it in Markdown as <OrbitWidget :e="0.5" :mean-deg="60" />.
 */
import {
  eccentricToTrueAnomaly,
  solveKepler
} from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{ e?: number; meanDeg?: number }>(), {
  e: 0.5,
  meanDeg: 60
});

const e = ref(props.e);
const meanDeg = ref(props.meanDeg);

// Drawing: semi-major axis in px, Sun (the focus) fixed in place
const A = 150;
const SUN = { x: 300, y: 170 };
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => ((((r * 180) / Math.PI) % 360) + 360) % 360;

const state = computed(() => {
  const M = rad(meanDeg.value) as Radians;
  const E = solveKepler(M, e.value);
  const nu = eccentricToTrueAnomaly(E, e.value);
  const b = A * Math.sqrt(1 - e.value ** 2);
  const cx = SUN.x - A * e.value;

  return {
    M,
    E,
    nu,
    b,
    cx,
    r: 1 - e.value * Math.cos(E),
    body: { x: cx + A * Math.cos(E), y: SUN.y - b * Math.sin(E) },
    onCircle: { x: cx + A * Math.cos(E), y: SUN.y - A * Math.sin(E) },
    mean: { x: cx + A * Math.cos(M), y: SUN.y - A * Math.sin(M) }
  };
});
</script>

<template>
  <figure class="mc-orbit">
    <figcaption class="mc-orbit__head">
      <span class="mc-orbit__tag">Live</span>
      <span>Kepler's equation <var>M = E - e·sin E</var></span>
    </figcaption>

    <svg viewBox="0 0 460 340" role="img" aria-label="Orbit diagram">
      <!-- auxiliary circle and the orbit -->
      <circle :cx="state.cx" :cy="SUN.y" :r="A" class="mc-orbit__aux" />
      <ellipse
        :cx="state.cx"
        :cy="SUN.y"
        :rx="A"
        :ry="state.b"
        class="mc-orbit__path"
      />
      <line
        :x1="state.cx - A - 10"
        :x2="state.cx + A + 10"
        :y1="SUN.y"
        :y2="SUN.y"
        class="mc-orbit__axis"
      />
      <!-- eccentric anomaly: from the centre to the circle, then down -->
      <line
        :x1="state.cx"
        :y1="SUN.y"
        :x2="state.onCircle.x"
        :y2="state.onCircle.y"
        class="mc-orbit__ecc"
      />
      <line
        :x1="state.onCircle.x"
        :y1="state.onCircle.y"
        :x2="state.body.x"
        :y2="state.body.y"
        class="mc-orbit__drop"
      />
      <!-- true anomaly: from the Sun to the body -->
      <line
        :x1="SUN.x"
        :y1="SUN.y"
        :x2="state.body.x"
        :y2="state.body.y"
        class="mc-orbit__true"
      />
      <circle
        :cx="state.mean.x"
        :cy="state.mean.y"
        r="5"
        class="mc-orbit__mean"
      />
      <circle
        :cx="state.onCircle.x"
        :cy="state.onCircle.y"
        r="3.5"
        class="mc-orbit__eccdot"
      />
      <circle :cx="SUN.x" :cy="SUN.y" r="9" class="mc-orbit__sun" />
      <circle
        :cx="state.body.x"
        :cy="state.body.y"
        r="6"
        class="mc-orbit__body"
      />
    </svg>

    <div class="mc-orbit__controls">
      <label>
        <span>Eccentricity <var>e</var></span>
        <input v-model.number="e" type="range" min="0" max="0.8" step="0.01" />
        <output>{{ e.toFixed(2) }}</output>
      </label>
      <label>
        <span>Mean anomaly <var>M</var></span>
        <input
          v-model.number="meanDeg"
          type="range"
          min="0"
          max="359"
          step="1"
        />
        <output>{{ meanDeg }}°</output>
      </label>
    </div>

    <dl class="mc-orbit__readout">
      <div>
        <dt><i class="sw sw--mean" />Mean <var>M</var></dt>
        <dd>{{ deg(state.M).toFixed(1) }}°</dd>
      </div>
      <div>
        <dt><i class="sw sw--ecc" />Eccentric <var>E</var></dt>
        <dd>{{ deg(state.E).toFixed(1) }}°</dd>
      </div>
      <div>
        <dt><i class="sw sw--true" />True <var>ν</var></dt>
        <dd>{{ deg(state.nu).toFixed(1) }}°</dd>
      </div>
      <div>
        <dt>Distance <var>r / a</var></dt>
        <dd>{{ state.r.toFixed(3) }}</dd>
      </div>
    </dl>
  </figure>
</template>

<style scoped>
.mc-orbit {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-orbit__head {
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

/* Symbols keep their case: uppercase would turn ν into N and e into E */
var {
  font-style: normal;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--mc-text);
}

.mc-orbit__tag {
  white-space: nowrap;
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-orbit__aux {
  fill: none;
  stroke: var(--mc-line);
  stroke-dasharray: 3 5;
}

.mc-orbit__path {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 1.5;
}

.mc-orbit__axis {
  stroke: var(--mc-grid-strong);
}

.mc-orbit__ecc,
.mc-orbit__drop {
  stroke: var(--mc-muted);
  stroke-dasharray: 4 4;
}

.mc-orbit__true {
  stroke: var(--mc-teal);
}

.mc-orbit__mean {
  fill: none;
  stroke: var(--mc-amber-fill);
  stroke-width: 2;
}

.mc-orbit__eccdot {
  fill: var(--mc-muted);
}

.mc-orbit__sun {
  fill: var(--mc-amber-fill);
  filter: drop-shadow(0 0 6px var(--mc-amber-fill));
}

.mc-orbit__body {
  fill: var(--mc-teal);
  filter: drop-shadow(0 0 5px var(--mc-teal));
}

.mc-orbit__controls {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-orbit__controls label {
  display: grid;
  grid-template-columns: 9.5em 1fr 4em;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-orbit__controls input {
  accent-color: var(--mc-teal);
}

.mc-orbit__controls output {
  text-align: right;
  color: var(--mc-text);
}

.mc-orbit__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-orbit__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-orbit__readout div:last-child {
  border-right: 0;
}

.mc-orbit__readout dt {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-orbit__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  color: var(--mc-text);
}

.sw {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.sw--mean {
  border: 2px solid var(--mc-amber-fill);
}

.sw--ecc {
  background: var(--mc-muted);
}

.sw--true {
  background: var(--mc-teal);
}

@media (max-width: 640px) {
  .mc-orbit__readout {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
