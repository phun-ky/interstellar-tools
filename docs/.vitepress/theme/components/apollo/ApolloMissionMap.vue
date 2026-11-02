<script setup lang="ts">
/**
 * The Apollo 11 round trip on a schematic Earth–Moon map. Step through the
 * mission's events and see where the spacecraft was, with the flown numbers
 * from mission.ts. Distances are to scale; the path is drawn by hand until
 * the restricted three-body equations (#249) can compute it.
 * Use it in Markdown as <ApolloMissionMap />.
 */
import { computed, onMounted, ref } from 'vue';

import { EVENTS, type MapLeg } from './mission';

const props = withDefaults(defineProps<{ start?: number }>(), { start: 0 });

const index = ref(props.start);
const event = computed(() => EVENTS[index.value]);

// Drawing: Earth–Moon distance (384 400 km) is 590 px, so 1 px ≈ 651 km
const EARTH = { x: 150, y: 200 };
const MOON = { x: 740, y: 200 };
const KM_PER_PX = 384_400 / 590;
const RINGS = [100_000, 200_000, 300_000];
const SOI_KM = 66_100;

const OUT = 'M150 226 C 300 330, 560 60, 726 191';
const RET = 'M754 209 C 640 370, 320 340, 172 214';

const outPath = ref<SVGPathElement>();
const retPath = ref<SVGPathElement>();
const parkPath = ref<SVGCircleElement>();
const moonPath = ref<SVGCircleElement>();
const lengths = ref({ out: 0, ret: 0, park: 0, moon: 0 });

onMounted(() => {
  lengths.value = {
    out: outPath.value?.getTotalLength() ?? 0,
    ret: retPath.value?.getTotalLength() ?? 0,
    park: parkPath.value?.getTotalLength() ?? 0,
    moon: moonPath.value?.getTotalLength() ?? 0
  };
});

const pathFor = (leg: MapLeg) =>
  ({
    out: outPath.value,
    ret: retPath.value,
    park: parkPath.value,
    moon: moonPath.value
  })[leg as 'out' | 'ret' | 'park' | 'moon'];

const craft = computed(() => {
  // Read lengths so this recomputes once the paths have been measured
  void lengths.value;
  const [leg, t = 0] = event.value.where;

  if (leg === 'pad') return { x: EARTH.x, y: EARTH.y - 20 };
  if (leg === 'surface') return { x: MOON.x, y: MOON.y - 9 };

  const path = pathFor(leg);

  if (!path) return EARTH;

  const point = path.getPointAtLength(path.getTotalLength() * t);

  return { x: point.x, y: point.y };
});

const ORDER: Record<MapLeg, number> = {
  pad: 0,
  park: 1,
  out: 2,
  moon: 3,
  surface: 3,
  ret: 4
};

// How much of each leg has been flown, as a stroke-dashoffset
const flown = computed(() => {
  const [leg, t = 0] = event.value.where;
  const at = ORDER[leg];
  const fraction = (of: MapLeg) => {
    if (ORDER[of] < at) return 1;
    if (of === leg) return t;
    if (of === 'moon' && leg === 'surface') return 0.3;

    return 0;
  };
  const offset = (of: 'out' | 'ret' | 'moon') =>
    lengths.value[of] * (1 - fraction(of));

  return { out: offset('out'), ret: offset('ret'), moon: offset('moon') };
});
</script>

<template>
  <figure class="mc-map">
    <figcaption class="mc-map__head">
      <span class="mc-map__tag">Mission map</span>
      <span>Apollo 11 · 16–24 July 1969</span>
    </figcaption>

    <svg
      viewBox="0 0 900 400"
      role="img"
      :aria-label="`Earth–Moon map of the Apollo 11 trajectory. ${event.title}: ${event.position}.`"
    >
      <defs>
        <clipPath id="mc-map-clip">
          <rect x="0" y="0" width="900" height="400" />
        </clipPath>
      </defs>
      <g clip-path="url(#mc-map-clip)">
        <circle
          v-for="km in RINGS"
          :key="km"
          :cx="EARTH.x"
          :cy="EARTH.y"
          :r="km / KM_PER_PX"
          class="mc-map__ring"
        />
        <text
          v-for="km in RINGS"
          :key="`label-${km}`"
          :x="EARTH.x + km / KM_PER_PX - 4"
          :y="EARTH.y - 4"
          text-anchor="end"
          class="mc-map__label"
        >
          {{ (km / 1000).toFixed(0) }} 000 km
        </text>
        <circle
          :cx="EARTH.x"
          :cy="EARTH.y"
          :r="590"
          class="mc-map__moon-orbit"
        />
        <circle
          :cx="MOON.x"
          :cy="MOON.y"
          :r="SOI_KM / KM_PER_PX"
          class="mc-map__soi"
        />
        <text
          :x="MOON.x"
          :y="MOON.y - SOI_KM / KM_PER_PX - 8"
          text-anchor="middle"
          class="mc-map__label mc-map__label--soi"
        >
          Moon's sphere of influence
        </text>

        <circle
          ref="parkPath"
          :cx="EARTH.x"
          :cy="EARTH.y"
          r="26"
          class="mc-map__path"
        />
        <path ref="outPath" :d="OUT" class="mc-map__path" />
        <path ref="retPath" :d="RET" class="mc-map__path" />
        <circle
          ref="moonPath"
          :cx="MOON.x"
          :cy="MOON.y"
          r="16"
          class="mc-map__path"
        />

        <path
          :d="OUT"
          class="mc-map__flown"
          :stroke-dasharray="`${lengths.out} ${lengths.out}`"
          :stroke-dashoffset="flown.out"
        />
        <path
          :d="RET"
          class="mc-map__flown"
          :stroke-dasharray="`${lengths.ret} ${lengths.ret}`"
          :stroke-dashoffset="flown.ret"
        />
        <circle
          :cx="MOON.x"
          :cy="MOON.y"
          r="16"
          class="mc-map__flown"
          :stroke-dasharray="`${lengths.moon} ${lengths.moon}`"
          :stroke-dashoffset="flown.moon"
        />

        <circle :cx="EARTH.x" :cy="EARTH.y" r="20" class="mc-map__earth" />
        <circle :cx="MOON.x" :cy="MOON.y" r="9" class="mc-map__moon" />
        <text :x="EARTH.x" y="272" text-anchor="middle" class="mc-map__body">
          Earth
        </text>
        <text :x="MOON.x + 30" y="234" class="mc-map__body">Moon</text>

        <g
          class="mc-map__craft"
          :style="{ transform: `translate(${craft.x}px, ${craft.y}px)` }"
        >
          <circle r="11" class="mc-map__halo" />
          <circle r="4.5" class="mc-map__dot" />
        </g>

        <text x="890" y="390" text-anchor="end" class="mc-map__label">
          Distances to scale · bodies enlarged · path schematic
        </text>
      </g>
    </svg>

    <dl class="mc-map__readout" aria-live="polite">
      <div class="mc-map__event">
        <dt>Event</dt>
        <dd>{{ event.title }}</dd>
      </div>
      <div>
        <dt>GET</dt>
        <dd>{{ event.get }}</dd>
      </div>
      <div>
        <dt>Where</dt>
        <dd>{{ event.position }}</dd>
      </div>
      <div>
        <dt>Speed</dt>
        <dd>{{ event.speed }}</dd>
      </div>
    </dl>

    <div class="mc-map__controls">
      <button
        type="button"
        :disabled="index === 0"
        @click="index = Math.max(0, index - 1)"
      >
        ← Previous
      </button>
      <label>
        <span class="mc-map__sr">Mission event</span>
        <input
          v-model.number="index"
          type="range"
          min="0"
          :max="EVENTS.length - 1"
          step="1"
          :aria-valuetext="event.title"
        />
      </label>
      <button
        type="button"
        :disabled="index === EVENTS.length - 1"
        @click="index = Math.min(EVENTS.length - 1, index + 1)"
      >
        Next →
      </button>
    </div>
    <p class="mc-map__text">{{ event.text }}</p>
  </figure>
</template>

<style scoped>
.mc-map {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-map__head {
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

.mc-map__tag {
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-map__ring {
  fill: none;
  stroke: var(--mc-grid-strong);
}

.mc-map__moon-orbit {
  fill: none;
  stroke: var(--mc-line);
  stroke-dasharray: 1 5;
}

.mc-map__soi {
  fill: none;
  stroke: var(--mc-teal);
  stroke-opacity: 0.5;
  stroke-dasharray: 4 4;
}

.mc-map__label {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-map__label--soi {
  fill: var(--mc-teal);
}

.mc-map__body {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  fill: var(--mc-text);
}

.mc-map__path {
  fill: none;
  stroke: var(--mc-line);
  stroke-width: 1.5;
}

.mc-map__flown {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 2;
}

.mc-map__earth {
  fill: var(--mc-body);
  stroke: var(--mc-teal);
}

.mc-map__moon {
  fill: var(--mc-muted);
}

.mc-map__halo {
  fill: var(--mc-amber-soft);
  stroke: var(--mc-amber);
}

.mc-map__dot {
  fill: var(--mc-amber-fill);
  filter: drop-shadow(0 0 5px var(--mc-amber-fill));
}

@media (prefers-reduced-motion: no-preference) {
  .mc-map__craft {
    transition: transform 0.6s ease;
  }

  .mc-map__flown {
    transition: stroke-dashoffset 0.6s ease;
  }
}

.mc-map__readout {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.4fr 1fr;
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-map__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
  min-width: 0;
}

.mc-map__readout div:last-child {
  border-right: 0;
}

.mc-map__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-map__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-map__event dd {
  color: var(--mc-amber);
}

.mc-map__controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-map__controls button {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--mc-teal);
  background: var(--mc-teal-soft);
  border: 1px solid var(--mc-line);
  padding: 4px 10px;
  cursor: pointer;
}

.mc-map__controls button:disabled {
  opacity: 0.4;
  cursor: default;
}

.mc-map__controls input {
  width: 100%;
  accent-color: var(--mc-amber-fill);
}

.mc-map__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.vp-doc .mc-map__text {
  margin: 0;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--mc-line);
  font-size: 15px;
}

@media (max-width: 640px) {
  .mc-map__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-map__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-map__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }
}
</style>
