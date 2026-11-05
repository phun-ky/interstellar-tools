<script setup lang="ts">
/**
 * Three orbits of the ISS's ground track on a flat world map, from the epoch
 * of the elements in the tracking package's SATELLITES snapshot, drawn with
 * the package's own groundTrack and equirectangular, so the picture can't
 * drift from the code. Each orbit's northbound equator crossing is marked,
 * 23.6° west of the one before. Use it in Markdown as
 * <IssGroundTrack>caption</IssGroundTrack>.
 */
import { equirectangular } from '@interstellar-tools/maps';
import {
  groundTrack,
  parseOmm,
  SATELLITES,
  subSatellitePoint
} from '@interstellar-tools/tracking';
import type { Radians } from '@interstellar-tools/types';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** A place to mark, in degrees */
    lat?: number;
    lon?: number;
    place?: string;
  }>(),
  { lat: -1.2864, lon: 36.8172, place: 'Nairobi' }
);

const WIDTH = 640;
const HEIGHT = 320;
const ORBITS = 3;
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (radians: number) => (radians * 180) / Math.PI;
// The map in the SVG's pixels: R = 1 puts x and y in radians
const at = (phi: number, lambda: number) => {
  const { x, y } = equirectangular(phi as Radians, lambda as Radians, 1);

  return {
    x: ((x + Math.PI) / (2 * Math.PI)) * WIDTH,
    y: ((Math.PI / 2 - y) / Math.PI) * HEIGHT
  };
};
const iss = parseOmm(SATELLITES.find(({ id }) => id === 'iss')!.omm);
const STEP = 30_000;

// The times the ISS crosses the equator heading north, from just before the
// epoch: the line between two steps either side, where the latitude is 0
const crossings = (count: number): Date[] => {
  const found: Date[] = [];

  let t = iss.epoch.getTime() - STEP;
  let before = subSatellitePoint(iss, new Date(t)).phi;

  while (found.length < count) {
    const after = subSatellitePoint(iss, new Date(t + STEP)).phi;

    if (before < 0 && after >= 0)
      found.push(new Date(t + (STEP * -before) / (after - before)));

    t += STEP;
    before = after;
  }

  return found;
};

const drawing = computed(() => {
  const times = crossings(ORBITS + 1);
  const orbits = Array.from({ length: ORBITS }, (_, k) => {
    const start = times[k]!;
    const end = times[k + 1]!;
    const node = subSatellitePoint(iss, start);
    const point = at(node.phi, node.lambda);

    return {
      d: groundTrack(iss, start, end, STEP / 1000)
        .map((segment) =>
          segment
            .map(({ phi, lambda }, i) => {
              const { x, y } = at(phi, lambda);

              return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ')
        )
        .join(' '),
      node: { ...point, label: `${Math.abs(deg(node.lambda)).toFixed(1)}° W` }
    };
  });
  const lines: string[] = [];

  for (let lon = -180; lon <= 180; lon += 30) {
    const top = at(rad(90), rad(lon));
    const bottom = at(rad(-90), rad(lon));

    lines.push(`M${top.x} ${top.y} V${bottom.y}`);
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    if (lat === 0) continue;

    const { y } = at(rad(lat), 0);

    lines.push(`M0 ${y} H${WIDTH}`);
  }

  return {
    orbits,
    graticule: lines.join(' '),
    equator: at(0, 0).y,
    place: at(rad(props.lat), rad(props.lon))
  };
});
</script>

<template>
  <figure class="igt">
    <svg
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      role="img"
      aria-label="Three orbits of the ISS's ground track on a world map, each crossing the equator further west than the one before"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="igt__frame"
        x="0.5"
        y="0.5"
        :width="WIDTH - 1"
        :height="HEIGHT - 1"
      />
      <path class="igt__grid" :d="drawing.graticule" />
      <path class="igt__equator" :d="`M0 ${drawing.equator} H${WIDTH}`" />
      <g
        v-for="(orbit, k) in drawing.orbits"
        :key="k"
        :class="`igt__orbit igt__orbit--${k + 1}`"
      >
        <path :d="orbit.d" />
        <circle :cx="orbit.node.x" :cy="orbit.node.y" r="4" />
        <text
          :x="orbit.node.x"
          :y="orbit.node.y + 20 + 16 * k"
          text-anchor="middle"
        >
          {{ k + 1 }}: {{ orbit.node.label }}
        </text>
      </g>
      <circle
        class="igt__place"
        :cx="drawing.place.x"
        :cy="drawing.place.y"
        r="4"
      />
      <text
        class="igt__label"
        :x="drawing.place.x + 8"
        :y="drawing.place.y - 6"
      >
        {{ place }}
      </text>
    </svg>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.igt {
  margin: 16px 0;
}
svg {
  display: block;
  width: 100%;
  height: auto;
}
.igt__frame {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1;
}
.igt__grid {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-opacity: 0.5;
  stroke-width: 1;
}
.igt__equator {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-dasharray: 4 4;
  stroke-width: 1;
}
.igt__orbit path {
  fill: none;
  stroke-width: 2;
}
.igt__orbit text,
.igt__label {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}
.igt__orbit--1 path {
  stroke: var(--vp-c-brand-1);
}
.igt__orbit--1 circle,
.igt__orbit--1 text {
  fill: var(--vp-c-brand-1);
}
.igt__orbit--2 path {
  stroke: var(--vp-c-warning-1);
}
.igt__orbit--2 circle,
.igt__orbit--2 text {
  fill: var(--vp-c-warning-1);
}
.igt__orbit--3 path {
  stroke: var(--vp-c-text-2);
}
.igt__orbit--3 circle,
.igt__orbit--3 text {
  fill: var(--vp-c-text-2);
}
.igt__place {
  fill: var(--vp-c-text-1);
}
.igt__label {
  fill: var(--vp-c-text-1);
}
figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
