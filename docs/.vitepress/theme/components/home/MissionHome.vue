<script setup lang="ts">
import { hohmannTransfer } from '@interstellar-tools/equations';
import { withBase } from 'vitepress';

import constants from '../../../../../packages/constants/package.json';
import equations from '../../../../../packages/equations/package.json';
import mcp from '../../../../../packages/mcp/package.json';
import temporal from '../../../../../packages/temporal/package.json';
import types from '../../../../../packages/types/package.json';

import FormulaTicker from './FormulaTicker.vue';
import TrajectoryPlot from './TrajectoryPlot.vue';

const { dvTotal, tTransfer } = hohmannTransfer(
  6_678e3,
  42_164e3,
  3.986004418e14
);
const kms = (dvTotal / 1e3).toFixed(2);
const hours = (tTransfer / 3600).toFixed(2);

const SUBSYSTEMS = [
  {
    id: 'EQ-01',
    title: 'Orbital mechanics',
    text: 'Vis-viva, Kepler solvers that hold up as e → 1, anomaly conversions, Hohmann transfers, plane changes, J2 precession and Clohessy–Wiltshire motion. 59 functions and counting.',
    link: '/api/@interstellar-tools/equations/',
    cta: 'Browse equations'
  },
  {
    id: 'SI-02',
    title: 'Units you can trust',
    text: 'SI in, SI out, everywhere. Invalid domains fail loudly with actionable messages, never a quiet NaN that surfaces three modules later.',
    link: '/guide/introduction/#conventions-read-me-first',
    cta: 'Conventions'
  },
  {
    id: 'DB-03',
    title: 'Constants & datasets',
    text: 'Physical constants from one source of truth, plus planets, moons, stars, comets, asteroids, belts, galaxies and systems, with units on every value.',
    link: '/api/@interstellar-tools/constants/',
    cta: 'Explore data'
  },
  {
    id: 'AI-04',
    title: 'AI assistant uplink',
    text: 'An MCP server exposes the toolkit to Claude, ChatGPT, Mistral Le Chat, Gemini and Copilot, so answers are computed, not guessed.',
    link: '/guide/mcp/',
    cta: 'Establish uplink'
  },
  {
    id: 'TM-05',
    title: 'Time systems',
    text: 'Durations across 16 units, from attoseconds to gigayears, with aliases. The foundation for epochs and ephemerides.',
    link: '/api/@interstellar-tools/temporal/',
    cta: 'Temporal'
  },
  {
    id: 'QA-06',
    title: 'Typed, tested, documented',
    text: 'Strict TypeScript with branded radians, over 500 unit tests, tree-shakeable ESM, and every equation written out in LaTeX next to its code.',
    link: '/api/@interstellar-tools/types/',
    cta: 'Types'
  }
];

const STATIONS = [
  { name: 'Claude', mode: 'Local · remote', anchor: 'claude-desktop' },
  { name: 'ChatGPT', mode: 'Remote', anchor: 'chatgpt' },
  {
    name: 'Mistral Le Chat',
    mode: 'EU · remote',
    anchor: 'mistral-le-chat',
    eu: true
  },
  {
    name: 'Mistral Vibe',
    mode: 'EU · local',
    anchor: 'mistral-vibe',
    eu: true
  },
  {
    name: 'JetBrains AI',
    mode: 'EU · local',
    anchor: 'jetbrains-ai-assistant',
    eu: true
  },
  { name: 'Junie', mode: 'EU · local', anchor: 'jetbrains-junie', eu: true },
  { name: 'Langdock', mode: 'EU · remote', anchor: 'langdock', eu: true },
  { name: 'Codex CLI', mode: 'Local', anchor: 'openai-codex-cli' },
  { name: 'Gemini CLI', mode: 'Local', anchor: 'google-gemini-cli' },
  {
    name: 'GitHub Copilot',
    mode: 'Local',
    anchor: 'github-copilot-in-vs-code'
  },
  { name: 'Cursor', mode: 'Local', anchor: 'cursor' },
  { name: 'Perplexity', mode: 'Remote', anchor: 'perplexity' }
];

const MANIFEST = [
  {
    pkg: equations,
    payload: 'Orbits, gravity, manoeuvres, anomalies, cartography',
    status: 'Alpha'
  },
  {
    pkg: constants,
    payload: 'Physical constants and celestial datasets',
    status: 'Alpha'
  },
  {
    pkg: temporal,
    payload: 'Time unit conversion and normalisation',
    status: 'WIP'
  },
  {
    pkg: types,
    payload: 'Shared, zero-dependency TypeScript types',
    status: 'Alpha'
  },
  { pkg: mcp, payload: 'MCP server for AI assistants', status: 'WIP' }
].map((row) => ({
  ...row,
  link: `/api/${row.pkg.name}/`
}));
</script>

<template>
  <div class="mc-home">
    <section class="hero" aria-labelledby="mc-title">
      <div class="intro">
        <p class="callsign">// Mission: open space software</p>
        <h1 id="mc-title">
          Engineering the next <span>spacefaring</span> stack
        </h1>
        <p class="lede">
          Open, tested building blocks for orbital mechanics and space software
          in TypeScript. Equations, constants, datasets and time utilities with
          SI units, strong types and the formula behind every function.
        </p>
        <div class="ctas">
          <a class="mc-btn go" :href="withBase('/guide/introduction/')"
            >Initiate: get started</a
          >
          <a class="mc-btn" :href="withBase('/guide/mcp/')"
            >Connect AI assistant</a
          >
          <a class="mc-btn" :href="withBase('/api/')">API reference</a>
        </div>
      </div>
      <TrajectoryPlot />
    </section>
  </div>

  <FormulaTicker />

  <div class="mc-home">
    <section aria-labelledby="mc-s1">
      <header class="sec-head">
        <span class="sec-id">01</span>
        <h2 id="mc-s1">Subsystems</h2>
        <p>
          Six capabilities, each tested and documented with the equation it
          implements.
        </p>
      </header>
      <div class="subsystems">
        <article v-for="item in SUBSYSTEMS" :key="item.id" class="mc-panel">
          <div class="mc-ptitle">
            <span>{{ item.id }}</span
            ><span class="nominal">● nominal</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <a class="mc-link" :href="withBase(item.link)">{{ item.cta }} →</a>
        </article>
      </div>
    </section>

    <section aria-labelledby="mc-s2">
      <header class="sec-head">
        <span class="sec-id">02</span>
        <h2 id="mc-s2">Flight console</h2>
        <p>Call it from code, or let your assistant call it for you.</p>
      </header>
      <div class="console">
        <div class="mc-panel">
          <div class="mc-ptitle">
            <span>leo-to-geo.ts</span><b>typescript</b>
          </div>
          <pre><code><span class="k">import</span> { hohmannTransfer } <span class="k">from</span> <span class="s">'@interstellar-tools/equations'</span>;

<span class="k">const</span> MU_EARTH = <span class="n">3.986004418e14</span>; <span class="c">// m³/s²</span>
<span class="k">const</span> { dvTotal, tTransfer } =
  hohmannTransfer(<span class="n">6_678e3</span>, <span class="n">42_164e3</span>, MU_EARTH);

dvTotal;          <span class="c">// {{ dvTotal.toFixed(0) }}  [m/s]</span>
tTransfer / <span class="n">3600</span>; <span class="c">// {{ hours }}  [h]</span></code></pre>
        </div>
        <div class="mc-panel">
          <div class="mc-ptitle"><span>Comms log · MCP</span><b>uplink</b></div>
          <ol class="log">
            <li>
              <span class="t">[T+00:00]</span> USER: Δv from a 300 km orbit to
              GEO, and how long?
            </li>
            <li>
              <span class="t">[T+00:01]</span>
              <span class="call">
                CALL hohmann_transfer {r1_m: 6678000, r2_m: 42164000}</span
              >
            </li>
            <li>
              <span class="t">[T+00:01]</span>
              <span class="ok">
                ACK dv_total_m_s={{ dvTotal.toFixed(1) }} t_transfer_s={{
                  tTransfer.toFixed(0)
                }}</span
              >
            </li>
            <li>
              <span class="t">[T+00:02]</span> ASSISTANT: About
              <strong>{{ kms }} km/s</strong> over two prograde burns, and a
              <strong>{{ hours }} h</strong> coast.
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section aria-labelledby="mc-s3">
      <header class="sec-head">
        <span class="sec-id">03</span>
        <h2 id="mc-s3">Ground stations</h2>
        <p>Supported AI assistants. Local over stdio, remote over HTTPS.</p>
      </header>
      <ul class="stations">
        <li v-for="station in STATIONS" :key="station.name">
          <a :href="withBase(`/guide/mcp/#${station.anchor}`)">
            {{ station.name
            }}<small :class="{ eu: station.eu }">{{ station.mode }}</small>
          </a>
        </li>
      </ul>
    </section>

    <section aria-labelledby="mc-s4">
      <header class="sec-head">
        <span class="sec-id">04</span>
        <h2 id="mc-s4">Payload manifest</h2>
      </header>
      <div class="mc-panel manifest">
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>Payload</th>
              <th>Version</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in MANIFEST" :key="row.pkg.name">
              <td>
                <a :href="withBase(row.link)"
                  ><code>{{ row.pkg.name }}</code></a
                >
              </td>
              <td>{{ row.payload }}</td>
              <td class="ver">{{ row.pkg.version }}</td>
              <td>
                <span
                  class="pill"
                  :class="row.status === 'WIP' ? 'wip' : 'alpha'"
                  >{{ row.status }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mc-caution">
        <b>Caution</b>
        <span>
          Early alpha. APIs can change between minor versions, and the equations
          are unit-tested but not yet cross-validated against flight software.
          <a href="https://github.com/phun-ky/interstellar-tools/issues"
            >Tell us what you need</a
          >.
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mc-home {
  width: min(1240px, 100% - 48px);
  margin-inline: auto;
}

section {
  padding: 72px 0;
}

/* hero */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 28px;
  align-items: center;
  padding: 48px 0 56px;
}

.callsign {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mc-amber);
}

h1 {
  margin: 16px 0 20px;
  font-size: clamp(42px, 5.4vw, 76px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--mc-text);
}

h1 span {
  color: var(--mc-teal);
}

.lede {
  margin: 0 0 30px;
  max-width: 32em;
  font-size: 18.5px;
  line-height: 1.55;
  color: var(--mc-muted);
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* section headers */
.sec-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 18px;
  margin-bottom: 28px;
}

.sec-id {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--mc-amber);
}

h2 {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--mc-text);
}

.sec-head p {
  flex-basis: 100%;
  margin: 0;
  font-size: 17px;
  color: var(--mc-muted);
}

/* subsystems */
.subsystems {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
  gap: 18px;
}

h3 {
  margin: 0 0 8px;
  font-size: 21px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--mc-text);
}

.subsystems p {
  margin: 0 0 16px;
  font-size: 15.5px;
  line-height: 1.55;
  color: var(--mc-muted);
}

.nominal {
  color: var(--mc-green);
}

/* console */
.console {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  gap: 18px;
}

pre {
  margin: 0;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--mc-text);
}

.k {
  color: var(--mc-teal);
}

.s {
  color: var(--mc-green);
}

.n {
  color: var(--mc-amber);
}

.c {
  color: var(--mc-faint);
}

.log {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--mc-text);
}

.log li + li {
  margin-top: 12px;
}

.log .t {
  color: var(--mc-muted);
}

.log .call {
  color: var(--mc-teal);
}

.log .ok {
  color: var(--mc-green);
}

.log strong {
  color: var(--mc-amber);
}

/* ground stations */
.stations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--mc-line);
  border: 1px solid var(--mc-line);
}

.stations a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 14px 16px;
  background: var(--mc-bg-2);
  font-size: 16px;
  color: var(--mc-text);
  white-space: nowrap;
}

.stations a:hover {
  background: var(--mc-bg-3);
  color: var(--mc-amber);
}

.stations small {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mc-muted);
  text-align: right;
}

.stations small.eu {
  color: var(--mc-amber);
}

/* manifest */
.manifest {
  overflow-x: auto;
}

table {
  display: table;
  width: 100%;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  background: transparent;
  font-size: 15.5px;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--mc-line);
  text-align: left;
  white-space: nowrap;
}

tbody tr:nth-child(2n) {
  background: transparent;
}

th {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

td {
  color: var(--mc-text);
}

td code {
  font-family: var(--vp-font-family-mono);
  color: var(--mc-teal);
}

.ver {
  font-family: var(--vp-font-family-mono);
  color: var(--mc-muted);
}

.pill {
  padding: 3px 8px;
  border: 1px solid currentColor;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pill.alpha {
  color: var(--mc-green);
}

.pill.wip {
  color: var(--mc-amber);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 24px;
  }

  section {
    padding: 48px 0;
  }
}
</style>
