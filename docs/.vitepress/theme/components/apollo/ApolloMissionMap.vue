<script setup lang="ts">
/**
 * The Apollo 11 round trip on an Earth–Moon map, in the frame that turns with
 * the Moon. Step through the mission's events and see where the spacecraft
 * was, with the flown numbers from mission.ts. The path is a free return from
 * Apollo 11's TLI point, integrated with the restricted three-body equations:
 * the figure-eight that loops behind the Moon and back to Earth.
 * Use it in Markdown as <ApolloMissionMap />.
 */
import {
  cr3bpDerivatives,
  cr3bpUnits,
  rk4Integrate
} from '@interstellar-tools/equations';
import type { Cr3bpState } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

import { EVENTS, FREE_RETURN, type MapAt, type MapLeg } from './mission';

const props = withDefaults(defineProps<{ start?: number }>(), { start: 0 });

const index = ref(props.start);
const event = computed(() => EVENTS[index.value]);

// Drawing: Earth–Moon distance (384 400 km) is 590 px, so 1 px ≈ 651 km
const EARTH = { x: 150, y: 200 };
const MOON = { x: 740, y: 200 };
const SEPARATION_KM = 384_400;
const PX = 590;
const KM_PER_PX = SEPARATION_KM / PX;
const RINGS = [100_000, 200_000, 300_000];
const SOI_KM = 66_100;
// The bodies and their orbits are drawn enlarged
const PARK_PX = 26;
const LUNAR_ORBIT_PX = 16;

type Point = { x: number; y: number };

// The free return, integrated once: 13 200 RK4 steps, drawn to 0.04 px
const freeReturn = (() => {
  const { mu, speed, length } = cr3bpUnits(
    3.986004418e14,
    4.902800118e12,
    SEPARATION_KM * 1000
  );
  const th = (FREE_RETURN.angle * Math.PI) / 180;
  const fpa = (FREE_RETURN.fpa * Math.PI) / 180;
  const r = (6_378_137 + FREE_RETURN.altitude) / length;
  const v = FREE_RETURN.speed / speed;
  const [ux, uy] = [Math.cos(th), Math.sin(th)];
  const x = -mu + r * ux;
  const y = r * uy;
  // Inertial velocity, then into the rotating frame: subtract ω × r
  const vx = v * (Math.sin(fpa) * ux - Math.cos(fpa) * uy) + y;
  const vy = v * (Math.sin(fpa) * uy + Math.cos(fpa) * ux) - x;
  const { y: states } = rk4Integrate(
    (_t, s) => cr3bpDerivatives(s as unknown as Cr3bpState, mu),
    [x, y, 0, vx, vy, 0],
    0,
    FREE_RETURN.duration,
    13_200,
    { every: 10 }
  );
  // SVG's y points down; the Moon moves towards −y on screen, up the page
  const points = states.map(([sx, sy]) => ({
    x: EARTH.x + (sx + mu) * PX,
    y: EARTH.y - sy * PX
  }));
  const fromEarth = (p: Point) => Math.hypot(p.x - EARTH.x, p.y - EARTH.y);
  const fromMoon = (p: Point) => Math.hypot(p.x - MOON.x, p.y - MOON.y);
  let closest = 0;

  for (let k = 0; k < points.length; k++)
    if (fromMoon(points[k]) < fromMoon(points[closest])) closest = k;

  // Clip each leg to outside the enlarged parking and lunar orbits
  const out = points
    .slice(0, closest + 1)
    .filter((p) => fromEarth(p) >= PARK_PX && fromMoon(p) >= LUNAR_ORBIT_PX);
  const back = points.slice(closest);
  const home = back.findIndex(
    (p, k) =>
      k > 0 && fromEarth(p) < PARK_PX && fromEarth(back[k - 1]) >= PARK_PX
  );
  const ret = back
    .slice(0, home < 0 ? undefined : home)
    .filter((p) => fromMoon(p) >= LUNAR_ORBIT_PX);

  return { out, ret };
})();

const measure = (points: Point[]) => {
  const at = [0];

  for (let k = 1; k < points.length; k++)
    at.push(
      at[k - 1] +
        Math.hypot(points[k].x - points[k - 1].x, points[k].y - points[k - 1].y)
    );

  return at;
};

const legs = {
  out: { points: freeReturn.out, at: measure(freeReturn.out) },
  ret: { points: freeReturn.ret, at: measure(freeReturn.ret) }
};

const toPath = (points: Point[]) =>
  points
    .map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

const OUT = toPath(legs.out.points);
const RET = toPath(legs.ret.points);

const lengths = {
  out: legs.out.at[legs.out.at.length - 1],
  ret: legs.ret.at[legs.ret.at.length - 1],
  park: 2 * Math.PI * PARK_PX,
  moon: 2 * Math.PI * LUNAR_ORBIT_PX
};

// A fraction of a leg's length, from a fraction or a distance from the Moon
const fractionOf = (leg: 'out' | 'ret', at: MapAt) => {
  if (typeof at === 'number') return at;

  const { points, at: along } = legs[leg];
  const target = at.moonKm / KM_PER_PX;
  const k = points.findIndex(
    (p, i) =>
      i > 0 &&
      Math.sign(Math.hypot(p.x - MOON.x, p.y - MOON.y) - target) !==
        Math.sign(
          Math.hypot(points[i - 1].x - MOON.x, points[i - 1].y - MOON.y) -
            target
        )
  );

  return k < 0 ? 0 : along[k] / lengths[leg];
};

const pointOn = (leg: 'out' | 'ret', fraction: number): Point => {
  const { points, at } = legs[leg];
  const target = fraction * lengths[leg];
  const k = Math.max(
    1,
    at.findIndex((d) => d >= target)
  );
  const [a, b] = [points[k - 1], points[k]];
  const span = at[k] - at[k - 1] || 1;
  const u = Math.min(1, Math.max(0, (target - at[k - 1]) / span));

  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
};

// An SVG circle's path starts at 3 o'clock and runs clockwise on screen
const pointOnCircle = (centre: Point, r: number, fraction: number): Point => ({
  x: centre.x + r * Math.cos(2 * Math.PI * fraction),
  y: centre.y + r * Math.sin(2 * Math.PI * fraction)
});

const where = computed(() => {
  const [leg, at = 0] = event.value.where;
  const fraction =
    leg === 'out' || leg === 'ret' ? fractionOf(leg, at) : (at as number);

  return { leg, fraction };
});

const craft = computed((): Point => {
  const { leg, fraction } = where.value;

  if (leg === 'pad') return { x: EARTH.x, y: EARTH.y - 20 };
  if (leg === 'surface') return { x: MOON.x, y: MOON.y - 9 };
  if (leg === 'park') return pointOnCircle(EARTH, PARK_PX, fraction);
  if (leg === 'moon') return pointOnCircle(MOON, LUNAR_ORBIT_PX, fraction);

  return pointOn(leg, fraction);
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
  const { leg, fraction: t } = where.value;
  const at = ORDER[leg];
  const fraction = (of: MapLeg) => {
    if (ORDER[of] < at) return 1;
    if (of === leg) return t;
    if (of === 'moon' && leg === 'surface') return 0.3;

    return 0;
  };
  const offset = (of: 'out' | 'ret' | 'moon') =>
    lengths[of] * (1 - fraction(of));

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
          :r="PX"
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

        <circle :cx="EARTH.x" :cy="EARTH.y" :r="PARK_PX" class="mc-map__path" />
        <path :d="OUT" class="mc-map__path" />
        <path :d="RET" class="mc-map__path" />
        <circle
          :cx="MOON.x"
          :cy="MOON.y"
          :r="LUNAR_ORBIT_PX"
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
          :r="LUNAR_ORBIT_PX"
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
          To scale, turning with the Moon · bodies enlarged · path: a computed
          free return
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
        <dt>Figure</dt>
        <dd>{{ event.figure }}</dd>
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
  font-size: 0.75rem;
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
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-map__label--soi {
  fill: var(--mc-teal);
}

.mc-map__body {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
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
  /* Wide enough for a GET of 000:00:00 on one line */
  grid-template-columns: 1.3fr 1.1fr 1.4fr 1fr;
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
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-map__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
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
  font-size: 0.75rem;
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
  font-size: 0.9375rem;
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
