<script setup lang="ts">
/**
 * Every Apollo 11 burn after Earth orbit, grouped by the engine that made it,
 * with the mission total. The numbers are the flown values from mission.ts.
 * Use it in Markdown as <ApolloDvLedger />.
 */
import { computed } from 'vue';

import { BURNS, ENGINES } from './mission';

const groups = computed(() =>
  ENGINES.map((engine) => {
    const burns = BURNS.filter((burn) => burn.engine === engine.id);

    return {
      ...engine,
      burns,
      total: burns.reduce((sum, burn) => sum + burn.dv, 0)
    };
  }).filter((group) => group.burns.length > 0)
);

const total = computed(() =>
  groups.value.reduce((sum, group) => sum + group.total, 0)
);
const largest = Math.max(...BURNS.map((burn) => burn.dv));

const speed = (mps: number) =>
  mps >= 1000 ? `${(mps / 1000).toFixed(2)} km/s` : `${mps.toFixed(0)} m/s`;
const duration = (s: number) => {
  const minutes = Math.floor(s / 60);
  const seconds = Math.round(s - minutes * 60);

  return minutes ? `${minutes} min ${seconds} s` : `${seconds} s`;
};
</script>

<template>
  <figure class="mc-ledger">
    <figcaption class="mc-ledger__head">
      <span class="mc-ledger__tag">Δv ledger</span>
      <span>Every burn after Earth orbit</span>
    </figcaption>

    <div class="mc-ledger__legend">
      <span v-for="group in groups" :key="group.id">
        <i :class="`mc-ledger__swatch mc-ledger__swatch--${group.id}`" />
        {{ group.name }}
      </span>
    </div>

    <div v-for="group in groups" :key="group.id" class="mc-ledger__group">
      <div class="mc-ledger__group-head">
        <span>{{ group.name }}</span>
        <span>{{ speed(group.total) }}</span>
      </div>
      <details
        v-for="burn in group.burns"
        :key="burn.id"
        class="mc-ledger__row"
      >
        <summary>
          <span class="mc-ledger__get">{{ burn.get }}</span>
          <span class="mc-ledger__name">{{ burn.name }}</span>
          <span class="mc-ledger__bar" aria-hidden="true">
            <i
              :class="`mc-ledger__swatch--${group.id}`"
              :style="{ width: `${(100 * burn.dv) / largest}%` }"
            />
          </span>
          <span class="mc-ledger__dv">{{ speed(burn.dv) }}</span>
        </summary>
        <p>
          {{ burn.note }}
          <span class="mc-ledger__burn"
            >Burn time {{ duration(burn.duration) }}.</span
          >
        </p>
      </details>
    </div>

    <div class="mc-ledger__total">
      <span>Mission total after Earth orbit</span>
      <b>{{ speed(total) }}</b>
    </div>
  </figure>
</template>

<style scoped>
.mc-ledger {
  margin: 24px 0;
  border: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
}

.mc-ledger__head {
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

.mc-ledger__tag {
  color: var(--mc-green);
  font-weight: 600;
}

.mc-ledger__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: 10px 16px 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.mc-ledger__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mc-ledger__swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
}

.mc-ledger__swatch--sivb {
  background: var(--mc-teal);
}

.mc-ledger__swatch--csm {
  background: var(--mc-green);
}

.mc-ledger__swatch--dps {
  background: var(--mc-amber-fill);
}

.mc-ledger__swatch--lm {
  background: var(--mc-red);
}

.mc-ledger__group {
  padding: 0 16px;
}

.mc-ledger__group-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0 6px;
  border-bottom: 1px solid var(--mc-line);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mc-faint);
}

.mc-ledger__row {
  border-bottom: 1px solid var(--mc-grid-strong);
}

.mc-ledger__row summary {
  display: grid;
  grid-template-columns: 6.5em minmax(0, 1.2fr) minmax(0, 2fr) 6em;
  align-items: center;
  gap: 12px;
  padding: 7px 0;
  cursor: pointer;
  list-style: none;
}

.mc-ledger__row summary::-webkit-details-marker {
  display: none;
}

.mc-ledger__row summary:hover,
.mc-ledger__row[open] summary {
  background: var(--mc-teal-soft);
}

.mc-ledger__get {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--mc-faint);
}

.mc-ledger__name {
  color: var(--mc-text);
}

.mc-ledger__bar {
  position: relative;
  height: 10px;
  background: var(--mc-bg-3);
}

.mc-ledger__bar i {
  position: absolute;
  inset: 0 auto 0 0;
  min-width: 2px;
}

.mc-ledger__dv {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  text-align: right;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.vp-doc .mc-ledger__row p {
  margin: 0;
  padding: 4px 0 12px 7.3em;
  font-size: 14px;
}

.mc-ledger__burn {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--mc-faint);
}

.mc-ledger__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-top: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--mc-line);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mc-ledger__total b {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--mc-text);
}

@media (max-width: 640px) {
  .mc-ledger__row summary {
    grid-template-columns: 5.5em minmax(0, 1fr) 5.5em;
  }

  .mc-ledger__bar {
    grid-column: 2 / 4;
    grid-row: 2;
  }

  .vp-doc .mc-ledger__row p {
    padding-left: 0;
  }
}
</style>
