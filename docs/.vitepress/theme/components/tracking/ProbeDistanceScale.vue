<script setup lang="ts">
/**
 * How far is far: the planets, the Kuiper belt, the heliosphere's two
 * boundaries and the probes leaving it, on one logarithmic scale, with how
 * long each probe's signal takes to reach us. The planets and the belt come
 * from PLANETS and ASTEROID_BELTS, the boundaries from the Voyagers'
 * crossings in HELIOSPHERE, and the probes from
 * PROBES with stateAt, on `date`. Use it in Markdown as
 * <ProbeDistanceScale>caption</ProbeDistanceScale>.
 */
import {
  ASTEROID_BELTS,
  AU_METERS,
  HELIOSPHERE,
  PLANETS,
  SPEED_OF_LIGHT_M_PER_S
} from '@interstellar-tools/constants';
import { PROBES, stateAt } from '@interstellar-tools/tracking';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** When to put the probes, within PROBES' ephemerides */
    date?: string;
  }>(),
  { date: '2026-11-05T00:00:00Z' }
);

const WIDTH = 680;
const HEIGHT = 350;
const LEFT = 28;
const RIGHT = 28;
const AXIS = 250;
// The scale runs from 0.3 to 400 au
const LOW = Math.log10(0.3);
const HIGH = Math.log10(400);
const IDS = [
  'voyager-1',
  'voyager-2',
  'pioneer-10',
  'pioneer-11',
  'new-horizons'
] as const;
const x = (au: number) =>
  LEFT + ((Math.log10(au) - LOW) / (HIGH - LOW)) * (WIDTH - LEFT - RIGHT);
const lightTime = (au: number) => {
  const minutes = (au * AU_METERS) / SPEED_OF_LIGHT_M_PER_S / 60;

  if (minutes < 10) return `${minutes.toFixed(1)} light-min`;

  return minutes < 90
    ? `${Math.round(minutes)} light-min`
    : `${(minutes / 60).toFixed(1)} light-h`;
};
const crossings = HELIOSPHERE.crossings!;
const span = (boundary: string) => {
  const distances = crossings
    .filter((crossing) => crossing.boundary === boundary)
    .map(({ distance }) => distance.value);

  return [Math.min(...distances), Math.max(...distances)] as const;
};
const shock = span('termination shock');
const pause = span('astropause');
const kuiper = ASTEROID_BELTS.find(({ id }) => id === 'kuiper-belt')!;
const planets = PLANETS.filter(
  ({ category, parent }) => category === 'planet' && parent === 'sun'
).map(({ name, orbit }, k) => ({
  name,
  a: orbit.a.value,
  x: x(orbit.a.value),
  // Alternate the names between two rows, so neighbours don't collide
  y: AXIS + (k % 2 ? 60 : 76)
}));
const drawing = computed(() => {
  const when = new Date(props.date);
  const probes = IDS.map((id, k) => {
    const probe = PROBES.find((candidate) => candidate.id === id)!;
    const au = Math.hypot(...stateAt(probe.ephemeris, when).r) / AU_METERS;
    const hours = (au * AU_METERS) / SPEED_OF_LIGHT_M_PER_S / 3600;
    const whole = Math.floor(hours);

    return {
      id,
      name: probe.name,
      colour: k + 1,
      au,
      x: x(au),
      signal: `${whole} h ${String(Math.round((hours - whole) * 60)).padStart(2, '0')} m`
    };
  })
    // The farthest on the top row, each name to the left of its stem
    .sort((a, b) => b.au - a.au)
    .map((probe, row) => ({ ...probe, y: 60 + 40 * row }));

  return {
    probes,
    day: when.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    })
  };
});
</script>

<template>
  <figure class="pds">
    <svg
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      role="img"
      :aria-label="`The planets, the Kuiper belt, the heliosphere's boundaries and five probes on one logarithmic scale of distance from the Sun, on ${drawing.day}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="pds__shock"
        :x="x(shock[0])"
        y="40"
        :width="x(shock[1]) - x(shock[0])"
        :height="AXIS - 40"
      />
      <rect
        class="pds__beyond"
        :x="x(pause[0])"
        y="40"
        :width="WIDTH - RIGHT - x(pause[0])"
        :height="AXIS - 40"
      />
      <rect
        class="pds__kuiper"
        :x="x(kuiper.innerRadius.value)"
        :y="AXIS - 10"
        :width="x(kuiper.outerRadius.value) - x(kuiper.innerRadius.value)"
        height="20"
        rx="3"
      />
      <path class="pds__axis" :d="`M${LEFT},${AXIS} H${WIDTH - RIGHT}`" />
      <text
        class="pds__note"
        :x="(x(shock[0]) + x(shock[1])) / 2"
        y="32"
        text-anchor="middle"
      >
        termination shock
      </text>
      <text class="pds__note" :x="WIDTH - RIGHT - 6" y="58" text-anchor="end">
        interstellar
      </text>
      <text class="pds__note" :x="WIDTH - RIGHT - 6" y="72" text-anchor="end">
        space
      </text>
      <g v-for="au in [1, 10, 100]" :key="au">
        <path class="pds__axis" :d="`M${x(au)},${AXIS} v8`" />
        <text class="pds__tick" :x="x(au)" :y="AXIS + 24" text-anchor="middle">
          {{ au }} au
        </text>
        <text
          class="pds__tick pds__tick--dim"
          :x="x(au)"
          :y="AXIS + 40"
          text-anchor="middle"
        >
          {{ lightTime(au) }}
        </text>
      </g>
      <g v-for="planet in planets" :key="planet.name">
        <circle class="pds__planet" :cx="planet.x" :cy="AXIS" r="4">
          <title>{{ planet.name }}, {{ planet.a }} au</title>
        </circle>
        <text
          class="pds__tick"
          :x="planet.x"
          :y="planet.y"
          text-anchor="middle"
        >
          {{ planet.name }}
        </text>
      </g>
      <text
        class="pds__tick"
        :x="x((kuiper.innerRadius.value + kuiper.outerRadius.value) / 2)"
        :y="AXIS + 92"
        text-anchor="middle"
      >
        {{ kuiper.name }}
      </text>
      <circle class="pds__sun" :cx="x(0.3) + 2" :cy="AXIS" r="6" />
      <g
        v-for="probe in drawing.probes"
        :key="probe.id"
        :class="`pds__probe pds__probe--${probe.colour}`"
      >
        <path :d="`M${probe.x},${AXIS} V${probe.y + 8}`" />
        <circle :cx="probe.x" :cy="AXIS" r="4.5" />
        <text class="pds__name" :x="probe.x - 8" :y="probe.y" text-anchor="end">
          {{ probe.name }}
        </text>
        <text
          class="pds__tick"
          :x="probe.x - 8"
          :y="probe.y + 15"
          text-anchor="end"
        >
          {{ probe.au.toFixed(1) }} au · signal {{ probe.signal }}
        </text>
      </g>
    </svg>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.pds {
  --pds-shock: rgba(150, 96, 12, 0.12);
  --pds-beyond: rgba(42, 88, 160, 0.08);
  --pds-kuiper: #b9c7d8;
  --pds-sun: #e3a300;
  --pds-probe-1: #0072b2;
  --pds-probe-2: #d55e00;
  --pds-probe-3: #00866a;
  --pds-probe-4: #b8588f;
  --pds-probe-5: #9a6a00;

  margin: 16px 0;
}
.dark .pds {
  --pds-shock: rgba(230, 182, 95, 0.12);
  --pds-beyond: rgba(141, 179, 242, 0.08);
  --pds-kuiper: #2c3a50;
  --pds-sun: #ffd45c;
  --pds-probe-1: #56b4e9;
  --pds-probe-2: #f08a4b;
  --pds-probe-3: #3cc59a;
  --pds-probe-4: #e3a2c8;
  --pds-probe-5: #f0c050;
}
.pds > svg {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.pds__shock {
  fill: var(--pds-shock);
}
.pds__beyond {
  fill: var(--pds-beyond);
}
.pds__kuiper {
  fill: var(--pds-kuiper);
}
.pds__axis {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}
.pds__planet {
  fill: var(--vp-c-text-2);
}
.pds__sun {
  fill: var(--pds-sun);
}
.pds__note {
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  fill: var(--vp-c-text-2);
}
.pds__tick {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  fill: var(--vp-c-text-2);
}
.pds__tick--dim {
  opacity: 0.75;
}
.pds__name {
  font-family: var(--vp-font-family-base);
  font-size: 12.5px;
  font-weight: 600;
  fill: var(--vp-c-text-1);
}
.pds__probe path {
  fill: none;
  stroke-width: 1.5;
}
.pds__probe--1 path {
  stroke: var(--pds-probe-1);
}
.pds__probe--1 circle {
  fill: var(--pds-probe-1);
}
.pds__probe--2 path {
  stroke: var(--pds-probe-2);
}
.pds__probe--2 circle {
  fill: var(--pds-probe-2);
}
.pds__probe--3 path {
  stroke: var(--pds-probe-3);
}
.pds__probe--3 circle {
  fill: var(--pds-probe-3);
}
.pds__probe--4 path {
  stroke: var(--pds-probe-4);
}
.pds__probe--4 circle {
  fill: var(--pds-probe-4);
}
.pds__probe--5 path {
  stroke: var(--pds-probe-5);
}
.pds__probe--5 circle {
  fill: var(--pds-probe-5);
}
figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
