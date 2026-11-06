<script setup lang="ts">
/**
 * Why a solar day is longer than one turn: a planet at noon, then one turn
 * against the stars later, a little further along its orbit, where it has to
 * turn a little more to face the Sun again. The orbit's step is exaggerated.
 * Use it in Markdown as <SolarDayFigure>caption</SolarDayFigure>.
 */
const WIDTH = 560;
const HEIGHT = 255;
const SUN = { x: 170, y: 190, r: 26 };
const ORBIT = 210;
const PLANET = 16;
const STEP = (38 * Math.PI) / 180;
const ARROW = 70;
const at = (angle: number, radius = ORBIT) => ({
  x: SUN.x + radius * Math.cos(angle),
  y: SUN.y - radius * Math.sin(angle)
});
const arcTo = (from: number, to: number, radius: number) => {
  const start = at(from, radius);
  const end = at(to, radius);

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`;
};
const first = at(0);
const second = at(STEP);
// Unit vector from the second position to the Sun
const toSun = {
  x: (SUN.x - second.x) / ORBIT,
  y: (SUN.y - second.y) / ORBIT
};
// The orbit, and an arrow just outside it for the planet's step along it
const arc = arcTo(-0.2, STEP + 0.25, ORBIT);
const along = arcTo(0.14, STEP - 0.3, ORBIT + 30);
const noon = {
  x1: first.x - PLANET,
  y1: first.y,
  x2: first.x - PLANET - ARROW,
  y2: first.y
};
const turn = {
  x1: second.x - PLANET,
  y1: second.y,
  x2: second.x - PLANET - ARROW,
  y2: second.y
};
const again = {
  x1: second.x + toSun.x * PLANET,
  y1: second.y + toSun.y * PLANET,
  x2: second.x + toSun.x * (PLANET + ARROW),
  y2: second.y + toSun.y * (PLANET + ARROW)
};
</script>

<template>
  <figure class="sdf">
    <svg
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      role="img"
      aria-label="A planet at noon, and one turn later a little further along its orbit, where it has to turn a little more to face the Sun again"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="sdf-head"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" class="sdf__head" />
        </marker>
      </defs>
      <path class="sdf__orbit" :d="arc" />
      <path class="sdf__along" :d="along" marker-end="url(#sdf-head)" />
      <circle class="sdf__sun" :cx="SUN.x" :cy="SUN.y" :r="SUN.r" />
      <text
        class="sdf__label"
        :x="SUN.x"
        :y="SUN.y + SUN.r + 20"
        text-anchor="middle"
      >
        Sun
      </text>

      <circle class="sdf__planet" :cx="first.x" :cy="first.y" :r="PLANET" />
      <line class="sdf__noon" v-bind="noon" marker-end="url(#sdf-head)" />
      <text class="sdf__label" :x="first.x + PLANET + 10" :y="first.y + 5">
        1. Noon
      </text>

      <circle class="sdf__planet" :cx="second.x" :cy="second.y" :r="PLANET" />
      <line class="sdf__turn" v-bind="turn" marker-end="url(#sdf-head)" />
      <line class="sdf__noon" v-bind="again" marker-end="url(#sdf-head)" />
      <text
        v-for="(line, k) in [
          '2. One turn later:',
          'facing the same way,',
          'not yet noon'
        ]"
        :key="k"
        class="sdf__label"
        :x="second.x + PLANET + 10"
        :y="second.y - 14 + 20 * k"
      >
        {{ line }}
      </text>
    </svg>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.sdf {
  margin: 16px 0;
}
svg {
  display: block;
  width: 100%;
  height: auto;
}
.sdf__orbit {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-dasharray: 4 4;
  stroke-width: 1;
}
.sdf__along {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}
.sdf__sun {
  fill: var(--vp-c-yellow-2);
}
.sdf__planet {
  fill: var(--vp-c-brand-1);
}
.sdf__noon,
.sdf__turn {
  stroke: var(--vp-c-text-1);
  stroke-width: 2;
}
.sdf__turn {
  stroke-dasharray: 5 4;
  stroke: var(--vp-c-text-2);
}
.sdf__head {
  fill: var(--vp-c-text-1);
}
.sdf__label {
  fill: var(--vp-c-text-1);
  font-size: 16px;
}
</style>
