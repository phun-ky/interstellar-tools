<script setup lang="ts">
/**
 * The 10 × 10 elevation grid on Jezero's delta front, drawn as one of the
 * layers the Mars tutorial builds: height, slope, roughness, shaded relief,
 * the tip-over check, or the full landing check. Every value comes from the
 * maps package, so the picture can't drift from the code. Hover or focus a
 * cell for its numbers. Use it in Markdown as <MarsLandingGrid layer="slope" />.
 */
import { greatCircleDistance } from '@interstellar-tools/equations';
import {
  aspectGrid,
  createGrid,
  hillshadeGrid,
  safeLandingGrid,
  slopeGrid,
  terrainRoughnessIndexGrid,
  tipOverAngle
} from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
import { computed, ref } from 'vue';

import JEZERO from './jezero-delta-front.json';

type Layer = 'height' | 'slope' | 'roughness' | 'shade' | 'tipping' | 'safe';

const props = withDefaults(defineProps<{ layer?: Layer }>(), {
  layer: 'height'
});

// The lander and the target, as in the tutorial
const LANDER = { rFootprint: 1.0, hCoM: 1.5 };
const TARGET = { row: 2, column: 8 };
const MARS_RADIUS = 3389.5e3;

const N = JEZERO.rows;
const CELL = 34;
const PAD = 24;
const SIZE = PAD * 2 + N * CELL;
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const deg = (r: number) => (r * 180) / Math.PI;

const grid = createGrid({
  rows: N,
  columns: JEZERO.columns,
  values: JEZERO.heights,
  cellSize: JEZERO.cellSize
});
const slope = slopeGrid(grid);
const aspect = aspectGrid(grid);
const roughness = terrainRoughnessIndexGrid(grid);

const sunAzimuth = ref(315);
const sunElevation = ref(30);
const tiltDeg = ref(12);
const maxRoughness = ref(1);

const tipLimit = tipOverAngle(LANDER.rFootprint, LANDER.hCoM);
const shade = computed(() =>
  hillshadeGrid(grid, rad(sunAzimuth.value), rad(sunElevation.value))
);
const safe = computed(() =>
  safeLandingGrid(grid, {
    ...LANDER,
    dynamicTilt: rad(tiltDeg.value),
    // The tip-over layer leaves roughness out (the limit must be finite)
    maxRoughness:
      props.layer === 'tipping' ? Number.MAX_VALUE : maxRoughness.value
  })
);

const cells = Array.from({ length: N * N }, (_, i) => ({
  i,
  row: Math.floor(i / N),
  column: i % N,
  x: PAD + (i % N) * CELL,
  y: PAD + Math.floor(i / N) * CELL
}));

const range = (values: ArrayLike<number>) => {
  const finite = Array.from(values).filter((v) => !Number.isNaN(v));

  return [Math.min(...finite), Math.max(...finite)];
};
const SCALES = {
  height: {
    values: grid.values,
    format: (v: number) => `${v.toFixed(1).replace('-', '−')} m`
  },
  slope: {
    values: slope.values.map(deg),
    format: (v: number) => `${v.toFixed(1)}°`
  },
  roughness: {
    values: roughness.values,
    format: (v: number) => `${v.toFixed(2)} m`
  }
};

const isStatus = computed(
  () => props.layer === 'tipping' || props.layer === 'safe'
);
const scale = computed(() =>
  props.layer in SCALES ? SCALES[props.layer as keyof typeof SCALES] : null
);
const limits = computed(() =>
  scale.value ? range(scale.value.values) : [0, 1]
);

const fill = (i: number) => {
  if (props.layer === 'shade') {
    const v = shade.value.values[i]!;

    return Number.isNaN(v)
      ? 'none'
      : `color-mix(in oklab, #fff ${Math.round(100 * v)}%, #000)`;
  }

  if (isStatus.value) {
    const v = safe.value.values[i]!;

    if (Number.isNaN(v)) return 'none';

    return v ? 'var(--mc-green)' : 'var(--mc-red)';
  }

  const v = scale.value!.values[i]!;

  if (Number.isNaN(v)) return 'none';

  const [lo, hi] = limits.value;
  const t = (v - lo) / (hi - lo);

  return `color-mix(in oklab, var(--mc-teal) ${Math.round(8 + 92 * t)}%, var(--mc-bg-3))`;
};

const safeCount = computed(
  () => Array.from(safe.value.values).filter((v) => v === 1).length
);

// The safe cell nearest the target, along the surface
const site = computed(() => {
  let best: { row: number; column: number; distance: number } | null = null;

  for (const { i, row, column } of cells) {
    if (safe.value.values[i] !== 1) continue;

    const distance = greatCircleDistance(
      rad(JEZERO.latitudes[row]!),
      rad(JEZERO.longitudes[column]!),
      rad(JEZERO.latitudes[TARGET.row]!),
      rad(JEZERO.longitudes[TARGET.column]!),
      MARS_RADIUS
    );

    if (!best || distance < best.distance) best = { row, column, distance };
  }

  return best;
});

const active = ref<number | null>(null);
const readout = computed(() => {
  const i = active.value ?? TARGET.row * N + TARGET.column;
  const value = (v: number, digits: number, unit: string) =>
    Number.isNaN(v)
      ? '–'
      : `${v.toFixed(digits).replace('-', '−')}${unit === '°' ? '' : ' '}${unit}`;

  return {
    cell: `${Math.floor(i / N)}, ${i % N}`,
    height: value(grid.values[i]!, 1, 'm'),
    slope: value(deg(slope.values[i]!), 1, '°'),
    aspect: value(deg(aspect.values[i]!), 0, '°'),
    roughness: value(roughness.values[i]!, 2, 'm')
  };
});

const label = (i: number) => {
  const status = isStatus.value
    ? Number.isNaN(safe.value.values[i]!)
      ? ', no verdict on the edge'
      : safe.value.values[i]
        ? ', safe'
        : ', unsafe'
    : '';

  return `Row ${Math.floor(i / N)}, column ${i % N}${status}`;
};

const TITLES: Record<Layer, string> = {
  height: 'Height above the Mars datum',
  slope: 'Slope, Horn’s method',
  roughness: 'Terrain Roughness Index',
  shade: 'Shaded relief',
  tipping: 'Will the lander tip over?',
  safe: 'Safe to land: tip-over and roughness'
};
</script>

<template>
  <figure class="mc-mars">
    <figcaption class="mc-mars__head">
      <span class="mc-mars__tag">Live</span>
      <span>{{ TITLES[props.layer] }}</span>
    </figcaption>

    <div class="mc-mars__body">
      <svg
        :viewBox="`0 0 ${SIZE} ${SIZE}`"
        role="group"
        :aria-label="`${TITLES[props.layer]}, 10 by 10 cells of about 20 m on Jezero crater's delta front`"
      >
        <g v-for="cell in cells" :key="cell.i">
          <rect
            :x="cell.x + 1"
            :y="cell.y + 1"
            :width="CELL - 2"
            :height="CELL - 2"
            :style="{ fill: fill(cell.i) }"
            :class="[
              'mc-mars__cell',
              { 'mc-mars__cell--edge': fill(cell.i) === 'none' }
            ]"
            tabindex="0"
            :aria-label="label(cell.i)"
            @mouseenter="active = cell.i"
            @focus="active = cell.i"
          />
          <text
            v-if="isStatus && fill(cell.i) !== 'none'"
            :x="cell.x + CELL / 2"
            :y="cell.y + CELL / 2 + 5"
            class="mc-mars__glyph"
            aria-hidden="true"
          >
            {{ safe.values[cell.i] ? '✓' : '✕' }}
          </text>
        </g>

        <!-- The target on the delta front, and the nearest safe cell -->
        <circle
          :cx="PAD + (TARGET.column + 0.5) * CELL"
          :cy="PAD + (TARGET.row + 0.5) * CELL"
          :r="CELL / 2 - 3"
          class="mc-mars__target"
        />
        <rect
          v-if="props.layer === 'safe' && site"
          :x="PAD + site.column * CELL + 3"
          :y="PAD + site.row * CELL + 3"
          :width="CELL - 6"
          :height="CELL - 6"
          class="mc-mars__site"
        />
        <rect
          v-if="active !== null"
          :x="cells[active]!.x"
          :y="cells[active]!.y"
          :width="CELL"
          :height="CELL"
          class="mc-mars__active"
        />

        <text :x="SIZE - PAD + 4" :y="PAD + 10" class="mc-mars__north">N</text>
        <path
          :d="`M ${SIZE - PAD + 8} ${PAD + 14} l 0 14 M ${SIZE - PAD + 4} ${PAD + 18} l 4 -4 l 4 4`"
          class="mc-mars__axis"
        />
        <!-- 100 m east–west, in cells of 19.83 m -->
        <path
          :d="`M ${PAD} ${SIZE - 10} l 0 -4 M ${PAD} ${SIZE - 12} l ${(100 / JEZERO.cellSize.x) * CELL} 0 m 0 -2 l 0 4`"
          class="mc-mars__axis"
        />
        <text
          :x="PAD + (100 / JEZERO.cellSize.x) * CELL + 6"
          :y="SIZE - 8"
          class="mc-mars__label"
        >
          100 m
        </text>
      </svg>

      <div class="mc-mars__side">
        <div v-if="scale" class="mc-mars__legend">
          <span>{{ scale.format(limits[0]!) }}</span>
          <i class="mc-mars__ramp" />
          <span>{{ scale.format(limits[1]!) }}</span>
        </div>
        <div v-else-if="isStatus" class="mc-mars__legend">
          <span><i class="sw sw--safe" />✓ Safe</span>
          <span><i class="sw sw--unsafe" />✕ Unsafe</span>
        </div>
        <ul class="mc-mars__key">
          <li><i class="sw sw--target" />Target on the delta front</li>
          <li v-if="props.layer === 'safe'">
            <i class="sw sw--site" />Nearest safe cell
          </li>
          <li v-if="props.layer !== 'height'">
            <i class="sw sw--edge" />Edge: no 3 × 3 neighbourhood
          </li>
        </ul>

        <div v-if="props.layer === 'shade'" class="mc-mars__controls">
          <label>
            <span>Sun azimuth</span>
            <input
              v-model.number="sunAzimuth"
              type="range"
              min="0"
              max="359"
              step="1"
            />
            <output>{{ sunAzimuth }}°</output>
          </label>
          <label>
            <span>Sun elevation</span>
            <input
              v-model.number="sunElevation"
              type="range"
              min="5"
              max="90"
              step="1"
            />
            <output>{{ sunElevation }}°</output>
          </label>
        </div>
        <div v-if="isStatus" class="mc-mars__controls">
          <label>
            <span>Touchdown tilt</span>
            <input
              v-model.number="tiltDeg"
              type="range"
              min="0"
              max="30"
              step="1"
            />
            <output>{{ tiltDeg }}°</output>
          </label>
          <label v-if="props.layer === 'safe'">
            <span>Max roughness</span>
            <input
              v-model.number="maxRoughness"
              type="range"
              min="0.25"
              max="12"
              step="0.25"
            />
            <output>{{ maxRoughness.toFixed(2) }} m</output>
          </label>
          <p class="mc-mars__count">
            Tips over at {{ deg(tipLimit).toFixed(1) }}°.
            <b>{{ safeCount }}</b> of 64 cells safe<template
              v-if="props.layer === 'safe' && site"
              >, the nearest <b>{{ site.distance.toFixed(0) }} m</b> from the
              target</template
            >.
          </p>
        </div>
      </div>
    </div>

    <dl class="mc-mars__readout">
      <div>
        <dt>Row, column</dt>
        <dd>{{ readout.cell }}</dd>
      </div>
      <div>
        <dt>Height</dt>
        <dd>{{ readout.height }}</dd>
      </div>
      <div>
        <dt>Slope</dt>
        <dd>{{ readout.slope }}</dd>
      </div>
      <div>
        <dt>Aspect</dt>
        <dd>{{ readout.aspect }}</dd>
      </div>
      <div>
        <dt>Roughness</dt>
        <dd>{{ readout.roughness }}</dd>
      </div>
    </dl>
  </figure>
</template>

<style scoped>
.mc-mars {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-mars__head {
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

.mc-mars__tag {
  white-space: nowrap;
  color: var(--mc-green);
  font-weight: 600;
}

.mc-mars__body {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 8px 16px;
  padding: 12px 16px;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.mc-mars__cell {
  stroke: none;
  outline: none;
  cursor: crosshair;
}

.mc-mars__cell--edge {
  fill: none;
  stroke: var(--mc-grid-strong);
  stroke-dasharray: 3 3;
}

.mc-mars__glyph {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  text-anchor: middle;
  fill: var(--mc-bg);
  pointer-events: none;
}

.mc-mars__target {
  fill: none;
  stroke: var(--mc-amber-fill);
  stroke-width: 2.5;
  pointer-events: none;
}

.mc-mars__site {
  fill: none;
  stroke: var(--mc-text);
  stroke-width: 2.5;
  pointer-events: none;
}

.mc-mars__active {
  fill: none;
  stroke: var(--mc-text);
  stroke-width: 1;
  stroke-dasharray: 2 2;
  pointer-events: none;
}

.mc-mars__axis {
  fill: none;
  stroke: var(--mc-muted);
  stroke-width: 1.5;
}

.mc-mars__north,
.mc-mars__label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  fill: var(--mc-muted);
}

.mc-mars__side {
  display: grid;
  align-content: start;
  gap: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--mc-muted);
}

.mc-mars__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
}

.mc-mars__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mc-mars__ramp {
  flex: 1 1 60px;
  height: 10px;
  background: linear-gradient(
    to right,
    color-mix(in oklab, var(--mc-teal) 8%, var(--mc-bg-3)),
    var(--mc-teal)
  );
}

.mc-mars__key {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mc-mars__key li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sw {
  flex: none;
  width: 12px;
  height: 12px;
}

.sw--safe {
  background: var(--mc-green);
}

.sw--unsafe {
  background: var(--mc-red);
}

.sw--target {
  border: 2px solid var(--mc-amber-fill);
  border-radius: 50%;
}

.sw--site {
  border: 2px solid var(--mc-text);
}

.sw--edge {
  border: 1px dashed var(--mc-grid-strong);
}

.mc-mars__controls {
  display: grid;
  gap: 8px;
}

.mc-mars__controls label {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    'name value'
    'slider slider';
  align-items: center;
  gap: 2px 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-mars__controls span {
  grid-area: name;
}

.mc-mars__controls input {
  grid-area: slider;
  width: 100%;
  min-width: 0;
  margin: 0;
  accent-color: var(--mc-teal);
}

.mc-mars__controls output {
  grid-area: value;
  text-align: right;
  text-transform: none;
  color: var(--mc-text);
}

.vp-doc .mc-mars__count {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--mc-muted);
}

.mc-mars__count b {
  font-weight: 600;
  color: var(--mc-text);
}

.mc-mars__readout {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0;
  border-top: 1px solid var(--mc-line);
}

.mc-mars__readout div {
  padding: 10px 12px;
  border-right: 1px solid var(--mc-line);
}

.mc-mars__readout div:last-child {
  border-right: 0;
}

.mc-mars__readout dt {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-mars__readout dd {
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  white-space: nowrap;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .mc-mars__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .mc-mars__readout {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mc-mars__readout div {
    border-bottom: 1px solid var(--mc-line);
  }
}
</style>
