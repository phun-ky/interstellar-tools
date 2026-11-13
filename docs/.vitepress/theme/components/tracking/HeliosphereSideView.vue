<script setup lang="ts">
/**
 * The heliosphere side on, the interstellar wind from the left, with the
 * paths of the probes leaving it. The bubble, the wind's direction and the
 * Voyagers' crossings come from HELIOSPHERE in the constants package; the paths, from launch to 2027, from probe-paths.json (JPL
 * Horizons). The heliopause is a Rankine half-body, the shape a steady flow
 * makes round a source, sized by the heliopause's distance to the nose; the
 * termination shock is drawn only on the side the Voyagers crossed it. Use
 * it in Markdown as <HeliosphereSideView>caption</HeliosphereSideView>.
 */
import { HELIOSPHERE } from '@interstellar-tools/constants';
import { PROBES } from '@interstellar-tools/tracking';
import { computed } from 'vue';

import PATHS from './probe-paths.json';

type Vector = [number, number, number];
type Point = [number, number];

const WIDTH = 720;
const HEIGHT = 450;
// Pixels per au, and where the Sun is drawn
const SCALE = 0.99;
const SUN: Point = [225, 225];
// The probes, in the order of their colours
const IDS = [
  'voyager-1',
  'voyager-2',
  'pioneer-10',
  'pioneer-11',
  'new-horizons'
] as const;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const ecliptic = (longitude: number, latitude: number): Vector => [
  Math.cos(rad(latitude)) * Math.cos(rad(longitude)),
  Math.cos(rad(latitude)) * Math.sin(rad(longitude)),
  Math.sin(rad(latitude))
];
const dot = (a: Vector, b: Vector) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const line = (points: Point[]) =>
  `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`;
const onCanvas = ([x, y]: Point) =>
  x >= -40 && x <= WIDTH + 40 && y >= -40 && y <= HEIGHT + 40;
const astrosphere = HELIOSPHERE;
// The axes of the view: towards the nose, and north square to it
const upwind = ecliptic(
  astrosphere.upwind!.eclipticLongitude,
  astrosphere.upwind!.eclipticLatitude
);
const north = (() => {
  const raw: Vector = [
    -upwind[2] * upwind[0],
    -upwind[2] * upwind[1],
    1 - upwind[2] * upwind[2]
  ];
  const length = Math.hypot(...raw);

  return raw.map((x) => x / length) as Vector;
})();
// au towards the nose and north, to the drawing's pixels
const toScreen = (along: number, across: number): Point => [
  SUN[0] - along * SCALE,
  SUN[1] - across * SCALE
];
const project = (v: Vector): Point => toScreen(dot(v, upwind), dot(v, north));
// A Rankine half-body b au to the nose, φ from the nose: r = b φ / sin φ
const halfBody = (b: number, maxDegrees: number) => {
  const upper: Point[] = [];
  const lower: Point[] = [];

  for (let degrees = 0; degrees <= maxDegrees; degrees += 0.5) {
    const phi = rad(degrees);
    const r = degrees === 0 ? b : (b * phi) / Math.sin(phi);

    upper.push(toScreen(r * Math.cos(phi), r * Math.sin(phi)));
    lower.push(toScreen(r * Math.cos(phi), -r * Math.sin(phi)));
  }

  return { upper, lower };
};
const crossings = astrosphere.crossings!.map((crossing) => {
  const direction = ecliptic(
    crossing.direction!.eclipticLongitude,
    crossing.direction!.eclipticLatitude
  );

  return {
    ...crossing,
    name:
      PROBES.find((probe) => probe.id === crossing.probeId)?.name ??
      crossing.probeId,
    point: project(direction.map((x) => x * crossing.distance.value) as Vector),
    phi: Math.acos(dot(direction, upwind))
  };
});
// The termination shock's size, fitted to where the Voyagers crossed it
const shocks = crossings.filter(
  ({ boundary }) => boundary === 'termination shock'
);
const shockNose =
  shocks.reduce(
    (sum, { distance, phi }) => sum + (distance.value * Math.sin(phi)) / phi,
    0
  ) / shocks.length;
const pauseNose = astrosphere.astropause!.nose!.value;
const drawing = computed(() => {
  const pause = halfBody(pauseNose, 170);
  const upper = pause.upper.filter(onCanvas);
  const lower = pause.lower.filter(onCanvas);
  const shock = halfBody(shockNose, 110);
  // The interstellar gas's streamlines round the half-body: y + b θ = C
  const flow = [14, 40, 75, 120, 175].flatMap((offset) =>
    [1, -1].map((sign) => {
      const points: Point[] = [];

      for (let i = 399; i >= 1; i--) {
        const theta = (i / 400) * Math.PI;
        const y = pauseNose * Math.PI + offset - pauseNose * theta;

        points.push(toScreen(-y / Math.tan(theta), sign * y));
      }

      const visible = points.filter(onCanvas);
      const middle = Math.floor(visible.length / 3);

      return {
        d: line(visible),
        arrow: line(visible.slice(middle, middle + 2))
      };
    })
  );
  // The probes' paths, and their names, nudged apart
  const placed: Point[] = [];
  const probes = IDS.map((id, k) => {
    const points = (PATHS.probes as Record<string, number[][]>)[id]!.map(
      ([, x, y, z]) => project([x!, y!, z!])
    );
    const end = points[points.length - 1]!;

    return {
      id,
      name: PROBES.find((probe) => probe.id === id)?.name ?? id,
      colour: k + 1,
      d: line(points),
      end
    };
  })
    .sort((a, b) => a.end[1] - b.end[1])
    .map((probe) => {
      const left = probe.end[0] < SUN[0];
      const x = probe.end[0] + (left ? -11 : 11);
      let y = probe.end[1] + 4;

      while (
        placed.some(
          ([px, py]) => Math.abs(py - y) < 15 && Math.abs(px - x) < 90
        )
      )
        y += 15;

      placed.push([x, y]);

      return { ...probe, label: { x, y, anchor: left ? 'end' : 'start' } };
    });
  const nose = toScreen(pauseNose, 0);
  const shockEnd = shock.lower[shock.lower.length - 1]!;

  return {
    sheath: `${line([...upper, ...lower.reverse()])} Z`,
    pauseUpper: line(upper),
    pauseLower: line(pause.lower.filter(onCanvas)),
    shock: line([...shock.upper.reverse(), ...shock.lower]),
    shockLabel: { x: shockEnd[0] + 8, y: shockEnd[1] + 4 },
    flow,
    probes,
    nose,
    sheathLabel: toScreen(-140, 95),
    scaleBar: { x: WIDTH - 20 - 100 * SCALE, y: HEIGHT - 22 }
  };
});
const windSpeed = astrosphere.inflowSpeed!.value;
</script>

<template>
  <figure class="hsv">
    <svg
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      role="img"
      aria-label="The heliosphere side on: a bubble blunt towards the interstellar wind on the left and trailing a tail to the right, with Voyager 1 leaving it to the north and Voyager 2 to the south"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hsv-sheath" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" class="hsv__sheath-stop" stop-opacity="1" />
          <stop offset="0.75" class="hsv__sheath-stop" stop-opacity="0.35" />
          <stop offset="1" class="hsv__sheath-stop" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="hsv-tail" x1="0" x2="1">
          <stop offset="0" class="hsv__pause-stop" stop-opacity="1" />
          <stop offset="1" class="hsv__pause-stop" stop-opacity="0" />
        </linearGradient>
        <marker
          id="hsv-flow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path class="hsv__flow" d="M1,1 L7,4 L1,7" />
        </marker>
      </defs>
      <rect class="hsv__space" :width="WIDTH" :height="HEIGHT" />
      <g v-for="(stream, k) in drawing.flow" :key="`flow-${k}`">
        <path class="hsv__flow" :d="stream.d" />
        <path class="hsv__flow" :d="stream.arrow" marker-end="url(#hsv-flow)" />
      </g>
      <path class="hsv__sheath" :d="drawing.sheath" />
      <path class="hsv__pause" :d="drawing.pauseUpper" />
      <path class="hsv__pause" :d="drawing.pauseLower" />
      <path class="hsv__shock" :d="drawing.shock" />
      <circle class="hsv__orbit" :cx="SUN[0]" :cy="SUN[1]" :r="30 * SCALE" />
      <circle class="hsv__sun" :cx="SUN[0]" :cy="SUN[1]" r="5" />
      <g
        v-for="probe in drawing.probes"
        :key="probe.id"
        :class="`hsv__probe hsv__probe--${probe.colour}`"
      >
        <path :d="probe.d">
          <title>{{ probe.name }}</title>
        </path>
        <circle :cx="probe.end[0]" :cy="probe.end[1]" r="3.6" />
        <text
          :x="probe.label.x"
          :y="probe.label.y"
          :text-anchor="probe.label.anchor"
        >
          {{ probe.name }}
        </text>
      </g>
      <g
        v-for="crossing in crossings"
        :key="`${crossing.probeId}-${crossing.boundary}`"
      >
        <circle
          :class="
            crossing.boundary === 'astropause'
              ? 'hsv__crossed-pause'
              : 'hsv__crossed-shock'
          "
          :cx="crossing.point[0]"
          :cy="crossing.point[1]"
          r="5"
        >
          <title>
            {{ crossing.name }} crossed the
            {{
              crossing.boundary === 'astropause'
                ? 'heliopause'
                : 'termination shock'
            }}
            in {{ crossing.date.getUTCFullYear() }},
            {{ crossing.distance.value }} au out
          </title>
        </circle>
        <text
          class="hsv__year"
          :x="crossing.point[0] + 10"
          :y="crossing.point[1] + (crossing.point[1] < SUN[1] ? -4 : 14)"
        >
          {{ crossing.date.getUTCFullYear() }}
        </text>
      </g>
      <text class="hsv__region" x="24" y="34">Interstellar medium</text>
      <text class="hsv__note" x="24" y="52">
        The galaxy’s gas, blowing past at {{ windSpeed }} km/s
      </text>
      <text
        class="hsv__region hsv__region--small"
        :x="SUN[0] + 10"
        :y="SUN[1] + 46"
      >
        Solar wind
      </text>
      <text class="hsv__note" :x="SUN[0] + 10" :y="SUN[1] + 62">
        Neptune’s orbit, 30 au
      </text>
      <text
        class="hsv__region hsv__region--small"
        :x="drawing.sheathLabel[0]"
        :y="drawing.sheathLabel[1]"
      >
        Heliosheath
      </text>
      <text
        class="hsv__region hsv__region--small"
        :x="WIDTH - 24"
        :y="SUN[1] + 4"
        text-anchor="end"
      >
        Heliotail →
      </text>
      <text
        class="hsv__note"
        :x="drawing.nose[0] - 8"
        :y="drawing.nose[1] + 30"
        text-anchor="end"
      >
        Heliopause
      </text>
      <text
        class="hsv__note"
        :x="drawing.nose[0] - 8"
        :y="drawing.nose[1] + 45"
        text-anchor="end"
      >
        {{ pauseNose }} au at the nose
      </text>
      <text
        class="hsv__note hsv__note--shock"
        :x="drawing.shockLabel.x"
        :y="drawing.shockLabel.y"
      >
        Termination shock, where crossed
      </text>
      <path
        class="hsv__scale"
        :d="`M${drawing.scaleBar.x},${drawing.scaleBar.y} h${100 * SCALE}`"
      />
      <text
        class="hsv__note"
        :x="drawing.scaleBar.x + 50 * SCALE"
        :y="drawing.scaleBar.y - 8"
        text-anchor="middle"
      >
        100 au
      </text>
    </svg>
    <div class="hsv__key">
      <span
        ><svg viewBox="0 0 22 12" aria-hidden="true">
          <circle class="hsv__crossed-shock" cx="11" cy="6" r="4.5" /></svg
        >Crossed the termination shock</span
      >
      <span
        ><svg viewBox="0 0 22 12" aria-hidden="true">
          <circle class="hsv__crossed-pause" cx="11" cy="6" r="4.5" /></svg
        >Crossed the heliopause</span
      >
      <span
        ><svg viewBox="0 0 22 12" aria-hidden="true">
          <path class="hsv__flow" d="M1,6 H21" /></svg
        >Interstellar gas, flowing round the bubble</span
      >
    </div>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.hsv {
  --hsv-space: #edf1f7;
  --hsv-sheath: #c9d8ef;
  --hsv-flow: #a3b2c6;
  --hsv-pause: #2a58a0;
  --hsv-shock: #96600c;
  --hsv-sun: #e3a300;
  --hsv-probe-1: #0072b2;
  --hsv-probe-2: #d55e00;
  --hsv-probe-3: #00866a;
  --hsv-probe-4: #b8588f;
  --hsv-probe-5: #9a6a00;

  margin: 16px 0;
}
.dark .hsv {
  --hsv-space: #070b12;
  --hsv-sheath: #1b3256;
  --hsv-flow: #34445c;
  --hsv-pause: #8db3f2;
  --hsv-shock: #e6b65f;
  --hsv-sun: #ffd45c;
  --hsv-probe-1: #56b4e9;
  --hsv-probe-2: #f08a4b;
  --hsv-probe-3: #3cc59a;
  --hsv-probe-4: #e3a2c8;
  --hsv-probe-5: #f0c050;
}
.hsv > svg {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.hsv__space {
  fill: var(--hsv-space);
}
.hsv__sheath-stop {
  stop-color: var(--hsv-sheath);
}
.hsv__pause-stop {
  stop-color: var(--hsv-pause);
}
.hsv__sheath {
  fill: url(#hsv-sheath);
  stroke: none;
}
.hsv__pause {
  fill: none;
  stroke: url(#hsv-tail);
  stroke-width: 2.4;
}
.hsv__shock {
  fill: none;
  stroke: var(--hsv-shock);
  stroke-width: 1.6;
  stroke-dasharray: 4 4;
}
.hsv__flow {
  fill: none;
  stroke: var(--hsv-flow);
  stroke-width: 1.2;
}
.hsv__orbit {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.hsv__sun {
  fill: var(--hsv-sun);
}
.hsv__probe path {
  fill: none;
  stroke-width: 2.2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.hsv__probe text {
  font-family: var(--vp-font-family-base);
  font-size: 12.5px;
  font-weight: 600;
  fill: var(--vp-c-text-1);
}
.hsv__probe--1 path {
  stroke: var(--hsv-probe-1);
}
.hsv__probe--1 circle {
  fill: var(--hsv-probe-1);
}
.hsv__probe--2 path {
  stroke: var(--hsv-probe-2);
}
.hsv__probe--2 circle {
  fill: var(--hsv-probe-2);
}
.hsv__probe--3 path {
  stroke: var(--hsv-probe-3);
}
.hsv__probe--3 circle {
  fill: var(--hsv-probe-3);
}
.hsv__probe--4 path {
  stroke: var(--hsv-probe-4);
}
.hsv__probe--4 circle {
  fill: var(--hsv-probe-4);
}
.hsv__probe--5 path {
  stroke: var(--hsv-probe-5);
}
.hsv__probe--5 circle {
  fill: var(--hsv-probe-5);
}
.hsv__crossed-shock {
  fill: var(--hsv-space);
  stroke: var(--hsv-shock);
  stroke-width: 2.2;
}
.hsv__crossed-pause {
  fill: var(--hsv-pause);
  stroke: var(--hsv-space);
  stroke-width: 1.6;
}
.hsv__year {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  fill: var(--vp-c-text-2);
}
.hsv__region {
  font-family: var(--vp-font-family-base);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--vp-c-text-1);
}
.hsv__region--small {
  font-size: 12px;
  fill: var(--vp-c-text-2);
}
.hsv__note {
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  fill: var(--vp-c-text-2);
}
.hsv__note--shock {
  fill: var(--hsv-shock);
}
.hsv__scale {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}
.hsv__key {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 10px;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}
.hsv__key span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.hsv__key svg {
  width: 22px;
  height: 12px;
}
figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
