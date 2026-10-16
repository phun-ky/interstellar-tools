<script setup lang="ts">
const FORMULAS = [
  ['vis_viva_speed', 'v = √(μ(2/r − 1/a))'],
  ['kepler_period', 'T = 2π√(a³/μ)'],
  ['escape_speed', 'v = √(2μ/r)'],
  ['rocket_delta_v', 'Δv = g₀·Isp·ln(m₀/m_f)'],
  ['solve_kepler', 'M = E − e·sin E'],
  ['sphere_of_influence_radius', 'r = a(m/M)^⅖'],
  ['plane_change_delta_v', 'Δv = 2v·sin(Δi/2)'],
  ['hohmann_transfer', 'a = (r₁ + r₂)/2']
];
// Two copies make the loop seamless: the track scrolls by exactly one copy
const track = [...FORMULAS, ...FORMULAS];
</script>

<template>
  <div class="ticker" aria-hidden="true">
    <div class="track">
      <span v-for="([name, formula], index) in track" :key="index">
        <b>{{ name }}</b> {{ formula }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  white-space: nowrap;
  border-block: 1px solid var(--mc-line);
  background: var(--mc-bg-2);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--mc-muted);
}

.track {
  display: inline-block;
  padding: 12px 0;
  animation: tick 60s linear infinite;
}

span {
  margin-right: 44px;
}

b {
  color: var(--mc-teal);
  font-weight: 500;
}

@keyframes tick {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}
</style>
