<script setup lang="ts">
/**
 * The Sun at Tranquility Base: a side view of the landing point, looking
 * north, with east to the right. The crew look down from the east along the
 * descent's mean 16°; the Sun's elevation is the slider. The planned 5–14°
 * window and Apollo 11's 10.8° come from Apollo by the Numbers. Use it in
 * Markdown as <ApolloSunPlot />.
 */
import { illuminationAngles } from '@interstellar-tools/maps';
import type { Vector3DTupleType } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

const LOOK = 16;
const WINDOW = [5, 14] as const;
const FLOWN = 10.8;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;
const towards = (deg: number): Vector3DTupleType => [
  Math.cos(toRad(deg)),
  0,
  Math.sin(toRad(deg))
];

const sun = ref(FLOWN);

const lighting = computed(() => {
  const { incidence, emission, phase } = illuminationAngles(
    [0, 0, 1],
    towards(sun.value),
    towards(LOOK)
  );

  return {
    incidence: toDeg(incidence),
    emission: toDeg(emission),
    phase: toDeg(phase),
    shadow: 1 / Math.tan(toRad(sun.value))
  };
});

const status = computed(() => {
  if (sun.value < WINDOW[0]) return 'Below the 5–14° window';

  if (sun.value <= WINDOW[1]) return 'Inside the 5–14° window';

  return 'Above the 5–14° window';
});

// Drawing: the landing point at P, rays of length L to the east (right)
const W = 640;
const H = 190;
const GROUND = 150;
const PX = 300;
const L = 230;
const ARC = 70;

const end = (deg: number, length = L) => ({
  x: PX + length * Math.cos(toRad(deg)),
  y: GROUND - length * Math.sin(toRad(deg))
});

const wedge = computed(() => {
  const [a, b] = WINDOW.map((deg) => end(deg));

  return `M${PX} ${GROUND} L${a.x.toFixed(1)} ${a.y.toFixed(1)} A${L} ${L} 0 0 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z`;
});

const phaseArc = computed(() => {
  const [lo, hi] = [Math.min(sun.value, LOOK), Math.max(sun.value, LOOK)];
  const a = end(lo, ARC);
  const b = end(hi, ARC);

  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${ARC} ${ARC} 0 0 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
});

const sunAt = computed(() => end(sun.value));
const eyeAt = end(LOOK);

// A boulder 12 px high and a crater 12 px deep; shadows fall to the west
const BOULDER = { x: 200, w: 14, h: 12 };
const CRATER = { x0: 30, x1: 130, depth: 12 };

// The strip of ground the boulder shades
const boulderShadow = computed(() => {
  const length = Math.min(BOULDER.h * lighting.value.shadow, BOULDER.x);

  return { x: BOULDER.x - length, width: length };
});

const CRATER_WIDTH = CRATER.x1 - CRATER.x0;

// The bowl, from the west rim (t = 0) to the east rim (t = 1)
const bowl = (t: number) => ({
  x: CRATER.x0 + t * CRATER_WIDTH,
  y: GROUND + 4 * CRATER.depth * t * (1 - t)
});

const craterFloor = `M${CRATER.x0} ${GROUND} Q${CRATER.x0 + CRATER_WIDTH / 2} ${GROUND + 2 * CRATER.depth} ${CRATER.x1} ${GROUND}`;
const surface = `M0 ${GROUND} L${craterFloor.slice(1)} L${W} ${GROUND} L${W} ${H} L0 ${H} Z`;

// The east rim shades the bowl's floor out to where the Sun's ray from the rim
// meets it: 4 d t (1 − t) = w (1 − t) tan(elevation)
const craterShadow = computed(() => {
  const t0 = (CRATER_WIDTH * Math.tan(toRad(sun.value))) / (4 * CRATER.depth);

  if (t0 >= 1) return '';

  const points = Array.from({ length: 21 }, (_, k) => {
    const { x, y } = bowl(t0 + ((1 - t0) * k) / 20);

    return `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return points.join(' ');
});
</script>

<template>
  <figure class="mc-sun">
    <figcaption class="mc-sun__head">
      <span class="mc-sun__tag">Live</span>
      <span>The Sun at Tranquility Base</span>
      <span class="mc-sun__status">{{ status }}</span>
    </figcaption>

    <svg
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      :aria-label="`With the Sun ${sun.toFixed(1)} degrees up, a boulder casts a shadow ${lighting.shadow.toFixed(1)} times its height, and the phase angle to a crew looking down at 16 degrees is ${lighting.phase.toFixed(1)} degrees.`"
    >
      <path :d="surface" class="mc-sun__surface" />
      <path :d="craterShadow" class="mc-sun__shade" />
      <rect
        :x="boulderShadow.x"
        :y="GROUND"
        :width="boulderShadow.width"
        height="4"
        class="mc-sun__shadow"
      />
      <rect
        :x="BOULDER.x"
        :y="GROUND - BOULDER.h"
        :width="BOULDER.w"
        :height="BOULDER.h"
        class="mc-sun__boulder"
      />
      <path
        :d="`M0 ${GROUND} L${craterFloor.slice(1)} L${W} ${GROUND}`"
        class="mc-sun__ground"
      />

      <path :d="wedge" class="mc-sun__window" />
      <text
        :x="PX + L"
        :y="GROUND + 18"
        text-anchor="end"
        class="mc-sun__label mc-sun__label--window"
      >
        5–14° window
      </text>

      <line
        :x1="PX"
        :y1="GROUND"
        :x2="eyeAt.x"
        :y2="eyeAt.y"
        class="mc-sun__sight"
      />
      <polygon
        :points="`${eyeAt.x},${eyeAt.y - 7} ${eyeAt.x - 7},${eyeAt.y + 5} ${eyeAt.x + 7},${eyeAt.y + 5}`"
        class="mc-sun__eagle"
      />
      <text
        :x="eyeAt.x - 10"
        :y="eyeAt.y - 10"
        text-anchor="end"
        class="mc-sun__label"
      >
        Line of sight 16°
      </text>

      <line
        :x1="PX"
        :y1="GROUND"
        :x2="sunAt.x"
        :y2="sunAt.y"
        class="mc-sun__ray"
      />
      <circle :cx="sunAt.x" :cy="sunAt.y" r="9" class="mc-sun__sun" />
      <text
        :x="sunAt.x + 16"
        :y="sunAt.y + 4"
        class="mc-sun__label mc-sun__label--sun"
      >
        Sun {{ sun.toFixed(1) }}°
      </text>

      <path :d="phaseArc" class="mc-sun__phase" />
      <circle :cx="PX" :cy="GROUND" r="3" class="mc-sun__point" />
      <text x="12" y="20" class="mc-sun__label">West</text>
      <text :x="W - 12" y="20" text-anchor="end" class="mc-sun__label">
        East
      </text>
    </svg>

    <dl class="mc-sun__readout" aria-live="polite">
      <div>
        <dt>Incidence</dt>
        <dd>{{ lighting.incidence.toFixed(1) }}°</dd>
      </div>
      <div>
        <dt>Emission</dt>
        <dd>{{ lighting.emission.toFixed(1) }}°</dd>
      </div>
      <div>
        <dt>Phase</dt>
        <dd>{{ lighting.phase.toFixed(1) }}°</dd>
      </div>
      <div>
        <dt>Shadow</dt>
        <dd>{{ lighting.shadow.toFixed(1) }} × height</dd>
      </div>
    </dl>

    <div class="mc-sun__controls">
      <label>
        <span>Sun elevation</span>
        <input v-model.number="sun" type="range" min="1" max="30" step="0.1" />
        <output>{{ sun.toFixed(1) }}°</output>
      </label>
    </div>
  </figure>
</template>

<style scoped>
.mc-sun {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-sun__head {
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

.mc-sun__tag {
  color: var(--mc-green);
  font-weight: 600;
}

.mc-sun__status {
  margin-left: auto;
  color: var(--mc-amber);
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-sun__window {
  fill: var(--mc-green);
  fill-opacity: 0.12;
  stroke: var(--mc-green);
  stroke-opacity: 0.4;
}

.mc-sun__sight {
  stroke: var(--mc-teal);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.mc-sun__eagle {
  fill: var(--mc-teal);
}

.mc-sun__ray {
  stroke: var(--mc-amber);
  stroke-width: 2;
}

.mc-sun__sun {
  fill: var(--mc-amber);
}

.mc-sun__phase {
  fill: none;
  stroke: var(--mc-red);
  stroke-width: 3;
}

.mc-sun__surface {
  fill: var(--mc-bg-3);
}

.mc-sun__ground {
  fill: none;
  stroke: var(--mc-muted);
  stroke-width: 1.5;
}

.mc-sun__shadow {
  fill: var(--mc-bg);
}

.mc-sun__shade {
  fill: none;
  stroke: var(--mc-bg);
  stroke-width: 8;
}

.mc-sun__boulder {
  fill: var(--mc-bg-3);
  stroke: var(--mc-muted);
}

.mc-sun__point {
  fill: var(--mc-text);
}

.mc-sun__label {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-sun__label--window {
  fill: var(--mc-green);
}

.mc-sun__label--sun {
  fill: var(--mc-amber);
}

.mc-sun__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-sun__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-sun__readout div:last-child {
  border-right: 0;
}

.mc-sun__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-sun__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-sun__controls {
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-sun__controls label {
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

.mc-sun__controls input {
  accent-color: var(--mc-amber);
}

.mc-sun__controls output {
  text-align: right;
  text-transform: none;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-sun__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-sun__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-sun__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }

  .mc-sun__controls label {
    grid-template-columns: 1fr 5.5em;
  }

  .mc-sun__controls label span {
    grid-column: 1 / -1;
  }
}
</style>
