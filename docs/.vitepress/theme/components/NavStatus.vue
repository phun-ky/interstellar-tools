<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import equations from '../../../../packages/equations/package.json';

/**
 * Live status of the latest "Checks" workflow run on main (build, lint,
 * typecheck and tests), read from GitHub's public API in the browser.
 */
type StateType = 'acquiring' | 'nominal' | 'anomaly' | 'running' | 'offline';

interface RunInterface {
  status: string;
  conclusion: string | null;
  html_url: string;
  head_sha: string;
  updated_at: string;
}

const REPO = 'phun-ky/interstellar-tools';
const ACTIONS_URL = `https://github.com/${REPO}/actions/workflows/check.yml?query=branch%3Amain`;
const API_URL = `https://api.github.com/repos/${REPO}/actions/workflows/check.yml/runs?branch=main&per_page=10`;
const CACHE_KEY = 'it-checks-status';
const VISIBLE_FROM = '1600px'; // keep in sync with the media query below
const CACHE_MS = 10 * 60 * 1000; // stay well inside the 60 requests/hour limit
const LABELS: Record<StateType, string> = {
  acquiring: 'Acquiring signal',
  nominal: 'Systems nominal',
  anomaly: 'Anomaly detected',
  running: 'Checks in progress',
  offline: 'Telemetry offline'
};
const DESCRIPTIONS: Record<StateType, string> = {
  acquiring: 'loading',
  nominal: 'passing',
  anomaly: 'failing',
  running: 'in progress',
  offline: 'unavailable'
};
const version = equations.version.split('.').slice(0, 2).join('.');
const state = ref<StateType>('acquiring');
const run = ref<RunInterface | null>(null);
const href = computed(() => run.value?.html_url ?? ACTIONS_URL);
const title = computed(() =>
  run.value
    ? `Checks on main: ${DESCRIPTIONS[state.value]} · ${run.value.head_sha.slice(0, 7)} · ${new Date(run.value.updated_at).toLocaleString('en-GB')}`
    : 'Checks on main: status unavailable'
);
const toState = ({ status, conclusion }: RunInterface): StateType => {
  if (status !== 'completed') return 'running';

  return conclusion === 'success' ? 'nominal' : 'anomaly';
};
const readCache = (): RunInterface | null => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');

    // A run in progress changes soon, so recheck it after a minute
    const ttl = cached?.run.status === 'completed' ? CACHE_MS : 60 * 1000;

    return cached && Date.now() - cached.at < ttl ? cached.run : null;
  } catch {
    return null;
  }
};
const writeCache = (value: RunInterface) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ at: Date.now(), run: value })
    );
  } catch {
    // storage unavailable (private mode, blocked): just skip caching
  }
};

const load = async () => {
  let latest = readCache();

  if (!latest) {
    try {
      const response = await fetch(API_URL, {
        headers: { accept: 'application/vnd.github+json' }
      });

      if (!response.ok) {
        state.value = 'offline';

        return;
      }

      const { workflow_runs: runs } = (await response.json()) as {
        workflow_runs: RunInterface[];
      };

      // Release commits skip the checks on purpose, so look past them
      latest =
        runs.find(
          ({ conclusion }) =>
            conclusion !== 'skipped' && conclusion !== 'cancelled'
        ) ?? null;

      if (latest) writeCache(latest);
    } catch {
      state.value = 'offline'; // offline or blocked

      return;
    }
  }

  if (latest) {
    run.value = latest;
    state.value = toState(latest);
  } else {
    state.value = 'offline';
  }
};

// Only ask GitHub when the status is on screen (see VISIBLE_FROM), so narrow
// screens never contact GitHub at all
onMounted(() => {
  const wide = window.matchMedia(`(min-width: ${VISIBLE_FROM})`);

  if (wide.matches) {
    void load();

    return;
  }

  wide.addEventListener('change', () => void load(), { once: true });
});
</script>

<template>
  <div class="nav-status">
    <a
      :class="['checks', state]"
      :href="href"
      :title="title"
      :aria-label="title"
      target="_blank"
      rel="noreferrer"
    >
      <i class="led" aria-hidden="true"></i>{{ LABELS[state] }}
    </a>
    <span aria-hidden="true">v{{ version }}</span>
  </div>
</template>

<style scoped>
.nav-status {
  display: none;
  align-items: center;
  gap: 16px;
  margin-left: 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-muted);
  white-space: nowrap;
}

.checks {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--state);
  transition: opacity 0.2s;
}

.checks:hover {
  opacity: 0.75;
}

.nominal {
  --state: var(--mc-green);
}

.anomaly {
  --state: var(--mc-red);
}

.running {
  --state: var(--mc-amber);
}

.offline,
.acquiring {
  --state: var(--mc-faint);
}

.led {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--state);
  box-shadow: 0 0 8px var(--state);
}

.running .led,
.acquiring .led {
  animation: blink 1.2s steps(2) infinite;
}

.offline .led {
  box-shadow: none;
}

@keyframes blink {
  50% {
    opacity: 0.35;
  }
}

@media (min-width: 1600px) {
  .nav-status {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .led {
    animation: none;
  }
}
</style>
