<script setup lang="ts">
/**
 * Latitude two ways: on an oblate Earth, the geodetic latitude (the angle of
 * the ellipsoid's normal, the one on maps) and the geocentric latitude (the
 * angle seen from the centre) differ. The readouts use WGS 84 through
 * geodeticToBodyFixed; the drawing exaggerates the flattening so the two
 * lines can be told apart. Use it in Markdown as <ApolloLatitudePlot />.
 */
import { geodeticToBodyFixed } from '@interstellar-tools/equations';
import type { Radians } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

const A = 6_378_137; // m, WGS 84
const E2 = 0.00669437999014;
const OMEGA = 7.292115e-5; // rad/s
const PRESETS = [
  // Apollo by the Numbers; AS-506 flight evaluation report, Table 4-5
  { label: 'Pad 39A', lat: 28.608422, km: 0 },
  { label: 'Orbit insertion', lat: 32.672, km: 191.1 }
];

const latDeg = ref(PRESETS[0].lat);
const heightKm = ref(PRESETS[0].km);

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

const point = computed(() => {
  const [x, y, z] = geodeticToBodyFixed(
    toRad(latDeg.value),
    0 as Radians,
    heightKm.value * 1000,
    A,
    E2
  );
  const p = Math.hypot(x, y);
  const geocentric = (Math.atan2(z, p) * 180) / Math.PI;

  return {
    geocentric,
    difference: latDeg.value - geocentric,
    r: Math.hypot(x, y, z),
    east: OMEGA * p
  };
});

// Drawing: a quarter of the ellipse, flattening drawn 75 times too large
const W = 640;
const H = 300;
const OX = 60;
const OY = 270;
const SCALE = 230 / A;
const DRAWN_F = 75 / 298.257223563;
const DRAWN_E2 = DRAWN_F * (2 - DRAWN_F);
const DRAWN_B = A * (1 - DRAWN_F);

const px = (x: number) => OX + x * SCALE;
const py = (z: number) => OY - z * SCALE;

const outline = (() => {
  const points: string[] = [];

  for (let k = 0; k <= 90; k++) {
    const t = (k * Math.PI) / 180;

    points.push(
      `${k ? 'L' : 'M'}${px(A * Math.cos(t)).toFixed(1)} ${py(DRAWN_B * Math.sin(t)).toFixed(1)}`
    );
  }

  return points.join(' ');
})();

const drawn = computed(() => {
  const phi = toRad(latDeg.value);
  // Exaggerate the height too, so 191 km shows
  const h = heightKm.value * 1000 * 4;
  const [x, , z] = geodeticToBodyFixed(phi, 0 as Radians, h, A, DRAWN_E2);
  const [sx, , sz] = geodeticToBodyFixed(phi, 0 as Radians, 0, A, DRAWN_E2);
  // The normal, extended down to where it crosses the equatorial plane
  const toAxis = sz / Math.sin(phi || 1e-9);

  return {
    x: px(x),
    y: py(z),
    surface: { x: px(sx), y: py(sz) },
    normalFoot: {
      x: px(sx - toAxis * Math.cos(phi)),
      y: py(0)
    }
  };
});

const pick = (preset: (typeof PRESETS)[number]) => {
  latDeg.value = preset.lat;
  heightKm.value = preset.km;
};

const group = (n: number) =>
  Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
</script>

<template>
  <figure class="mc-lat">
    <figcaption class="mc-lat__head">
      <span class="mc-lat__tag">Live</span>
      <span>Latitude two ways</span>
    </figcaption>

    <svg
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      :aria-label="`At ${latDeg.toFixed(3)} degrees geodetic and ${heightKm.toFixed(1)} km up, the geocentric latitude is ${point.geocentric.toFixed(3)} degrees.`"
    >
      <line :x1="OX" :x2="px(A) + 20" :y1="OY" :y2="OY" class="mc-lat__axis" />
      <line
        :x1="OX"
        :x2="OX"
        :y1="OY"
        :y2="py(DRAWN_B) - 16"
        class="mc-lat__axis"
      />
      <text :x="OX + 6" :y="OY + 14" class="mc-lat__label">Equator</text>
      <text :x="OX + 6" :y="py(DRAWN_B) - 6" class="mc-lat__label">Axis</text>
      <path :d="outline" class="mc-lat__earth" />

      <line
        :x1="OX"
        :y1="OY"
        :x2="drawn.x"
        :y2="drawn.y"
        class="mc-lat__geocentric"
      />
      <line
        :x1="drawn.normalFoot.x"
        :y1="drawn.normalFoot.y"
        :x2="drawn.x"
        :y2="drawn.y"
        class="mc-lat__normal"
      />
      <circle
        :cx="drawn.surface.x"
        :cy="drawn.surface.y"
        r="3"
        class="mc-lat__foot"
      />
      <circle :cx="drawn.x" :cy="drawn.y" r="5" class="mc-lat__point" />

      <text
        :x="W - 16"
        :y="40"
        text-anchor="end"
        class="mc-lat__label mc-lat__label--normal"
      >
        Normal: geodetic latitude
      </text>
      <text
        :x="W - 16"
        :y="58"
        text-anchor="end"
        class="mc-lat__label mc-lat__label--geocentric"
      >
        From the centre: geocentric latitude
      </text>
      <text :x="W - 16" :y="H - 12" text-anchor="end" class="mc-lat__label">
        Flattening drawn 75× too large, height 4×
      </text>
    </svg>

    <dl class="mc-lat__readout" aria-live="polite">
      <div>
        <dt>Geocentric</dt>
        <dd>{{ point.geocentric.toFixed(3) }}°</dd>
      </div>
      <div>
        <dt>Difference</dt>
        <dd>{{ point.difference.toFixed(3) }}°</dd>
      </div>
      <div>
        <dt>From centre</dt>
        <dd>{{ group(point.r / 1000) }} km</dd>
      </div>
      <div>
        <dt>Eastward</dt>
        <dd>{{ point.east.toFixed(1) }} m/s</dd>
      </div>
    </dl>

    <div class="mc-lat__controls">
      <div class="mc-lat__presets">
        <button
          v-for="preset in PRESETS"
          :key="preset.label"
          type="button"
          :aria-pressed="latDeg === preset.lat && heightKm === preset.km"
          @click="pick(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
      <label>
        <span>Geodetic latitude</span>
        <input
          v-model.number="latDeg"
          type="range"
          min="0"
          max="90"
          step="0.001"
        />
        <output>{{ latDeg.toFixed(3) }}°</output>
      </label>
      <label>
        <span>Height</span>
        <input
          v-model.number="heightKm"
          type="range"
          min="0"
          max="400"
          step="0.1"
        />
        <output>{{ heightKm.toFixed(1) }} km</output>
      </label>
    </div>
  </figure>
</template>

<style scoped>
.mc-lat {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-lat__head {
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

.mc-lat__tag {
  color: var(--mc-green);
  font-weight: 600;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-lat__axis {
  stroke: var(--mc-grid-strong);
  stroke-dasharray: 4 4;
}

.mc-lat__earth {
  fill: none;
  stroke: var(--mc-muted);
  stroke-width: 1.5;
}

.mc-lat__geocentric {
  stroke: var(--mc-amber);
  stroke-width: 1.5;
}

.mc-lat__normal {
  stroke: var(--mc-teal);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}

.mc-lat__foot {
  fill: var(--mc-bg-2);
  stroke: var(--mc-muted);
}

.mc-lat__point {
  fill: var(--mc-amber-fill);
  filter: drop-shadow(0 0 5px var(--mc-amber-fill));
}

.mc-lat__label {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--mc-faint);
}

.mc-lat__label--normal {
  fill: var(--mc-teal);
}

.mc-lat__label--geocentric {
  fill: var(--mc-amber);
}

.mc-lat__readout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-lat__readout div {
  padding: 10px 16px;
  border-right: 1px solid var(--mc-line);
}

.mc-lat__readout div:last-child {
  border-right: 0;
}

.mc-lat__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-lat__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-lat__controls {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
}

.mc-lat__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mc-lat__presets button {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--mc-teal);
  background: var(--mc-teal-soft);
  border: 1px solid var(--mc-line);
  padding: 4px 10px;
  cursor: pointer;
}

.mc-lat__presets button[aria-pressed='true'] {
  border-color: var(--mc-teal);
}

.mc-lat__controls label {
  display: grid;
  grid-template-columns: 11em 1fr 5.5em;
  align-items: center;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-lat__controls input {
  accent-color: var(--mc-teal);
}

.mc-lat__controls output {
  text-align: right;
  text-transform: none;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-lat__readout {
    grid-template-columns: repeat(2, 1fr);
  }

  .mc-lat__readout div:nth-child(2) {
    border-right: 0;
  }

  .mc-lat__readout div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--mc-line);
  }

  .mc-lat__controls label {
    grid-template-columns: 1fr 5.5em;
  }

  .mc-lat__controls label span {
    grid-column: 1 / -1;
  }
}
</style>
