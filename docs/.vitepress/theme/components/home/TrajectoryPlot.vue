<script setup lang="ts">
import { hohmannTransfer } from '@interstellar-tools/equations';

// The plot is illustrative; every number on it comes from the library
const MU_EARTH = 3.986004418e14; // [m³/s²]
const R_LEO = 6_678e3; // 300 km parking orbit [m]
const R_GEO = 42_164e3; // geostationary [m]
const { at, dv1, dv2, dvTotal, tTransfer, dir1, dir2 } = hohmannTransfer(
  R_LEO,
  R_GEO,
  MU_EARTH
);
const burns = [dir1, dir2].filter((dir) => dir === 'prograde').length;
const fmt = (value: number, digits = 0) =>
  value.toLocaleString('en-GB', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
</script>

<template>
  <div class="mc-panel plot">
    <div class="mc-ptitle">
      <span>Trajectory · LEO → GEO</span><b>hohmannTransfer()</b>
    </div>
    <svg
      viewBox="0 0 480 360"
      role="img"
      :aria-label="`Plot of a Hohmann transfer from a 300 km low Earth orbit to geostationary orbit: ${fmt(dvTotal)} metres per second in total over ${fmt(tTransfer / 3600, 2)} hours`"
    >
      <g class="axes">
        <line x1="0" y1="190" x2="480" y2="190" />
        <line x1="290" y1="0" x2="290" y2="360" />
      </g>
      <circle class="body" cx="290" cy="190" r="14" />
      <circle class="leo" cx="290" cy="190" r="30" />
      <circle class="geo" cx="290" cy="190" r="160" />
      <path class="transfer" d="M 320 190 A 95 84 0 0 0 130 190" />
      <circle class="burn" cx="320" cy="190" r="5" />
      <circle class="burn" cx="130" cy="190" r="5" />
      <text x="328" y="210">Δv₁ {{ fmt(dv1) }} m/s</text>
      <text x="40" y="210">Δv₂ {{ fmt(dv2) }} m/s</text>
      <text x="300" y="170">LEO {{ fmt(R_LEO / 1e3) }} km</text>
      <text x="300" y="22">GEO {{ fmt(R_GEO / 1e3) }} km</text>
      <text x="14" y="346">μ⊕ = 3.986004418 × 10¹⁴ m³/s² · not to scale</text>
    </svg>
    <dl class="readouts">
      <div class="hl">
        <dt>Δv total</dt>
        <dd>{{ fmt(dvTotal) }}<i>m/s</i></dd>
      </div>
      <div>
        <dt>Transfer</dt>
        <dd>{{ fmt(tTransfer / 3600, 2) }}<i>h</i></dd>
      </div>
      <div>
        <dt>a transfer</dt>
        <dd>{{ fmt(at / 1e3) }}<i>km</i></dd>
      </div>
      <div>
        <dt>Burns</dt>
        <dd>{{ burns }}<i>prograde</i></dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
svg {
  display: block;
  width: 100%;
  height: auto;
}

.axes line {
  stroke: var(--mc-grid-strong);
}

.body {
  fill: var(--mc-body);
  stroke: var(--mc-teal);
}

.leo {
  fill: none;
  stroke: var(--mc-teal);
  stroke-width: 1.5;
}

.geo {
  fill: none;
  stroke: var(--mc-green);
  stroke-width: 1.5;
  stroke-dasharray: 2 5;
}

.transfer {
  fill: none;
  stroke: var(--mc-amber);
  stroke-width: 2;
  stroke-dasharray: 6 6;
  animation: flow 1.4s linear infinite;
}

.burn {
  fill: var(--mc-amber);
}

text {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  fill: var(--mc-muted);
}

@keyframes flow {
  to {
    stroke-dashoffset: -12;
  }
}

.readouts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  margin: 16px 0 0;
  background: var(--mc-line);
  border: 1px solid var(--mc-line);
}

.readouts div {
  background: var(--mc-bg-2);
  padding: 12px 14px;
}

dt {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

dd {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
  font-weight: 500;
  color: var(--mc-text);
}

dd i {
  font-style: normal;
  font-size: 13px;
  color: var(--mc-muted);
  margin-left: 4px;
}

.hl dd {
  color: var(--mc-amber);
}

@media (max-width: 640px) {
  .readouts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .transfer {
    animation: none;
  }
}
</style>
