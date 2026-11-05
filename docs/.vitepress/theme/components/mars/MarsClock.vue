<script setup lang="ts">
/**
 * The time now on Mars: the Mars Sol Date, Coordinated Mars Time at Airy-0,
 * and the local mean solar time and mission sol of Curiosity and
 * Perseverance, from the temporal package's own Mars time functions. It ticks
 * in the browser only, so the static page shows dashes until it loads. Use it
 * in Markdown as <MarsClock>caption</MarsClock>.
 */
import {
  coordinatedMarsTime,
  marsLocalMeanSolarTime,
  marsSolDate,
  missionSol
} from '@interstellar-tools/temporal';
import type { Radians } from '@interstellar-tools/types';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const DEG = Math.PI / 180;
// Landings, and the east longitudes of the mission clocks (Mars24)
const ROVERS = [
  {
    name: 'Curiosity',
    site: 'Gale crater, 137.42° E',
    landing: new Date('2012-08-06T05:17:57Z'),
    longitude: (137.42 * DEG) as Radians
  },
  {
    name: 'Perseverance',
    site: 'Jezero crater, 77.43° E',
    landing: new Date('2021-02-18T20:43:48.818Z'),
    longitude: (77.43 * DEG) as Radians
  }
];
const now = ref<Date | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  now.value = new Date();
  timer = setInterval(() => (now.value = new Date()), 1000);
});
onUnmounted(() => clearInterval(timer));

const clock = (hours: number) => {
  const seconds = Math.floor(hours * 3600);
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
};
const rows = computed(() => {
  const date = now.value;

  if (!date)
    return {
      utc: '—',
      msd: '—',
      mtc: '—',
      rovers: ROVERS.map(({ name, site }) => ({
        name,
        site,
        sol: '—',
        time: '—'
      }))
    };

  return {
    utc: date.toISOString().slice(11, 19),
    msd: marsSolDate(date).toFixed(5),
    mtc: clock(coordinatedMarsTime(date)),
    rovers: ROVERS.map(({ name, site, landing, longitude }) => ({
      name,
      site,
      sol: String(missionSol(date, landing, longitude)),
      time: clock(marsLocalMeanSolarTime(date, longitude))
    }))
  };
});
</script>

<template>
  <figure class="mc">
    <table>
      <tbody>
        <tr>
          <th scope="row">Earth, UTC</th>
          <td>{{ rows.utc }}</td>
        </tr>
        <tr>
          <th scope="row">Mars Sol Date</th>
          <td>{{ rows.msd }}</td>
        </tr>
        <tr>
          <th scope="row">Coordinated Mars Time, at Airy-0</th>
          <td>{{ rows.mtc }}</td>
        </tr>
        <tr v-for="rover in rows.rovers" :key="rover.name">
          <th scope="row">
            {{ rover.name }}<span class="mc__site">{{ rover.site }}</span>
          </th>
          <td>sol {{ rover.sol }}, {{ rover.time }}</td>
        </tr>
      </tbody>
    </table>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.mc {
  margin: 16px 0;
}
.mc table {
  display: table;
  width: 100%;
  margin: 0;
}
.mc th {
  white-space: normal;
}
.mc__site {
  display: block;
  font-size: 0.85em;
  opacity: 0.8;
  text-transform: none;
}
.mc td {
  font-family: var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
