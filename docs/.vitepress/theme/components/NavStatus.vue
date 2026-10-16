<script lang="ts">
import { ref } from 'vue';

/**
 * Status of the latest "Checks" workflow run on main (build, lint, typecheck
 * and tests), read from GitHub's public API.
 *
 * Nothing is requested until the visitor asks for it: the browser only
 * contacts GitHub after a click on "Request status". The answer is kept in
 * memory for this visit and never written to storage.
 */
type StateType =
  'idle' | 'acquiring' | 'nominal' | 'anomaly' | 'running' | 'offline';

interface RunInterface {
  status: string;
  conclusion: string | null;
  html_url: string;
  head_sha: string;
  updated_at: string;
}

// Module scope, shared by every instance: the answer survives navigating
// between pages and is gone on a full reload
const latest = ref<RunInterface | null>(null);
const state = ref<StateType>('idle');
</script>

<script setup lang="ts">
import { computed } from 'vue';

import equations from '../../../../packages/equations/package.json';

const REPO = 'phun-ky/interstellar-tools';
const API_URL = `https://api.github.com/repos/${REPO}/actions/workflows/check.yml/runs?branch=main&per_page=10`;
const LABELS: Record<StateType, string> = {
  idle: 'Request status',
  acquiring: 'Acquiring signal',
  nominal: 'Systems nominal',
  anomaly: 'Anomaly detected',
  running: 'Checks in progress',
  offline: 'Telemetry offline'
};
const DESCRIPTIONS: Record<StateType, string> = {
  idle: 'not requested',
  acquiring: 'loading',
  nominal: 'passing',
  anomaly: 'failing',
  running: 'in progress',
  offline: 'unavailable, select to retry'
};
const version = equations.version.split('.').slice(0, 2).join('.');
const title = computed(() => {
  if (state.value === 'idle') {
    return 'Request the latest test results for main from GitHub';
  }

  if (!latest.value) return `Checks on main: ${DESCRIPTIONS[state.value]}`;

  return `Checks on main: ${DESCRIPTIONS[state.value]} · ${latest.value.head_sha.slice(0, 7)} · ${new Date(latest.value.updated_at).toLocaleString('en-GB')}`;
});
const toState = ({ status, conclusion }: RunInterface): StateType => {
  if (status !== 'completed') return 'running';

  return conclusion === 'success' ? 'nominal' : 'anomaly';
};
const request = async () => {
  state.value = 'acquiring';

  try {
    const response = await fetch(API_URL, {
      headers: { accept: 'application/vnd.github+json' }
    });

    if (!response.ok) throw new Error(String(response.status));

    const { workflow_runs: runs } = (await response.json()) as {
      workflow_runs: RunInterface[];
    };
    // Release commits skip the checks on purpose, so look past them
    const run = runs.find(
      ({ conclusion }) => conclusion !== 'skipped' && conclusion !== 'cancelled'
    );

    if (!run) throw new Error('no runs');

    latest.value = run;
    state.value = toState(run);
  } catch {
    state.value = 'offline'; // offline, blocked or rate-limited
  }
};
</script>

<template>
  <div class="nav-status">
    <a
      v-if="latest"
      :class="['checks', state]"
      :href="latest.html_url"
      :title="title"
      :aria-label="title"
      target="_blank"
      rel="noreferrer"
    >
      <i class="led" aria-hidden="true"></i>{{ LABELS[state] }}
    </a>
    <button
      v-else
      type="button"
      :class="['checks', state]"
      :title="title"
      :aria-label="title"
      :aria-busy="state === 'acquiring'"
      :disabled="state === 'acquiring'"
      @click="request"
    >
      <i class="led" aria-hidden="true"></i>{{ LABELS[state] }}
    </button>
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
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--state);
  cursor: pointer;
  transition: opacity 0.2s;
}

.checks:hover {
  opacity: 0.75;
}

.checks:disabled {
  cursor: progress;
}

.checks:focus-visible {
  outline: 2px solid var(--mc-teal);
  outline-offset: 4px;
}

.idle {
  --state: var(--mc-muted);
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

/* Not requested yet: an empty ring rather than a lit light */
.idle .led {
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--state);
}

.offline .led {
  box-shadow: none;
}

.running .led,
.acquiring .led {
  animation: blink 1.2s steps(2) infinite;
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
